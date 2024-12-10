"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generateSHA1, generateSignature, getPublicIdFromUrl } from '@/lib/utils';
import { useDeleteImage } from '@/features/mealImage/use-delete-meal-image';

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
    console.log('result: ', result);
    onChange(result.info.secure_url);
  };

  const onDelete = async (url: string) => {
    console.log('url: ', url);
    // const publicId = getPublicIdFromUrl(url);
    // const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    // console.log('cloudName: ', cloudName);
    // const timestamp = new Date().getTime();
    // const apiKey = process.env.CLOUDINARY_API_KEY!;
    // console.log('process.env: ', process.env);
    // console.log('apiKey: ', apiKey);
    // const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    // console.log('apiSecret: ', apiSecret);
    // const signature = generateSHA1(generateSignature(publicId as string, apiSecret));
    // const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    // const response = await axios.post(api, {
    //   public_id: publicId,
    //   signature: signature,
    //   api_key: apiKey,
    //   timestamp: timestamp,
    // });
    // console.log('response: ', response);
    // console.log('publicId: ', publicId);
    // onRemove(url);
    await axios.delete('/api/upload', {
      url: url,
    }).then(() => {
      toast.success("Image Remove");
    });
    // await axios.post('/api/servers/deleteImage', {
    //   imageUrl: url,
    // }).then(() => {
    //   toast.success("Image Remove");
    // });
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
          <CldUploadWidget onUpload={onUpload} uploadPreset="multi-store-e-commerce-app">
            {({ open }) => {
              const onClick = () => {
                open();
              };
    
              return (
                <Button 
                  type="button" 
                  disabled={disabled} 
                  variant="secondary" 
                  onClick={onClick}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload an Image
                </Button>
              );
            }}
          </CldUploadWidget>
          {/* <UploadDropzone
            className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
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
          /> */}

          {/* <UploadButton
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
          /> */}
        </main>
      )}
    </div>
  );
}
 
export default ImageUpload;
