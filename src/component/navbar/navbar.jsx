'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch('/api/login/userlogin');
                const data = await res.json();
                console.log("Login Check Response:", data); // 👈 Tambahkan ini

                if (res.ok && data.success) {
                    setIsLoggedIn(true);
                    setUser(data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (err) {
                console.error("Login check failed:", err);
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        checkLoginStatus();
    }, []);


    return (
        <div className="w-full px-30 py-5 flex">
            {/* Kiri: Logo dan Menu */}
            <div className="flex gap-10 items-center w-full justify-between">
                <div className="flex items-center gap-10 ">
                    {/* Logo */}
                    <div
                        className="cursor-pointer leading-none font-[PlayfairDisplay] text-[#D2CBB1]"
                        onClick={() => router.push('/')}
                    >
                        <h1 className="text-3xl font-extrabold">WELL</h1>
                        <h1 className="text-3xl font-extrabold">COME</h1>
                    </div>

                    {/* Menu */}
                    <div className="flex items-center gap-6 text-[#D2CBB1] text-3xl">
                        <span className="cursor-pointer" onClick={() => router.push('/')}>
                            Beranda
                        </span>
                        <span className="cursor-pointer" onClick={() => router.push('/barang')}>
                            Belanja
                        </span>
                    </div>
                </div>

                {/* Tengah: Search bar */}
                <div className="flex items-center w-full bg-[#d2ccb2] rounded-full px-4 py-2 text-[#333]">
                    <FiSearch className="text-xl mr-2" />
                    <input
                        type="text"
                        placeholder="Cari Produk..."
                        className="bg-transparent outline-none w-full text-base placeholder-[#555]"
                    />
                </div>

                {/* Kanan: Cart dan Profile */}
                <div className="flex items-center gap-6">
                    <FiShoppingCart className="text-[#D2CBB1] h-12 w-12 p-2 rounded-xl text-2xl cursor-pointer hover:bg-[#D2CBB1] hover:text-[#273529]" />

                    {isLoggedIn ? (
                        <div
                            src={user.foto_profil}
                            title={user?.nama}
                            className="h-12 w-12 bg-[#D2CBB1] rounded-2xl flex items-center justify-center text-xl font-bold text-[#273529] cursor-pointer"
                            onClick={() => router.push('/profil')}
                        >
                            {user?.nama?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <>
                            <div
                                className="text-[#D2CBB1] text-lg cursor-pointer"
                                onClick={() => router.push('/login')}
                            >
                                Masuk
                            </div>
                            <div
                                className="text-[#D2CBB1] text-lg cursor-pointer"
                                onClick={() => router.push('/register')}
                            >
                                Daftar
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
