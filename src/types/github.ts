/** GitHub リポジトリオーナー */
export interface GitHubOwner {
  login: string
  avatar_url: string
}

/** GitHub リポジトリ */
export interface GitHubRepository {
  id: number
  full_name: string
  name: string
  owner: GitHubOwner
  description: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  html_url: string
  created_at: string
  updated_at: string
  topics: string[]
  homepage: string | null
  license: { name: string } | null
}

/** GitHub 検索 API レスポンス */
export interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepository[]
}

/** ソート順 */
export type SortOption = "best-match" | "stars" | "updated"

/** 並び順 */
export type OrderOption = "desc" | "asc"

/** 検索パラメータ */
export interface SearchParams {
  q: string
  page: number
  per_page: number
  sort?: SortOption
  order?: OrderOption
}

/** ページネーション情報 */
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
}
