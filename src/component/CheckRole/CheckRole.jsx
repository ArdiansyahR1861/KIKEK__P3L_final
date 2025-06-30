"use client";

import { useEffect, useState } from "react";

export default function CheckRole({ allowed = [], children, fallback = null }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowedAccess, setAllowedAccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/login/userlogin");
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
          setAllowedAccess(allowed.includes(data.user.nama_role));
        } else {
          setAllowedAccess(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setAllowedAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [allowed]);

  if (loading) return <p>CEk hak akses...</p>;

  if (!allowedAccess) return fallback || <p className="text-red-500">Anda tidak memiliki akses.</p>;

  return <>{children}</>;
}
