import { pool } from "@/config/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const offset = (page - 1) * limit

    const startDate = searchParams.get("startDate") || "2024-12-23"
    const endDate = searchParams.get("endDate")

    const month = searchParams.get("month")
    const year = searchParams.get("year")

    let dateCondition = `sa.createdAt >= '${startDate}'`
    if (endDate) {
      dateCondition += ` AND sa.createdAt <= '${endDate}'`
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    if (month && year) {
      dateCondition += ` AND EXTRACT(MONTH FROM sa.createdAt) = ${month} AND EXTRACT(YEAR FROM sa.createdAt) = ${year}`
    } else if (month) {
      dateCondition += ` AND EXTRACT(MONTH FROM sa.createdAt) = ${month}`
    } else if (year) {
      dateCondition += ` AND EXTRACT(YEAR FROM sa.createdAt) = ${year}`
    } else {
      dateCondition += ` AND EXTRACT(MONTH FROM sa.createdAt) = ${currentMonth} AND EXTRACT(YEAR FROM sa.createdAt) = ${currentYear}`
    }

    const queryArticles = `
    SELECT DISTINCT 
        sa.userId, 
        sa.feeLevelId, 
        ph.paymentReceiptImageUrl, 
        ph.articleId,
        (SELECT SUM(f.price) 
         FROM feelevels f 
         JOIN paymenthistory ph_sub ON ph_sub.articleId = sa.id
         WHERE sa.feeLevelId = f.id 
         AND ph_sub.articleId = sa.id) AS totalRevenue
    FROM sharedarticles sa
    JOIN paymenthistory ph ON ph.articleId = sa.id
    JOIN feelevels f ON sa.feeLevelId = f.id
    JOIN useraccounttypes u ON u.user_id = sa.userId
    WHERE u.account_type_id = 3
    AND ${dateCondition}
    ORDER BY sa.createdAt DESC  
    LIMIT ? OFFSET ?
    `

    const queryTotalCount = `
    SELECT COUNT(DISTINCT sa.id) AS totalCount
    FROM sharedarticles sa
    JOIN paymenthistory ph ON ph.articleId = sa.id
    JOIN feelevels f ON sa.feeLevelId = f.id
    JOIN useraccounttypes u ON u.user_id = sa.userId
    WHERE u.account_type_id = 3
    AND ${dateCondition}
    `

    const queryTotalRevenue = `
    SELECT SUM(f.price) AS totalRevenue
    FROM sharedarticles sa
    JOIN paymenthistory ph ON ph.articleId = sa.id
    JOIN feelevels f ON sa.feeLevelId = f.id
    JOIN useraccounttypes u ON u.user_id = sa.userId
    WHERE u.account_type_id = 3
    AND ${dateCondition}
    `

    const [rows] = await pool.execute<any[]>(queryArticles, [limit, offset])

    const [countResult] = await pool.execute<any[]>(queryTotalCount)
    const totalCount = countResult[0]?.totalCount || 0

    const [totalRevenueResult] = await pool.execute<any[]>(queryTotalRevenue)
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json(
      {
        articles: rows,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
        totalRevenue: totalRevenue,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching articles and total revenue:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
