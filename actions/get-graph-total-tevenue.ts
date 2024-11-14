import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphTotalRevenue = async (storeId: string) => {
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
            }
          }
        }
      },
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  const paidOrders = ordersData.filter((order) => order.isPaid);

  const monthlyRevenue: { [key: string]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt
      // ?.toDate()
      .toLocaleDateString("en-US", { month: "short" });

    if (month) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        if (item.product.qty !== undefined) {
          revenueForOrder += Number(item.product.price) * item.product.qty;
        } else {
          revenueForOrder += Number(item.product.price);
        }
      }

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }
  }

  // Create a map to convert month names to numeric representation
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  //   update the graph data
  const graphData: GraphData[] = Object.keys(monthMap).map((monthName) => ({
    name: monthName,
    total: monthlyRevenue[monthName] || 0,
  }));

  return graphData;
};
