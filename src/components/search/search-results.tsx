import type { GitHubRepository } from "@/types/github"
import { RepositoryCard } from "@/components/repository/repository-card"

interface SearchResultsProps {
  repositories: GitHubRepository[]
}

export function SearchResults({ repositories }: SearchResultsProps) {
  if (repositories.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        該当するリポジトリが見つかりませんでした
      </p>
    )
  }

  return (
    <ul className="space-y-3" role="list">
      {repositories.map((repo) => (
        <li key={repo.id}>
          <RepositoryCard repository={repo} />
        </li>
      ))}
    </ul>
  )
}
