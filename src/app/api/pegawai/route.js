import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifyUserRole } from '@/lib/auth';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

export async function GET(request) {
    try {
        await verifyUserRole(["Admin"]);

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("q");

        let query = `
            SELECT p.*, r.nama_role
            FROM pegawai p
            LEFT JOIN role r ON p.id_role = r.id_role
        `;

        let values = [];

        if (search) {
            query += `
                WHERE p.nama_pegawai LIKE ? 
                OR p.email_pegawai LIKE ? 
                OR p.no_telp_pegawai LIKE ?
            `;
            values = [`%${search}%`, `%${search}%`, `%${search}%`];
        }

        const [pegawai] = await pool.query(query, values);

        return NextResponse.json({ pegawai }, { status: 200 });

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error("Uncaught error:", error);
        return NextResponse.json({ error: "Gagal mengambil data pegawai" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await verifyUserRole(["Admin"]);

        const { nama_pegawai, no_telp_pegawai, email_pegawai, password_pegawai, alamat_pegawai, id_role } = await request.json();

        if (!nama_pegawai || !no_telp_pegawai || !email_pegawai || !password_pegawai || !alamat_pegawai || !id_role) {
            return NextResponse.json({ error: "Semua field wajib diisi!" }, { status: 400 });
        }

        const [existing] = await pool.query("SELECT * FROM pegawai WHERE email_pegawai = ?", [email_pegawai]);
        if (existing.length > 0) {
            return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password_pegawai, 10);

        await pool.query(
            `INSERT INTO pegawai (nama_pegawai, no_telp_pegawai, email_pegawai, password_pegawai, alamat_pegawai, id_role)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nama_pegawai, no_telp_pegawai, email_pegawai, hashedPassword, alamat_pegawai, id_role]
        );

        return NextResponse.json({ message: "Pegawai berhasil ditambahkan!" }, { status: 201 });

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error("Gagal menambahkan pegawai:", error);
        return NextResponse.json({ error: "Gagal menambahkan pegawai" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await verifyUserRole(["Admin"]);

        const { id_pegawai, nama_pegawai, no_telp_pegawai, email_pegawai, password_pegawai, alamat_pegawai, id_role } = await request.json();

        if (!id_pegawai || !nama_pegawai || !no_telp_pegawai || !email_pegawai || !password_pegawai || !alamat_pegawai || !id_role) {
            return NextResponse.json({ error: "Semua field wajib diisi!" }, { status: 400 });
        }

        const [pegawaiExists] = await pool.query("SELECT * FROM pegawai WHERE id_pegawai = ?", [id_pegawai]);
        if (pegawaiExists.length === 0) {
            return NextResponse.json({ error: "Pegawai tidak ditemukan!" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(password_pegawai, 10);

        await pool.query(
            `UPDATE pegawai 
             SET nama_pegawai = ?, no_telp_pegawai = ?, email_pegawai = ?, password_pegawai = ?, alamat_pegawai = ?, id_role = ? 
             WHERE id_pegawai = ?`,
            [nama_pegawai, no_telp_pegawai, email_pegawai, hashedPassword, alamat_pegawai, id_role, id_pegawai]
        );

        return NextResponse.json({ message: "Pegawai berhasil diperbarui!" }, { status: 200 });

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error("Gagal memperbarui pegawai:", error);
        return NextResponse.json({ error: "Gagal memperbarui pegawai" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await verifyUserRole(["Admin"]);

        const { id_pegawai } = await request.json();

        if (!id_pegawai) {
            return NextResponse.json({ error: "id_pegawai wajib diisi!" }, { status: 400 });
        }

        const [pegawaiExists] = await pool.query("SELECT * FROM pegawai WHERE id_pegawai = ?", [id_pegawai]);
        if (pegawaiExists.length === 0) {
            return NextResponse.json({ error: "Pegawai tidak ditemukan!" }, { status: 404 });
        }

        await pool.query("DELETE FROM pegawai WHERE id_pegawai = ?", [id_pegawai]);

        return NextResponse.json({ message: "Pegawai berhasil dihapus!" }, { status: 200 });

    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: "Anda tidak memiliki akses ke halaman ini" }, { status: 403 });
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa" }, { status: 401 });
        }

        console.error("Gagal menghapus pegawai:", error);
        return NextResponse.json({ error: "Gagal menghapus pegawai" }, { status: 500 });
    }
}
