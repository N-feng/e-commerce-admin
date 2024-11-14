import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { getTotalProducts } from "@/actions/get-total-products";
import { getTotalSales } from "@/actions/get-total-sales";
import { getGraphTotalRevenue } from "@/actions/get-graph-total-tevenue";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/get-total-revenue-by-order-status.ts";
import { getOrderStatusTotalRevenue } from "@/actions/get-total-revenue-order-status";
import { getOrderTotalRevenueByCategory } from "@/actions/get-total-revenue-by-category";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ 
  params
}) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalSales = await getTotalSales(params.storeId);
  const totalProducts = await getTotalProducts(params.storeId);

  const monthlyGraphRevenue = await getGraphTotalRevenue(params.storeId);
  const revenueByOrderStatus = await getOrderStatusTotalRevenue(params.storeId);
  const revenueBycategory = await getOrderTotalRevenueByCategory(
    params.storeId
  );
  const orderStatusTotalRevenue = await getOrderPaymentStatusTotalRevenue(
    params.storeId
  );

  // const totalRevenue = await getTotalRevenue(params.storeId);
  // const graphRevenue = await getGraphRevenue(params.storeId);
  // const salesCount = await getSalesCount(params.storeId);
  // const stockCount = await getStockCount(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        {/* <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card> */}
        <div className="grid gap-4 grid-cols-4">
          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                Revenue By Month
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={monthlyGraphRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                Revenue By Payment Status
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={orderStatusTotalRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                Revenue By Category
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={revenueBycategory} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                Revenue By Order Stauts
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={revenueByOrderStatus} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
