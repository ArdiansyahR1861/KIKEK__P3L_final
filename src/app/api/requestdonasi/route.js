import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyUserRole } from '@/lib/auth';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

export async function GET() {
    try {
        await verifyUserRole(["Owner"]);
        const query = `
        SELECT 
            r.id_request,
            r.deskripsi_request,
            r.tanggal_request,
            r.status_request,
            r.id_organisasi,
            r.id_pegawai,
            o.nama_organisasi
        FROM requestdonasi r
        LEFT JOIN organisasi o ON r.id_organisasi = o.id_organisasi
        ORDER BY r.tanggal_request DESC
        `;

        const [rows] = await pool.query(query);

        return NextResponse.json({ success: true, data: rows }, { status: 200 });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error('Gagal mengambil data request:', error);
        return NextResponse.json({ success: false, error: 'Gagal mengambil data request' }, { status: 500 });
    }
}

export async function PUT(request) {
    const { id_request, status_request, id_barang, id_pegawai } = await request.json();

    try {
        await verifyUserRole(["Owner"]);
        // 1. Update status request
        await pool.query(
            `UPDATE requestdonasi SET status_request = ?, id_pegawai = ? WHERE id_request = ?`,
            [status_request, id_pegawai, id_request]
        );

        if (status_request === 1 && id_barang) {
            // 2. Insert donasi
            await pool.query(
                `INSERT INTO donasi (tanggal_donasi, id_barang, id_request)
         VALUES (CURDATE(), ?, ?)`,
                [id_barang, id_request]
            );

            // 3. Ubah status barang
            await pool.query(
                `UPDATE barang SET status = 'terdonasikan' WHERE id_barang = ?`,
                [id_barang]
            );

            // 4. Ambil harga barang dan id_penitip dari join
            const [[data]] = await pool.query(`
        SELECT 
          b.harga_satuan, 
          tp.id_penitip
        FROM barang b
        JOIN detailpenitipan dp ON dp.id_barang = b.id_barang
        JOIN transaksipenitipan tp ON tp.id_transaksi_penitipan = dp.id_transaksi_penitipan
        WHERE b.id_barang = ?
        LIMIT 1
      `, [id_barang]);

            if (data && data.id_penitip) {
                const poin = Math.floor(data.harga_satuan / 10000);

                // 5. Tambah poin penitip
                await pool.query(
                    `UPDATE penitip SET poin_penitip = poin_penitip + ? WHERE id_penitip = ?`,
                    [poin, data.id_penitip]
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error("Gagal update request:", err);
        return NextResponse.json({ success: false, error: "Gagal update request" }, { status: 500 });
    }
}


