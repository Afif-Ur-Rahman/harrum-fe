"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { FormProvider } from "react-hook-form";

import { FormInput, SelectInput } from "@/components";

import { useStockForm } from "./form";
import { StockFormType } from "./schema";

interface StockFormProps {
  addStock?: { stockId: string; name: string };
  stockData?: StockFormType & { _id?: string; stockHistoryId?: string };
  onSubmit: (data: StockFormType, id?: string, historyId?: string) => Promise<void>;
}

const StockForm = ({ addStock, stockData, onSubmit }: StockFormProps) => {
  const form = useStockForm();
  const unitOptions = [
    { label: "Gram", value: "gram" },
    { label: "Kilogram", value: "KG" },
    { label: "Liter", value: "L" },
    { label: "Milliliter", value: "mL" },
    { label: "Pieces", value: "pcs" },
  ];

  const handleSubmit = form.handleSubmit(data => {
    onSubmit(data, stockData?._id || addStock?.stockId, stockData?.stockHistoryId);
  });

  return (
    <FormProvider {...form}>
      <Flex direction="column" gap="4" className="rounded-lg bg-white">
        <Flex direction="column" gap="2">
          <FormInput label="Stock Name" field="name" placeholder="Rice, Meat, Oil, etc." />
          <FormInput label="Quantity" field="quantity" type="number" placeholder="Quantity" />
          <Flex gap="2" direction="column">
            <Text className="mb-1 block text-sm font-medium">Unit</Text>
            <SelectInput field="unit" buttonClassName="flex-1!" options={unitOptions} />
          </Flex>
          <FormInput label={`Price (PKR)`} field="price" type="number" placeholder="Price" />
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
