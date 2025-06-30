"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function BarangPage() {
    const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBarang() {
            try {
                const res = await fetch("/api/barang");
                const data = await res.json();
                setBarang(data.data);
            } catch (error) {
                console.error("Gagal mengambil data barang:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBarang();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Daftar Barang Dijual</h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
                    {barang.map((item) => (
                        <Link
                            key={item.id_barang}
                            href={`/barang/${item.id_barang}`}
                            className="bg-[#d1cbb5] shadow-md rounded-2xl p-4 hover:shadow-lg transition duration-200"
                        >
                            <img src={item.gambar} alt="gambar" className="w-full h-65 object-cover rounded-4xl mb-3 bg-gray-100" />

                            <h2 className="text-xl font-semibold mb-1">{item.nama_barang}</h2>
                            <p className="text-sm text-gray-600 mb-2">{item.deskripsi}</p>
                            <p className="text-lg font-bold my-2">
                                Rp {item.harga_satuan.toLocaleString("id-ID")}
                            </p>
                            <div className="flex justify-end">
                                <button className="bg-[#273529] text-[#d1cbb5] px-8 py-1 rounded-lg text-xl">
                                    Detail
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
