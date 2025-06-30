import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'No token provided' }), { status: 401 });
  }
  // console.log('JWT_SECRET:', JWT_SECRET);
  // console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let userData = null;

    if (decoded.role === 'penitip') {
      const [result] = await pool.query(`
        SELECT 
          id_penitip, 
          nama_penitip, 
          email_penitip, 
          nik_penitip, 
          no_telp_penitip, 
          badge_penitip, 
          total_barang_terjual, 
          poin_penitip, 
          saldo_penitip, 
          rating_penitip
        FROM penitip 
        WHERE id_penitip = ?
      `, [decoded.id]);

      if (result.length > 0) {
        const user = result[0];
        userData = {
          id_penitip: user.id_penitip,
          nama: user.nama_penitip,
          email: user.email_penitip,
          role: decoded.role,
          no_ktp: user.nik_penitip,
          no_telepon: user.no_telp_penitip,
          src_img_profile: null, // kolom ini belum ada di tabel kamu
          jml_barang_terjual: user.total_barang_terjual,
          badge_level: user.badge_penitip,
          komisi: user.saldo_penitip, // jika "komisi" kamu maksudkan saldo
          poin_reward: user.poin_penitip,
          rating: user.rating_penitip
        };
      }


    } else if (decoded.role === 'pembeli') {
      const [result] = await pool.query(`
        SELECT id_pembeli, nama_pembeli, email_pembeli, no_telp_pembeli, poin_pembeli
        FROM pembeli 
        WHERE id_pembeli = ?
      `, [decoded.id]);

      if (result.length > 0) {
        const user = result[0];
        userData = {
          id_pembeli: user.id_pembeli,
          nama: user.nama_pembeli,
          email: user.email_pembeli,
          no_telepon: user.no_telp_pembeli,
          poin_loyalitas: user.poin_pembeli,
          role: decoded.role,
        };
      }


    } else if (decoded.role === 'pegawai') {
      const [result] = await pool.query(`
        SELECT 
          p.id_pegawai, 
          p.nama_pegawai,
          p.no_telp_pegawai,
          p.email_pegawai,
          p.alamat_pegawai,
          r.nama_role
        FROM pegawai p
        LEFT JOIN role r ON p.id_role = r.id_role
        WHERE p.id_pegawai = ?
      `, [decoded.id]);

      if (result.length > 0) {
        const user = result[0];
        userData = {
          id_pegawai: user.id_pegawai,
          nama: user.nama_pegawai,
          email: user.email_pegawai,
          no_telepon: user.no_telp_pegawai,
          alamat: user.alamat_pegawai,
          nama_role: user.nama_role,
          role: decoded.role,
        };
      }


    } else if (decoded.role === 'organisasi') {
      const [result] = await pool.query(`
        SELECT 
          id_organisasi, 
          nama_organisasi, 
          email_organisasi, 
          no_telp_organisasi, 
          alamat_organisasi,
          foto_organisasi
        FROM organisasi 
        WHERE id_organisasi = ?
      `, [decoded.id]);

      if (result.length > 0) {
        const user = result[0];
        userData = {
          id_organisasi: user.id_organisasi,
          nama: user.nama_organisasi,
          email: user.email_organisasi,
          no_telepon: user.no_telp_organisasi,
          alamat: user.alamat_organisasi,
          foto: user.foto_organisasi,
          role: decoded.role,
        };
      }

    }


    if (!userData) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, user: userData }), { status: 200 });

  } catch (error) {
    console.error('Error verifying token:', error);
    return new Response(JSON.stringify({ success: false, message: 'Invalid or expired token' }), { status: 401 });
  }
}
