import { pool } from "@/config/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const offset = (page - 1) * limit

    // Các bộ lọc ngày
    const startDate = searchParams.get("startDate") || "2024-12-16"
    const endDate = searchParams.get("endDate")

    // Bộ lọc tháng (nếu có)
    const month = searchParams.get("month")

    // Xây dựng điều kiện lọc ngày
    let dateCondition = `sa.createdAt >= '${startDate}'`
    if (endDate) {
      dateCondition += ` AND sa.createdAt <= '${endDate}'`
    }

    // Nếu có filter theo tháng, thêm điều kiện
    if (month) {
      dateCondition += ` AND EXTRACT(MONTH FROM sa.createdAt) = ${month}`
    }

    // Truy vấn lấy danh sách bài viết với phân trang
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
    LIMIT ? OFFSET ?
    `

    // Truy vấn đếm tổng số bài viết (để phân trang)
    const queryTotalCount = `
    SELECT COUNT(DISTINCT sa.id) AS totalCount
    FROM sharedarticles sa
    JOIN paymenthistory ph ON ph.articleId = sa.id
    JOIN feelevels f ON sa.feeLevelId = f.id
    JOIN useraccounttypes u ON u.user_id = sa.userId
    WHERE u.account_type_id = 3
    AND ${dateCondition}
    `

    // Truy vấn tính tổng doanh thu
    const queryTotalRevenue = `
    SELECT SUM(f.price) AS totalRevenue
    FROM sharedarticles sa
    JOIN paymenthistory ph ON ph.articleId = sa.id
    JOIN feelevels f ON sa.feeLevelId = f.id
    JOIN useraccounttypes u ON u.user_id = sa.userId
    WHERE u.account_type_id = 3
    AND ${dateCondition}
    `

    // Thực thi truy vấn lấy danh sách bài viết
    const [rows] = await pool.execute<any[]>(queryArticles, [limit, offset])

    // Thực thi truy vấn đếm tổng số bài viết
    const [countResult] = await pool.execute<any[]>(queryTotalCount)
    const totalCount = countResult[0]?.totalCount || 0

    // Thực thi truy vấn tính tổng doanh thu
    const [totalRevenueResult] = await pool.execute<any[]>(queryTotalRevenue)
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(totalCount / limit)

    // Trả về kết quả gồm danh sách bài viết, tổng doanh thu và thông tin phân trang
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
