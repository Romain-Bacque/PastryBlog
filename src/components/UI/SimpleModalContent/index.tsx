// component import
import { Button, Typography, CardContent } from "@mui/material";
// styled component import
import { StyledCardActions, StyledDivider } from "./style";
import { SimpleModalContentProps } from "./types";

const SimpleModalContent: React.FC<SimpleModalContentProps> = ({
  title,
  description,
  onValidate,
  onCancel,
}) => {
  return (
    <CardContent>
      <Typography id="modal-modal-title" variant="h5" component="h2">
        {title}
      </Typography>
      {description && (
        <Typography m="1rem 0" id="modal-modal-description" mt={2}>
          {description}
        </Typography>
      )}
      <StyledDivider light />
      <StyledCardActions>
        <Button sx={{ color: "white" }} onClick={onValidate} size="large">
          Valider
        </Button>
        <Button variant="outlined" onClick={onCancel} size="large">
          Annuler
        </Button>
      </StyledCardActions>
    </CardContent>
  );
};

SimpleModalContent.defaultProps = {
  description: null,
};

export default SimpleModalContent;
