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
  parentComponent?: SingleBlockComponent;
  nodeOutcome: string | unknown;
}

export interface DynamicComponentEditConfig extends ConfigOptions {
  parentComponent?: UpdateSingleBlockComponent;
  isEditRendering?: boolean;
  editComponentId?: string;
}
