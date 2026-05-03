import type { GitHubRepository, GitHubSearchResponse } from "@/types/github"

export function createMockRepository(overrides?: Partial<GitHubRepository>): GitHubRepository {
  return {
    id: 1,
    full_name: "octocat/Hello-World",
    name: "Hello-World",
    owner: {
      login: "octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    description: "My first repository on GitHub!",
    language: "TypeScript",
    stargazers_count: 1000,
    watchers_count: 500,
    forks_count: 200,
    open_issues_count: 50,
    html_url: "https://github.com/octocat/Hello-World",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    topics: ["typescript", "react"],
    homepage: "https://example.com",
    license: { name: "MIT License" },
    ...overrides,
  }
}

export function createMockSearchResponse(
  overrides?: Partial<GitHubSearchResponse>
): GitHubSearchResponse {
  return {
    total_count: 1,
    incomplete_results: false,
    items: [createMockRepository()],
    ...overrides,
  }
}
