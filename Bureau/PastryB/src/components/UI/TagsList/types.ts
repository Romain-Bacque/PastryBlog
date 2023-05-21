// aliases
export type Category = { _id: string; tag: string };

// interfaces
export interface TagsListProps {
  onTagDelete?: (arg: Category) => void;
  list?: Category[];
}
