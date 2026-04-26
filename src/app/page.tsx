import type { Metadata } from "next"
import { searchRepositories } from "@/lib/github"
import { PER_PAGE } from "@/lib/constants"
import { Header } from "@/components/layout/header"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"
import { Pagination } from "@/components/pagination/pagination"
import { SearchSuggestions } from "@/components/search/search-suggestions"

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
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
  const { q, page } = await searchParams
  const query = q?.trim() ?? ""
  const currentPage = Math.max(1, Number(page) || 1)

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Header />
        <SearchForm defaultValue="" />
        <SearchSuggestions />
      </div>
    )
  }

  const { repositories, pagination } = await searchRepositories({
    q: query,
    page: currentPage,
    per_page: PER_PAGE,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Header />
      <SearchForm defaultValue={query} />

      <div className="flex items-center justify-between mt-4 mb-4">
        <p className="text-sm text-muted-foreground">
          検索結果: {pagination.totalCount.toLocaleString()} 件
          {pagination.totalCount > 1000 && "（最大 1,000 件まで表示可能）"}
        </p>
      </div>

      {pagination.totalPages >= 5 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
        />
      )}

      <SearchResults repositories={repositories} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          query={query}
        />
      )}
    </div>
  )
}
