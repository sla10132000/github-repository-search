"use client"

import { useRouter } from "next/navigation"

const suggestions = ["react", "typescript", "next.js", "tailwindcss", "python", "rust"]

export function SearchSuggestions() {
  const router = useRouter()

  function handleClick(keyword: string) {
    router.push(`/?q=${encodeURIComponent(keyword)}&page=1`)
  }

  return (
    <div className="mt-8 text-center" data-tour="suggestions">
      <p className="text-muted-foreground mb-3">例えばこんなキーワードで検索:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => handleClick(keyword)}
            className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  )
}
