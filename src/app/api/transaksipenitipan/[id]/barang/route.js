import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req, { params }) {
    const id_transaksi = params.id;
    const { barangList } = await req.json();

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        for (const b of barangList) {
            await conn.query(
                `UPDATE barang SET nama_barang=?, deskripsi=?, harga_satuan=? WHERE id_barang=?`,
                [b.nama_barang, b.deskripsi, b.harga_satuan, b.id_barang]
            );
        }

        await conn.commit();
        return NextResponse.json({ success: true });
    } catch (error) {
        await conn.rollback();
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        conn.release();
    }
}
