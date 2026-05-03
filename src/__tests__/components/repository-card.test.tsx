import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { RepositoryCard } from "@/components/repository/repository-card"
import { createMockRepository } from "../helpers/mock-data"

vi.mock("next/image", () => ({
  // biome-ignore lint/a11y/useAltText: test mock passes alt through props
  // biome-ignore lint/performance/noImgElement: test mock for next/image
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

afterEach(() => {
  cleanup()
})

describe("RepositoryCard", () => {
  it("リポジトリ名が表示される", () => {
    render(<RepositoryCard repository={createMockRepository()} />)

    expect(screen.getByText("octocat/Hello-World")).toBeInTheDocument()
  })

  it("Star 数が表示される", () => {
    render(<RepositoryCard repository={createMockRepository({ stargazers_count: 12345 })} />)

    expect(screen.getByText("★ 12,345")).toBeInTheDocument()
  })

  it("言語が表示される", () => {
    render(<RepositoryCard repository={createMockRepository({ language: "Rust" })} />)

    expect(screen.getByText("Rust")).toBeInTheDocument()
  })

  it("description がある場合は表示される", () => {
    render(<RepositoryCard repository={createMockRepository({ description: "A cool project" })} />)

    expect(screen.getByText("A cool project")).toBeInTheDocument()
  })

  it("description が null の場合は表示されない", () => {
    render(<RepositoryCard repository={createMockRepository({ description: null })} />)

    expect(screen.queryByText("A cool project")).not.toBeInTheDocument()
  })

  it("詳細ページへのリンクが正しい", () => {
    render(<RepositoryCard repository={createMockRepository()} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/repositories/octocat/Hello-World")
  })

  it("language が null の場合は言語を表示しない", () => {
    render(<RepositoryCard repository={createMockRepository({ language: null })} />)

    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument()
  })
})
