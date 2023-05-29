// hook import
import { useEffect, useState } from "react";
// component import
import Chip from "@mui/material/Chip";
// styled component import
import { ListItem, StyledPaper } from "./style";
import { TagsListProps } from "./types";
import { Tag } from "../../../global/types";

// Component
const TagsList: React.FC<TagsListProps> = ({ onTagDelete, list }) => {
  const [chipData, setChipData] = useState<Tag[]>([]);

  const handleDelete = (chipToDelete: Tag) => () => {
    if (onTagDelete) {
      setChipData((chips) =>
        chips.filter((chip) => chip._id !== chipToDelete._id)
      );
      onTagDelete(chipToDelete);
    }
  };

  useEffect(() => {
    list && setChipData(list);
  }, [list]);

  return (
    <StyledPaper elevation={0} component="ul">
      {chipData?.length > 0 &&
        chipData.map((data) => {
          if (data._id && data.tag) {
            return (
              <ListItem key={data._id}>
                <Chip
                  sx={{ fontSize: "0.95rem" }}
                  label={data.tag}
                  onDelete={onTagDelete && handleDelete(data)}
                />
              </ListItem>
            );
          }
          return null;
        })}
    </StyledPaper>
  );
};

export default TagsList;
