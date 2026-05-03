import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SortSelect } from "@/components/search/sort-select"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

afterEach(() => {
  cleanup()
  mockPush.mockClear()
})

describe("SortSelect", () => {
  it("ソート選択肢が表示される", () => {
    render(<SortSelect currentSort="best-match" currentOrder="desc" query="react" />)

    const select = screen.getByRole("combobox", { name: "並び替え" })
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue("best-match")
  })

  it("ソート変更で page=1 にリセットしてナビゲーションする", async () => {
    const user = userEvent.setup()
    render(<SortSelect currentSort="best-match" currentOrder="desc" query="react" />)

    await user.selectOptions(screen.getByRole("combobox", { name: "並び替え" }), "stars")

    expect(mockPush).toHaveBeenCalledWith("/?q=react&page=1&sort=stars&order=desc")
  })

  it("best-match 選択時は order トグルボタンが非表示", () => {
    render(<SortSelect currentSort="best-match" currentOrder="desc" query="react" />)

    expect(screen.queryByRole("button", { name: /昇順|降順/ })).not.toBeInTheDocument()
  })

  it("stars 選択時に order トグルボタンが表示される", () => {
    render(<SortSelect currentSort="stars" currentOrder="desc" query="react" />)

    expect(screen.getByRole("button", { name: "昇順に変更" })).toBeInTheDocument()
  })

  it("order トグルで desc から asc に切り替わる", async () => {
    const user = userEvent.setup()
    render(<SortSelect currentSort="stars" currentOrder="desc" query="react" />)

    await user.click(screen.getByRole("button", { name: "昇順に変更" }))

    expect(mockPush).toHaveBeenCalledWith("/?q=react&page=1&sort=stars&order=asc")
  })

  it("order トグルで asc から desc に切り替わる", async () => {
    const user = userEvent.setup()
    render(<SortSelect currentSort="stars" currentOrder="asc" query="react" />)

    await user.click(screen.getByRole("button", { name: "降順に変更" }))

    expect(mockPush).toHaveBeenCalledWith("/?q=react&page=1&sort=stars&order=desc")
  })
})
