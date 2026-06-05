"use client";

import React from "react";
import { Box, Table as RadixTable } from "@radix-ui/themes";
import Loader from "@/components/ui/loader";
import Nodata from "./nodata";

type Column<T> =
  | {
    key: keyof T;
    header: React.ReactNode;
    render?: undefined;
    align?: "left" | "center" | "right";
    className?: string;
  }
  | {
    key: string;
    header: React.ReactNode;
    render: (row: T, rowIndex: number) => React.ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
  };


interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  title?: string;
  getRowClassName?: (row: T) => string;
}

function Table<T>({
  data,
  columns,
  isLoading,
  onRowClick,
  title,
  getRowClassName,
}: TableProps<T>) {
  const getAlign = (index: number, col?: Column<T>) => {
    if (col?.align) return col.align;
    if (index === 0) return "left";
    if (index === columns.length - 1) return "right";
    return "center";
  };

  return (
    <Box className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <RadixTable.Root className="text-nowrap!">
        <RadixTable.Header>
          <RadixTable.Row className="bg-gray-50">
            {columns.map((col, index) => (
              <RadixTable.ColumnHeaderCell
                key={String(col.key)}
                align={getAlign(index, col)}
                className={col.className}
              >
                {col.header}
              </RadixTable.ColumnHeaderCell>
            ))}
          </RadixTable.Row>
        </RadixTable.Header>

        <RadixTable.Body>
          {isLoading ? (
            <RadixTable.Row>
              <RadixTable.Cell colSpan={columns.length} className="py-8">
                <Loader label={title} />
              </RadixTable.Cell>
            </RadixTable.Row>
          ) : data.length === 0 ? (
            <RadixTable.Row>
              <RadixTable.Cell
                colSpan={columns.length}
                className="text-center text-gray-500"
              >
                <Nodata />
              </RadixTable.Cell>
            </RadixTable.Row>
          ) : (
            data.map((row, rowIndex) => (
              <RadixTable.Row
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`group cursor-pointer transition align-middle! ${getRowClassName?.(row) || ""}`}
              >
                {columns.map((col, colIndex) => (
                  <RadixTable.Cell
                    key={String(col.key)}
                    align={getAlign(colIndex, col)}
                    className={col.className}
                  >
                    {col.render ? col.render(row, rowIndex) : String(row[col.key])}
                  </RadixTable.Cell>
                ))}
              </RadixTable.Row>
            ))
          )}
        </RadixTable.Body>
      </RadixTable.Root>
    </Box>
  );
}

export { Table };
