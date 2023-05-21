export interface SimpleModalContentProps {
  title: string;
  description: string | null;
  onValidate: () => void;
  onCancel: () => void;
}
