export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    nodeInformation: any;
    activity: any;
    xPos?: number;
    yPos?: number;
    nodeTitle?: string;
    [propName: string]: any;
  };
}
