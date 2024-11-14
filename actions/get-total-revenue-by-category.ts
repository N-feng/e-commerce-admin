import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  total: number;
}

export const getOrderTotalRevenueByCategory = async (storeId: string) => {
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

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
    }
  });

  const categoryRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.product.category;

      if (category) {
        let revenueForItem = 0;

        if (item.product.qty !== undefined) {
          revenueForItem = item.product.price * item.product.qty;
        } else {
          revenueForItem = item.product.price;
        }

        categoryRevenue[category.name] =
          (categoryRevenue[category.name] || 0) + revenueForItem;
      }
    }
  }

  for (const category of categories) {
    categoryRevenue[category.name] = categoryRevenue[category.name] || 0; // Set the initial value to 0 for each category
  }

  // Update graphData using the categories array
  const graphData: GraphData[] = categories.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name] || 0,
  }));

  return graphData;
};
