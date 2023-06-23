import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { WorkflowBuilderComponent } from 'src/app/workflow-builder/workflow-builder.component';
import { DynamicComponent } from 'src/shared/interfaces/dynamic-component.interface';
import { LineOptions } from 'src/shared/interfaces/line-options.interface';

declare var LeaderLine: any;

@Component({
  selector: 'app-single-block',
  templateUrl: './single-block.component.html',
  styleUrls: ['./single-block.component.scss'],
})
export class SingleBlockComponent
  implements OnInit, AfterViewInit, DynamicComponent
{
  @ViewChild('decisionBlock', { read: ElementRef, static: true })
  decisionBlock: ElementRef;
  @Input() index: number;
  @Input() componentId: string;
  @Input() isCreatedFromChild: boolean = false;
  @Input() parentIndex: number;
  @Input() parentElementRef: ElementRef;
  @Input() parentDynamicComponent: SingleBlockComponent;
  @Output() removeItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendPosition: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendLines: EventEmitter<any> = new EventEmitter<any>();
  line: any;
  lineOptions: LineOptions = {
    color: 'grey',
    size: 2,
    path: 'fluid',
    startSocket: 'bottom',
    endSocket: 'top',
  };
  position: { x: number; y: number; componentId?: string; isChild?: boolean };

  constructor(
    private parentComponent: WorkflowBuilderComponent,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    console.log('On INIT', this.parentComponent.dynamicComponentsObj);
  }
  ngAfterViewInit(): void {
    //Set Dynamic Position of the components
    this.setDynamicPosition(this.isCreatedFromChild, this.parentElementRef);
    //Creating Line between the components === After dynamic positioning are in place *Important*
    if (!this.isCreatedFromChild) {
      this.line = new LeaderLine(
        this.parentComponent.builderStartPoint.nativeElement,
        this.decisionBlock.nativeElement,
        this.lineOptions
      );

      this.sendLines.emit(this.line);
    } else {
      // if dynamic components are created from another dynamic component
      this.line = new LeaderLine(
        this.parentElementRef.nativeElement,
        this.decisionBlock.nativeElement,
        this.lineOptions
      );

      this.sendLines.emit(this.line);
    }
    // adding css styles
    this.renderer.addClass(this.decisionBlock.nativeElement, 'box-border');
  }

  addComponent(
    e: any,
    parentIndex: number,
    isChildrComponentCall: boolean
  ): void {
    this.parentComponent.createComponent(
      e,
      isChildrComponentCall,
      this.decisionBlock,
      parentIndex,
      this
    );
  }

  deleteComponent(): void {
    this.removeItem.emit(this.componentId);
    this.line.remove();
  }

  //Set Dynamic positioning of the component
  private setDynamicPosition(
    isCreatedFromChild: boolean,
    parentElementRef: ElementRef
  ): void {
    console.log(
      'View initialized!!',
      this.decisionBlock.nativeElement.offsetLeft,
      this.decisionBlock.nativeElement.offsetTop,
      this.decisionBlock.nativeElement.offsetWidth,
      this.decisionBlock.nativeElement.offsetHeight
    );
    if (!isCreatedFromChild) {
      this.dynamicPositionOfParentComponents();
    } else {
      this.dynamicPositionOfChildComponents(parentElementRef);
    }
  }

  dynamicPositionOfParentComponents(): void {
    console.log('CALLED FROM PARENT COMPONENT');
    let topPosition: any;
    const componentWidth = this.decisionBlock.nativeElement.offsetWidth;
    const offsetLeft = this.decisionBlock.nativeElement.offsetLeft;
    const dynamicComponentWrapperWidth =
      this.parentComponent.dynamicComponentWrapper.nativeElement.offsetWidth;
    //we need to divide the width of the dynamicComponentWrapper to center the dynamic component

    //* 1. evaluate x & y
    const leftPosition =
      +(dynamicComponentWrapperWidth / 2).toFixed(2) -
      componentWidth * this.parentComponent.componentsFromRoot.length;
    console.log(
      'left Position',
      leftPosition,
      this.parentComponent.componentsFromRoot.length
    );
    this.renderer.setStyle(this.decisionBlock.nativeElement, 'top', '100px');
    if (leftPosition >= 0) {
      console.log('IF PART');
      this.renderer.setStyle(
        this.decisionBlock.nativeElement,
        'left',
        `${leftPosition}px`
      );
      //* save the coordinates  x & y
      this.position = {
        x: leftPosition,
        y: 100,
        componentId: this.componentId,
        isChild: false,
      };
    } else {
      console.log('ELSE PART');
      const marginFromTop = 20;
      topPosition =
        this.decisionBlock.nativeElement.offsetTop +
        this.decisionBlock.nativeElement.offsetHeight +
        marginFromTop;
      //check top position is available or not
      if (this.parentComponent.YCoOrdinates.indexOf(topPosition) === -1) {
        this.renderer.setStyle(
          this.decisionBlock.nativeElement,
          'top',
          `${topPosition}px`
        );
      } else {
        //increase Y position => Take highest top position from Ycordinates array
        // const prevTopPosition = this.parentComponent.YCoOrdinates.at(-1);
        const prevTopPosition = Math.max(...this.parentComponent.YCoOrdinates);

        alert(
          `prev Y position ${prevTopPosition} --- ${topPosition}, ${this.decisionBlock.nativeElement.offsetHeight}`
        );
        topPosition =
          prevTopPosition +
          marginFromTop +
          this.decisionBlock.nativeElement.offsetHeight;

        this.renderer.setStyle(
          this.decisionBlock.nativeElement,
          'top',
          `${topPosition}px`
        );
      }

      this.renderer.setStyle(
        this.decisionBlock.nativeElement,
        'left',
        `${this.decisionBlock.nativeElement.offsetLeft}px`
      );
      console.log('top position', topPosition);
      //* save the coordinates  x & y
      this.position = {
        x: this.decisionBlock.nativeElement.offsetLeft,
        y: topPosition,
        componentId: this.componentId,
        isChild: false,
      };
    }
    this.sendPosition.emit(this.position);
  }

  dynamicPositionOfChildComponents(parentElementRef: ElementRef): void {
    console.log('hiii CHILD component call');
    console.log(
      'testt',
      parentElementRef.nativeElement.offsetTop,
      parentElementRef.nativeElement.offsetHeight
    );
    const marginFromTop = 20;
    let topPosition =
      parentElementRef.nativeElement.offsetTop +
      parentElementRef.nativeElement.offsetHeight +
      marginFromTop;
    this.renderer.setStyle(
      this.decisionBlock.nativeElement,
      'top',
      `${topPosition}px`
    );
    //LEFT POSITION
    const componentWidth = this.decisionBlock.nativeElement.offsetWidth;
    const offsetLeft = this.decisionBlock.nativeElement.offsetLeft;
    const dynamicComponentWrapperWidth =
      this.parentComponent.dynamicComponentWrapper.nativeElement.offsetWidth;
    const parentComponentArry =
      this.parentComponent.dynamicComponentsObj[
        this.parentDynamicComponent.componentId
      ].childs;
    console.log('parentComponentArry', parentComponentArry);
    const leftPosition =
      +(dynamicComponentWrapperWidth / 2).toFixed(2) -
      componentWidth * parentComponentArry.length;
    console.log(
      'left Position',
      leftPosition,
      'component width',
      componentWidth
    );
    //filter out the same x axis childrens first as it will narrow down the filter.so filter with Y position first that means same row childrens
    let newLeftPosition: any;

    let sameRowChilds: number[]; //leftP [509, 259, 9.5]   // 509
    sameRowChilds = this.parentComponent.coOrdinatesOfChildComponents
      .filter((data: { x: number; y: number }) => data.y == topPosition)
      .map((data) => data.x);
    console.log('sameRowChilds', sameRowChilds, leftPosition);
    if (sameRowChilds.includes(leftPosition)) {
      // const takeLastUsedLeftPosition = Math.min(...sameRowChilds);//givest smallest value of left position
      // const index = sameRowChilds.indexOf(takeLastUsedLeftPosition) + 1;
      newLeftPosition =
        +(dynamicComponentWrapperWidth / 2).toFixed(2) -
        componentWidth * (sameRowChilds.length + 1);
      console.log('newLeftPostion✌️', newLeftPosition);
    } else {
      newLeftPosition = leftPosition;
      console.log('newLeftPostion💥', newLeftPosition);
    }

    //IF leftposition goes viewport of x axis
    if (newLeftPosition >= 0) {
      this.renderer.setStyle(
        this.decisionBlock.nativeElement,
        'left',
        `${newLeftPosition}px`
      );
      this.position = {
        x: newLeftPosition,
        y: topPosition,
        componentId: this.componentId,
        isChild: true,
      };
    } else {
      alert(`left position ${leftPosition}`);
      const marginFromTop = 20;
      topPosition =
        this.decisionBlock.nativeElement.offsetTop +
        this.decisionBlock.nativeElement.offsetHeight +
        marginFromTop;
      //check top position is available or not
      if (this.parentComponent.YCoOrdinates.indexOf(topPosition) === -1) {
        this.renderer.setStyle(
          this.decisionBlock.nativeElement,
          'top',
          `${topPosition}px`
        );
        alert(`topPosition ${topPosition}`);
      } else {
        //increase Y position => Take highest top position from Ycordinates array
        // const prevTopPosition = this.parentComponent.YCoOrdinates.at(-1);
        const prevTopPosition = Math.max(...this.parentComponent.YCoOrdinates);
        alert(
          `prev Y position ${prevTopPosition} --- ${topPosition}, ${this.decisionBlock.nativeElement.offsetTop}--- ${parentElementRef.nativeElement.offsetTop}`
        );
        topPosition =
          prevTopPosition +
          marginFromTop +
          this.decisionBlock.nativeElement.offsetHeight; //parentElementRef.nativeElement.offsetTop;

        this.renderer.setStyle(
          this.decisionBlock.nativeElement,
          'top',
          `${topPosition}px`
        );
      }
      this.renderer.setStyle(
        this.decisionBlock.nativeElement,
        'left',
        `${this.decisionBlock.nativeElement.offsetLeft}px`
      );
      console.log('offset top', this.decisionBlock.nativeElement.offsetTop);
      //* save the coordinates  x & y
      this.position = {
        x: this.decisionBlock.nativeElement.offsetLeft,
        y: topPosition,
        componentId: this.componentId,
        isChild: true,
      };
    }
    //send to parent component
    this.sendPosition.emit(this.position);
  }

  onDragStart(e: any) {
    // console.log('drag Started', e);
  }

  onDragOver(e: any) {
    this.parentComponent.linesArr.forEach((line) => {
      line.position();
    });
  }
}
