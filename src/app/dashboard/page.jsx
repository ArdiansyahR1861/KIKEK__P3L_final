'use client';

export default function Dashboard(){
    return(
        <div className="">
            <div className="flex">
                <div className="h-300 w-75 bg-[#D2CBB1] pt-10">
                    <h1 className=" font-[PlayfairDisplay] text-6xl text-[#273529] font-extrabold text-center">WELL</h1>
                    <h1 className=" font-[PlayfairDisplay] text-6xl text-[#273529] font-extrabold text-center">COME</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 ml-5">Control</h1>
                    <div className="border-b-2 border-[#273529]"></div>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Home</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Barang</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Merchandise</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Laporan</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-20 ml-5">User</h1>
                    <div className="border-b-2 border-[#273529]"></div>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#D2CBB1] mt-10 text-center bg-[#273529]">Pegawai</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Organisasi</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Penitip</h1>
                    <h1 className=" font-[MontserratBold] text-2xl text-[#273529] mt-10 text-center">Pembeli</h1>
                </div>
                <div className="flex flex-col">
                    <div className="h-20 w-auto bg-[#273529] mx-10 mt-10 flex justify-between">
                        <div className="w-40 h-12 bg-[#D2CBB1] rounded-2xl flex items-center justify-center">
                            <h1 className="font-[MontserratBold] text-lg text-[#273529]">Tambah</h1>
                        </div>
                        <div className="h-12 w-150 bg-[#D2CBB1] rounded-2xl text-2xl p-4 flex items-center">Cari...</div>
                    </div>
                    <div className="h-240 w-auto bg-[#D2CBB1] mx-10 mt-2 rounded-2xl">
                        <table class="table-fixed border-separate mx-auto border-spacing-10">
                        <thead >
                            <tr>
                            <th>Id Pegawai</th>
                            <th>Nama</th>
                            <th>NoTelp</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                <td>Malcolm Lockyer</td>
                                <td>081967895432</td>
                                <td>MalcolmLockyer@gmail.com</td>
                                <td>MalcolmLockyerHokya123</td>
                                <td>Pegawai Gudang</td>
                                <td className="flex gap-2">
                                    <div className="w-40 h-10 bg-[#D2CBB1] rounded-2xl flex items-center justify-center border-2 border-[#273529]">
                                    <h1 className="font-[MontserratBold] text-lg text-[#273529]">Edit</h1>
                                    </div>
                                    <div className="w-40 h-10 bg-[#273529] rounded-2xl flex items-center justify-center">
                                        <h1 className="font-[MontserratBold] text-lg text-[#D2CBB1]">Hapus</h1>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                <td>Malcolm Lockyer</td>
                                <td>081967895432</td>
                                <td>MalcolmLockyer@gmail.com</td>
                                <td>MalcolmLockyerHokya123</td>
                                <td>Pegawai Gudang</td>
                                <td className="flex gap-2">
                                    <div className="w-40 h-10 bg-[#D2CBB1] rounded-2xl flex items-center justify-center border-2 border-[#273529]">
                                    <h1 className="font-[MontserratBold] text-lg text-[#273529]">Edit</h1>
                                    </div>
                                    <div className="w-40 h-10 bg-[#273529] rounded-2xl flex items-center justify-center">
                                        <h1 className="font-[MontserratBold] text-lg text-[#D2CBB1]">Hapus</h1>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                <td>Malcolm Lockyer</td>
                                <td>081967895432</td>
                                <td>MalcolmLockyer@gmail.com</td>
                                <td>MalcolmLockyerHokya123</td>
                                <td>Pegawai Gudang</td>
                                <td className="flex gap-2">
                                    <div className="w-40 h-10 bg-[#D2CBB1] rounded-2xl flex items-center justify-center border-2 border-[#273529]">
                                    <h1 className="font-[MontserratBold] text-lg text-[#273529]">Edit</h1>
                                    </div>
                                    <div className="w-40 h-10 bg-[#273529] rounded-2xl flex items-center justify-center">
                                        <h1 className="font-[MontserratBold] text-lg text-[#D2CBB1]">Hapus</h1>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}