import { Pagination } from "@/components/pagination/pagination"
import { SearchResults } from "@/components/search/search-results"
import { SortSelect } from "@/components/search/sort-select"
import { PER_PAGE } from "@/lib/constants"
import { searchRepositories } from "@/lib/github"
import type { OrderOption, SortOption } from "@/types/github"

interface SearchResultsContainerProps {
  query: string
  page: number
  sort: SortOption
  order: OrderOption
}

export async function SearchResultsContainer({
  query,
  page,
  sort,
  order,
}: SearchResultsContainerProps) {
  const { repositories, pagination } = await searchRepositories({
    q: query,
    page,
    per_page: PER_PAGE,
    sort,
    order,
  })

  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-4">
        <p className="text-sm text-muted-foreground">
          検索結果: {pagination.totalCount.toLocaleString()} 件
          {pagination.totalCount > 1000 && "（最大 1,000 件まで表示可能）"}
        </p>
        <SortSelect currentSort={sort} currentOrder={order} query={query} />
      </div>

      {pagination.totalPages >= 5 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
          sort={sort}
        />
      )}

      <SearchResults repositories={repositories} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
          sort={sort}
        />
      )}
    </>
  )
}
