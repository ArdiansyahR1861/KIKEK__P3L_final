'use client';

import { useEffect, useState } from "react";
import Navbar from "@/component/navbar/navbar";
import { Card, CardContent } from "@/components/ui/card";
import TombolLogout from "@/component/TombolLogout/TombolLogout"
import Link from 'next/link';

export default function Home() {
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
    <div className="">
      <Navbar />

      <div className="px-30">
        <TombolLogout className="px-3 py-1 rounded-2xl bg-[#ce3434] cursor-pointer font-semibold" />
        <div className="border-b-2 w-full " />
        <div className="flex mt-5 gap-4 justify-center">
          <div className="h-100 w-150 bg-[#D2CBB1] rounded-2xl text-2xl p-4">
            <h1 className="text-center font-[PlayfairDisplay] text-[#273529] text-8xl mt-30">KUALITAS</h1>
            <p className="text-base text-center">MENJAMIN KUALITAS SEMUA BARANG</p>

          </div>
          <div className="flex flex-col gap-4">
            <div className="h-48 w-150 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
              <h1 className=" font-[PlayfairDisplay] text-[#273529] text-6xl mt-10">PAKAIAN</h1>
              <p className="text-xl ">MENGHADIRKAN SEGALA PAKAIAN</p>
            </div>
            <div className="h-48 w-150 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
              <div className="flex justify-end"></div>
              <h1 className=" font-[PlayfairDisplay] text-[#273529] text-6xl mt-10">RUMAH</h1>
              <p className="text-xl ">KELUARGA HARMONIS SEKALI</p>
            </div>
          </div>
        </div>
        <div className="border-b-2 mt-5" />
        <h1 className="text-center font-[MontserratBold] text-[#D2CBB1] font-extrabold text-5xl mt-5">BARANG BARU</h1>
        <div className="p-6">
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
      </div>
    </div>


  );
}