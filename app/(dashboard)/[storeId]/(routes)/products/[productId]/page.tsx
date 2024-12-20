import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  const product = params.productId === 'new' ? null : await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      attribute: true,
      vitamins: true,
      minerals: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const kitchens = await prismadb.kitchen.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const cuisines = await prismadb.cuisine.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          colors={colors}
          sizes={sizes}
          kitchens={kitchens}
          cuisines={cuisines}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;
