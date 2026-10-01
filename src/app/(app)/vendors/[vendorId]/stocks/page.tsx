import { VendorStocks } from "@/ui/vendors";

interface VendorsStockPageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

const VendorsStockPage = async ({ params }: VendorsStockPageProps) => {
  const { vendorId } = await params;

  return <VendorStocks vendorId={vendorId} />;
};

export default VendorsStockPage;
