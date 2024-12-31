export interface EmailElement {
  type: string;
  content: string;
  styles: {
    [key: string]: string | number;
  };
}
