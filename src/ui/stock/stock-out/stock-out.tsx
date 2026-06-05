"use client";

import { Flex, Text, Button } from "@radix-ui/themes";
import { FormProvider } from "react-hook-form";
import { MultiSelectDropdown } from "@/components";
import { useStocks } from "../useStocks";
import { ArrowLeft, Trash2 } from "lucide-react";
import { StockOutTable } from "./stock-out-table";
import Link from "next/link";

const StockOut = () => {
  const {
    user,
    stockOptions,
    form,
    fields,
    selectedStock,
    unitOptions,
    onStockOut,
    isStockOutDisabled,
    wastageReason,
    setWastageReason,
  } = useStocks();

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 min-h-[90vh]">
      <Flex justify="between" direction="column" gap="4">

        {/* Header */}
        <Flex justify="between" align="center" gap="2" wrap="wrap">
          <Flex justify="between" align="center" gap="2">
            <Link href={user?.type === "restaurant" ? "/restaurant/stocks" : "/accountant/stocks"}>
              <ArrowLeft width={20} height={20} className="cursor-pointer" />
            </Link>
            <div>
              <Text className="text-2xl font-semibold">Record Wastage</Text>
              <p className="text-sm text-gray-500 mt-0.5">
                Stock quantities will be deducted immediately
              </p>
            </div>
          </Flex>
          <Button
            size="3"
            className={`px-6 py-2.5 rounded-full! bg-red-100! text-red-600! font-semibold! ${isStockOutDisabled ? "opacity-50! cursor-not-allowed!" : "cursor-pointer!"
              }`}
            onClick={form.handleSubmit(onStockOut)}
            disabled={isStockOutDisabled}
          >
            <Trash2 className="w-4 h-4" />
            <Text className="hidden sm:block">Record Wastage</Text>
          </Button>
        </Flex>

        <FormProvider {...form}>
          {/* Reason input */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Reason for Wastage
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              value={wastageReason}
              onChange={(e) => setWastageReason(e.target.value)}
              placeholder="e.g. Expired items, spillage, damaged goods…"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Stock selector */}
          <MultiSelectDropdown
            field="selectedStock"
            options={stockOptions}
            placeholder="Search or select stock items to mark as wastage"
          />

          {/* Table */}
          <StockOutTable
            stockData={fields}
            unitOptions={unitOptions}
            removeField={(name: string) => {
              const updatedSelected = selectedStock?.filter((n) => n !== name);
              form.setValue("selectedStock", updatedSelected);
            }}
          />
        </FormProvider>
      </Flex>
    </div>
  );
};

export { StockOut };
