export interface childComponentConfig {
  childComponentID: string;
  x: number;
  y: number;
  isChild?: boolean;
  [propName: string]: string | number | boolean;
}
