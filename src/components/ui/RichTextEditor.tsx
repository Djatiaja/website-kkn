import React, { useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';

// Import React Quill dynamically to avoid SSR issues and provide proper ref wrapping
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return function ForwardedQuill({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  saveImageMode?: boolean; // Override: true=storage, false=blob. Default reads env.
  folder?: string;          // Upload subfolder for storage mode. Default: "images"
}

export const RichTextEditor = ({ value, onChange, placeholder, saveImageMode, folder = "images" }: RichTextEditorProps) => {
  const quillRef = useRef<any>(null);
  // Resolve mode: prop override > env var > default "storage"
  const useStorage = saveImageMode ?? (process.env.NEXT_PUBLIC_UPLOAD_MODE !== "blob");

  // Wrap imageHandler in useCallback to prevent re-creating modules object
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      if (!useStorage) {
        // Base64 / Blob Mode
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current?.getEditor ? quillRef.current.getEditor() : null;
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', e.target?.result);
            quill.setSelection(range.index + 1);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Storage Mode — upload to server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!res.ok) throw new Error('Upload gagal');
          
          const data = await res.json();
          const quill = quillRef.current?.getEditor ? quillRef.current.getEditor() : null;
          if (quill && data.url) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.url);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error(error);
          toast.error("Gagal mengunggah gambar");
        }
      }
    };
  }, [useStorage, folder]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [useStorage, folder]);

  return (
    <div className="bg-white [&_.ql-editor]:min-h-[200px]">
      <ReactQuill 
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
};
