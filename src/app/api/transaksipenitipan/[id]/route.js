import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request, context) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    try {
        // Ambil data transaksi + penitip
        const [transaksiRows] = await pool.query(
            `SELECT 
         tp.*, 
         p.nama_penitip 
       FROM transaksipenitipan tp
       JOIN penitip p ON tp.id_penitip = p.id_penitip
       WHERE tp.id_transaksi_penitipan = ?`,
            [id]
        );

        if (transaksiRows.length === 0) {
            return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        // Ambil data barang + gambar dari detailpenitipan
        const [barangRows] = await pool.query(
            `SELECT 
         b.id_barang, b.nama_barang, b.harga_satuan, b.deskripsi,
         GROUP_CONCAT(gb.gambar) AS gambar
       FROM detailpenitipan dp
       JOIN barang b ON dp.id_barang = b.id_barang
       LEFT JOIN gambarbarang gb ON gb.id_barang = b.id_barang
       WHERE dp.id_transaksi_penitipan = ?
       GROUP BY b.id_barang`,
            [id]
        );

        // sesudah query barangRows
        const parsedBarangRows = barangRows.map(b => ({
            ...b,
            gambar: typeof b.gambar === 'string' ? b.gambar.split(',') : []
        }));

        return NextResponse.json({
            transaksi: transaksiRows[0],
            barang: parsedBarangRows
        });


        return NextResponse.json({
            transaksi: transaksiRows[0],
            barang: barangRows
        });
    } catch (error) {
        console.error("❌ ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




export async function PUT(req, { params }) {
    const id = params.id;
    const { tanggal_masuk, id_penitip, id_pegawai, barangList } = await req.json();
    const tanggal_keluar = new Date(tanggal_masuk);
    tanggal_keluar.setDate(tanggal_keluar.getDate() + 30);
    const batas_diambil = new Date(tanggal_keluar);

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        await conn.query(
            `UPDATE transaksipenitipan SET tanggal_masuk=?, tanggal_keluar=?, batas_diambil=?, id_penitip=?, id_pegawai=? WHERE id_transaksi_penitipan=?`,
            [tanggal_masuk, tanggal_keluar, batas_diambil, id_penitip, id_pegawai, id]
        );

        await conn.query(`DELETE FROM detailpenitipan WHERE id_transaksi_penitipan=?`, [id]);

        for (const barang of barangList) {
            await conn.query(
                `INSERT INTO detailpenitipan (id_transaksi_penitipan, id_barang) VALUES (?, ?)`,
                [id, barang.id_barang]
            );
        }

        await conn.commit();
        return NextResponse.json({ success: true });
    } catch (err) {
        await conn.rollback();
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    } finally {
        conn.release();
    }
}
