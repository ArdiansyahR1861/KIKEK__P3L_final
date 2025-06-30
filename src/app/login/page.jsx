'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [checkLogin, setCheckLogin] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await fetch('/api/login/userlogin');
        const data = await res.json();

        if (res.ok && data.success) {
          const role = data.user.role;
          if (role === 'penitip') router.push('/penitip');
          else if (role === 'pembeli') router.push('/home');
          else if (role === 'pegawai') router.push('/admin');
          else if (role === 'organisasi') router.push('/organisasi');
        } else {
          setCheckLogin(false);
        }
      } catch (err) {
        setCheckLogin(false);
      }
    };
    checkLoggedIn();
  }, [router]);
  if(checkLogin) {
    return <div className="">CHECK LOGIN</div>;
  }

  const SubmitLogin = async (e) => {
    setError('');
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal masuk!');
        return;
      }

      if (data.success) {
        if (data.userType === 'penitip') router.push('/penitip');
        else if (data.userType === 'pembeli') router.push('/home');
        else if (data.userType === 'organisasi') router.push('/organisasi');

      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Coba lagi nanti.');
    }
  }
  return (
    <div className="p-10">
      <h1 className="text-center font-[PlayfairDisplay] text-6xl text-[#D2CBB1] font-extrabold">WELL</h1>
      <h1 className="text-center font-[PlayfairDisplay] text-6xl text-[#D2CBB1] font-extrabold">COME</h1>
      <div className="p-5 flex justify-center">
        <div className="bg-[#D2CBB1] p-5 rounded-3xl w-lg">
          <h1 className="text-center font-[MontserratBold] text-[#273529] font-extrabold text-3xl py-2">SELAMAT DATANG</h1>
          <div className="flex justify-center">
            <form onSubmit={SubmitLogin} className="max-w-md w-full mx-auto p-3">
              <div className="flex flex-col gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-[#273529] text-[#D2CBB1] font-medium text-base p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2CBB1]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="bg-[#273529] text-[#D2CBB1] font-medium text-base p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2CBB1]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="text-center text-sm text-[#273529] font-medium">
                  Terjadi Masalah? <b className="underline cursor-pointer">Lupa Password</b>
                </div>

                <div className="border-t-2 border-[#273529]"></div>

                <button
                  type="submit"
                  className="bg-[#273529] text-[#D2CBB1] text-lg font-semibold py-3 rounded-2xl hover:bg-[#1e2b22] transition duration-200"
                >
                  Login
                </button>

                <div className="text-center text-sm text-[#273529] font-medium">
                  Belum Punya Akun? <b className="underline cursor-pointer">Register</b>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
