import { Text, Tooltip } from "@radix-ui/themes";

import { cn } from "@/utils";

interface BlockLabelProps {
  name?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  isTooltip?: boolean;
  required?: boolean;
  tooltipContent?: string;
}

const BlockLabel = ({
  name,
  orientation = "horizontal",
  className,
  children,
  isTooltip = false,
  required = false,
  tooltipContent,
}: React.PropsWithChildren<BlockLabelProps>) => {
  const labelContent = (
    <Text
      as="label"
      htmlFor={name}
      className={cn("flex text-[12px] text-nowrap", className, {
        "min-h-(--chip-height)": orientation === "horizontal",
      })}
    >
      {children}
      {required ? <Text className="text-red-9 ml-0.5 text-[12px]">*</Text> : null}
    </Text>
  );

  return isTooltip ? (
    <Tooltip content={tooltipContent ?? ""}>{labelContent}</Tooltip>
  ) : (
    labelContent
  );
};

export { BlockLabel };
