// aliases
export interface FeaturedRecipesProps {
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
