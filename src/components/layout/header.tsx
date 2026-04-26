import Link from "next/link"

interface HeaderProps {
  showBackLink?: boolean
}

export function Header({ showBackLink = false }: HeaderProps) {
  return (
    <header className="mb-6">
      {showBackLink && (
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← 検索結果に戻る
        </Link>
      )}
      <h1 className="text-2xl font-bold">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          GitHub Repository Search
        </Link>
      </h1>
    </header>
  )
}
