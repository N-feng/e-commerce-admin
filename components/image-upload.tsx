"use client";

// import { CldUploadWidget } from 'next-cloudinary';
import { twMerge } from 'tailwind-merge'
import { UploadButton } from "@/lib/uploadthing";
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

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
        <main className="flex">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              // alert("Upload Completed");
              onUpload(res)
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            config={{ cn: twMerge }}
          />
        </main>
      )}
    </div>
  );
}
 
export default ImageUpload;
