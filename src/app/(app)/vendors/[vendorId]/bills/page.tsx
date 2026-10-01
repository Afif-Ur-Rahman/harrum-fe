import { VendorBills } from "@/ui/bills";

interface VendorBillsPageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

const VendorBillsPage = async ({ params }: VendorBillsPageProps) => {
  const { vendorId } = await params;

  return <VendorBills vendorId={vendorId} />;
};

export default VendorBillsPage;
