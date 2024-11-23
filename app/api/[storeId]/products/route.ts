import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, chineseName, price, qty,
      energyKcal,
      energyKj,
      carbohydrates,
      sugars,
      dietaryFiber,
      fat,
      protein,
      vitaminA,
      thiamineB1,
      riboflavinB2,
      niacinB3,
      pantothenicAcidB5,
      vitaminB6,
      folateB9,
      vitaminC,
      vitaminE,
      vitaminK,
      calcium,
      iron,
      magnesium,
      manganese,
      phosphorus,
      potassium,
      sodium,
      zinc, categoryId, colorId, sizeId, images, isFeatured, isArchived, kitchenId, cuisineId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // if (!colorId) {
    //   return new NextResponse("Color id is required", { status: 400 });
    // }

    // if (!sizeId) {
    //   return new NextResponse("Size id is required", { status: 400 });
    // }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        chineseName,
        price,
        qty,
        isFeatured,
        isArchived,
        categoryId,
        // colorId,
        // sizeId,
        kitchenId,
        cuisineId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        attribute: {
          createMany: {
            data: [{
              energyKcal,
              energyKj,
              carbohydrates,
              sugars,
              dietaryFiber,
              fat,
              protein,
              storeId: params.storeId
            }]
          }
        },
        vitamins: {
          createMany: {
            data: [{
              vitaminA,
              thiamineB1,
              riboflavinB2,
              niacinB3,
              pantothenicAcidB5,
              vitaminB6,
              folateB9,
              vitaminC,
              vitaminE,
              vitaminK,
              storeId: params.storeId
            }]
          }
        },
        minerals: {
          createMany: {
            data: [{
              calcium,
              iron,
              magnesium,
              manganese,
              phosphorus,
              potassium,
              sodium,
              zinc,
              storeId: params.storeId
            }]
          }
        }
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
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
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const kitchenId = searchParams.get('kitchenId') || undefined;
    const cuisineId = searchParams.get('cuisineId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const isArchived = searchParams.get('isArchived');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        // colorId,
        // sizeId,
        kitchenId,
        cuisineId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: isArchived ? true : undefined,
      },
      include: {
        images: true,
        category: true,
        // kitchen: true,
        // cuisine: true,
        // color: true,
        // size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
