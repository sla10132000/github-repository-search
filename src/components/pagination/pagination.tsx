"use client"

import Link from "next/link"
import { calcVisiblePages } from "@/lib/github"
import { MAX_VISIBLE_PAGES } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  query: string
}

export function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  const visiblePages = calcVisiblePages(currentPage, totalPages, MAX_VISIBLE_PAGES)

  function pageUrl(page: number): string {
    return `/?q=${encodeURIComponent(query)}&page=${page}`
  }

  return (
    <nav className="flex justify-center items-center gap-1 mt-6" aria-label="ページネーション">
      {currentPage > 1 && (
        <Link href={pageUrl(currentPage - 1)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          前へ
        </Link>
      )}

      {/* モバイルでは前へ/次へのみ、md以上でページ番号表示 */}
      <div className="hidden md:flex gap-1">
        {visiblePages.map((page) =>
          page === currentPage ? (
            <span
              key={page}
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={pageUrl(page)}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* モバイル: 現在ページ / 総ページ */}
      <span className="md:hidden text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link href={pageUrl(currentPage + 1)} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          次へ
        </Link>
      )}
    </nav>
  )
}
