export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}