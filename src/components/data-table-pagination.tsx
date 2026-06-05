'use client'

import { cn } from '@/utils'
import { Button, Flex } from '@radix-ui/themes'

interface DataTablePaginationProps {
  total: number
  page: number
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
}

const DataTablePagination = ({
  total,
  page: currentPage,
  pageSize,
  onPageSizeChange,
}: DataTablePaginationProps) => {
  const totalPages = Math.ceil(total / pageSize)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  if (!total) return null

  return (
    <Flex align="center" justify="end" gap={'2'} className="mb-2 mt-4 w-full">
      <Button
        onClick={() => onPageSizeChange(currentPage - 1)}
        disabled={currentPage === 1 || total === 0}
        className="text-white h-8 w-8 rounded-2"
      >
        &lt;
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageSizeChange(page)}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-2 border',
            page === currentPage
              ? 'bg-pp-blue text-white'
              : 'bg-white border-gray-10 text-gray-6',
          )}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageSizeChange(currentPage + 1)}
        disabled={currentPage === totalPages || total === 0}
        className="text-white h-8 w-8 rounded-2"
      >
        &gt;
      </Button>
    </Flex>
  )
}

export { DataTablePagination }
