'use client';

import { useEffect, useState } from 'react';
import CheckRole from '@/component/CheckRole/CheckRole';

export default function DonasiList() {
    const [donasi, setDonasi] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonasi = async () => {
            try {
                const res = await fetch('/api/donasi');
                const data = await res.json();
                if (res.ok && data.success) {
                    setDonasi(data.data);
                }
            } catch (err) {
                console.error('Gagal fetch donasi:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonasi();
    }, []);

    return (
        <div className="p-6">
            <CheckRole allowed={["Owner"]}>
                <h1 className="text-2xl font-bold text-white mb-4">Riwayat Donasi</h1>

                {loading ? (
                    <p className="text-white">Memuat data donasi...</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-[#d1cbb5] text-[#1c2b1c] uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-4 py-3">Tanggal Donasi</th>
                                    <th className="px-4 py-3">Nama Barang</th>
                                    <th className="px-4 py-3">Deskripsi</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Harga Satuan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {donasi.map((d) => (
                                    <tr key={d.id_donasi} className="bg-[#d1cbb5] hover:bg-[#bcb69e] transition-colors duration-200">
                                        <td className="px-4 py-2">{d.tanggal_donasi}</td>
                                        <td className="px-4 py-2">{d.nama_barang}</td>
                                        <td className="px-4 py-2">{d.deskripsi}</td>
                                        <td className="px-4 py-2">{d.status}</td>
                                        <td className="px-4 py-2">Rp {Number(d.harga_satuan).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                                {donasi.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-gray-700 py-4">
                                            Belum ada data donasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CheckRole>
        </div>
    );
}
