import { beforeEach, describe, expect, it, vi } from "vitest"
import { calcVisiblePages, getRepository, searchRepositories } from "@/lib/github"

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
})
