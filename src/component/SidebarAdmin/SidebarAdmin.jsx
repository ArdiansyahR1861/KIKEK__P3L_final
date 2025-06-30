"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TombolLogout from "../TombolLogout/TombolLogout";

export default function SidebarAdmin() {
    const pathname = usePathname();

    const menuItems = [
        {
            section: "Control",
            links: [
                { name: "Home", href: "/admin" },
                { name: "Barang", href: "/admin/barang" },
                { name: "Merchandise", href: "/admin/merchandise" },
                { name: "Laporan", href: "/admin/laporan" },
                { name: "Request Donasi", href: "/admin/requestdonasi" },
                { name: "Transaksi Penitipan", href: "/admin/penitipan-barang" },
                { name: "Donasi", href: "/admin/donasi" }
            ],
        },
        {
            section: "Users",
            links: [
                { name: "Pegawai", href: "/admin/pegawai" },
                { name: "Organisasi", href: "/admin/organisasi" },
                { name: "Penitip", href: "/admin/penitip" },
                { name: "Pembeli", href: "/admin/pembeli" },
            ],
        },
    ];

    return (
        <div className="w-64 min-h-screen bg-[#d1cbb5] text-[#1c2b1c] p-6 font-sans">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold leading-none">WELL<br />COME</h1>
                <p className="text-sm mt-2">Admin Only</p>
            </div>
            <TombolLogout />

            {menuItems.map((section) => (
                <div key={section.section} className="mb-6">
                    <h2 className="text-sm font-semibold mb-2">{section.section}</h2>
                    <hr className="border-t border-[#1c2b1c] mb-2" />
                    <ul className="space-y-2">
                        {section.links.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`block px-4 py-2 rounded ${pathname === link.href
                                        ? "bg-[#1c2b1c] text-white"
                                        : "hover:bg-[#1c2b1c]/10"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
