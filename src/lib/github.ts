import type {
  GitHubRepository,
  GitHubSearchResponse,
  PaginationInfo,
  SearchParams,
} from "@/types/github"
import { DETAIL_REVALIDATE_SECONDS, GITHUB_API_BASE_URL, MAX_SEARCH_RESULTS } from "./constants"

/**
 * GitHub API リクエスト用の共通ヘッダーを生成
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

/**
 * fetch のラッパー。ネットワークエラーをユーザー向けメッセージに変換する。
 */
async function fetchGitHub(url: string, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...options, headers: getHeaders() })
  } catch {
    throw new Error("GitHub API に接続できませんでした。ネットワーク接続を確認してください。")
  }
}

/**
 * API レスポンスが検索結果の形式を満たしているか検証する
 */
function isValidSearchResponse(data: unknown): data is GitHubSearchResponse {
  if (typeof data !== "object" || data === null) return false
  const obj = data as Record<string, unknown>
  return typeof obj.total_count === "number" && Array.isArray(obj.items)
}

/**
 * API レスポンスがリポジトリの形式を満たしているか検証する
 */
function isValidRepository(data: unknown): data is GitHubRepository {
  if (typeof data !== "object" || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.id === "number" &&
    typeof obj.full_name === "string" &&
    typeof obj.owner === "object" &&
    obj.owner !== null
  )
}

/**
 * リポジトリを検索する
 * @throws {Error} ネットワークエラー、API エラー、レスポンス不正時
 */
export async function searchRepositories(
  params: SearchParams
): Promise<{ repositories: GitHubRepository[]; pagination: PaginationInfo }> {
  const searchParams = new URLSearchParams({
    q: params.q,
    page: String(params.page),
    per_page: String(params.per_page),
  })
  if (params.sort && params.sort !== "best-match") {
    searchParams.set("sort", params.sort)
    searchParams.set("order", params.order ?? "desc")
  }

  const res = await fetchGitHub(`${GITHUB_API_BASE_URL}/search/repositories?${searchParams}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("API レート制限に達しました。しばらく待ってから再度お試しください。")
    }
    if (res.status === 422) {
      throw new Error("検索条件が不正です。キーワードを変更してお試しください。")
    }
    throw new Error(`GitHub API エラー: ${res.status}`)
  }

  const data: unknown = await res.json()

  if (!isValidSearchResponse(data)) {
    throw new Error("GitHub API から予期しない形式のレスポンスが返されました。")
  }

  // GitHub API は最大 1000 件まで取得可能
  const totalCount = Math.min(data.total_count, MAX_SEARCH_RESULTS)
  const totalPages = Math.ceil(totalCount / params.per_page)

  return {
    repositories: data.items,
    pagination: {
      currentPage: params.page,
      totalPages,
      totalCount: data.total_count,
    },
  }
}

/**
 * リポジトリの詳細を取得する
 * @throws {Error} ネットワークエラー、API エラー、レスポンス不正時
 */
export async function getRepository(owner: string, repo: string): Promise<GitHubRepository> {
  const res = await fetchGitHub(
    `${GITHUB_API_BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    { next: { revalidate: DETAIL_REVALIDATE_SECONDS } }
  )

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("REPOSITORY_NOT_FOUND")
    }
    if (res.status === 403) {
      throw new Error("API レート制限に達しました。しばらく待ってから再度お試しください。")
    }
    throw new Error(`GitHub API エラー: ${res.status}`)
  }

  const data: unknown = await res.json()

  if (!isValidRepository(data)) {
    throw new Error("GitHub API から予期しない形式のレスポンスが返されました。")
  }

  return data
}

/**
 * ページネーションの表示ページ番号を計算する
 */
export function calcVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
