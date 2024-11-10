"use client";

// import { CldUploadWidget } from 'next-cloudinary';
import { twMerge } from 'tailwind-merge'
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDropzone } from '@uploadthing/react';
import { useUploadThing } from "@/lib/uploadthing";
import { generateClientDropzoneAccept } from "uploadthing/client";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export const MultiUploader: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const files: File[] = Array.from(res || []);

      setIsLoading(false);

      console.log("Files: ", res);
      // alert("uploaded successfully!");
      onUpload(res)
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });

  const fileTypes = routeConfig
    ? Object.keys(routeConfig)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    // onChange(result.info.secure_url);

    onChange(result[0].url)
  };

  const onDelete = async (url: string) => {
    onRemove(url);
    await axios.post('/api/servers/deleteImage', {
      imageUrl: url,
    }).then(() => {
      toast.success("Image Remove");
    });
  }

  if (!isMounted) {
    return null;
  }

  return ( 
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                <div className="z-10 absolute top-2 right-2">
                  <Button type="button" onClick={() => onDelete(url)} variant="destructive" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Image
                  fill
                  className="object-cover"
                  alt="Image"
                  src={url}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="flex items-center justify-center h-48 border-2 border-gray-300 border-dashed rounded-md flex-col">
              Drop files here!
            </div>
          </div>

          {files.length > 0 && (
            <button
              type="button"
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => startUpload(files)}
            >
              Upload {files.length} files
            </button>
          )}
        </>
      )}
    </div>
  );
}
