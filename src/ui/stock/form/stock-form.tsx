"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { FormProvider } from "react-hook-form";
import { useStockForm } from "./form";
import { StockFormType } from "./schema";
import { FormInput, SelectInput } from "@/components";
import { usePersistStore } from "@/store/presistStore";

interface StockFormProps {
  addStock?: { stockId: string; name: string };
  stockData?: StockFormType & { _id?: string; stockHistoryId?: string };
  onSubmit: (data: StockFormType, id?: string, historyId?: string) => Promise<void>;
}

const StockForm = ({ addStock, stockData, onSubmit }: StockFormProps) => {
  const { user } = usePersistStore();
  const form = useStockForm();
  const unitOptions = [
    { label: "Gram", value: "gram" },
    { label: "Kilogram", value: "KG" },
    { label: "Liter", value: "L" },
    { label: "Milliliter", value: "mL" },
    { label: "Pieces", value: "pcs" },
  ];

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data, stockData?._id || addStock?.stockId, stockData?.stockHistoryId);
  });

  return (
    <FormProvider {...form}>
      <Flex direction="column" gap="4" className="bg-white rounded-lg">
        <Flex direction="column" gap="2">
          <FormInput label="Stock Name" field="name" placeHolder="Rice, Meat, Oil, etc." />
          <FormInput label="Quantity" field="quantity" type="number" />
          <Flex gap="2" direction='column' >
            <Text className="block text-sm font-medium mb-1">Unit</Text>
            <SelectInput field="unit" buttonClassName="flex-1!" options={unitOptions} />
          </Flex>
          <FormInput label={`Price (${user?.currency || "USD"})`} field="price" type="number" />
        </Flex>
        <Button
          className={`${stockData ? "bg-blue-600!" : "bg-green-600!"} text-white hover:cursor-pointer!`}
          onClick={handleSubmit}
        >
          {stockData ? "Update Stock" : "Add Stock"}
        </Button>
      </Flex>
    </FormProvider>
  );
};

export { StockForm };
