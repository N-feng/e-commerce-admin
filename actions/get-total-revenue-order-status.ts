import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  total: number;
}

export const getOrderStatusTotalRevenue = async (storeId: string) => {
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

  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.order_status;

    if (status) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        if (item.product.qty !== undefined) {
          revenueForOrder += item.product.price * item.product.qty;
        } else {
          revenueForOrder += item.product.price;
        }
      }

      statusRevenue[status] = (statusRevenue[status] || 0) + revenueForOrder;
    }
  }

  // Create a map to convert month names to numeric representation
  const statusMap: { [key: string]: number } = {
    Processing: 0,
    Delivering: 1,
    Delivered: 2,
    Canceled: 3,
  };

  // Update graphData using the month map
  const graphData: GraphData[] = Object.keys(statusMap).map((statusName) => ({
    name: statusName,
    total: statusRevenue[statusName] || 0,
  }));

  return graphData;
};
