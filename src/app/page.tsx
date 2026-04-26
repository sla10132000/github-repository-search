import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { TourGuide } from "@/components/onboarding/tour-guide"
import { Pagination } from "@/components/pagination/pagination"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"
import { SearchSuggestions } from "@/components/search/search-suggestions"
import { SortSelect } from "@/components/search/sort-select"
import { PER_PAGE } from "@/lib/constants"
import { searchRepositories } from "@/lib/github"
import type { OrderOption, SortOption } from "@/types/github"

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string; order?: string }>
}

const validSorts: SortOption[] = ["best-match", "stars", "updated"]
const validOrders: OrderOption[] = ["desc", "asc"]

function parseSortOption(sort?: string): SortOption {
  if (sort && validSorts.includes(sort as SortOption)) {
    return sort as SortOption
  }
  return "best-match"
}

function parseOrderOption(order?: string): OrderOption {
  if (order && validOrders.includes(order as OrderOption)) {
    return order as OrderOption
  }
  return "desc"
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
  const { q, page, sort, order } = await searchParams
  const query = q?.trim() ?? ""
  const currentPage = Math.max(1, Number(page) || 1)
  const currentSort = parseSortOption(sort)
  const currentOrder = parseOrderOption(order)

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
    order: currentOrder,
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
        <SortSelect currentSort={currentSort} currentOrder={currentOrder} query={query} />
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
