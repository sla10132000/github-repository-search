import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Pagination } from "@/components/pagination/pagination"

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

afterEach(() => {
  cleanup()
})

describe("Pagination", () => {
  it("最初のページでは「前へ」「最初」が表示されない", () => {
    render(<Pagination currentPage={1} totalPages={5} query="react" />)

    expect(screen.queryByText("前へ")).not.toBeInTheDocument()
    expect(screen.queryByText("最初")).not.toBeInTheDocument()
    expect(screen.getByText("次へ")).toBeInTheDocument()
    expect(screen.getByText("最後")).toBeInTheDocument()
  })

  it("最後のページでは「次へ」「最後」が表示されない", () => {
    render(<Pagination currentPage={5} totalPages={5} query="react" />)

    expect(screen.getByText("前へ")).toBeInTheDocument()
    expect(screen.getByText("最初")).toBeInTheDocument()
    expect(screen.queryByText("次へ")).not.toBeInTheDocument()
    expect(screen.queryByText("最後")).not.toBeInTheDocument()
  })

  it("中間ページでは全ナビゲーションが表示される", () => {
    render(<Pagination currentPage={3} totalPages={5} query="react" />)

    expect(screen.getByText("最初")).toBeInTheDocument()
    expect(screen.getByText("前へ")).toBeInTheDocument()
    expect(screen.getByText("次へ")).toBeInTheDocument()
    expect(screen.getByText("最後")).toBeInTheDocument()
  })

  it("現在ページに aria-current='page' が設定される", () => {
    render(<Pagination currentPage={3} totalPages={5} query="react" />)

    expect(screen.getByText("3")).toHaveAttribute("aria-current", "page")
  })

  it("ページリンクの URL にクエリパラメータが含まれる", () => {
    render(<Pagination currentPage={2} totalPages={5} query="react" />)

    const prevLink = screen.getByText("前へ")
    expect(prevLink).toHaveAttribute("href", "/?q=react&page=1")

    const nextLink = screen.getByText("次へ")
    expect(nextLink).toHaveAttribute("href", "/?q=react&page=3")
  })

  it("sort が指定されている場合 URL に含まれる", () => {
    render(<Pagination currentPage={2} totalPages={5} query="react" sort="stars" />)

    const nextLink = screen.getByText("次へ")
    expect(nextLink).toHaveAttribute("href", "/?q=react&page=3&sort=stars")
  })

  it("totalPages が 1 の場合はナビゲーションリンクが表示されない", () => {
    render(<Pagination currentPage={1} totalPages={1} query="react" />)

    expect(screen.queryByText("前へ")).not.toBeInTheDocument()
    expect(screen.queryByText("次へ")).not.toBeInTheDocument()
    expect(screen.queryByText("最初")).not.toBeInTheDocument()
    expect(screen.queryByText("最後")).not.toBeInTheDocument()
  })

  it("nav 要素に aria-label が設定される", () => {
    render(<Pagination currentPage={1} totalPages={5} query="react" />)

    expect(screen.getByRole("navigation", { name: "ページネーション" })).toBeInTheDocument()
  })

  it("モバイル向けに現在ページ/総ページ数が表示される", () => {
    render(<Pagination currentPage={3} totalPages={10} query="react" />)

    expect(screen.getByText("3 / 10")).toBeInTheDocument()
  })
})
