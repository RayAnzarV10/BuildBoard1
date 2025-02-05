// components/FileUpload.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // 1. Obtener la URL firmada del servidor
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error('Error obteniendo la URL de subida');

      const { url, fields } = await response.json();

      // 2. Subir el archivo directamente a S3
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Error subiendo el archivo');

      // La URL del archivo será:
      const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${fields.key}`;
      
      console.log('Archivo subido con éxito:', fileUrl);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error subiendo el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        accept=".pdf,.png,.jpg,.jpeg"
        disabled={uploading}
      />
      {uploading && <p>Subiendo archivo...</p>}
    </div>
  );
}