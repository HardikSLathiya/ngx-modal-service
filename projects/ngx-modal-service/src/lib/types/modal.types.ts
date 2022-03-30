export interface ModalOptions {
  height?: number;
  maxHeight?: number;
  width?: number;
  index?: number;
  backdrop?: boolean;
  backdropDismiss?: boolean;
  top?: number,
  bottom?: number,
  left?: number,
  right?: number
  borderColor?: string;
}

export interface ModalResponse {
  success: boolean;
  result: any;
}
