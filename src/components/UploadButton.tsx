"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

type FileInfo = { url: string; public_id: string };

type Props = {
  folder?: string;
  onUploaded?: (files: FileInfo[]) => void;
  onStart?: () => void;
  onError?: (err: Error) => void;
  disabled?: boolean;
};

export default function UploadButton({ 
  folder = "auto-order/dev", 
  onUploaded, 
  onStart, 
  onError,
  disabled = false
}: Props) {
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const resetInput = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const onSelect = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || busy) return;

    setBusy(true);
    onStart?.();

    try {
      console.log('🔍 UploadButton - Starting upload for', files.length, 'files');
      
      // Get upload signature
      const signRes = await fetch("/api/uploads/sign", { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, eager: "q_auto,f_auto" }) 
      });
      
      if (!signRes.ok) {
        const errorText = await signRes.text();
        throw new Error(`Sign failed: ${signRes.status} ${errorText}`);
      }
      
      const { timestamp, signature, cloudName, apiKey, eager } = await signRes.json();
      console.log('🔍 UploadButton - Got signature:', { timestamp, cloudName, eager });
      
      const uploaded: FileInfo[] = [];

      // Upload each file
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          console.warn('⚠️ UploadButton - Skipping non-image file:', file.name);
          continue;
        }
        
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Fișierul ${file.name} este prea mare (>10MB)`);
        }

        const form = new FormData();
        form.append("file", file);
        form.append("api_key", apiKey);
        form.append("timestamp", String(timestamp));
        form.append("signature", signature);
        form.append("folder", folder);
        form.append("eager", eager || "q_auto,f_auto");

        console.log('🔍 UploadButton - Uploading file:', file.name, 'to Cloudinary');
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { 
          method: "POST", 
          body: form 
        });
        
        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Upload failed for ${file.name}: ${uploadRes.status} ${errorText}`);
        }
        
        const json = await uploadRes.json();
        if (json.secure_url) {
          uploaded.push({ 
            url: json.secure_url, 
            public_id: json.public_id 
          });
          console.log('✅ UploadButton - File uploaded successfully:', file.name, json.secure_url);
        }
      }

      if (uploaded.length > 0) {
        console.log('✅ UploadButton - All files uploaded, calling onUploaded with:', uploaded);
        onUploaded?.(uploaded);
      }

    } catch (err: any) {
      console.error('❌ UploadButton - Upload error:', err);
      onError?.(err instanceof Error ? err : new Error(err.message || "Upload error"));
    } finally {
      setBusy(false);
      resetInput();
    }
  }, [busy, folder, onStart, onUploaded, onError, resetInput]);

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        disabled={busy || disabled}
      />
      {busy && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Se încarcă…</span>
        </div>
      )}
    </div>
  );
}
