export interface LineOptions {
  color: string;
  size: number;
  path: string;
  startSocket: string;
  endSocket: string;
  [propName: string]: string | number | boolean;
}
