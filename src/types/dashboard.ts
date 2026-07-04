
export interface Chart {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export interface DashboardResponse {
  message: string;
  data: {
    totalOrdersPrice: number;
    pendingOrdersPrice: number;
    totalOrdersCount: number;
    chart: Chart | null;
    recentOrders: any[];
  };
}

export interface ResponseForDashboard {
  state: boolean;
  data?: DashboardResponse;
  error?: string;
}
