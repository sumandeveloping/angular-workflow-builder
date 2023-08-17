export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    nodeInformation: object;
    activity: any;
    xPos?: number;
    yPos?: number;
    [propName: string]: any;
  };
}
