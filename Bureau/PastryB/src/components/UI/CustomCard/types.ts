export type Category = { _id: string; tag: string };

export interface CustomCardProps {
  _id: string;
  title: string;
  date: string;
  image?: string;
  description: string;
  content: string;
  isLinkShown: boolean;
  categories?: Category[];
}
