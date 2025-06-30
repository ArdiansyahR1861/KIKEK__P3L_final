'use client';

import Navbar from "@/component/navbar/navbar";

export default function Detail(){
    return(
        <div className="">
            <Navbar />
            <div className="px-30">
                <div className="border-b-2 w-full"/>
                    <div className="flex mt-5 gap-4">
                        {/* kiri */}
                        <div className="h-250 w-150 rounded-2xl mt-10 flex flex-col">
                        <div className="h-full w-full bg-[#D2CBB1] rounded-2xl mt-10 flex flex-col"></div>
                        <div className="h-150 w-150rounded-2xl mt-10 flex justify-center gap-10">
                            <div className="h-40 w-full bg-[#D2CBB1] rounded-2xl mt-5"></div>
                            <div className="h-40 w-full bg-[#D2CBB1] rounded-2xl mt-5"></div>
                            <div className="h-40 w-full bg-[#D2CBB1] rounded-2xl mt-5"></div>
                        </div>
                        </div>
                        {/* kanan */}
                        <div className="flex flex-col mt-10 ml-10">
                            <h1 className="font-[MontserratSemiBold] text-[#D2CBB1] font-extrabold text-7xl mt-10">Kaos Palace Skaterboard</h1>
                            <h1 className="font-[MontserratSemiBold] text-[#D2CBB1] font-extrabold text-5xl mt-10">Harga Barang</h1>
                            <h1 className="font-[MontserratSemiBold] text-[#D2CBB1] font-extrabold text-2xl mt-10">Kategori Barang</h1>
                            <div className="flex justify-center gap-5 mt-10">
                                <div className="h-15 w-full rounded-2xl border-2 border-[#D2CBB1]">
                                    <h1 className="text-center font-[MontserratBold] p-3 text-xl text-[#D2CBB1]">+ Keranjang</h1>
                                </div>
                                <div className="h-15 w-full bg-[#D2CBB1] rounded-2xl">
                                    <h1 className="text-center font-[MontserratBold] p-4 text-xl text-[#273529]">Beli Sekarang</h1>
                                </div>
                            </div>
                            <div className="flex justify-center gap-5 mt-30">
                                <div className="h-10 w-full bg-[#D2CBB1] rounded-t-2xl">
                                    <h1 className="text-center font-[MontserratBold] p-2 text-xl text-[#273529]">Detail</h1>
                                </div>
                                <div className="h-10 w-full rounded-t-2xl">
                                    <h1 className="text-center font-[MontserratBold] p-2 text-xl text-[#D2CBB1]">Diskusi</h1>
                                </div>
                            </div>
                            <div className="border-b-2 w-full border-[#D2CBB1]"/>
                            <p className="text-[#D2CBB1] mt-5 px-3 text-bold text-xl">Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi </p>
                            <div className="flex">
                                <div className="h-30 w-30 bg-[#D2CBB1] rounded-2xl mt-21"></div>
                                <div className="flex flex-col">
                                    <h1 className="font-[MontserratBold] p-4 text-xl text-[#D2CBB1] mt-20">Nama Penitip</h1>
                                    <h1 className="font-[MontserratBold] p-4 text-xl text-[#D2CBB1]">Rating</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}