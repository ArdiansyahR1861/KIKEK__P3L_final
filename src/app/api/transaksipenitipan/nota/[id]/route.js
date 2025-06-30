import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, context) {
    const { id } = context.params;

    try {
        const [transaksiRows] = await pool.query(
            `SELECT 
                tp.id_transaksi_penitipan, 
                tp.tanggal_masuk, 
                tp.tanggal_keluar,
                p.id_penitip,
                p.email_penitip,
                p.nama_penitip,
                pg.id_pegawai, pg.nama_pegawai,
                k.nama_pegawaI
            FROM transaksipenitipan tp
            JOIN penitip p ON tp.id_penitip = p.id_penitip
            JOIN pegawai pg ON tp.id_pegawai = pg.id_pegawai
            LEFT JOIN pegawai k ON tp.id_pegawai = k.id_pegawai
            WHERE tp.id_transaksi_penitipan = ?`,
            [id]
        );

        if (transaksiRows.length === 0) {
            return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
        }

        const data = transaksiRows[0];

        const [barangRows] = await pool.query(
            `SELECT b.nama_barang, b.deskripsi, b.harga_satuan
       FROM detailpenitipan dp
       JOIN barang b ON dp.id_barang = b.id_barang
       WHERE dp.id_transaksi_penitipan = ?`,
            [id]
        );

        data.barang = barangRows;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Gagal ambil data nota:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
