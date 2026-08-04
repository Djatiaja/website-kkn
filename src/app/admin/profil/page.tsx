"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface MissionItem {
  id: string;
  textId: string;
  textEn: string;
  order: number;
}

interface ProfileData {
  id: string;
  name: string;
  descriptionId: string;
  descriptionEn: string;
  visionId: string;
  visionEn: string;
  missionId: string;
  missionEn: string;
  historyId: string;
  historyEn: string;
  heroVideoUrl: string;
  address: string;
  phone: string;
  email: string;
  population: number;
  area: number;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  footerDescriptionId?: string;
  footerDescriptionEn?: string;
  copyrightId?: string;
  copyrightEn?: string;
  missionItems?: MissionItem[];
}

export default function AdminProfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [missionItems, setMissionItems] = useState<MissionItem[]>([]);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    api.get<ProfileData>("/profile").then((data) => {
      setProfile(data);
      setMissionItems(data.missionItems || []);
      setLoading(false);
    });
  }, []);

  const handleChange = (field: string, value: string | number) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
    setSuccess(false);
  };

  const handleSocialChange = (field: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialMedia: { ...profile.socialMedia, [field]: value },
    });
    setSuccess(false);
  };

  const handleAddMissionItem = async () => {
    if (!profile) return;
    const newItem = await api.post<MissionItem>("/profile/mission-items", {
      profileId: profile.id,
      textId: "",
      textEn: "",
      order: missionItems.length,
    });
    setMissionItems([...missionItems, newItem]);
    setSuccess(false);
  };

  const handleUpdateMissionItem = async (id: string, field: "textId" | "textEn", value: string) => {
    setMissionItems(missionItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    await api.put(`/profile/mission-items/${id}`, { [field]: value });
    setSuccess(false);
  };

  const handleDeleteMissionItem = async (id: string) => {
    if (!confirm("Hapus item misi ini?")) return;
    await api.delete(`/profile/mission-items/${id}`);
    setMissionItems(missionItems.filter(item => item.id !== id));
    setSuccess(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Password baru tidak cocok");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess("Password berhasil diubah");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Gagal mengubah password");
    }
    setPasswordSaving(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    await api.put("/profile", {
      name: profile.name,
      descriptionId: profile.descriptionId,
      descriptionEn: profile.descriptionEn,
      visionId: profile.visionId,
      visionEn: profile.visionEn,
      missionId: profile.missionId,
      missionEn: profile.missionEn,
      historyId: profile.historyId,
      historyEn: profile.historyEn,
      heroVideoUrl: profile.heroVideoUrl,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
      population: profile.population,
      area: profile.area,
      socialMedia: profile.socialMedia,
      footerDescriptionId: profile.footerDescriptionId,
      footerDescriptionEn: profile.footerDescriptionEn,
      copyrightId: profile.copyrightId,
      copyrightEn: profile.copyrightEn,
    });

    setSaving(false);
    setSuccess(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) return <p>Profil tidak ditemukan</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Edit Profil Desa</h1>
        {success && (
          <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            ✅ Berhasil disimpan
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Dasar */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Desa"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              label="Telepon"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              label="Hero Video URL"
              value={profile.heroVideoUrl}
              onChange={(e) => handleChange("heroVideoUrl", e.target.value)}
            />
            <Input
              label="Populasi"
              type="number"
              value={String(profile.population)}
              onChange={(e) => handleChange("population", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Luas Wilayah (ha)"
              type="number"
              value={String(profile.area)}
              onChange={(e) => handleChange("area", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Alamat"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={2}
            />
          </div>
        </Card>

        {/* Deskripsi */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Deskripsi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi (ID)</label>
              <RichTextEditor value={profile.descriptionId} onChange={(val) => handleChange("descriptionId", val)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi (EN)</label>
              <RichTextEditor value={profile.descriptionEn} onChange={(val) => handleChange("descriptionEn", val)} />
            </div>
          </div>
        </Card>

        {/* Visi & Misi */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Visi & Misi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Visi (ID)</label>
              <RichTextEditor value={profile.visionId} onChange={(val) => handleChange("visionId", val)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Visi (EN)</label>
              <RichTextEditor value={profile.visionEn} onChange={(val) => handleChange("visionEn", val)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Misi (ID) - Legacy</label>
              <RichTextEditor value={profile.missionId} onChange={(val) => handleChange("missionId", val)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Misi (EN) - Legacy</label>
              <RichTextEditor value={profile.missionEn} onChange={(val) => handleChange("missionEn", val)} />
            </div>

            {/* Mission Items */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-neutral-700">Daftar Misi (per baris)</h3>
                <Button type="button" onClick={handleAddMissionItem}>
                  + Tambah Misi
                </Button>
              </div>
              {missionItems.map((item, idx) => (
                <div key={item.id} className="mb-4 p-3 border rounded-lg bg-neutral-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-600">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMissionItem(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Bahasa Indonesia</label>
                      <RichTextEditor
                        value={item.textId}
                        onChange={(val) => handleUpdateMissionItem(item.id, "textId", val)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">English</label>
                      <RichTextEditor
                        value={item.textEn}
                        onChange={(val) => handleUpdateMissionItem(item.id, "textEn", val)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {missionItems.length === 0 && (
                <p className="text-sm text-neutral-400 italic">Belum ada item misi. Klik "Tambah Misi" untuk menambahkan.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Sejarah */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Sejarah</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Sejarah (ID)</label>
              <RichTextEditor value={profile.historyId} onChange={(val) => handleChange("historyId", val)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Sejarah (EN)</label>
              <RichTextEditor value={profile.historyEn} onChange={(val) => handleChange("historyEn", val)} />
            </div>
          </div>
        </Card>

        {/* Media Sosial */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Media Sosial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Facebook"
              value={profile.socialMedia?.facebook || ""}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
            <Input
              label="Instagram"
              value={profile.socialMedia?.instagram || ""}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
            <Input
              label="YouTube"
              value={profile.socialMedia?.youtube || ""}
              onChange={(e) => handleSocialChange("youtube", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
        </Card>

        {/* Footer Settings */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Pengaturan Footer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi Footer (ID)</label>
              <Textarea
                value={profile.footerDescriptionId || ""}
                onChange={(e) => handleChange("footerDescriptionId", e.target.value)}
                rows={3}
                placeholder="Deskripsi singkat untuk footer dalam Bahasa Indonesia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi Footer (EN)</label>
              <Textarea
                value={profile.footerDescriptionEn || ""}
                onChange={(e) => handleChange("footerDescriptionEn", e.target.value)}
                rows={3}
                placeholder="Short description for footer in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Copyright (ID)</label>
              <Input
                value={profile.copyrightId || ""}
                onChange={(e) => handleChange("copyrightId", e.target.value)}
                placeholder="© 2024 Desa Pasangsari. Hak cipta dilindungi."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Copyright (EN)</label>
              <Input
                value={profile.copyrightEn || ""}
                onChange={(e) => handleChange("copyrightEn", e.target.value)}
                placeholder="© 2024 Pasangsari Village. All rights reserved."
              />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Simpan Perubahan
          </Button>
        </div>
      </form>

      {/* Change Password Section */}
      <Card className="mt-6">
        <h2 className="text-lg font-heading font-semibold mb-4">Ubah Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {passwordSuccess}
            </div>
          )}
          <Input
            type="password"
            label="Password Lama"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
          />
          <Input
            type="password"
            label="Password Baru"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
            minLength={6}
          />
          <Input
            type="password"
            label="Konfirmasi Password Baru"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={passwordSaving}>
              Ubah Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
