"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function PenitipanBarangPage() {
    const [transaksiList, setTransaksiList] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        tanggal_masuk: "",
        id_penitip: "",
        id_pegawai: "",
        barangList: [],
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalBarang, setModalBarang] = useState([]);
    const [modalTransaksi, setModalTransaksi] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showBarangInputModal, setShowBarangInputModal] = useState(false);
    const [penitipList, setPenitipList] = useState([]);
    const [pegawaiList, setPegawaiList] = useState([]);

    const [barangBaru, setBarangBaru] = useState({ nama_barang: "", deskripsi: "", harga_satuan: "", gambar: [] });
    const [barangEditing, setBarangEditing] = useState(null);
    const [showEditBarangModal, setShowEditBarangModal] = useState(false);

    const [barangDraftEditing, setBarangDraftEditing] = useState(null);
    const [showEditDraftModal, setShowEditDraftModal] = useState(false);

    const handleGambarChange = (e) => {
        const files = Array.from(e.target.files);
        setBarangBaru((prev) => ({ ...prev, gambar: [...prev.gambar, ...files.map((f) => URL.createObjectURL(f))] }));
    };

    const removeGambarAt = (index) => {
        setBarangBaru((prev) => ({
            ...prev,
            gambar: prev.gambar.filter((_, i) => i !== index)
        }));
    };

    const fetchTransaksi = async () => {
        try {
            const res = await fetch(`/api/transaksipenitipan?search=${search}`);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Gagal fetch data: ${res.status} ${errorText}`);
            }

            const data = await res.json();
            setTransaksiList(data);
        } catch (err) {
            console.error("Error saat fetchTransaksi:", err.message);
        }
    };

    const fetchDropdownData = async () => {
        const [penitipRes, pegawaiRes] = await Promise.all([
            fetch("/api/transaksipenitipan/get-penitip"),
            fetch("/api/transaksipenitipan/get-pegawai")
        ]);
        const [penitipData, pegawaiData] = await Promise.all([
            penitipRes.json(),
            pegawaiRes.json()
        ]);
        setPenitipList(penitipData);
        setPegawaiList(pegawaiData);
    };

    useEffect(() => {
        fetchTransaksi();
    }, [search]);

    useEffect(() => {
        if (showFormModal) fetchDropdownData();
    }, [showFormModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId
            ? `/api/transaksipenitipan/${editingId}`
            : "/api/transaksipenitipan";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setForm({ tanggal_masuk: "", id_penitip: "", id_pegawai: "", barangList: [] });
            setEditingId(null);
            setShowFormModal(false);
            fetchTransaksi();
        } else {
            alert("Gagal menyimpan data");
        }
    };


    const handleDetail = (id) => {
        fetch(`/api/transaksipenitipan/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setModalBarang(data?.barang || []);
                setModalTransaksi(data?.transaksi || null);
                setShowModal(true);
            })
            .catch((err) => {
                console.error("Gagal mengambil detail transaksi:", err);
                alert("Terjadi kesalahan saat mengambil detail transaksi");
            });
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTanggalWaktu = (tanggal) => {
        if (!tanggal) return "-";
        return new Date(tanggal).toLocaleString("id-ID", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const handleCetak = async (transaksi) => {
        try {
            // Ambil data detail transaksi lengkap
            const res = await fetch(`/api/transaksipenitipan/nota/${transaksi.id_transaksi_penitipan}`);
            const data = await res.json();

            const doc = new jsPDF();

            // Header
            doc.setFont("helvetica", "bold");
            doc.text("ReUse Mart", 20, 20);
            doc.setFont("helvetica", "normal");
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 20, 26);

            // Info Transaksi
            const tanggal = new Date(data.tanggal_masuk);
            const tahun = tanggal.getFullYear().toString().slice(-2); // ambil dua digit terakhir
            const bulan = (tanggal.getMonth() + 1).toString().padStart(2, '0');
            const noNota = `${tahun}.${bulan}.${data.id_transaksi_penitipan}`;
            doc.text(`No Nota: ${noNota}`, 20, 36);
            doc.text(`Tanggal penitipan: ${formatTanggalWaktu(data.tanggal_masuk)}`, 20, 42);
            doc.text(`Masa penitipan sampai: ${formatTanggal(data.tanggal_keluar)}`, 20, 48);


            // Info Penitip
            // Buat kode_penitip dari huruf depan nama + id_penitip
            const hurufDepan = data.nama_penitip?.trim().charAt(0).toUpperCase() || "";
            const kodePenitip = `${hurufDepan}${data.id_penitip}`;
            const namaPenitip = `${kodePenitip} / ${data.nama_penitip}`;

            doc.setFont("helvetica", "bold");
            doc.text(`\nPenitip : ${namaPenitip}`, 20, 58);

            doc.setFont("helvetica", "normal");
            doc.text(`${data.alamat_penitip || "-"}`, 20, 64);
            doc.text(`Delivery: ${data.metode_pengiriman || "-"} (${data.nama_kurir || "-"})`, 20, 70);

            // Daftar Barang
            let y = 80;
            data.barang.forEach((item, i) => {
                doc.text(`${item.nama_barang}`, 20, y);
                doc.text(`Rp${Number(item.harga_satuan).toLocaleString("id-ID")}`, 150, y, { align: "right" });
                y += 6;

                if (item.deskripsi) {
                    doc.text(item.deskripsi, 20, y);
                    y += 6;
                }

                if (item.berat) {
                    doc.text(`Berat barang: ${item.berat} kg`, 20, y);
                    y += 6;
                }
            });

            // Footer
            y += 10;
            doc.text("Diterima dan QC oleh:", 20, y);
            y += 10;
            doc.setFont("helvetica", "bold");
            doc.text(`${data.kode_qc || data.id_pegawai} - ${data.nama_pegawai}`, 20, y);

            doc.save(`NotaPenitipan-${data.id_transaksi_penitipan}.pdf`);
        } catch (err) {
            console.error("❌ Gagal cetak nota:", err);
            alert("Gagal mencetak nota. Coba lagi.");
        }
    };


    const tambahBarangKeForm = () => {
        const newId = Date.now();
        setForm({
            ...form,
            barangList: [
                ...form.barangList,
                { id_barang: newId, ...barangBaru }
            ]
        });
        setBarangBaru({ nama_barang: "", deskripsi: "", harga_satuan: "", gambar: [] });
        setShowBarangInputModal(false);
    };

    const handleUpdateBarang = async (id_transaksi) => {
        try {
            const res = await fetch(`/api/transaksipenitipan/${id_transaksi}/barang`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ barangList: modalBarang })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Gagal update barang: ${errText}`);
            }

            alert("Barang berhasil diperbarui.");
            setShowModal(false);
            fetchTransaksi(); // refresh list
        } catch (err) {
            console.error("Error update barang:", err);
            alert("Gagal menyimpan perubahan.");
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 text-white">Manajemen Penitipan Barang</h1>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Cari..."
                    className="border p-2 w-full max-w-md bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded ml-4"
                    onClick={() => {
                        setForm({ tanggal_masuk: new Date().toISOString().split("T")[0], id_penitip: "", id_pegawai: "", barangList: [] });
                        setEditingId(null);
                        setShowFormModal(true);
                    }}
                >
                    Tambah Transaksi
                </button>
            </div>

            <table className="w-full table-auto border bg-white text-sm">
                <thead>
                    <tr className="bg-gray-100 text-center">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tanggal Masuk</th>
                        <th className="border px-4 py-2">Tanggal Keluar</th>
                        <th className="border px-4 py-2">Penitip</th>
                        <th className="border px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {transaksiList.map((t) => (
                        <tr key={t.id_transaksi_penitipan} className="text-center">
                            <td className="border px-4 py-2">{t.id_transaksi_penitipan}</td>
                            <td className="border px-4 py-2">{formatTanggal(t.tanggal_masuk)}</td>
                            <td className="border px-4 py-2">{formatTanggal(t.tanggal_keluar)}</td>
                            <td className="border px-4 py-2 text-left">{t.nama_penitip}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleDetail(t.id_transaksi_penitipan)}
                                >
                                    Detail
                                </button>
                                <button
                                    className="bg-purple-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleCetak(t)}
                                >
                                    Cetak Nota
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Modal Detail */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Detail Transaksi</h2>
                        {modalTransaksi && (
                            <div className="mb-4">
                                <p><strong>ID Transaksi:</strong> {modalTransaksi.id_transaksi_penitipan}</p>
                                <p><strong>Tanggal Masuk:</strong> {formatTanggal(modalTransaksi.tanggal_masuk)}</p>
                                <p><strong>Tanggal Keluar:</strong> {formatTanggal(modalTransaksi.tanggal_keluar)}</p>
                                <p><strong>Penitip:</strong> {modalTransaksi.nama_penitip}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {modalBarang && modalBarang.map((barang, i) => (
                                <div
                                    key={i}
                                    className="border rounded p-2 hover:shadow cursor-pointer"
                                    onClick={() => {
                                        setBarangEditing({ ...barang, index: i });
                                        setShowEditBarangModal(true);
                                    }}
                                >

                                    <h3 className="font-semibold mb-2">{barang.nama_barang}</h3>
                                    <div className="flex gap-2">
                                        {barang.gambar?.slice(0, 2).map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt={`gambar-${idx}`}
                                                className="w-24 h-24 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showEditBarangModal && barangEditing && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg w-[400px]">
                                    <h2 className="text-lg font-bold mb-4">Edit Barang</h2>

                                    <input
                                        type="text"
                                        placeholder="Nama Barang"
                                        className="border p-2 w-full mb-2"
                                        value={barangEditing.nama_barang}
                                        onChange={(e) => setBarangEditing({ ...barangEditing, nama_barang: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Deskripsi"
                                        className="border p-2 w-full mb-2"
                                        value={barangEditing.deskripsi}
                                        onChange={(e) => setBarangEditing({ ...barangEditing, deskripsi: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Harga Satuan"
                                        className="border p-2 w-full mb-4"
                                        value={barangEditing.harga_satuan}
                                        onChange={(e) => setBarangEditing({ ...barangEditing, harga_satuan: e.target.value })}
                                    />

                                    <div className="mb-4">
                                        <label className="font-semibold block mb-1">Gambar Barang</label>
                                        <div className="flex flex-wrap gap-2">
                                            {barangEditing.gambar.map((g, idx) => (
                                                <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                                    <img src={g} alt={`gambar-${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => {
                                                            const updatedGambar = barangEditing.gambar.filter((_, i) => i !== idx);
                                                            setBarangEditing({ ...barangEditing, gambar: updatedGambar });
                                                        }}
                                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                                                    >
                                                        x
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-20 h-20 flex items-center justify-center border border-dashed cursor-pointer text-gray-500">
                                                +
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        const newImages = files.map((file) => URL.createObjectURL(file));
                                                        setBarangEditing({
                                                            ...barangEditing,
                                                            gambar: [...barangEditing.gambar, ...newImages],
                                                        });
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                            onClick={() => {
                                                setShowEditBarangModal(false);
                                                setBarangEditing(null);
                                            }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded"
                                            onClick={() => {
                                                const updated = [...modalBarang];
                                                updated[barangEditing.index] = {
                                                    ...updated[barangEditing.index],
                                                    nama_barang: barangEditing.nama_barang,
                                                    deskripsi: barangEditing.deskripsi,
                                                    harga_satuan: barangEditing.harga_satuan,
                                                    gambar: barangEditing.gambar,
                                                };
                                                setModalBarang(updated);
                                                setShowEditBarangModal(false);
                                                setBarangEditing(null);
                                            }}
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="text-right mt-4">
                            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Tutup</button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded ml-2"
                                onClick={() => handleUpdateBarang(modalTransaksi?.id_transaksi_penitipan)}
                            >
                                Simpan Perubahan
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal Form Tambah/Ubah Transaksi */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-auto">
                        <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="date" className="border p-2 w-full" value={form.tanggal_masuk} readOnly />

                            <select className="border p-2 w-full" value={form.id_penitip} onChange={(e) => setForm({ ...form, id_penitip: e.target.value })} required>
                                <option value="">Pilih Penitip</option>
                                {penitipList.map((p) => (
                                    <option key={p.id_penitip} value={p.id_penitip}>{p.nama_penitip}</option>
                                ))}
                            </select>

                            <select className="border p-2 w-full" value={form.id_pegawai} onChange={(e) => setForm({ ...form, id_pegawai: e.target.value })} required>
                                <option value="">Pilih Petugas QC</option>
                                {pegawaiList.map((pg) => (
                                    <option key={pg.id_pegawai} value={pg.id_pegawai}>{pg.nama_pegawai}</option>
                                ))}
                            </select>

                            <div className="mt-6">
                                <h3 className="font-bold mb-2">Barang yang Akan Dititipkan:</h3>
                                <div className="flex flex-wrap gap-4">
                                    {form.barangList.map((b, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg w-32 h-32 flex items-center justify-center bg-gray-100 overflow-hidden cursor-pointer"
                                            onClick={() => {
                                                setBarangDraftEditing({ ...b, index: idx });
                                                setShowEditDraftModal(true);
                                            }}
                                        >
                                            {b.gambar && b.gambar.length > 0 ? (
                                                <img src={b.gambar[0]} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm text-gray-500 text-center px-2">{b.nama_barang}</span>
                                            )}
                                        </div>
                                    ))}
                                    <div onClick={() => setShowBarangInputModal(true)} className="cursor-pointer border-dashed border-2 border-gray-400 w-32 h-32 flex items-center justify-center text-gray-500">
                                        +
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowFormModal(false)}>Batal</button>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Modal Input Barang Baru */}
            {showBarangInputModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-lg font-bold mb-4">Tambah Barang</h2>
                        <input type="text" placeholder="Nama Barang" className="border p-2 w-full mb-2"
                            value={barangBaru.nama_barang} onChange={(e) => setBarangBaru({ ...barangBaru, nama_barang: e.target.value })} />
                        <input type="text" placeholder="Deskripsi" className="border p-2 w-full mb-2"
                            value={barangBaru.deskripsi} onChange={(e) => setBarangBaru({ ...barangBaru, deskripsi: e.target.value })} />
                        <input type="number" placeholder="Harga Satuan" className="border p-2 w-full mb-4"
                            value={barangBaru.harga_satuan} onChange={(e) => setBarangBaru({ ...barangBaru, harga_satuan: e.target.value })} />

                        <div className="mb-4">
                            <label className="font-semibold block mb-1">Gambar Barang</label>
                            <div className="flex flex-wrap gap-2">
                                {barangBaru.gambar.map((g, idx) => (
                                    <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                        <img src={g} alt={`gambar-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const updated = barangBaru.gambar.filter((_, i) => i !== idx);
                                                setBarangBaru({ ...barangBaru, gambar: updated });
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                                <label className="w-20 h-20 flex items-center justify-center border border-dashed cursor-pointer text-gray-500">
                                    +
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const newImages = files.map((f) => URL.createObjectURL(f));
                                            setBarangBaru({ ...barangBaru, gambar: [...barangBaru.gambar, ...newImages] });
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowBarangInputModal(false)}>Batal</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={tambahBarangKeForm}>Tambah</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditDraftModal && barangDraftEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-lg font-bold mb-4">Edit Barang</h2>
                        <input
                            type="text"
                            placeholder="Nama Barang"
                            className="border p-2 w-full mb-2"
                            value={barangDraftEditing.nama_barang}
                            onChange={(e) => setBarangDraftEditing({ ...barangDraftEditing, nama_barang: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Deskripsi"
                            className="border p-2 w-full mb-2"
                            value={barangDraftEditing.deskripsi}
                            onChange={(e) => setBarangDraftEditing({ ...barangDraftEditing, deskripsi: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Harga Satuan"
                            className="border p-2 w-full mb-4"
                            value={barangDraftEditing.harga_satuan}
                            onChange={(e) => setBarangDraftEditing({ ...barangDraftEditing, harga_satuan: e.target.value })}
                        />

                        <div className="mb-4">
                            <label className="font-semibold block mb-1">Gambar Barang</label>
                            <div className="flex flex-wrap gap-2">
                                {barangDraftEditing.gambar.map((g, idx) => (
                                    <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                        <img src={g} alt={`gambar-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newGambar = barangDraftEditing.gambar.filter((_, i) => i !== idx);
                                                setBarangDraftEditing({ ...barangDraftEditing, gambar: newGambar });
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                                <label className="w-20 h-20 flex items-center justify-center border border-dashed cursor-pointer text-gray-500">
                                    +
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const newImages = files.map((f) => URL.createObjectURL(f));
                                            setBarangDraftEditing({
                                                ...barangDraftEditing,
                                                gambar: [...barangDraftEditing.gambar, ...newImages],
                                            });
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setShowEditDraftModal(false);
                                    setBarangDraftEditing(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    const updatedBarangList = [...form.barangList];
                                    updatedBarangList[barangDraftEditing.index] = {
                                        ...barangDraftEditing,
                                    };
                                    setForm({ ...form, barangList: updatedBarangList });
                                    setShowEditDraftModal(false);
                                    setBarangDraftEditing(null);
                                }}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
