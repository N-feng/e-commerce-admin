import prismadb from '@/lib/prismadb';

export const getTotalProducts = async (storeId: string) => {
  const productsData = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    // include: {
    //   images: true,
    //   category: true,
    //   kitchen: true,
    //   cuisine: true,
    //   color: true,
    //   size: true,
    // },
    // orderBy: {
    //   createdAt: 'desc',
    // }
  });

  const count = productsData.length;

  return count;
};
