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
import { DynamicComponentConfig } from 'src/shared/interfaces/configOptions.interface';

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
  @Input() lineLabel: string;
  @Input() nodeOutcome: string | any;
  @Input() nodeInformation: any;
  @Input() parentIndex: number;
  @Input() parentElementRef: ElementRef;
  @Input() parentDynamicComponent: SingleBlockComponent;
  @Output() removeItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendPosition: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendLines: EventEmitter<{
    componentId: string;
    line: any;
    label: string;
    color?: string;
  }> = new EventEmitter<{ componentId: string; line: any; label: string }>();
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
  nodeConnectorColorsHash = {
    positive: '#66FF00',
    negative: '#FF4F00',
  };
  /* -------------------------------------------------------------------------- */
  /*                 FOR Data related stuff                                     */
  /* -------------------------------------------------------------------------- */
  activityState: { state: any; type: string };
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
    this.initializeNodeInformation();
  }

  ngAfterViewInit(): void {
    this.initializeNodeInformationAfterViewInit();
  }

  initializeNodeInformation = () => {
    this.nodeProperties = nodeProperties;
    this.nodeRules = MULTITOUCH_NODE_RULES;
    const nodesArr = this.nodeRules.filter(
      (node) => node.parentNodeName == this.nodeInformation.childNodeName
    );
    this.nodeDetails = nodesArr?.[0];
    this.nodeType = this.nodeDetails.parentNodeType;
    this.nodeCategory = this.nodeDetails.parentNodeCategory;
    this.childNodesToConnect = this.nodeDetails.childNodeIds;
    this.actionNodesToConnect = this.childNodesToConnect.filter(
      (node: any) => node.childNodeCategory === 'ACTION'
    );
    this.decisionNodesToConnect = this.childNodesToConnect.filter(
      (node: any) => node.childNodeCategory === 'DECISION'
    );
  };

  initializeNodeInformationAfterViewInit = () => {
    //Set Dynamic Position of the components
    this.setDynamicPosition(this.isCreatedFromChild, this.parentElementRef);
    //Creating Line between the components === After dynamic positioning are in place *Important*
    this.renderLinesBetweenComponents();
    this.renderer.setAttribute(
      this.decisionBlock.nativeElement,
      'class',
      `dynamic-component card box-border box-border-${this.nodeCategory.toLowerCase()}`
    );
  };

  addComponent(label: string, nodeOutcome?: string | null): void {
    this.displayModal = !this.displayModal;
    const componentConfigurations: DynamicComponentConfig = {
      isChildComponentCall: this.nodeDate.isChildrComponentCall,
      componentLabel: label,
      parentElementRef: this.decisionBlock,
      parentIndex: this.nodeDate.parentIndex,
      parentComponent: this,
      nodeOutcome,
    };
    this.parentComponent.createComponent(componentConfigurations);
  }

  deleteComponent(): void {
    this.parentComponent.linesMap.delete(this.componentId);
    this.removeItem.emit(this.componentId);
    this.line.remove();
  }

  //Set Dynamic positioning of the component
  private setDynamicPosition(
    isCreatedFromChild: boolean,
    parentElementRef: ElementRef
  ): void {
    if (!isCreatedFromChild) {
      this.dynamicPositionOfParentComponents();
    } else {
      this.dynamicPositionOfChildComponents(parentElementRef);
    }
  }

  evaluateLeftPositionForParent = (
    dynamicComponentWrapperWidth: number,
    componentWidth: number
  ) => {
    return (
      +(dynamicComponentWrapperWidth / 2).toFixed(2) -
      componentWidth * this.parentComponent.componentsFromRoot.length +
      componentWidth / 2
    );
  };

  evaluateLeftPositionForChild = (
    dynamicComponentWrapperWidth: number,
    componentWidth: number,
    parentComponentArry: any
  ) => {
    return (
      +(dynamicComponentWrapperWidth / 2).toFixed(2) -
      componentWidth * parentComponentArry.length
    );
  };

  positionNodeFromMidToLeftForParent = (leftPosition: number) => {
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
  };

  positionNodeFromMidToLeftForChild = (
    newLeftPosition: number,
    topPosition: number
  ) => {
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
  };

  positionNodeNearLeftEdgeForParent = () => {
    let topPosition: any;
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
    //* save the coordinates  x & y
    this.position = {
      x: this.decisionBlock.nativeElement.offsetLeft,
      y: topPosition,
      componentId: this.componentId,
      isChild: false,
    };
  };

  positionNodeNearLeftEdgeForChild = () => {
    const marginFromTop = 20;
    let topPosition =
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
    //* save the coordinates  x & y
    this.position = {
      x: this.decisionBlock.nativeElement.offsetLeft,
      y: topPosition,
      componentId: this.componentId,
      isChild: true,
    };
  };

  dynamicPositionOfParentComponents(): void {
    const componentWidth = this.decisionBlock.nativeElement.offsetWidth;
    const offsetLeft = this.decisionBlock.nativeElement.offsetLeft;
    const dynamicComponentWrapperWidth =
      this.parentComponent.dynamicComponentWrapper.nativeElement.offsetWidth;
    //we need to divide the width of the dynamicComponentWrapper to center the dynamic component

    //* 1. evaluate x & y
    const leftPosition = this.evaluateLeftPositionForParent(
      dynamicComponentWrapperWidth,
      componentWidth
    );
    this.renderer.setStyle(this.decisionBlock.nativeElement, 'top', '100px');
    if (leftPosition >= 0) {
      this.positionNodeFromMidToLeftForParent(leftPosition);
    } else {
      this.positionNodeNearLeftEdgeForParent();
    }
    this.sendPosition.emit(this.position);
  }

  dynamicPositionOfChildComponents(parentElementRef: ElementRef): void {
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
    const leftPosition = this.evaluateLeftPositionForChild(
      dynamicComponentWrapperWidth,
      componentWidth,
      parentComponentArry
    );
    //filter out the same x axis childrens first as it will narrow down the filter.so filter with Y position first that means same row childrens
    let newLeftPosition: any;

    let sameRowChilds: number[]; //leftP [509, 259, 9.5]   // 509
    sameRowChilds = this.parentComponent.coOrdinatesOfChildComponents
      .filter((data: { x: number; y: number }) => data.y == topPosition)
      .map((data) => data.x);
    if (sameRowChilds.includes(leftPosition)) {
      // const takeLastUsedLeftPosition = Math.min(...sameRowChilds);//givest smallest value of left position
      // const index = sameRowChilds.indexOf(takeLastUsedLeftPosition) + 1;
      newLeftPosition =
        +(dynamicComponentWrapperWidth / 2).toFixed(2) -
        componentWidth * (sameRowChilds.length + 1);
    } else {
      newLeftPosition = leftPosition;
    }

    //IF leftposition goes viewport of x axis
    if (newLeftPosition >= 0) {
      this.positionNodeFromMidToLeftForChild(newLeftPosition, topPosition);
    } else {
      this.positionNodeNearLeftEdgeForChild();
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
    } else {
      // if dynamic components are created from another dynamic component
      this.line = new LeaderLine(
        this.parentElementRef.nativeElement,
        this.decisionBlock.nativeElement,
        this.lineOptions
      );
    }
    this.addOrUpdateLabel(this.nodeOutcome, this.lineLabel);
  }

  onDragStart(e: any) {}

  onDragOver(e: any) {
    this.parentComponent.linesMap.forEach((line, key, map) => {
      line.position();
    });
  }

  onDragMoveEnd(
    e: { x: number; y: number },
    data: { isCreatedFromChild: boolean; componentId: string }
  ) {
    const { x: clientX, y: clientY } = e;
    const { isCreatedFromChild: isChild, componentId } = data;
    const { prevX, prevY } = {
      prevX: this.parentComponent.dynamicComponentsObj[componentId].xPos,
      prevY: this.parentComponent.dynamicComponentsObj[componentId].yPos,
    };
    let currentX: number;
    let currentY: number;
    currentX = clientX + prevX;
    currentY = clientY + prevY;
    //step1. update dynamic components obj and its activity property (activity.x & activity.y too)
    this.parentComponent.dynamicComponentsObj[componentId].xPos = currentX;
    this.parentComponent.dynamicComponentsObj[componentId].yPos = currentY;
    const newActivity = {
      ...this.parentComponent.activities.get(componentId),
      x: currentX,
      y: currentY,
    };
    this.parentComponent.dynamicComponentsObj[componentId].activity =
      newActivity;
    //step2. save x & y in the activities object
    this.parentComponent.activities.set(componentId, newActivity);
    //step3. remove from xCoOrdinates & yCoOrdinates
    //remove old xPos
    this.parentComponent.xCoOrdinates =
      this.parentComponent.xCoOrdinates.filter(
        (xPos: number) => xPos !== prevX
      );
    //save new xPos
    this.parentComponent.xCoOrdinates.push(currentX);
    //remove old yPos
    this.parentComponent.YCoOrdinates =
      this.parentComponent.YCoOrdinates.filter(
        (yPos: number) => yPos !== prevY
      );
    //save new yPos
    this.parentComponent.YCoOrdinates.push(currentY);
    //step4. check if child component then remove from coOrdinatesOfChildComponents
    if (isChild)
      this.parentComponent.coOrdinatesOfChildComponents =
        this.parentComponent.coOrdinatesOfChildComponents.map((data) => {
          return data.childComponentID === componentId
            ? { ...data, x: currentX, y: currentY }
            : data;
        });
  }

  showModal = (e: any, parentIndex: number, isChildrComponentCall: boolean) => {
    this.selectedNode = {};
    this.displayNode = false;
    this.nodeDate = {
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
    this.selectedNode = childNode;
    console.log(
      'selected node childnode name',
      this.selectedNode.childNodeName,
      'parentNodeCategory',
      this.nodeDetails.parentNodeCategory
    );
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
      //remove value if there is any value in model
      if (tempModel) {
        for (const key in tempModel.model) {
          tempModel.model[key].value = '';
        }
        this.nodeModel = tempModel.model;
      } else {
        this.nodeModel = {};
      }
      this.nodeDetails.parentNodeCategory === 'DECISION' &&
      Object.keys(this.nodeModel).length > 0
        ? this.addDecisionOutcome(this.nodeModel)
        : null;
      setTimeout(() => {
        this.spinner.hide('nodePropertyLoader');
        resolve(true);
      }, 400);
    });
  };

  addDecisionOutcome = (obj: object) => {
    obj['decisionOutcome'] = {
      label: 'Take this action if previous decision outcome is',
      type: 'select',
      value: null,
      placeholder: '',
      hidden: false,
      rules: {
        required: true,
      },
      options: [
        {
          label: 'positive',
          value: 'positive',
        },
        {
          label: 'negative',
          value: 'negative',
        },
      ],
    };
  };

  openModalWithNodeProps = async (e: any) => {
    console.log(
      'while open modal with node prop filled data: ',
      this.nodeDetails.parentNodeCategory
    );
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

  onAdd = async (e) => {
    this.activityState = {
      state: e,
      type: this.selectedNode.childNodeNameType,
    };
    // decisionOutcome: "positive"
    const nodeOutcome = this.activityState.state?.decisionOutcome
      ? this.activityState.state?.decisionOutcome
      : null;
    // console.log('Node Outcome', nodeOutcome);

    this.closeModal();
    const label: any = await this.getLineLabel(e);
    this.addComponent(label, nodeOutcome);
  };

  getLineLabel = (nodeData: any) => {
    return new Promise((resolve) => {
      switch (nodeData.executeThisEvent) {
        case 'immediately':
          resolve('Immediately');
          break;
        case 'at a relative time period':
          resolve(
            `Send after ${nodeData.intervalValue} ${nodeData.intervalUnit}`
          );
          break;
        case 'at a specific date/time':
          resolve(`Send on ${nodeData.date}`);
          break;
        default:
          resolve('');
          break;
      }
      resolve('');
    });
  };

  onEditNodeDetailsSave = async (data: any) => {
    console.log('data on edit', data, data?.decisionOutcome);
    let nodeOutcome = data?.decisionOutcome;
    const preVNodeDetails = this.parentComponent.activities.get(
      this.componentId
    );
    this.parentComponent.activities.set(this.componentId, {
      ...preVNodeDetails,
      state: { ...data },
    });
    this.parentComponent.dynamicComponentsObj[this.componentId].activity = {
      ...this.parentComponent.activities.get(this.componentId),
    };
    const label: any = await this.getLineLabel(data);
    this.addOrUpdateLabel(nodeOutcome, label);
    // NEED TO ADD SUCCESS TOASTER AFTER SUCCESSFUL NODE DETAILS UPDATE
    this.closeModal();
  };

  addOrUpdateLabel = (nodeOutcome: string | any, label: string) => {
    console.log('addOrUpdateLabel triggered', label, nodeOutcome);
    let color = nodeOutcome
      ? this.nodeConnectorColorsHash[nodeOutcome]
      : '#d5d5d5';
    this.sendLines.emit({
      componentId: this.componentId,
      line: this.line,
      label: label,
      color,
    });
  };

  onFilterChange = (filterTerm: string) => {
    this.filterText = filterTerm;
    this.displayNode = false;
    this.selectedNode = {};
  };
}
