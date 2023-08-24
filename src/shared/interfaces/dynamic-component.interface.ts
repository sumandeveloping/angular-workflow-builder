import { ElementRef } from '@angular/core';

export interface DynamicComponent {
  addComponent?(label: string, nodeOutcome?: string | null): void | any;
  addComponentOnEdit?(
    isEditRendering: boolean,
    label: string,
    nodeOutcome: string | any,
    editComponentId?: string
  ): void | any;
  deleteComponent(): void | any;
  dynamicPositionOfParentComponents(): void;
  dynamicPositionOfChildComponents(parentElementRef: ElementRef): void;
  onDragStart(event: any | MouseEvent | Event): void;
  // onDragOver(event: any | MouseEvent | Event): void;
  onDragEnd?(event: any | MouseEvent | Event): void;
  onDragMoveEnd(
    event: { x: number; y: number },
    data: { isCreatedFromChild: boolean; componentId: string }
  ): void;
}
