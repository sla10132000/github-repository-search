import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { getRepository } from "@/lib/github"
import { Header } from "@/components/layout/header"
import { RepositoryStats } from "@/components/repository/repository-stats"

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

export default async function RepositoryDetailPage({ params }: PageProps) {
  const { owner, repo } = await params

  let repository
  try {
    repository = await getRepository(owner, repo)
  } catch (error) {
    if (error instanceof Error && error.message === "REPOSITORY_NOT_FOUND") {
      notFound()
    }
    throw error
  }

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
        </div>
      </div>

      {repository.description && (
        <p className="mt-4 text-muted-foreground">{repository.description}</p>
      )}

      <RepositoryStats
        stars={repository.stargazers_count}
        watchers={repository.watchers_count}
        forks={repository.forks_count}
        issues={repository.open_issues_count}
      />
    </div>
  )
}
