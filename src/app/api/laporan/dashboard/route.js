import { NextResponse } from "next/server";
import pool from "@/lib/db"; // sesuaikan path dengan struktur project kamu

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun") || new Date().getFullYear();

    try {
        // 1. Penjualan Bulanan
        const [penjualanRows] = await pool.query(`
        SELECT 
            b.nama_bulan AS bulan,
            b.nomor_bulan AS urutan,
            COALESCE(COUNT(tp.id_transaksi_pembelian), 0) AS jumlah_terjual,
            COALESCE(SUM(tp.harga_transaksi), 0) AS jumlah_penjualan
        FROM (
            SELECT 1 AS nomor_bulan, 'Januari' AS nama_bulan UNION
            SELECT 2, 'Februari' UNION
            SELECT 3, 'Maret' UNION
            SELECT 4, 'April' UNION
            SELECT 5, 'Mei' UNION
            SELECT 6, 'Juni' UNION
            SELECT 7, 'Juli' UNION
            SELECT 8, 'Agustus' UNION
            SELECT 9, 'September' UNION
            SELECT 10, 'Oktober' UNION
            SELECT 11, 'November' UNION
            SELECT 12, 'Desember'
        ) AS b
        LEFT JOIN transaksipembelian tp 
        ON MONTH(tp.tanggal_transaksi) = b.nomor_bulan 
        AND YEAR(tp.tanggal_transaksi) = ? 
        AND tp.status_pembelian = 'berhasil'
        GROUP BY b.nomor_bulan, b.nama_bulan
        ORDER BY b.nomor_bulan
        `, [tahun]);

        const penjualan = penjualanRows.map(row => ({
            bulan: row.bulan,
            jumlah_terjual: row.jumlah_terjual,
            jumlah_penjualan: row.jumlah_penjualan
        }));


        const [komisiRows] = await pool.query(`
       SELECT 
            b.id_barang,
            b.nama_barang,
            b.harga_satuan AS harga_jual,
            tp.tanggal_transaksi AS tanggal_laku,
            ttp.tanggal_masuk,
            k.komisi_hunter,
            k.komisi_reusemart,
            k.komisi_penitip
        FROM komisi k
        JOIN transaksipembelian tp ON k.id_transaksi_pembelian = tp.id_transaksi_pembelian
        JOIN detailpembelian dp ON dp.id_transaksi_pembelian = tp.id_transaksi_pembelian
        JOIN barang b ON dp.id_barang = b.id_barang
        LEFT JOIN detailpenitipan dpn ON b.id_barang = dpn.id_barang
        LEFT JOIN transaksipenitipan ttp ON dpn.id_transaksi_penitipan = ttp.id_transaksi_penitipan
        WHERE YEAR(tp.tanggal_transaksi) = ?
        `, [tahun]);

        const komisi = komisiRows.map(row => ({
            id_barang: row.id_barang,
            nama_barang: row.nama_barang,
            harga_jual: row.harga_jual,
            tanggal_masuk: row.tanggal_masuk,
            tanggal_laku: row.tanggal_laku,
            komisi_hunter: row.komisi_hunter,
            komisi_reusemart: row.komisi_reusemart,
            komisi_penitip: row.komisi_penitip
        }));


        const [stokRows] = await pool.query(`
        SELECT 
            b.id_barang,
            b.nama_barang,
            b.harga_satuan,
            b.extend,
            k.nama_kategori,
            p.id_penitip,
            p.nama_penitip,
            t.tanggal_masuk,
            h.id_pegawai,
            h.nama_pegawai
        FROM barang b
        LEFT JOIN kategoribarang k ON b.id_kategori = k.id_kategori
        LEFT JOIN detailpenitipan dp ON b.id_barang = dp.id_barang
        LEFT JOIN transaksipenitipan t ON dp.id_transaksi_penitipan = t.id_transaksi_penitipan
        LEFT JOIN penitip p ON t.id_penitip = p.id_penitip
        LEFT JOIN pegawai h ON b.id_pegawai = h.id_pegawai
        WHERE YEAR(t.tanggal_masuk) = ?
    `, [tahun]);


        const stok = stokRows.map(row => ({
            id_barang: row.id_barang,
            nama_barang: row.nama_barang,
            harga_satuan: row.harga_satuan,
            kategori: row.nama_kategori || "-",
            extend: row.extend,
            id_penitip: row.id_penitip,
            nama_penitip: row.nama_penitip,
            tanggal_masuk: row.tanggal_masuk,
            id_hunter: row.id_pegawai,
            nama_hunter: row.nama_pegawai || "-"
        }));


        return NextResponse.json({
            success: true,
            penjualan,
            komisi,
            stok
        });

    } catch (error) {
        console.error("Error fetching laporan dashboard:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
