"use client";

import { useEffect, useState } from "react";
import CheckRole from "@/component/CheckRole/CheckRole";

export default function PegawaiPage() {
  const [pegawai, setPegawai] = useState([]);
  const [filteredPegawai, setFilteredPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [roles, setRoles] = useState([]);


  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPegawai, setNewPegawai] = useState({
    nama_pegawai: "",
    email_pegawai: "",
    no_telp_pegawai: "",
    alamat_pegawai: "",
    id_role: "",
    password_pegawai: "",
  });



  const handleEdit = (pegawai) => {
    setSelectedPegawai(pegawai);
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles")
      const data = await res.json();
      if (res.ok) {
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data role:", error);
    }
  };



  const fetchPegawai = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pegawai", { method: "GET" });
      const data = await res.json();
      const list = data.pegawai || [];
      setPegawai(list);
      setFilteredPegawai(list);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/pegawai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPegawai),
      });

      if (res.ok) {
        alert("Pegawai berhasil ditambahkan");
        fetchPegawai();
        setShowAddModal(false);
        setNewPegawai({
          nama_pegawai: "",
          email_pegawai: "",
          no_telp_pegawai: "",
          alamat_pegawai: "",
          id_role: "",
          password: "",
        });
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menambah pegawai");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menambah pegawai");
    }
  };


  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/pegawai", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPegawai),
      });

      if (res.ok) {
        alert('Pegawai berhasil diperbarui');
        fetchPegawai();
        setShowEditModal(false);
      } else {
        alert('Gagal memperbarui pegawai');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat update');
    }
  };

  const handleDelete = async (id_pegawai) => {
    const confirmDelete = confirm("Yakin ingin menghapus pegawai ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/pegawai", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pegawai }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchPegawai();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = pegawai.filter((p) =>
      [p.nama_pegawai, p.email_pegawai, p.no_telp_pegawai]
        .some((field) => field?.toLowerCase().includes(term))
    );
    setFilteredPegawai(filtered);
  };

  useEffect(() => {
    fetchPegawai();
    fetchRoles();
  }, []);

  return (
    <div className="p-6">
      <CheckRole allowed={["Admin"]}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Manajemen Pegawai</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Pegawai
          </button>

        </div>

        <div className="flex mb-5">
          <input
            type="text"
            placeholder="Cari nama/email/no telepon..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded bg-[#d1cbb5] border border-gray-300 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1c2b1c]/50 transition duration-200"
          />
        </div>

        {loading ? (
          <p className="text-white">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#d1cbb5] text-[#1c2b1c] uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">No. Telepon</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPegawai.map((p) => (
                  <tr
                    key={p.id_pegawai}
                    className="bg-[#d1cbb5] hover:bg-[#bcb69e] transition-colors duration-200"
                  >
                    <td className="px-4 py-2">{p.nama_pegawai}</td>
                    <td className="px-4 py-2">{p.email_pegawai}</td>
                    <td className="px-4 py-2">{p.no_telp_pegawai}</td>
                    <td className="px-4 py-2">{p.alamat_pegawai}</td>
                    <td className="px-4 py-2">{p.nama_role}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition duration-200"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                        onClick={() => handleDelete(p.id_pegawai)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPegawai.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-700 py-4">
                      {pegawai.length === 0
                        ? "Tidak ada data pegawai"
                        : "Pegawai tidak ditemukan"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}



        {/* ---------- EDIT MODAL ---------- */}
        {showEditModal && selectedPegawai && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Pegawai</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Nama"
                  value={selectedPegawai.nama_pegawai}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, nama_pegawai: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Email"
                  value={selectedPegawai.email_pegawai}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, email_pegawai: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="No. Telepon"
                  value={selectedPegawai.no_telp_pegawai}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, no_telp_pegawai: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Alamat"
                  value={selectedPegawai.alamat_pegawai}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, alamat_pegawai: e.target.value })
                  }
                />
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={selectedPegawai.id_role}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, id_role: e.target.value })
                  }
                >
                  <option value="">Pilih Role</option>
                  {roles.map((role) => (
                    <option key={role.id_role} value={role.id_role}>
                      {role.nama_role}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}




        {/* ---------- ADD MODAL ---------- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tambah Pegawai</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Nama"
                  value={newPegawai.nama_pegawai}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, nama_pegawai: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Email"
                  value={newPegawai.email_pegawai}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, email_pegawai: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="No. Telepon"
                  value={newPegawai.no_telp_pegawai}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, no_telp_pegawai: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Alamat"
                  value={newPegawai.alamat_pegawai}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, alamat_pegawai: e.target.value })
                  }
                />
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={newPegawai.id_role}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, id_role: e.target.value })
                  }
                >
                  <option value="">Pilih Role</option>
                  {roles.map((role) => (
                    <option key={role.id_role} value={role.id_role}>
                      {role.nama_role}
                    </option>
                  ))}
                </select>

                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Password"
                  value={newPegawai.password_pegawai}
                  onChange={(e) =>
                    setNewPegawai({ ...newPegawai, password_pegawai: e.target.value })
                  }
                />
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

      </CheckRole>
    </div>

  );
}
