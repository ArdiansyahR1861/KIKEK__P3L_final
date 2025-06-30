import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    const { id_barang } = await params;

    try {
        const query = `
            SELECT 
                b.id_barang,
                b.nama_barang,
                b.deskripsi AS deskripsi_barang,
                b.harga_satuan AS harga_barang,
                b.status,
                k.nama_kategori,
                g.id_gambar,
                g.gambar AS src_img
            FROM barang b
            LEFT JOIN kategoribarang k ON b.id_kategori = k.id_kategori
            LEFT JOIN gambarbarang g ON g.id_barang = b.id_barang
            WHERE b.id_barang = ?
        `;

        const [barang] = await pool.query(query, [id_barang]);

        if (barang.length === 0) {
            return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
        }

        const grouped = barang.reduce((acc, item) => {
            if (!acc) {
                acc = {
                    id_barang: item.id_barang,
                    nama_barang: item.nama_barang,
                    deskripsi_barang: item.deskripsi_barang,
                    harga_barang: item.harga_barang,
                    status: item.status,
                    kategori_barang: [],
                    gambar_barang: []
                };
            }

            if (item.id_gambar) {
                acc.gambar_barang.push({
                    id_gambar: item.id_gambar,
                    src_img: item.src_img
                });
            }

            if (item.nama_kategori && !acc.kategori_barang.includes(item.nama_kategori)) {
                acc.kategori_barang.push(item.nama_kategori);
            }

            return acc;
        }, null);

        return NextResponse.json({ barang: grouped }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
