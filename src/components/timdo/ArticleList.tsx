"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useEffect, useState } from "react"

import AdminRevenueBreakdown from "./AdminRevenueBreakdown"
import { ArticlesTable } from "./ArticlesTable"
import { FilterSection } from "./FilterSection"

export interface ArticleData {
  userId: string
  feeLevelId: string
  paymentReceiptImageUrl: string
  articleId: string
  totalRevenue: number
}

export interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

const ArticlesRevenueDashboard: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [totalRevenue, setTotalRevenue] = useState<number>(0)

  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 6,
    totalCount: 0,
    totalPages: 0,
  })

  const [startDate, setStartDate] = useState<string>("2024-12-23")
  const [endDate, setEndDate] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<string>("")

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(month && { month }),
        ...(year && { year }),
      })
      const response = await fetch(`/api/totalRevenue?${params.toString()}`)
      const data = await response.json()

      setArticles(data.articles)
      setTotalRevenue(data.totalRevenue)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }
  useEffect(() => {
    fetchArticles()
  }, [pagination.page, month, year])

  const onApplyFilters = () => {
    fetchArticles()
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu Tháng {month}</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminRevenueBreakdown totalRevenue={totalRevenue} />
          <FilterSection
            startDate={startDate}
            endDate={endDate}
            month={month}
            year={year}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setMonth={setMonth}
            setYear={setYear}
            onApplyFilters={onApplyFilters}
          />
          <ArticlesTable
            articles={articles}
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ArticlesRevenueDashboard
