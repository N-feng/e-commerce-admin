import { auth } from "@clerk/nextjs/server";

import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const imageId = imageUrl.split('/').pop();

    const utapi = new UTApi();
    await utapi.deleteFiles(imageId);

    return new NextResponse('Succesfull', { status: 200 });
  } catch (error) {
    console.error('[SERVERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
