"use client";

import { Button, Flex } from "@radix-ui/themes";

import { cn } from "@/utils";

interface DataTablePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

const DataTablePagination = ({
  total,
  page: currentPage,
  pageSize,
  onPageSizeChange,
}: DataTablePaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (!total) return null;

  return (
    <Flex align="center" justify="end" gap={"2"} className="mt-4 mb-2 w-full">
      <Button
        onClick={() => onPageSizeChange(currentPage - 1)}
        disabled={currentPage === 1 || total === 0}
        className="rounded-2 h-8 w-8 text-white"
      >
        &lt;
      </Button>

      {pages.map(page => (
        <Button
          key={page}
          onClick={() => onPageSizeChange(page)}
          className={cn(
            "rounded-2 flex h-8 w-8 items-center justify-center border",
            page === currentPage ? "bg-pp-blue text-white" : "border-gray-10 text-gray-6 bg-white",
          )}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageSizeChange(currentPage + 1)}
        disabled={currentPage === totalPages || total === 0}
        className="rounded-2 h-8 w-8 text-white"
      >
        &gt;
      </Button>
    </Flex>
  );
};

export { DataTablePagination };
