import { Building2, Palette, Ruler, Tag, Type, Coins } from "lucide-react";

type FieldType = "text" | "number" | "select";

interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface StockItemField {
  name: string;
  label: string;
  type: FieldType;
  placeholder: string;
  icon?: React.ElementType;
  options?: FieldOption[];
}

interface VariantField {
  name: string;
  label: string;
  type: FieldType;
  placeholder: string;
  icon?: React.ElementType;
}

export const STOCK_ITEM_FIELDS: StockItemField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Name",
    icon: Type,
  },
  {
    name: "brand",
    label: "Brand",
    type: "text",
    placeholder: "Brand",
    icon: Building2,
  },
  {
    name: "size",
    label: "Size",
    type: "select",
    placeholder: "Size",
    options: [
      {
        label: "Meter(s)",
        value: "meter(s)",
      },
    ],
    icon: Ruler,
  },
  {
    name: "purchasePrice",
    label: "Purchase Price",
    type: "number",
    placeholder: "Purchase price",
    icon: Coins,
  },
  {
    name: "wholesalePrice",
    label: "Wholesale",
    type: "number",
    placeholder: "Wholesale price",
    icon: Coins,
  },
  {
    name: "salePrice",
    label: "Sale",
    type: "number",
    placeholder: "Sale price",
    icon: Tag,
  },
];

export const VARIANT_FIELDS: VariantField[] = [
  {
    name: "color",
    label: "Color",
    type: "text",
    placeholder: "Color",
    icon: Palette,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "0",
    icon: undefined,
  },
];
