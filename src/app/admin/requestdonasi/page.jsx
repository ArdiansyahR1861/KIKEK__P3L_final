'use client';

import { useEffect, useState } from 'react';
import CheckRole from '@/component/CheckRole/CheckRole';

export default function RequestDonasiTable() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [barangList, setBarangList] = useState([]);
    const [selectedBarangId, setSelectedBarangId] = useState('');


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('/api/requestdonasi');
                const data = await res.json();
                if (res.ok && data.success) {
                    setRequests(data.data);
                }
            } catch (err) {
                console.error('Gagal mengambil data request:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const fetchBarangDonasi = async () => {
        try {
            const res = await fetch('/api/barang/requestdonasi?status=donasi');
            const data = await res.json();
            if (res.ok) {
                setBarangList(data.data);
            }
        } catch (err) {
            console.error('Gagal fetch barang:', err);
        }
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
        fetchBarangDonasi();
    };

    const handleSubmit = async (accepted) => {
        try {
            const res = await fetch('/api/requestdonasi', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_request: selectedRequest.id_request,
                    status_request: accepted ? 1 : 2, // 1: diterima, 2: ditolak
                    id_barang: accepted ? selectedBarangId : null,
                    id_pegawai: 1 // ganti dengan ID pegawai yang login
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert(accepted ? "Request diterima" : "Request ditolak");
                setShowModal(false);
                setSelectedRequest(null);
                setSelectedBarangId('');
                // refresh data
                const refreshed = await fetch('/api/requestdonasi');
                const refreshedData = await refreshed.json();
                setRequests(refreshedData.data);
            }
        } catch (err) {
            alert("Gagal memperbarui request");
        }
    };


    const formatStatus = (status) => {
        switch (status) {
            case 0:
                return 'Menunggu';
            case 1:
                return 'Diterima';
            case 2:
                return 'Ditolak';
            default:
                return 'Tidak diketahui';
        }
    };

    const handleAlokasi = (requestId) => {
        // Ganti ini dengan aksi alokasi yang sesungguhnya
        alert(`Alokasikan barang untuk request ID ${requestId}`);
        // Contoh: router.push(`/alokasi/${requestId}`) atau POST ke API
    };

    return (
        <div className="p-6">
            <CheckRole allowed={["Owner"]}>
                <h1 className="text-2xl font-bold text-white mb-4">Daftar Request Donasi</h1>

                {loading ? (
                    <p className="text-white">Memuat data...</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-[#d1cbb5] text-[#1c2b1c] uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Deskripsi</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Organisasi</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {requests.map((r) => (
                                    <tr key={r.id_request} className="bg-[#d1cbb5] hover:bg-[#bcb69e] transition-colors duration-200">
                                        <td className="px-4 py-2">{r.id_request}</td>
                                        <td className="px-4 py-2">{r.deskripsi_request}</td>
                                        <td className="px-4 py-2">{r.tanggal_request}</td>
                                        <td className="px-4 py-2">{formatStatus(r.status_request)}</td>
                                        <td className="px-4 py-2">{r.nama_organisasi || '-'}</td>
                                        <td className="px-4 py-2">
                                            {r.status_request === 0 && (
                                                <button
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    onClick={() => openModal(r)}
                                                >
                                                    Alokasikan Barang
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-gray-700 py-4">
                                            Tidak ada data request donasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {showModal && selectedRequest && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                <div className="bg-white rounded p-6 w-full max-w-lg shadow-lg">
                                    <h2 className="text-xl font-bold mb-4">Alokasi Barang</h2>
                                    <p className="mb-4"><strong>Deskripsi:</strong> {selectedRequest.deskripsi_request}</p>

                                    <label className="block mb-2">Pilih Barang:</label>
                                    <select
                                        className="w-full border px-3 py-2 rounded mb-4"
                                        value={selectedBarangId}
                                        onChange={(e) => setSelectedBarangId(e.target.value)}
                                    >
                                        <option value="">-- Pilih Barang --</option>
                                        {barangList.map((barang) => (
                                            <option key={barang.id_barang} value={barang.id_barang}>
                                                {barang.nama_barang} - {barang.deskripsi}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                            onClick={() => handleSubmit(false)}
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            disabled={!selectedBarangId}
                                            onClick={() => handleSubmit(true)}
                                        >
                                            Terima & Alokasikan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </CheckRole>
        </div>
    );
}
