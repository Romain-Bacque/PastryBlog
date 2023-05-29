import { Tag } from "../../../global/types";

// interfaces
export interface TagsListProps {
  onTagDelete?: (arg: Tag) => void;
  list?: Tag[];
}
