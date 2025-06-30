import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Cek Pegawai
    const [pegawaiResults] = await pool.query(`
      SELECT p.*, r.nama_role FROM pegawai p
      LEFT JOIN role r ON p.id_role = r.id_role
      WHERE p.email_pegawai = ?
    `, [email]);
    if (pegawaiResults.length > 0) {
      const user = pegawaiResults[0];
      const isPasswordValid = password === user.password_pegawai
      // const isPasswordValid = await bcrypt.compare(password, user.password_pegawai); //kalau udah password di bycrypt pakai ini
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id_pegawai, role: 'pegawai', jabatan: user.nama_role }, JWT_SECRET, { expiresIn: '1h' });

        // Menunggu cookies() secara asinkron
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        return new Response(JSON.stringify({
          success: true,
          userType: 'pegawai',
          userName: user.nama,
          token: token,
        }), { status: 200 });
      }
    }

    // Jika kredensial salah
    return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401 });

  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
