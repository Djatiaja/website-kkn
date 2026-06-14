"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Input, Textarea, Card } from "@/components/ui";

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
}

export default function AdminProfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get<ProfileData>("/profile").then((data) => {
      setProfile(data);
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
            <Textarea
              label="Deskripsi (ID)"
              value={profile.descriptionId}
              onChange={(e) => handleChange("descriptionId", e.target.value)}
              rows={4}
            />
            <Textarea
              label="Deskripsi (EN)"
              value={profile.descriptionEn}
              onChange={(e) => handleChange("descriptionEn", e.target.value)}
              rows={4}
            />
          </div>
        </Card>

        {/* Visi & Misi */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Visi & Misi</h2>
          <div className="space-y-4">
            <Textarea
              label="Visi (ID)"
              value={profile.visionId}
              onChange={(e) => handleChange("visionId", e.target.value)}
              rows={2}
            />
            <Textarea
              label="Visi (EN)"
              value={profile.visionEn}
              onChange={(e) => handleChange("visionEn", e.target.value)}
              rows={2}
            />
            <Textarea
              label="Misi (ID) — pisahkan dengan baris baru"
              value={profile.missionId}
              onChange={(e) => handleChange("missionId", e.target.value)}
              rows={5}
            />
            <Textarea
              label="Misi (EN)"
              value={profile.missionEn}
              onChange={(e) => handleChange("missionEn", e.target.value)}
              rows={5}
            />
          </div>
        </Card>

        {/* Sejarah */}
        <Card>
          <h2 className="text-lg font-heading font-semibold mb-4">Sejarah</h2>
          <div className="space-y-4">
            <Textarea
              label="Sejarah (ID)"
              value={profile.historyId}
              onChange={(e) => handleChange("historyId", e.target.value)}
              rows={5}
            />
            <Textarea
              label="Sejarah (EN)"
              value={profile.historyEn}
              onChange={(e) => handleChange("historyEn", e.target.value)}
              rows={5}
            />
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

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
