"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <h2 className="text-xl font-bold mb-4">エラーが発生しました</h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <Button onClick={reset}>再試行</Button>
    </div>
  )
}
