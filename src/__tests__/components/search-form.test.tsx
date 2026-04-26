import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SearchForm } from "@/components/search/search-form"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

afterEach(() => {
  cleanup()
  mockPush.mockClear()
})

describe("SearchForm", () => {
  it("入力欄とボタンが表示される", () => {
    render(<SearchForm defaultValue="" />)

    expect(screen.getByRole("textbox", { name: "検索キーワード" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument()
  })

  it("デフォルト値が入力欄に表示される", () => {
    render(<SearchForm defaultValue="react" />)

    expect(screen.getByRole("textbox")).toHaveValue("react")
  })

  it("空文字では検索ボタンが無効になる", () => {
    render(<SearchForm defaultValue="" />)

    expect(screen.getByRole("button", { name: "検索" })).toBeDisabled()
  })

  it("キーワード入力して送信すると URL が更新される", async () => {
    const user = userEvent.setup()
    render(<SearchForm defaultValue="" />)

    await user.type(screen.getByRole("textbox"), "nextjs")
    await user.click(screen.getByRole("button", { name: "検索" }))

    expect(mockPush).toHaveBeenCalledWith("/?q=nextjs&page=1")
  })

  it("空白のみでは検索ボタンが無効になる", async () => {
    const user = userEvent.setup()
    render(<SearchForm defaultValue="" />)

    await user.type(screen.getByRole("textbox"), "   ")

    expect(screen.getByRole("button", { name: "検索" })).toBeDisabled()
  })
})
