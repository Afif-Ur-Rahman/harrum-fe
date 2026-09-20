import {
  Building2,
  Palette,
  Ruler,
  Type,
  Shapes,
  ShoppingCart,
  Store,
  BadgeDollarSign,
  Hash,
  Truck,
} from "lucide-react";

type FieldType = "text" | "number" | "select";

interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface StockItemField {
  name: string;
  type: FieldType;
  placeholder: string;
  icon?: React.ElementType;
  required?: boolean;
  options?: FieldOption[];
  showWhen?: (values: Record<string, string>) => boolean;
}

interface VariantField {
  name: string;
  type: FieldType;
  placeholder: string;
  icon?: React.ElementType;
}

export const NO_COLOR_VARIANT_TYPES = ["perfume", "body_spray", "accessories"];

export const STOCK_ITEM_FIELDS: StockItemField[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Name",
    icon: Type,
    required: true,
  },
  {
    name: "brand",
    type: "text",
    placeholder: "Brand",
    icon: Building2,
    required: true,
  },
  {
    name: "vendor",
    type: "select",
    placeholder: "Select vendor",
    icon: Truck,
    required: true,
    options: [],
  },
  {
    name: "type",
    type: "select",
    placeholder: "Type",
    options: [
      {
        label: "Cotton",
        value: "cotton",
      },
      {
        label: "Wash & Wear",
        value: "wash_and_wear",
      },
      {
        label: "Latha",
        value: "latha",
      },
      {
        label: "Shawl",
        value: "shawl",
      },
      {
        label: "Perfume",
        value: "perfume",
      },
      {
        label: "Body Spray",
        value: "body_spray",
      },
      {
        label: "Accessories",
        value: "accessories",
      },
    ],
    icon: Shapes,
    required: true,
  },
  {
    name: "size",
    type: "select",
    placeholder: "Size",
    options: [
      {
        label: "Meters",
        value: "meters",
      },
      {
        label: "Pieces",
        value: "pcs",
      },
      {
        label: "Gaz",
        value: "gz",
      },
    ],
    icon: Ruler,
    required: true,
  },
  {
    name: "quantity",
    type: "number",
    placeholder: "0",
    icon: Hash,
    required: true,
    showWhen: (values) => NO_COLOR_VARIANT_TYPES.includes(values.type),
  },
  {
    name: "purchasePrice",
    type: "number",
    placeholder: "Purchase price",
    icon: ShoppingCart,
    required: true,
  },
  {
    name: "wholesalePrice",
    type: "number",
    placeholder: "Wholesale price",
    icon: Store,
    required: true,
  },
  {
    name: "salePrice",
    type: "number",
    placeholder: "Sale price",
    icon: BadgeDollarSign,
    required: true,
  },
];

export const VARIANT_FIELDS: VariantField[] = [
  {
    name: "color",
    type: "text",
    placeholder: "Color",
    icon: Palette,
  },
  {
    name: "quantity",
    type: "number",
    placeholder: "0",
    icon: undefined,
  },
];

export const STOCK_TYPE_OPTIONS: FieldOption[] =
  STOCK_ITEM_FIELDS.find((field) => field.name === "type")?.options ?? [];

export const PRICE_TYPE_OPTIONS = [
  { label: "Purchase price", value: "purchase" },
  { label: "Wholesale price", value: "wholesale" },
  { label: "Sale price", value: "sale" },
] as const;

export type PriceFilterType = (typeof PRICE_TYPE_OPTIONS)[number]["value"];
