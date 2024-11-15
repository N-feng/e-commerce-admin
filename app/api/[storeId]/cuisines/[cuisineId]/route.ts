import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { cuisineId: string } }
) {
  try {
    if (!params.cuisineId) {
      return new NextResponse("Cuisine id is required", { status: 400 });
    }

    const cuisine = await prismadb.cuisine.findUnique({
      where: {
        id: params.cuisineId
      }
    });
  
    return NextResponse.json(cuisine);
  } catch (error) {
    console.log('[KITCHEN_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { cuisineId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.cuisineId) {
      return new NextResponse("Cuisine id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const cuisine = await prismadb.cuisine.delete({
      where: {
        id: params.cuisineId
      }
    });
  
    return NextResponse.json(cuisine);
  } catch (error) {
    console.log('[KITCHEN_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { cuisineId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }


    if (!params.cuisineId) {
      return new NextResponse("Cuisine id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const cuisine = await prismadb.cuisine.update({
      where: {
        id: params.cuisineId
      },
      data: {
        name,
        value
      }
    });
  
    return NextResponse.json(cuisine);
  } catch (error) {
    console.log('[Cuisine_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
