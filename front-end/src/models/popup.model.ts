export interface Popup {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
