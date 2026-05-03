import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  calcVisiblePages,
  getRepository,
  isValidRepository,
  isValidSearchResponse,
  searchRepositories,
} from "@/lib/github"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

const mockRepoData = {
  id: 1,
  full_name: "owner/repo",
  name: "repo",
  owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
  description: "A test repo",
  language: "TypeScript",
  stargazers_count: 100,
  watchers_count: 50,
  forks_count: 30,
  open_issues_count: 10,
  html_url: "https://github.com/owner/repo",
}

describe("searchRepositories", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("正常にリポジトリを検索できる", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total_count: 100,
        incomplete_results: false,
        items: [mockRepoData],
      }),
    })

    const result = await searchRepositories({ q: "test", page: 1, per_page: 30 })

    expect(result.repositories).toHaveLength(1)
    expect(result.repositories[0].full_name).toBe("owner/repo")
    expect(result.pagination.totalCount).toBe(100)
  })

  it("403 エラー時にレート制限メッセージを投げる", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

    await expect(searchRepositories({ q: "test", page: 1, per_page: 30 })).rejects.toThrow(
      "レート制限"
    )
  })

  it("422 エラー時に不正な検索条件メッセージを投げる", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 422 })

    await expect(searchRepositories({ q: "", page: 1, per_page: 30 })).rejects.toThrow(
      "検索条件が不正"
    )
  })

  it("ネットワークエラー時にユーザー向けメッセージを投げる", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"))

    await expect(searchRepositories({ q: "test", page: 1, per_page: 30 })).rejects.toThrow(
      "接続できませんでした"
    )
  })

  it("想定外のレスポンス形式の場合にエラーを投げる", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpected: "format" }),
    })

    await expect(searchRepositories({ q: "test", page: 1, per_page: 30 })).rejects.toThrow(
      "予期しない形式"
    )
  })
})

describe("getRepository", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("正常にリポジトリ詳細を取得できる", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepoData,
    })

    const result = await getRepository("owner", "repo")
    expect(result.full_name).toBe("owner/repo")
  })

  it("404 エラー時に REPOSITORY_NOT_FOUND を投げる", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

    await expect(getRepository("owner", "nonexistent")).rejects.toThrow("REPOSITORY_NOT_FOUND")
  })

  it("ネットワークエラー時にユーザー向けメッセージを投げる", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"))

    await expect(getRepository("owner", "repo")).rejects.toThrow("接続できませんでした")
  })

  it("想定外のレスポンス形式の場合にエラーを投げる", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpected: "format" }),
    })

    await expect(getRepository("owner", "repo")).rejects.toThrow("予期しない形式")
  })
})

describe("calcVisiblePages", () => {
  it("全ページが maxVisible 以下の場合、全ページを返す", () => {
    expect(calcVisiblePages(1, 3, 5)).toEqual([1, 2, 3])
  })

  it("先頭付近では 1 から始まるページを返す", () => {
    expect(calcVisiblePages(2, 10, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it("中央付近では現在ページを中心にしたページを返す", () => {
    expect(calcVisiblePages(5, 10, 5)).toEqual([3, 4, 5, 6, 7])
  })

  it("末尾付近では最後のページで終わるページを返す", () => {
    expect(calcVisiblePages(9, 10, 5)).toEqual([6, 7, 8, 9, 10])
  })

  it("totalPages が 1 の場合は [1] を返す", () => {
    expect(calcVisiblePages(1, 1, 5)).toEqual([1])
  })

  it("maxVisible が 1 の場合は currentPage のみ返す", () => {
    expect(calcVisiblePages(5, 10, 1)).toEqual([5])
  })

  it("totalPages と maxVisible が等しい場合は全ページを返す", () => {
    expect(calcVisiblePages(3, 5, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it("最終ページにいる場合は末尾で終わるウィンドウを返す", () => {
    expect(calcVisiblePages(10, 10, 5)).toEqual([6, 7, 8, 9, 10])
  })
})

describe("isValidSearchResponse", () => {
  it("正常なレスポンスを受け入れる", () => {
    expect(isValidSearchResponse({ total_count: 10, incomplete_results: false, items: [] })).toBe(
      true
    )
  })

  it("null を拒否する", () => {
    expect(isValidSearchResponse(null)).toBe(false)
  })

  it("undefined を拒否する", () => {
    expect(isValidSearchResponse(undefined)).toBe(false)
  })

  it("total_count が欠損している場合を拒否する", () => {
    expect(isValidSearchResponse({ items: [] })).toBe(false)
  })

  it("items が配列でない場合を拒否する", () => {
    expect(isValidSearchResponse({ total_count: 10, items: "not-array" })).toBe(false)
  })

  it("items が欠損している場合を拒否する", () => {
    expect(isValidSearchResponse({ total_count: 10 })).toBe(false)
  })
})

describe("isValidRepository", () => {
  it("正常なリポジトリデータを受け入れる", () => {
    expect(
      isValidRepository({ id: 1, full_name: "octocat/Hello-World", owner: { login: "octocat" } })
    ).toBe(true)
  })

  it("null を拒否する", () => {
    expect(isValidRepository(null)).toBe(false)
  })

  it("id が文字列の場合を拒否する", () => {
    expect(
      isValidRepository({ id: "1", full_name: "octocat/Hello-World", owner: { login: "octocat" } })
    ).toBe(false)
  })

  it("owner が null の場合を拒否する", () => {
    expect(isValidRepository({ id: 1, full_name: "octocat/Hello-World", owner: null })).toBe(false)
  })

  it("full_name が欠損している場合を拒否する", () => {
    expect(isValidRepository({ id: 1, owner: { login: "octocat" } })).toBe(false)
  })
})
