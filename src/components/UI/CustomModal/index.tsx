// component import
import { Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
// styled component import
import { StyledCard, StyledIconButton } from "./style";
import { CustomModalProps } from "./types";

// Component
const CustomModal: React.FC<CustomModalProps> = ({ isOpen, setIsOpen, children }) => {
  return (
    <Modal open={isOpen}>
      <StyledCard>
        <StyledIconButton onClick={() => setIsOpen(false)}>
          <Close />
        </StyledIconButton>
        {children}
      </StyledCard>
    </Modal>
  );
};

export default CustomModal;
