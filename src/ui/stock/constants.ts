import {
  BadgeDollarSign,
  Building2,
  Hash,
  Palette,
  Ruler,
  Tag,
  Type,
} from "lucide-react";

export const STOCK_ITEM_FIELDS = [
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
    name: "article",
    label: "Article",
    type: "text",
    placeholder: "Article",
    icon: Hash,
  },
  {
    name: "size",
    label: "Size",
    type: "text",
    placeholder: "Size e.g. meter(s)",
    icon: Ruler,
  },
  {
    name: "wholesalePrice",
    label: "Wholesale",
    type: "number",
    placeholder: "Wholesale price",
    icon: BadgeDollarSign,
  },
  {
    name: "salePrice",
    label: "Sale",
    type: "number",
    placeholder: "Sale price",
    icon: Tag,
  },
] as const;

export const VARIANT_FIELDS = [
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
] as const;
