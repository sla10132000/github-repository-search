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
})
