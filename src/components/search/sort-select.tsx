"use client"

import { useRouter } from "next/navigation"
import type { OrderOption, SortOption } from "@/types/github"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "マッチ度" },
  { value: "stars", label: "Star 数" },
  { value: "updated", label: "更新日" },
]

interface SortSelectProps {
  currentSort: SortOption
  currentOrder: OrderOption
  query: string
}

export function SortSelect({ currentSort, currentOrder, query }: SortSelectProps) {
  const router = useRouter()

  function navigate(sort: SortOption, order: OrderOption) {
    const params = new URLSearchParams({ q: query, page: "1", sort, order })
    router.push(`/?${params}`)
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(e.target.value as SortOption, currentOrder)
  }

  function handleToggleOrder() {
    navigate(currentSort, currentOrder === "desc" ? "asc" : "desc")
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={currentSort}
        onChange={handleSortChange}
        aria-label="並び替え"
        className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {currentSort !== "best-match" && (
        <button
          type="button"
          onClick={handleToggleOrder}
          aria-label={currentOrder === "desc" ? "昇順に変更" : "降順に変更"}
          className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm hover:bg-accent transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          title={currentOrder === "desc" ? "降順（大きい順）" : "昇順（小さい順）"}
        >
          {currentOrder === "desc" ? "↓" : "↑"}
        </button>
      )}
    </div>
  )
}
