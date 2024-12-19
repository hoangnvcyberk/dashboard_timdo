"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ArticlesTable } from "./ArticlesTable"
import { FilterSection } from "./FilterSection"
import { convertToVnd } from "@/helpers/convertToVnd"

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
    limit: 5,
    totalCount: 0,
    totalPages: 0,
  })

  const [startDate, setStartDate] = useState<string>("2024-12-16")
  const [endDate, setEndDate] = useState<string>("")
  const [month, setMonth] = useState<string>("")

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(month && { month }),
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
  }, [])
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
          <FilterSection
            startDate={startDate}
            endDate={endDate}
            month={month}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setMonth={setMonth}
            onApplyFilters={onApplyFilters}
          />
          <div className="mt-8 mb-4 text-2xl font-bold">
            Tổng tiền: {convertToVnd(totalRevenue)}
          </div>
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
