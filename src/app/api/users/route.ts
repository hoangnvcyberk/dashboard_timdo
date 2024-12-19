import { pool } from "@/config/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [users] = await pool.execute("SELECT * FROM users")
    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
