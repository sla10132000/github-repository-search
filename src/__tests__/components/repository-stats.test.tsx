import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { RepositoryStats } from "@/components/repository/repository-stats"

afterEach(() => {
  cleanup()
})

describe("RepositoryStats", () => {
  it("4つの統計値がラベル付きで表示される", () => {
    render(<RepositoryStats stars={1000} watchers={500} forks={200} issues={50} />)

    expect(screen.getByText("Star 数")).toBeInTheDocument()
    expect(screen.getByText("Watcher 数")).toBeInTheDocument()
    expect(screen.getByText("Fork 数")).toBeInTheDocument()
    expect(screen.getByText("Issue 数")).toBeInTheDocument()
  })

  it("数値がフォーマットされて表示される", () => {
    render(<RepositoryStats stars={12345} watchers={6789} forks={1234} issues={567} />)

    expect(screen.getByText("12,345")).toBeInTheDocument()
    expect(screen.getByText("6,789")).toBeInTheDocument()
    expect(screen.getByText("1,234")).toBeInTheDocument()
    expect(screen.getByText("567")).toBeInTheDocument()
  })

  it("0 の値も正しく表示される", () => {
    render(<RepositoryStats stars={0} watchers={0} forks={0} issues={0} />)

    expect(screen.getAllByText("0")).toHaveLength(4)
  })
})
