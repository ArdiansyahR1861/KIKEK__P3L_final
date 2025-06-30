import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

import TombolLogout from '@/component/TombolLogout/TombolLogout';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login/admin');

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        redirect('/login/admin');
    }

    if (decoded.role !== 'pegawai') redirect('/login/admin');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login/userlogin`, {
        headers: { Cookie: `token=${token}` },
        cache: 'no-store',
    });
    const { user } = await res.json();

    return (
        <div className="min-h-screen p-10">
            <h1 className="text-3xl font-bold mb-6 text-[#273529]">Dashboard Admin</h1>

            <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl mx-auto">
                <TombolLogout className="px-3 py-1 rounded-2xl bg-[#ce3434] cursor-pointer font-semibold" />
                <h2 className="text-xl font-semibold text-[#273529] mb-4">Informasi Pegawai</h2>
                <div className="space-y-2 text-[#444]">
                    <p><strong>ID Pegawai:</strong> {user.id_pegawai}</p>
                    <p><strong>Nama:</strong> {user.nama}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>No. Telepon:</strong> {user.no_telepon}</p>
                    <p><strong>Alamat:</strong> {user.alamat}</p>
                    <p><strong>Role:</strong> {user.nama_role}</p>

                </div>
            </div>
        </div>
    );
}
