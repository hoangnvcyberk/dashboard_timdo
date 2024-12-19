import ArticleList from "@/components/timdo/ArticleList"
import RevenueHeader from "@/components/timdo/RevenueHeader"

export default function RevenuePage() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 bg-gray-50">
      <RevenueHeader />
      <ArticleList />
    </div>
  )
}
