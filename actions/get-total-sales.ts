import prismadb from '@/lib/prismadb';

export const getTotalSales = async (storeId: string) => {
  const ordersData = await prismadb.order.findMany({
    where: {
      storeId: storeId,
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

  const count = ordersData.length;

  return count;
};
