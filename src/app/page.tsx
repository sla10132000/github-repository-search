import type { Metadata } from "next"
import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { TourGuide } from "@/components/onboarding/tour-guide"
import { SearchForm } from "@/components/search/search-form"
import { SearchResultsContainer } from "@/components/search/search-results-container"
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton"
import { SearchSuggestions } from "@/components/search/search-suggestions"
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

  // key を変えることで searchParams が変わるたびに Suspense が再トリガーされる
  const suspenseKey = `${query}-${currentPage}-${currentSort}-${currentOrder}`

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Header />
      <SearchForm defaultValue={query} sort={currentSort} />

      <Suspense key={suspenseKey} fallback={<SearchResultsSkeleton />}>
        <SearchResultsContainer
          query={query}
          page={currentPage}
          sort={currentSort}
          order={currentOrder}
        />
      </Suspense>
    </div>
  )
}
