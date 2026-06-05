export interface MentionedProduct {
  _id: string;
  title: string;
  images: string[];
  variants: { name: string; price: number }[];
  description: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  mentionedProducts?: MentionedProduct[];
}

export interface PendingOrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface SendMessageResponse {
  conversationId: string;
  reply: string;
  orderReady?: boolean;
  pendingOrder?: PendingOrderItem[];
  isVoice?: boolean;
  mentionedProducts?: MentionedProduct[];
}
