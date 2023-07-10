export interface dynamicComponentHash {
  [propName: string]: {
    parentComponentId: string;
    childs: string[];
    connecters: any[];
    xPos?: number;
    yPos?: number;
    // sourceActivityId: string | any;
    // destinationActivityId: string | any;
    // outcome?: string;
    // sourceActivityNameType: string | any;
    // destinationActivityNameType: string | any;
    [propName: string]: string | number | any;
  };
}
