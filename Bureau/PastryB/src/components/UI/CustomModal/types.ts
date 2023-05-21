// interfaces
export interface CustomModalProps {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  children: JSX.Element | JSX.Element[];
}