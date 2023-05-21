// aliases
export interface FeaturedCardsProps {
  recipes:
    | {
        _id: string;
        image?: string;
        title: string;
        date: string;
        description: string;
        content: string;
      }[]
    | [];
}
