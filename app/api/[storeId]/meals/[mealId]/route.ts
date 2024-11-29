import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { MealItem, Product } from "@prisma/client";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; mealId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const { isPaid, phone, address, order_status,
      name,
      mealItems
    } = body;

    // if (!order_status) {
    //   return new NextResponse("Order Status is required", { status: 400 });
    // }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.mealId) {
      return new NextResponse("Meal Id is required", { status: 400 });
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

    await prismadb.meal.update({
      where: {
        id: params.mealId
      },
      data: {
        name,
        userId,
        storeId: params.storeId,
        mealItems: {
          deleteMany: {}
        },
      }
    })

    const order = await prismadb.meal.update({
      where: {
        id: params.mealId
      },
      data: {
        name,
        userId,
        storeId: params.storeId,
        mealItems: {
          createMany: {
            data: [
              ...mealItems.map((meal: { 
                // id: string,
                name: string,
                chineseName: string,
                // mealId: string,
                productId: string,
                weight: string,
              }) => ({
                ...meal,
                // mealId: params.mealId
              })),
            ]
          }
        },
      }
    })

    

    return NextResponse.json(order);
  } catch (error) {
    console.log(`[STORE_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
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

    const order = await prismadb.order.delete({
      where: {
        id: params.orderId
      },
    });

    return NextResponse.json({ msg: "Order Deleted" });
  } catch (error) {
    console.log(`[ORDER_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};