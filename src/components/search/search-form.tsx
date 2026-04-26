"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  defaultValue: string
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    router.push(`/?q=${encodeURIComponent(trimmed)}&page=1`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="リポジトリ名を入力してください"
        aria-label="検索キーワード"
        className="flex-1"
      />
      <Button type="submit" disabled={!query.trim()}>
        検索
      </Button>
    </form>
  )
}
