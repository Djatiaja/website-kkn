"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Input, Card, Modal, Select } from "@/components/ui";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "EDITOR" as "ADMIN" | "EDITOR",
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "EDITOR",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      email: "",
      name: "",
      password: "",
      role: "EDITOR",
    });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.name) {
      alert("Email dan nama wajib diisi");
      return;
    }

    if (!editingUser && !formData.password) {
      alert("Password wajib diisi untuk user baru");
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const updateData: Record<string, string> = {
          email: formData.email,
          name: formData.name,
          role: formData.role,
        };
        await api.put(`/users/${editingUser.id}`, updateData);
      } else {
        await api.post("/users", formData);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error instanceof Error ? error.message : "Gagal menghapus user");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Manajemen Pengguna</h1>
        <Button onClick={() => handleOpenModal()}>+ Tambah User</Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Nama</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Dibuat</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-neutral-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            Belum ada user terdaftar
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit User" : "Tambah User Baru"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label={editingUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as "ADMIN" | "EDITOR" })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Menyimpan..." : editingUser ? "Update" : "Simpan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
