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
    <Box className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.06),transparent_34%)]" />

      <div className="relative z-10 overflow-x-auto">
        <RadixTable.Root className="min-w-full text-nowrap!">
          <RadixTable.Header>
            <RadixTable.Row className="border-b border-white/10 bg-white/8">
              {columns.map((col, index) => (
                <RadixTable.ColumnHeaderCell
                  key={String(col.key)}
                  align={getAlign(index, col)}
                  className={`px-4! py-4! text-xs! font-semibold! uppercase! tracking-widest! text-slate-400! ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </RadixTable.ColumnHeaderCell>
              ))}
            </RadixTable.Row>
          </RadixTable.Header>

          <RadixTable.Body>
            {isLoading ? (
              <RadixTable.Row>
                <RadixTable.Cell
                  colSpan={columns.length}
                  className="py-10! text-center!"
                >
                  <Loader label={title} />
                </RadixTable.Cell>
              </RadixTable.Row>
            ) : data.length === 0 ? (
              <RadixTable.Row>
                <RadixTable.Cell
                  colSpan={columns.length}
                  className="py-12! text-center! text-slate-400!"
                >
                  <Nodata />
                </RadixTable.Cell>
              </RadixTable.Row>
            ) : (
              data.map((row, rowIndex) => (
                <RadixTable.Row
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`group border-b border-white/5 align-middle! transition last:border-b-0 ${
                    onRowClick
                      ? "cursor-pointer hover:bg-white/8"
                      : "hover:bg-white/5"
                  } ${getRowClassName?.(row) || ""}`}
                >
                  {columns.map((col, colIndex) => (
                    <RadixTable.Cell
                      key={String(col.key)}
                      align={getAlign(colIndex, col)}
                      className={`px-4! py-4! text-sm! text-slate-300! ${
                        col.className || ""
                      }`}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String(row[col.key])}
                    </RadixTable.Cell>
                  ))}
                </RadixTable.Row>
              ))
            )}
          </RadixTable.Body>
        </RadixTable.Root>
      </div>
    </Box>
  );
}

export { Table };
