import Link from "next/link"
import Image from "next/image"
import type { GitHubRepository } from "@/types/github"
import { Card, CardContent } from "@/components/ui/card"

interface RepositoryCardProps {
  repository: GitHubRepository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link href={`/repositories/${repository.owner.login}/${repository.name}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="flex items-center gap-3 p-4">
          <Image
            src={repository.owner.avatar_url}
            alt={`${repository.owner.login} のアバター`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{repository.full_name}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>★ {repository.stargazers_count.toLocaleString()}</span>
              {repository.language && <span>{repository.language}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
