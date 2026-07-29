"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Button, Input, Card, Modal, ImageUploader } from "@/components/ui";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Member {
  id: string;
  name: string;
  positionId: string;
  positionEn: string;
  photoUrl?: string;
  order: number;
}

function SortableMember({
  member,
  onEdit,
  onDelete,
}: {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary/30 transition-colors"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-neutral-400" />
      </button>

      {/* Photo */}
      <div className="flex-shrink-0">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400 text-sm">No</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
            #{member.order + 1}
          </span>
          <h3 className="font-semibold text-neutral-900 truncate">{member.name}</h3>
        </div>
        <p className="text-sm text-neutral-600 truncate">{member.positionId}</p>
        <p className="text-xs text-neutral-400 truncate">{member.positionEn}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button size="sm" variant="secondary" onClick={() => onEdit(member)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(member.id)}>
          Hapus
        </Button>
      </div>
    </div>
  );
}

export default function AdminOrganisasiPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Partial<Member>>({
    name: "",
    positionId: "",
    positionEn: "",
    photoUrl: "",
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchMembers = async () => {
    try {
      const data = await api.get<Member[]>("/profile/members");
      setMembers(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = members.findIndex((m) => m.id === active.id);
    const newIndex = members.findIndex((m) => m.id === over.id);

    const newMembers = arrayMove(members, oldIndex, newIndex).map((member, index) => ({
      ...member,
      order: index,
    }));

    setMembers(newMembers);
    setUpdatingOrder(true);

    try {
      // Update all members with new order
      await Promise.all(
        newMembers.map((member) =>
          api.put(`/profile/members/${member.id}`, { order: member.order })
        )
      );
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Gagal mengupdate urutan, memuat ulang...");
      fetchMembers();
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        positionId: "",
        positionEn: "",
        photoUrl: "",
        order: members.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({
      name: "",
      positionId: "",
      positionEn: "",
      photoUrl: "",
      order: 0,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.positionId || !formData.positionEn) {
      alert("Nama, Jabatan (ID) dan Jabatan (EN) wajib diisi");
      return;
    }

    setSaving(true);
    try {
      if (editingMember) {
        await api.put(`/profile/members/${editingMember.id}`, formData);
      } else {
        await api.post("/profile/members", formData);
      }
      handleCloseModal();
      fetchMembers();
    } catch (error) {
      console.error("Failed to save member:", error);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus anggota organisasi ini?")) return;

    try {
      await api.delete(`/profile/members/${id}`);
      // Reorder remaining members
      const remainingMembers = members
        .filter((m) => m.id !== id)
        .map((member, index) => ({ ...member, order: index }));
      
      await Promise.all(
        remainingMembers.map((member) =>
          api.put(`/profile/members/${member.id}`, { order: member.order })
        )
      );
      
      fetchMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert("Gagal menghapus data");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Struktur Organisasi</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Seret dan lepas untuk mengubah urutan
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Tambah Anggota</Button>
      </div>

      {updatingOrder && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          Mengupdate urutan...
        </div>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            Belum ada anggota organisasi
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={members.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {members.map((member) => (
                  <SortableMember
                    key={member.id}
                    member={member}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? "Edit Anggota" : "Tambah Anggota"}
        size="lg"
      >
        <div className="space-y-4">
          <ImageUploader
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            folder="profile"
            className="mx-auto"
          />

          <Input
            label="Nama"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Jabatan (ID)"
            value={formData.positionId || ""}
            onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
            required
          />

          <Input
            label="Jabatan (EN)"
            value={formData.positionEn || ""}
            onChange={(e) => setFormData({ ...formData, positionEn: e.target.value })}
            required
          />

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button onClick={handleSubmit} isLoading={saving}>
              {editingMember ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
