"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface FileUploadProps {
  transactionId: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function FileUpload({ 
  transactionId, 
  onComplete, 
  onError 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/transactions/${transactionId}/attachments`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const result = await response.json();
      console.log('Archivo subido con éxito:', result);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error:", error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error desconocido'));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        accept=".pdf,.png,.jpg,.jpeg"
        disabled={uploading}
        className="hidden"
        id={`file-upload-${transactionId}`}
      />
      <label htmlFor={`file-upload-${transactionId}`}>
        <Button 
          type="button"
          variant="outline" 
          disabled={uploading}
          className="cursor-pointer"
        >
          {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
        </Button>
      </label>
      {uploading && <p className="text-sm text-gray-500">Subiendo archivo...</p>}
    </div>
  );
}