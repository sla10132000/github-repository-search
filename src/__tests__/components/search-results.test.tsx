import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SearchResults } from "@/components/search/search-results"
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

describe("SearchResults", () => {
  it("リポジトリ一覧を表示する", () => {
    const repos = [
      createMockRepository({ id: 1, full_name: "owner/repo-a" }),
      createMockRepository({ id: 2, full_name: "owner/repo-b" }),
    ]
    render(<SearchResults repositories={repos} />)

    expect(screen.getByText("owner/repo-a")).toBeInTheDocument()
    expect(screen.getByText("owner/repo-b")).toBeInTheDocument()
  })

  it("0件の場合は該当なしメッセージを表示する", () => {
    render(<SearchResults repositories={[]} />)

    expect(screen.getByText("該当するリポジトリが見つかりませんでした")).toBeInTheDocument()
  })

  it("リポジトリをリストアイテムとして表示する", () => {
    const repos = [createMockRepository()]
    render(<SearchResults repositories={repos} />)

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(1)
  })
})
