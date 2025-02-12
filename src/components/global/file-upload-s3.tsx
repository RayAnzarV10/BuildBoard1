import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, FileUp, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  transactionId: string;
  maxSize?: number;
  onFileSelect?: (file: File | null) => void;
  onError?: (error: Error) => void;
  allowedTypes?: string[];
  disabled?: boolean;
}

export function FileUpload({ 
  transactionId, 
  maxSize = 10 * 1024 * 1024,
  onFileSelect,
  onError,
  allowedTypes = ['.pdf', '.png', '.jpg', '.jpeg'],
  disabled = false
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `El archivo es demasiado grande. Máximo permitido: ${formatFileSize(maxSize)}`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return `Tipo de archivo no permitido. Formatos aceptados: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast({
        variant: "destructive",
        title: "Error",
        description: validationError,
      });
      if (onError) onError(new Error(validationError));
      return;
    }

    setError(null);
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const clearFile = () => {
    setSelectedFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
            ${dragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            accept={allowedTypes.join(',')}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id={`file-upload-${transactionId}`}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                Arrastra y suelta o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Máximo: {formatFileSize(maxSize)} | Formatos: {allowedTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <FileUp className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}