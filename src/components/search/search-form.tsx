"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  defaultValue: string
  sort?: string
}

export function SearchForm({ defaultValue, sort }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    const params = new URLSearchParams({ q: trimmed, page: "1" })
    if (sort && sort !== "best-match") {
      params.set("sort", sort)
    }
    router.push(`/?${params}`)
  }

  function handleClear() {
    setQuery("")
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="リポジトリ名を入力してください（Enter で検索）"
          aria-label="検索キーワード"
          maxLength={256}
          className="flex-1 pr-8"
          data-tour="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
            aria-label="検索キーワードをクリア"
          >
            ✕
          </button>
        )}
      </div>
      <Button type="submit" disabled={!query.trim()} data-tour="search-button">
        検索
      </Button>
    </form>
  )
}
