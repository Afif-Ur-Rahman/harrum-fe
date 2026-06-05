export interface CartItemType {
  itemId: string;
  productId: string;
  name: string;
  variant: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  image: string;
}
