import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { GitHubRepository } from "@/types/github"

interface RepositoryCardProps {
  repository: GitHubRepository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repository.owner.login}/${repository.name}`}
      className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="cursor-pointer transition-all hover:bg-accent hover:shadow-md hover:border-foreground/20">
        <CardContent className="flex items-start gap-3 p-4">
          <Image
            src={repository.owner.avatar_url}
            alt={`${repository.owner.login} のアバター`}
            width={40}
            height={40}
            className="rounded-full mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{repository.full_name}</p>
            {repository.description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {repository.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>★ {repository.stargazers_count.toLocaleString()}</span>
              {repository.language && <span>{repository.language}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
