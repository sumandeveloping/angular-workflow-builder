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
import { nodeProperties } from 'src/shared/json/node-data.model';
import { MULTITOUCH_NODE_RULES } from 'src/shared/json/node-rule.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from '../modal/modal.component';

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
  @ViewChild('modalDialog') modalDialog: ModalComponent;
  @Input() index: number;
  @Input() componentId: string;
  @Input() isCreatedFromChild: boolean = false;
  @Input() nodeInformation: any;
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
  position: {
    x: number;
    y: number;
    componentId?: string;
    isChild?: boolean;
  };
  displayModal: boolean = false;
  showModalForm: boolean = false;
  nodeDate = {
    event: null,
    parentIndex: null,
    isChildrComponentCall: null,
  };
  filterNodeCategories: any[] = [
    {
      name: 'All',
      value: 'ALL',
    },
    {
      name: 'Action',
      value: 'ACTION',
    },
    {
      name: 'Decision',
      value: 'DECISION',
    },
  ];
  filterText: string = 'ALL';
  /* -------------------------------------------------------------------------- */
  /*                 FOR Data related stuff                                     */
  /* -------------------------------------------------------------------------- */
  activityState: { state: any };
  nodeDetails: any;
  childNodesToConnect: any;
  actionNodesToConnect: any;
  decisionNodesToConnect: any;
  nodeType: string; // truthy / falsy / null
  nodeCategory: any; // action / decision / null
  nodeProperties: any[];
  nodeModel: any;
  nodeModelForExistingNodeEdit: any;
  nodeRules: any[];
  displayNode: boolean = false; //for modal
  loading: boolean = false; //for modal
  selectedNode: any = {}; //for modal
  disableModalSave: boolean = true;

  constructor(
    private parentComponent: WorkflowBuilderComponent,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    console.log('On INIT ⬇️', this.parentComponent.dynamicComponentsObj);
    console.log('nodeInformation', this.nodeInformation);
    this.nodeProperties = nodeProperties;
    this.nodeRules = MULTITOUCH_NODE_RULES;
    const nodesArr = this.nodeRules.filter(
      (node) => node.parentNodeName == this.nodeInformation.childNodeName
    );
    console.log('nodesArr', nodesArr);
    this.nodeDetails = nodesArr?.[0];
    console.log('nodeDetails', this.nodeDetails);
    this.nodeType = this.nodeDetails.parentNodeType;
    this.nodeCategory = this.nodeDetails.parentNodeCategory;
    this.childNodesToConnect = this.nodeDetails.childNodeIds;
    this.actionNodesToConnect = this.childNodesToConnect.filter(
      (node: any) => node.childNodeCategory === 'ACTION'
    );
    this.decisionNodesToConnect = this.childNodesToConnect.filter(
      (node: any) => node.childNodeCategory === 'DECISION'
    );
  }
  ngAfterViewInit(): void {
    //Set Dynamic Position of the components
    this.setDynamicPosition(this.isCreatedFromChild, this.parentElementRef);
    //Creating Line between the components === After dynamic positioning are in place *Important*
    this.renderLinesBetweenComponents();
    // adding css styles
    // this.renderer.addClass(
    //   this.decisionBlock.nativeElement,
    //   `box-border box-border-actions`
    // );
    this.renderer.setAttribute(
      this.decisionBlock.nativeElement,
      'class',
      `dynamic-component card box-border box-border-${this.nodeCategory.toLowerCase()}`
    );
  }

  addComponent(): void {
    this.displayModal = !this.displayModal;
    this.parentComponent.createComponent(
      this.nodeDate.event,
      this.nodeDate.isChildrComponentCall,
      this.decisionBlock,
      this.nodeDate.parentIndex,
      this
    );
  }

  deleteComponent(): void {
    this.parentComponent.linesArr = this.parentComponent.linesArr.filter(
      (item) => item._id != this.line._id
    );
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
    console.log(
      'CALLED FROM PARENT COMPONENT',
      this.parentComponent.componentsFromRoot.length
    );
    let topPosition: any;
    const componentWidth = this.decisionBlock.nativeElement.offsetWidth;
    const offsetLeft = this.decisionBlock.nativeElement.offsetLeft;
    const dynamicComponentWrapperWidth =
      this.parentComponent.dynamicComponentWrapper.nativeElement.offsetWidth;
    //we need to divide the width of the dynamicComponentWrapper to center the dynamic component

    //* 1. evaluate x & y
    const leftPosition =
      +(dynamicComponentWrapperWidth / 2).toFixed(2) -
      componentWidth * this.parentComponent.componentsFromRoot.length +
      componentWidth / 2;
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

  renderLinesBetweenComponents(): void {
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
  }

  onDragStart(e: any) {
    // console.log('drag Started', e);
  }

  onDragOver(e: any) {
    this.parentComponent.linesArr.forEach((line) => {
      line.position();
    });
  }

  showModal = (e: any, parentIndex: number, isChildrComponentCall: boolean) => {
    this.nodeDate = {
      event: e,
      parentIndex: parentIndex,
      isChildrComponentCall: isChildrComponentCall,
    };
    this.displayModal = !this.displayModal;
    setTimeout(() => {
      this.modalDialog.showModal();
    }, 0);
  };

  closeModal = () => {
    this.modalDialog ? this.modalDialog.closeModal() : null;
  };

  onSelectChildNodeDisplayProperties = async (e: Event, childNode: any) => {
    e.preventDefault();
    console.log('childNode display', childNode);
    this.selectedNode = childNode;
    //get the properties of the child node & display...
    this.displayNode = false;
    this.loading = true;
    this.spinner.show('nodePropertyLoader');
    await this.displayNodeProperties();
    this.displayNode = true;
    this.loading = false;
    this.disableModalSave = false;
  };

  displayNodeProperties = async () => {
    return new Promise((resolve, reject) => {
      const tempModel = this.nodeProperties.find(
        (x) => x.displayName === this.selectedNode.childNodeName
      );
      tempModel ? (this.nodeModel = tempModel.model) : (this.nodeModel = {});
      setTimeout(() => {
        this.spinner.hide('nodePropertyLoader');
        resolve(true);
      }, 2000);
    });
  };

  openModalWithNodeProps = async (e: any) => {
    await this.displayNodeInformationsForEdit();
    this.showModalForm = true;
    this.displayModal = true;
    setTimeout(() => {
      this.modalDialog.showModal();
    }, 0);
  };

  displayNodeInformationsForEdit = async () => {
    return new Promise((resolve) => {
      const tempModel = this.nodeProperties.find(
        (x) => x.displayName === this.nodeInformation.childNodeName
      );
      tempModel
        ? (this.nodeModelForExistingNodeEdit = tempModel.model)
        : (this.nodeModelForExistingNodeEdit = {});
      const savedFormData = this.parentComponent.activities.get(
        this.componentId
      ).state;
      for (const key in this.nodeModelForExistingNodeEdit) {
        // this.nodeModelForExistingNodeEdit[key].value = savedFormData[key];
        //making dropdown visible as per the saved value
        if (
          this.nodeModelForExistingNodeEdit[key]?.linkValue ===
          savedFormData[this.nodeModelForExistingNodeEdit[key]?.link]
        ) {
          this.nodeModelForExistingNodeEdit[key].hidden = false;
          this.nodeModelForExistingNodeEdit[key].value = savedFormData[key];
        } else {
          this.nodeModelForExistingNodeEdit[key].hidden = true;
          this.nodeModelForExistingNodeEdit[key].value = '';
        }
      }
      resolve(true);
    });
  };

  onAdd = (e) => {
    this.activityState = { state: e };
    console.log('e🙌', e, this.activityState);
    this.closeModal();
    this.addComponent();
  };

  onEditNodeDetails = (data) => {
    console.log('data on edit', data);
    const preVNodeDetails = this.parentComponent.activities.get(
      this.componentId
    );
    console.log('prevNodeDetails', preVNodeDetails);
    this.parentComponent.activities.set(this.componentId, {
      ...preVNodeDetails,
      state: { ...data },
    });
    console.log(
      'Updated node details',
      this.parentComponent.activities.get(this.componentId)
    );
    // NEED TO ADD SUCCESS TOASTER AFTER SUCCESSFUL NODE DETAILS UPDATE
    this.closeModal();
  };

  onFilterChange = (filterTerm: string) => {
    console.log('filterText', filterTerm);
    this.filterText = filterTerm;
    this.displayNode = false;
    this.selectedNode = {};
  };
}
