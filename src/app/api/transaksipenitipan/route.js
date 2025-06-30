import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    try {
        const [rows] = await pool.query(
            `SELECT 
                tp.*, 
                p.nama_penitip 
            FROM transaksipenitipan tp 
            JOIN penitip p ON tp.id_penitip = p.id_penitip 
            WHERE p.nama_penitip LIKE ? OR DATE(tp.tanggal_masuk) LIKE ?`,
            [`%${search}%`, `%${search}%`]
        );

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const { tanggal_masuk, id_penitip, id_pegawai, barangList } = await req.json();
    const tanggal_keluar = new Date(tanggal_masuk);
    tanggal_keluar.setDate(tanggal_keluar.getDate() + 30);
    const batas_diambil = new Date(tanggal_keluar);

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        const [transaksiResult] = await conn.query(
            `INSERT INTO transaksipenitipan (tanggal_masuk, tanggal_keluar, batas_diambil, id_penitip, id_pegawai)
       VALUES (?, ?, ?, ?, ?)`,
            [tanggal_masuk, tanggal_keluar, batas_diambil, id_penitip, id_pegawai]
        );

        const id_transaksi = transaksiResult.insertId;

        for (const barang of barangList) {
            const [barangResult] = await conn.query(
                `INSERT INTO barang (nama_barang, deskripsi, harga_satuan, status, extend)
         VALUES (?, ?, ?, 'tersedia', 0)`,
                [barang.nama_barang, barang.deskripsi, barang.harga_satuan]
            );

            const id_barang = barangResult.insertId;

            await conn.query(
                `INSERT INTO detailpenitipan (id_transaksi_penitipan, id_barang) VALUES (?, ?)`,
                [id_transaksi, id_barang]
            );

            // (Opsional) Jika kamu ingin menyimpan nama file gambar:
            if (barang.gambar && barang.gambar.length) {
                for (const namaGambar of barang.gambar) {
                    await conn.query(
                        `INSERT INTO gambarbarang (id_barang, gambar) VALUES (?, ?)`,
                        [id_barang, namaGambar] // namaGambar = URL blob, perlu diganti jadi nama file asli jika disimpan permanen
                    );
                }
            }
        }

        await conn.commit();
        return NextResponse.json({ success: true, id_transaksi });
    } catch (err) {
        await conn.rollback();
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    } finally {
        conn.release();
    }
}
