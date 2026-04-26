import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { RepositoryStats } from "@/components/repository/repository-stats"
import { buttonVariants } from "@/components/ui/button"
import { getRepository } from "@/lib/github"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ owner: string; repo: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params
  return {
    title: `${owner}/${repo} - GitHub Repository Search`,
    description: `${owner}/${repo} の詳細情報`,
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function RepositoryDetailPage({ params }: PageProps) {
  const { owner, repo } = await params

  const repository = await getRepository(owner, repo).catch((error: unknown) => {
    if (error instanceof Error && error.message === "REPOSITORY_NOT_FOUND") {
      notFound()
    }
    throw error
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Header showBackLink />

      <div className="flex items-start gap-4 mt-4">
        <Image
          src={repository.owner.avatar_url}
          alt={`${repository.owner.login} のアバター`}
          width={128}
          height={128}
          className="rounded-full w-16 h-16 md:w-32 md:h-32"
        />
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{repository.full_name}</h2>
          {repository.language && (
            <p className="text-muted-foreground mt-1">{repository.language}</p>
          )}
          {repository.license && (
            <p className="text-xs text-muted-foreground mt-1">{repository.license.name}</p>
          )}
        </div>
      </div>

      {repository.description && (
        <p className="mt-4 text-muted-foreground">{repository.description}</p>
      )}

      {repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {repository.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-accent px-3 py-0.5 text-xs text-muted-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <RepositoryStats
        stars={repository.stargazers_count}
        watchers={repository.watchers_count}
        forks={repository.forks_count}
        issues={repository.open_issues_count}
      />

      <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
        <p>作成日: {formatDate(repository.created_at)}</p>
        <p>最終更新: {formatDate(repository.updated_at)}</p>
        {repository.homepage && (
          <p>
            ホームページ:{" "}
            <Link
              href={repository.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {repository.homepage}
            </Link>
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          GitHub で見る ↗
        </Link>
      </div>
    </div>
  )
}
