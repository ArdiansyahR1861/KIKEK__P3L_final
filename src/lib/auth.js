import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { ForbiddenError, UnauthorizedError } from './errors';
import { unauthorized } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyUserRole(allowedRoles = []) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new UnauthorizedError("no token provided");
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        let nama_role = null;

        if (decoded.role === 'pegawai') {
            const [result] = await pool.query(`
                SELECT r.nama_role FROM Pegawai p
                LEFT JOIN role r ON p.id_role = r.id_role
                WHERE p.id_pegawai = ?
            `, [decoded.id]);

            if (result.length === 0) {
                throw new UnauthorizedError("Pegawai not found");
            }

            nama_role = result[0].nama_role;

        } else {
            throw new ForbiddenError("You do not have permission");
        }

        if (!allowedRoles.includes(nama_role)) {
            throw new ForbiddenError("You do not have permission");
        }

        return {
            id: decoded.id,
            role: decoded.role,
            nama_role
        };

    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError("Invalid token");
        }
        throw err;
    }
}
