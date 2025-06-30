'use client';

import Navbar from "@/component/navbar/navbar";
import { Card, CardContent } from "@/components/ui/card";
import TombolLogout from "@/component/TombolLogout/TombolLogout"

export default function Home() {
    return (
        <div className="">
            <Navbar />

            <div className="px-30">
                <TombolLogout className="px-3 py-1 rounded-2xl bg-[#ce3434] cursor-pointer font-semibold"/>
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
                <h1 className="text-center font-[MontserratBold] text-[#D2CBB1] font-extrabold text-7xl mt-5">BARANG BARU</h1>
                <div className="flex mt-5 gap-4 justify-center">
                    <div className="h-120 w-90 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
                        <div className="h-70 bg-[#273529] rounded-2xl w-full objectcover"></div>
                        <h1 className="font-[MontserratBold] text-[#273529]">Nama Barang</h1>
                        <p className="text-base"> barangdeskripsi barangdeskripsi barangdeskripsi barang</p>
                        <h1 className="font-[MontserratBold] text-[#273529] text-lg">Harga</h1>
                        <div className="flex justify-end">
                            <div className="h-14 w-55 bg-[#273529] rounded-2xl">
                                <h1 className="font-[MontserratBold] text-[#D2CBB1] text-lg text-center p-4">Detail</h1>
                            </div>
                        </div>
                    </div>
                    <div className="h-120 w-90 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
                        <div className="h-70 bg-[#273529] rounded-2xl w-full objectcover"></div>
                        <h1 className="font-[MontserratBold] text-[#273529]">Nama Barang</h1>
                        <p className="text-base"> barangdeskripsi barangdeskripsi barangdeskripsi barang</p>
                        <h1 className="font-[MontserratBold] text-[#273529] text-lg">Harga</h1>
                        <div className="flex justify-end">
                            <div className="h-14 w-55 bg-[#273529] rounded-2xl">
                                <h1 className="font-[MontserratBold] text-[#D2CBB1] text-lg text-center p-4">Detail</h1>
                            </div>
                        </div>
                    </div>
                    <div className="h-120 w-90 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
                        <div className="h-70 bg-[#273529] rounded-2xl w-full objectcover"></div>
                        <h1 className="font-[MontserratBold] text-[#273529]">Nama Barang</h1>
                        <p className="text-base"> barangdeskripsi barangdeskripsi barangdeskripsi barang</p>
                        <h1 className="font-[MontserratBold] text-[#273529] text-lg">Harga</h1>
                        <div className="flex justify-end">
                            <div className="h-14 w-55 bg-[#273529] rounded-2xl">
                                <h1 className="font-[MontserratBold] text-[#D2CBB1] text-lg text-center p-4">Detail</h1>
                            </div>
                        </div>
                    </div>
                    <div className="h-120 w-90 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
                        <div className="h-70 bg-[#273529] rounded-2xl w-full objectcover"></div>
                        <h1 className="font-[MontserratBold] text-[#273529]">Nama Barang</h1>
                        <p className="text-base"> barangdeskripsi barangdeskripsi barangdeskripsi barang</p>
                        <h1 className="font-[MontserratBold] text-[#273529] text-lg">Harga</h1>
                        <div className="flex justify-end">
                            <div className="h-14 w-55 bg-[#273529] rounded-2xl">
                                <h1 className="font-[MontserratBold] text-[#D2CBB1] text-lg text-center p-4">Detail</h1>
                            </div>
                        </div>
                    </div>
                    <div className="h-120 w-90 bg-[#D2CBB1] rounded-2xl text-2xl p-4 text">
                        <div className="h-70 bg-[#273529] rounded-2xl w-full objectcover"></div>
                        <h1 className="font-[MontserratBold] text-[#273529]">Nama Barang</h1>
                        <p className="text-base"> barangdeskripsi barangdeskripsi barangdeskripsi barang</p>
                        <h1 className="font-[MontserratBold] text-[#273529] text-lg">Harga</h1>
                        <div className="flex justify-end">
                            <div className="h-14 w-55 bg-[#273529] rounded-2xl">
                                <h1 className="font-[MontserratBold] text-[#D2CBB1] text-lg text-center p-4">Detail</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}