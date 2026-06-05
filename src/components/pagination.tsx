"use client";

import { Button, Flex } from "@radix-ui/themes";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    let startPage = 1;

    if (totalPages <= 3) {
      startPage = 1;
    } else if (currentPage === 1) {
      startPage = 1;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
    } else {
      startPage = currentPage - 1;
    }

    const pagesToShow = Math.min(3, totalPages);
    for (let i = 0; i < pagesToShow; i++) {
      pages.push(startPage + i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);

  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" align="center" gap="2" className="pt-4">
      <Button
        variant="soft"
        size="2"
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;&lt;
      </Button>
      <Button
        variant="soft"
        size="2"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </Button>

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "solid" : "soft"}
          size="2"
          onClick={() => onPageChange(page)}
          className="min-w-10"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="soft"
        size="2"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </Button>
      <Button
        variant="soft"
        size="2"
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;&gt;
      </Button>
    </Flex>
  );
};