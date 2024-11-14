import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

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
  const { products, userId } = await req.json();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((item: Product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: item.name,
        },
        // unit_amount: item.price.toNumber() * 100
        unit_amount: Number(item.price) * 100
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      // orderItems: products,
      orderItems: {
        create: products.map((item: Product) => ({
          product: {
            connect: {
              id: item.id
            }
          }
        }))
      },
      userId,
      order_status: "Processing",
      // createdAt: serverTimestamp(),
      storeId: params.storeId,
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "IN"]
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
      storeId: params.storeId,
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};
