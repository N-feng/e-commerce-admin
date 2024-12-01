import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { userId } = auth();

  const body = await req.json();

  const { name, products } = body;

  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const order = await prismadb.meal.create({
    data: {
      // isPaid: false,
      // orderItems: products,
      name,
      mealItems: {
        create: products.map((item: Product) => ({
          product: {
            connect: {
              id: item.id
            }
          }
        }))
      },
      userId,
      // order_status: "Processing",
      // createdAt: serverTimestamp(),
      storeId: params.storeId,
    }
  });

  return NextResponse.json(order);
};

export async function GET(
  req: Request,
  { params }: { 
    params: { 
      categoryId: string,
      sizeId: string,
      kitchenId: string,
      cuisineId: string,
      storeId: string,
    } 
  },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const meals = await prismadb.meal.findMany({
      where: {
        storeId: params.storeId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  
    return NextResponse.json(meals);
  } catch (error) {
    console.log('[MEALS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
