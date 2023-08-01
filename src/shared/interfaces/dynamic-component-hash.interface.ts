export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    xPos?: number;
    yPos?: number;
    nodeInformation: object;
    [propName: string]: string | number | any;
  };
}
