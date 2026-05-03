import { expect, test } from "@playwright/test"

test.describe("GitHub リポジトリ検索フロー", () => {
  test("検索 → 結果表示 → 詳細 → 戻る", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /GitHub Repository Search/ })).toBeVisible()

    await page.getByRole("textbox", { name: "検索キーワード" }).fill("nextjs")
    await page.getByRole("button", { name: "検索" }).click()

    await expect(page.getByText("検索結果:")).toBeVisible({ timeout: 10000 })
    const firstCard = page.getByRole("list").getByRole("listitem").first()
    await expect(firstCard).toBeVisible()

    await firstCard.click()
    await expect(page.getByText("Star 数")).toBeVisible({ timeout: 10000 })
    await expect(page.getByText("Watcher 数")).toBeVisible()
    await expect(page.getByText("Fork 数")).toBeVisible()
    await expect(page.getByText("Issue 数")).toBeVisible()

    await page.getByText("← 検索結果に戻る").click()
    await expect(page.getByRole("heading", { name: /GitHub Repository Search/ })).toBeVisible()
  })

  test("初期状態では検索ボタンが無効", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("button", { name: "検索" })).toBeDisabled()
  })

  test("ソート変更で検索結果が更新される", async ({ page }) => {
    await page.goto("/?q=react&page=1")
    await expect(page.getByText("検索結果:")).toBeVisible({ timeout: 10000 })

    await page.getByRole("combobox", { name: "並び替え" }).selectOption("stars")
    await expect(page.getByText("検索結果:")).toBeVisible({ timeout: 10000 })
  })
})
