import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SingleBlockComponent } from 'src/shared/components/single-block/single-block.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.scss'],
})
export class WorkflowBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('builderStartPoint', { read: ElementRef })
  builderStartPoint: ElementRef;
  @ViewChild('dynamicComponentWrapper', { read: ElementRef, static: false })
  dynamicComponentWrapper: ElementRef;
  @ViewChild('dynamicComponents', { read: ViewContainerRef })
  container: ViewContainerRef;
  components: ComponentRef<SingleBlockComponent>[] = [];
  componentsFromRoot: ComponentRef<SingleBlockComponent>[] = [];
  dynamicComponentsObj: any = {};
  xCoOrdinates: number[] = [];
  YCoOrdinates: number[] = [];
  coOrdinatesOfChildComponents: {
    childComponentID: string;
    x: number;
    y: number;
    isChild?: boolean;
  }[] = [];
  linesArr: any[] = [];
  removeSubscriptions: Subscription;
  sendSubscriptions: Subscription;
  linesSubscriptions: Subscription;

  constructor() {} // private cdr: ChangeDetectorRef // private viewContainer: ViewContainerRef,

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public createComponent(
    e: any,
    isChildComponentCall: boolean = false,
    parentElementRef?: ElementRef,
    parentIndex?: number,
    parentComponent?: SingleBlockComponent
  ) {
    // console.log('parentIndex', parentIndex, parentElementRef);
    // this.container.clear();
    const dynamicComponent: ComponentRef<SingleBlockComponent> =
      this.container.createComponent<SingleBlockComponent>(
        SingleBlockComponent
      );
    // console.log('Created!!', dynamicComponent.hostView);
    const newComponentId = uuidv4();
    dynamicComponent.setInput('isCreatedFromChild', isChildComponentCall);
    dynamicComponent.setInput('componentId', newComponentId);
    if (parentIndex !== null || parentIndex !== undefined) {
      dynamicComponent.setInput('parentIndex', parentIndex);
      dynamicComponent.setInput('parentElementRef', parentElementRef);
      dynamicComponent.setInput('parentDynamicComponent', parentComponent);
    }
    this.components.push(dynamicComponent);
    dynamicComponent.setInput(
      'index',
      this.components.indexOf(dynamicComponent)
    );
    //ADD logic for hashing components ID ** Important **
    this.dynamicComponentsObj[newComponentId] = {
      parentComponentId: '',
      childs: [],
      connecters: [],
    };
    if (isChildComponentCall) {
      this.dynamicComponentsObj[parentComponent.componentId].childs.push(
        newComponentId
      );
      this.dynamicComponentsObj[newComponentId].parentComponentId =
        parentComponent.componentId;
    } else {
      this.componentsFromRoot.push(dynamicComponent);
    }
    //Get position from dynamic component
    this.sendSubscriptions = dynamicComponent.instance.sendPosition.subscribe(
      (data: {
        x: number;
        y: number;
        componentId?: string;
        isChild?: boolean;
      }) => {
        console.log('position received', data);
        this.xCoOrdinates.push(data.x);
        this.YCoOrdinates.push(data.y);
        if (data.isChild)
          this.coOrdinatesOfChildComponents.push({
            x: data.x,
            y: data.y,
            childComponentID: data.componentId,
            isChild: data.isChild,
          });
        console.log(
          'component Position 💥',
          this.xCoOrdinates,
          this.YCoOrdinates,
          'IsChild??',
          data?.isChild,
          this.coOrdinatesOfChildComponents
        );
      }
    );

    //Get connected lines
    this.linesSubscriptions = dynamicComponent.instance.sendLines.subscribe(
      (lines) => {
        this.linesArr.push(lines);
        console.log('Lines added', this.linesArr);
      }
    );

    // this.cdr.detectChanges();
    this.removeSubscriptions = dynamicComponent.instance.removeItem.subscribe(
      (componentId: string) => {
        // this.linesArr.forEach((line) => {
        //   console.log('line removing', line), line.remove();
        // });
        console.log('componentId should be removed', componentId);
        this.components = this.components.filter(
          (component) => component.instance.componentId !== componentId
        );
        this.componentsFromRoot = this.componentsFromRoot.filter(
          (component) => component.instance.componentId !== componentId
        );
        //remove child components
        const parentComponentID =
          this.dynamicComponentsObj[componentId].parentComponentId;

        if (parentComponentID !== '' || parentComponentID !== null) {
          delete this.dynamicComponentsObj[componentId];
        }
        if (this.dynamicComponentsObj[parentComponentID]) {
          const childComponentsOfParentComponents =
            this.dynamicComponentsObj[parentComponentID].childs;
          this.dynamicComponentsObj[parentComponentID].childs =
            childComponentsOfParentComponents.filter(
              (id: string) => id !== componentId
            );
        }
        //remove child component coOrdinates
        this.coOrdinatesOfChildComponents =
          this.coOrdinatesOfChildComponents.filter(
            (data) => data.childComponentID !== componentId
          );
        dynamicComponent.destroy();
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.removeSubscriptions.unsubscribe();
    this.sendSubscriptions.unsubscribe();
    this.linesSubscriptions.unsubscribe();
    this.components.forEach((component: ComponentRef<SingleBlockComponent>) => {
      component.destroy();
    });
  }
}
