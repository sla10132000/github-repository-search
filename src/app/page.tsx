import type { Metadata } from "next"
import { searchRepositories } from "@/lib/github"
import { PER_PAGE } from "@/lib/constants"
import type { SortOption } from "@/types/github"
import { Header } from "@/components/layout/header"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"
import { SortSelect } from "@/components/search/sort-select"
import { Pagination } from "@/components/pagination/pagination"
import { SearchSuggestions } from "@/components/search/search-suggestions"
import { TourGuide } from "@/components/onboarding/tour-guide"

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}

const validSorts: SortOption[] = ["best-match", "stars", "updated"]

function parseSortOption(sort?: string): SortOption {
  if (sort && validSorts.includes(sort as SortOption)) {
    return sort as SortOption
  }
  return "best-match"
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams
  if (!q) {
    return { title: "GitHub Repository Search" }
  }
  return {
    title: `「${q}」の検索結果 - GitHub Repository Search`,
    description: `GitHub で「${q}」に一致するリポジトリの検索結果`,
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page, sort } = await searchParams
  const query = q?.trim() ?? ""
  const currentPage = Math.max(1, Number(page) || 1)
  const currentSort = parseSortOption(sort)

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Header />
        <SearchForm defaultValue="" />
        <SearchSuggestions />
        <TourGuide />
      </div>
    )
  }

  const { repositories, pagination } = await searchRepositories({
    q: query,
    page: currentPage,
    per_page: PER_PAGE,
    sort: currentSort,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Header />
      <SearchForm defaultValue={query} sort={currentSort} />

      <div className="flex items-center justify-between mt-4 mb-4">
        <p className="text-sm text-muted-foreground">
          検索結果: {pagination.totalCount.toLocaleString()} 件
          {pagination.totalCount > 1000 && "（最大 1,000 件まで表示可能）"}
        </p>
        <SortSelect currentSort={currentSort} query={query} />
      </div>

      {pagination.totalPages >= 5 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
          sort={currentSort}
        />
      )}

      <SearchResults repositories={repositories} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
          sort={currentSort}
        />
      )}
    </div>
  )
}
