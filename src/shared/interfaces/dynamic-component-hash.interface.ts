export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    nodeInformation: object;
    activity: object;
    xPos?: number;
    yPos?: number;
    [propName: string]: any;
  };
}
