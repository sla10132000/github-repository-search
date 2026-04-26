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
}

/** GitHub 検索 API レスポンス */
export interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepository[]
}

/** 検索パラメータ */
export interface SearchParams {
  q: string
  page: number
  per_page: number
}

/** ページネーション情報 */
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
}
