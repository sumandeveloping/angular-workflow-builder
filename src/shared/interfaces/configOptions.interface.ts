import { ElementRef } from '@angular/core';
import { SingleBlockComponent } from '../components/single-block/single-block.component';
import { UpdateSingleBlockComponent } from '../components/update-single-block/update-single-block.component';

interface ConfigOptions {
  isChildComponentCall: boolean;
  componentLabel?: string;
  parentElementRef?: ElementRef;
  parentIndex?: number;
}

export interface DynamicComponentConfig extends ConfigOptions {
  nodeOutcome: string | any;
  parentComponent?: SingleBlockComponent;
}

export interface DynamicComponentEditConfig extends ConfigOptions {
  nodeOutcome: string | any;
  parentComponent?: UpdateSingleBlockComponent;
  isEditRendering?: boolean;
  editComponentId?: string;
}
