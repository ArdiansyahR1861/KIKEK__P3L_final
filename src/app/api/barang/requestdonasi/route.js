import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get("keyword") || "";
        const status = searchParams.get("status") || "TERSEDIA";

        let query = `
        SELECT 
            b.id_barang,
            b.nama_barang,
            b.deskripsi,
            b.harga_satuan,
            b.status,
            k.nama_kategori,
            g.id_gambar,
            g.gambar
        FROM barang b
        LEFT JOIN kategoribarang k ON b.id_kategori = k.id_kategori
        LEFT JOIN gambarbarang g ON g.id_barang = b.id_barang
        `;

        let conditions = [`b.status = ?`];
        let values = [status];

        if (keyword) {
            conditions.push(`b.nama_barang LIKE ?`);
            values.push(`%${keyword}%`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }

        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            return NextResponse.json({ data: [], message: "Tidak ada data ditemukan." }, { status: 200 });
        }

        const groupedData = rows.reduce((acc, item) => {
            if (!acc[item.id_barang]) {
                acc[item.id_barang] = {
                    ...item,
                    gambar_barang: []
                };
            }

            if (item.id_gambar) {
                acc[item.id_barang].gambar_barang.push({
                    id_gambar: item.id_gambar,
                    gambar: item.gambar
                });
            }

            return acc;
        }, {});

        const result = Object.values(groupedData);

        return NextResponse.json({ data: result }, { status: 200 });

    } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        return NextResponse.json({ error: "Gagal mengambil data barang" }, { status: 500 });
    }


}