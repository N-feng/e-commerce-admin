import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateSHA1, generateSignature, getPublicIdFromUrl } from "@/lib/utils";
import cloudinary from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const img = formData.get("file");
    if (!img) {
      return NextResponse.json({ success: false, message: "no image found" });
    }

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImageData = await uploadResponse.json();
    return NextResponse.json({
      uploadedImageData,
      message: "Success",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: any
) {
  try {
    const json = await req.json();
    console.log('json: ', json);
    const { searchParams } = new URL(req.url);
    console.log('searchParams: ', searchParams);
    const cloudinaryUrl = params.url;
    console.log('params: ', params);
    console.log('cloudinaryUrl: ', cloudinaryUrl);
    const publicId = getPublicIdFromUrl(cloudinaryUrl);
    console.log('publicId: ', publicId);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const timestamp = new Date().getTime();
    console.log('timestamp: ', timestamp);
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    console.log('url: ', url);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    // formData.append("timestamp", timestamp);

    const res = await cloudinary.v2.uploader.destroy(publicId, function(error,result) {
      console.log(result, error) })
      .then(resp => console.log(resp))
      .catch(_err=> console.log("Something went wrong, please try again later."));
      console.log('res: ', res);

    // const res = await fetch(url,
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );
    // await res.json();
    // console.log('res.json(): ', res.json());
    // console.log('res: ', res);
    return NextResponse.json({
      message: "Success",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", status: 500 });
  }
}