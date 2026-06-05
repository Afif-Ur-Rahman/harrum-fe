export interface Channel {
  allowInvites: boolean;
  categoryId: string | null;
  description: string | null;
  isActive: boolean;
  isArchived: boolean;
  lastMessage: unknown;
  lastMessageAt: string;
  memberCount: number;
  name: string;
  title: string;
  type: string;
  unread: number;
  members: Members[];
  updatedAt: string;
  createdAt: string;
  owner: {
    _id: string;
    fullName: string;
    email: string;
    image: string | undefined;
    username: string | null;
  };
  __v: number;
  _id: string;
}
export interface Members {
  _id: string;
  username: string;
  image: string | null;
  email: string | null;
}

export interface Message {
  timestamp: number;
  attachments?: [];
  channelId: string;
  createdAt: string;
  isEdited: boolean;
  text: string;
  messageType?: string;
  content: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
    image: string | null;
    username: string | null;
  };
  status?: string;
  updatedAt?: string;
  user: {
    _id: string;
    name: string;
    avatar: string | null;
  };
  __v?: number;
  _id: string;
}

export interface ChannelResponse {
  success: boolean;
  channels: Channel[];
}
