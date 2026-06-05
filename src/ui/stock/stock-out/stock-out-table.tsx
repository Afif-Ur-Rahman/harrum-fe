"use client";

import React from "react";
import { Table } from "@/components";
import { Flex, Text } from "@radix-ui/themes";
import { FormInput, SelectInput } from "@/components";
import { StockItemType } from "../form/schema";
import { Trash2 } from "lucide-react";

interface StockOutTableProps {
  stockData: StockItemType[];
  unitOptions: { label: string; value: string }[];
  removeField: (name: string) => void;
}

export const StockOutTable: React.FC<StockOutTableProps> = ({ stockData, unitOptions, removeField }) => {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: StockItemType) => (
        <Text>{row.name}</Text>
      ),
    },
    {
      key: "remainingQuantity",
      header: "Remaining Quantity",
      render: (row: StockItemType) => (
        <Text>{`${row.remainingQuantity} ${row.unit}`}</Text>
      ),
    },
    {
      key: "newQuantity",
      header: "Wastage Qty",
      render: (row: StockItemType, idx: number) => (
        <Flex justify='center' align='center'>
          <FormInput field={`stockItems.${idx}.newQuantity`} placeHolder="0" className="w-20!" type="number" maxValue={Number(row.remainingQuantity)} />
        </Flex>
      ),
    },
    {
      key: "unit",
      header: "Unit",
      render: (row: StockItemType, idx: number) => (
        <Flex justify='center' align='center'>
          <SelectInput
            field={`stockItems.${idx}.unit`}
            options={unitOptions}
            placeholder="Select Unit"
            buttonClassName="w-35!"
            disabled={!!row.unit} />
        </Flex>
      ),
    },
    {
      key: "remove",
      header: "",
      render: (row: StockItemType) => (
        <button
          onClick={() => removeField(row.name)}
          className="p-1 rounded-full transition hover:bg-red-100 cursor-pointer">
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      ),
    },
  ];

  return (
    <Flex direction="column" gap="4" className="w-full">
      <Table data={stockData} columns={columns} />
    </Flex>
  );
};
