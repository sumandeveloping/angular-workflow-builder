export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    xPos?: number;
    yPos?: number;
    [propName: string]: string | number | any;
  };
}
