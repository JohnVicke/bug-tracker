export interface Card {
  tags?: string[];
  content: string;
  id: number;
}

export interface Column {
  name: string;
  id: string;
  cards: Card[];
}
