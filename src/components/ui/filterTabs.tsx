// components/FilterTabs.tsx
import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import React from "react";

interface FilterTabsProps {
  options: { label: string; count: number }[];
  selected: string;
  onSelect: (value: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ options, selected, onSelect }) => {
  return (
    <ScrollArea size="1" type="auto" scrollbars="horizontal" style={{ height: 60 }} my="4">
      <Flex gap="3">
        {options.map(option => (
          <Box key={option.label}>
            <button
              onClick={() => onSelect(option.label)}
              className={`${
                selected === option.label ? "bg-black text-white" : "bg-white text-black"
              } rounded-full border border-black px-3 py-1 text-nowrap capitalize! ${
                option.count !== 0
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-50"
              }`}
            >
              {option.label} - {option.count}
            </button>
          </Box>
        ))}
      </Flex>
    </ScrollArea>
  );
};

export default FilterTabs;
