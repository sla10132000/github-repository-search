import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <h2 className="text-xl font-bold mb-4">ページが見つかりません</h2>
      <p className="text-muted-foreground mb-6">お探しのページは存在しません。</p>
      <Link href="/" className={cn(buttonVariants())}>
        トップページに戻る
      </Link>
    </div>
  )
}
