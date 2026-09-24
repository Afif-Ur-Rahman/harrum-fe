"use client";

import { Trash2 } from "lucide-react";
import React from "react";

import { Table } from "@/components";
import { Stock } from "@/types";

import { ItemCells } from "./item-cells";

import { OrderItemFormType } from "../../form";

interface ItemsTableProps {
  items: OrderItemFormType[];
  stocks: Stock[];
  removeItem: (index: number) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({ items, stocks, removeItem }) => {
  const columns = [
    {
      key: "name",
      header: "Item",
      align: "left" as const,
      render: (row: OrderItemFormType) => (
        <span className="font-semibold text-white">{row.name}</span>
      ),
    },
    {
      key: "quantity",
      header: "Colors / Quantity",
      align: "left" as const,
      render: (row: OrderItemFormType, index: number) => (
        <ItemCells
          item={row}
          index={index}
          stock={stocks.find(s => s._id === row.stockId)}
          mode="quantity"
        />
      ),
    },
    {
      key: "price",
      header: "Price",
      className: "w-40",
      render: (row: OrderItemFormType, index: number) => (
        <ItemCells
          item={row}
          index={index}
          stock={stocks.find(s => s._id === row.stockId)}
          mode="price"
        />
      ),
    },
    {
      key: "total-price",
      header: "Total Price",
      className: "w-40",
      render: (row: OrderItemFormType, index: number) => (
        <ItemCells
          item={row}
          index={index}
          stock={stocks.find(s => s._id === row.stockId)}
          mode="total"
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (_: OrderItemFormType, index: number) => (
        <button
          type="button"
          onClick={() => removeItem(index)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
          aria-label="Remove item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return <Table title="Order Items" data={items} columns={columns} />;
};
