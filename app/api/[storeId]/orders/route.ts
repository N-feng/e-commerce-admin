import { NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Return the added document with its ID
    return NextResponse.json(orders);
  } catch (error) {
    console.log(`[ORDERS_GET] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
