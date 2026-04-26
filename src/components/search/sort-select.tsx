"use client"

import { useRouter } from "next/navigation"
import type { SortOption } from "@/types/github"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "マッチ度" },
  { value: "stars", label: "Star 数" },
  { value: "updated", label: "更新日" },
]

interface SortSelectProps {
  currentSort: SortOption
  query: string
}

export function SortSelect({ currentSort, query }: SortSelectProps) {
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sort = e.target.value as SortOption
    router.push(`/?q=${encodeURIComponent(query)}&page=1&sort=${sort}`)
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      aria-label="並び替え"
      className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
