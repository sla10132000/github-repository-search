"use client"

import { useEffect, useCallback } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const TOUR_COMPLETED_KEY = "github-search-tour-completed"

export function TourGuide() {
  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "次へ",
      prevBtnText: "前へ",
      doneBtnText: "はじめる",
      steps: [
        {
          element: "[data-tour='search-input']",
          popover: {
            title: "キーワードを入力",
            description: "検索したいリポジトリ名やキーワードを入力してください。",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "[data-tour='search-button']",
          popover: {
            title: "検索を実行",
            description: "ボタンをクリックするか、Enter キーで検索できます。",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "[data-tour='suggestions']",
          popover: {
            title: "おすすめキーワード",
            description: "よく検索されるキーワードをクリックすると、すぐに検索できます。",
            side: "top",
            align: "center",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem(TOUR_COMPLETED_KEY, "true")
      },
    })

    driverObj.drive()
  }, [])

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY)
    if (!completed) {
      // 少し遅延させてDOMの描画を待つ
      const timer = setTimeout(startTour, 500)
      return () => clearTimeout(timer)
    }
  }, [startTour])

  return null
}
