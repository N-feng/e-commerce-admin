import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { kitchenId: string } }
) {
  try {
    if (!params.kitchenId) {
      return new NextResponse("Kitchen id is required", { status: 400 });
    }

    const kitchen = await prismadb.kitchen.findUnique({
      where: {
        id: params.kitchenId
      }
    });
  
    return NextResponse.json(kitchen);
  } catch (error) {
    console.log('[KITCHEN_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { kitchenId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.kitchenId) {
      return new NextResponse("Kitchen id is required", { status: 400 });
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

    const kitchen = await prismadb.kitchen.delete({
      where: {
        id: params.kitchenId
      }
    });
  
    return NextResponse.json(kitchen);
  } catch (error) {
    console.log('[KITCHEN_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { kitchenId: string, storeId: string } }
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


    if (!params.kitchenId) {
      return new NextResponse("Kitchen id is required", { status: 400 });
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

    const kitchen = await prismadb.kitchen.update({
      where: {
        id: params.kitchenId
      },
      data: {
        name,
        value
      }
    });
  
    return NextResponse.json(kitchen);
  } catch (error) {
    console.log('[KITCHEN_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
