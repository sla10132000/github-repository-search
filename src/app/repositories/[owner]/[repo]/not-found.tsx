import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <h2 className="text-xl font-bold mb-4">リポジトリが見つかりません</h2>
      <p className="text-muted-foreground mb-6">
        指定されたリポジトリは存在しないか、非公開の可能性があります。
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        検索に戻る
      </Link>
    </div>
  )
}
