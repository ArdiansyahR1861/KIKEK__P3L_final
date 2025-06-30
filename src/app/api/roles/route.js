// /pages/api/roles.js atau /app/api/roles/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id_role, nama_role FROM role");
    return NextResponse.json({ roles: rows });
  } catch (error) {
    console.error("Gagal mengambil role:", error);
    return NextResponse.json({ error: "Gagal mengambil role" }, { status: 500 });
  }
}
