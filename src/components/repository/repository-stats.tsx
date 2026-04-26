import { Card, CardContent } from "@/components/ui/card"

interface RepositoryStatsProps {
  stars: number
  watchers: number
  forks: number
  issues: number
}

const statItems = [
  { key: "stars", label: "Star 数" },
  { key: "watchers", label: "Watcher 数" },
  { key: "forks", label: "Fork 数" },
  { key: "issues", label: "Issue 数" },
] as const

export function RepositoryStats({ stars, watchers, forks, issues }: RepositoryStatsProps) {
  const values = { stars, watchers, forks, issues }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {statItems.map((item) => (
        <Card key={item.key}>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold">{values[item.key].toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
