import { NextResponse } from "next/server";
import pool from '@/lib/db';
import { verifyUserRole } from "@/lib/auth";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export async function GET() {
    try {
        const query = `
      SELECT 
        d.id_donasi,
        d.tanggal_donasi,
        b.nama_barang,
        b.deskripsi,
        b.status,
        b.harga_satuan
      FROM donasi d
      LEFT JOIN barang b ON d.id_barang = b.id_barang
      ORDER BY d.tanggal_donasi DESC
    `;

        const [rows] = await pool.query(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error('Gagal mengambil data donasi:', error);
        return NextResponse.json({ success: false, error: 'Gagal mengambil data donasi' }, { status: 500 });
    }
}