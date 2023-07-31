import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/shared/components/modal/modal.component';
import { SingleBlockComponent } from 'src/shared/components/single-block/single-block.component';
import { NodeNameType } from 'src/shared/enums/nodeName-type.enum';
import { childComponentConfig } from 'src/shared/interfaces/child-component-config.interface';
import { dynamicComponentHash } from 'src/shared/interfaces/dynamic-component-hash.interface';
import { NodeConnections } from 'src/shared/interfaces/node-config.interface';
import { nodeProperties } from 'src/shared/json/node-data.model';
import { MULTITOUCH_NODE_RULES } from 'src/shared/json/node-rule.model';
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
  @ViewChild('modalDialog') modalDialog: ModalComponent;
  components: ComponentRef<SingleBlockComponent>[] = [];
  componentID: string;
  componentsFromRoot: ComponentRef<SingleBlockComponent>[] = [];
  dynamicComponentsObj: dynamicComponentHash = {};
  xCoOrdinates: number[] = [];
  YCoOrdinates: number[] = [];
  NodeNameType: typeof NodeNameType;
  coOrdinatesOfChildComponents: childComponentConfig[] = [];
  linesArr: any[] = [];
  displayModal: boolean = false;
  nodeDate = {
    event: null,
    parentIndex: null,
    isChildrComponentCall: null,
  };
  removeSubscriptions: Subscription;
  sendSubscriptions: Subscription;
  linesSubscriptions: Subscription;

  /* -------------------------------------------------------------------------- */
  /*                                    DATA RELATED STUFF                                    */
  /* -------------------------------------------------------------------------- */
  connections: NodeConnections[] = [];
  activities: any[] = [];
  showSegmentModal: boolean = false;
  parentNodeArr: any[];
  nodeInformation: any;
  nodeType: string; // truthy / falsy / null
  nodeCategory: any; // action / decision / null
  childNodesObj: any;
  childNodesToConnect: any;
  nodeProperties: any[];
  nodeModel: any;
  nodeRules: any[];
  displayNode: boolean = false; //for modal
  loading: boolean = false; //for modal
  selectedNode: any = {}; //for modal
  disableModalSave: boolean = true;

  constructor(private spinner: NgxSpinnerService) {
    this.NodeNameType = NodeNameType;
  } // private cdr: ChangeDetectorRef // private viewContainer: ViewContainerRef,

  ngOnInit(): void {
    this.nodeProperties = nodeProperties;
    this.nodeRules = MULTITOUCH_NODE_RULES;
    this.parentNodeArr = this.nodeRules.filter(
      (node) => node.parentNodeName === 'Segment'
    );
    // this.nodeInformation = this.parentNodeArr[0];
    // console.log('Node Info', this.nodeInformation);
    // this.nodeType = this.nodeInformation.parentNodeType;
    // this.nodeCategory = this.nodeInformation.parentNodeCategory;
    // this.childNodesToConnect = this.nodeInformation.childNodeIds;
    //modification
    this.parentNodeArr = this.nodeRules.filter(
      (node) => node.parentNodeName == 'null' && node.parentNodeId == 'null'
    );
    this.nodeInformation = this.parentNodeArr[0];
    console.log('Node Info', this.nodeInformation);
    this.nodeType = this.nodeInformation.parentNodeType;
    this.nodeCategory = this.nodeInformation.parentNodeCategory;
    this.childNodesToConnect = this.nodeInformation.childNodeIds;
  }

  ngAfterViewInit(): void {
    this.showModal({});
  }

  public async createComponent(
    e: any,
    isChildComponentCall: boolean = false,
    parentElementRef?: ElementRef,
    parentIndex?: number,
    parentComponent?: SingleBlockComponent
  ) {
    // this.container.clear();
    const dynamicComponent: ComponentRef<SingleBlockComponent> =
      this.container.createComponent<SingleBlockComponent>(
        SingleBlockComponent
      );

    const newComponentId = uuidv4();
    dynamicComponent.setInput('isCreatedFromChild', isChildComponentCall);
    dynamicComponent.setInput('componentId', newComponentId);

    // if(isChildComponentCall){}
    // if (parentIndex !== null || parentIndex !== undefined)
    if (isChildComponentCall) {
      dynamicComponent.setInput('parentIndex', parentIndex);
      dynamicComponent.setInput('parentElementRef', parentElementRef);
      dynamicComponent.setInput('parentDynamicComponent', parentComponent);
      dynamicComponent.setInput(
        'nodeInformation',
        parentComponent.selectedNode
      );
      //store the component connections for backend
      const connectionObj = {
        sourceActivityId: parentComponent.componentId,
        destinationActivityId: newComponentId,
        outcome: 'Action 1',
        sourceActivityNameType:
          parentComponent.nodeInformation.childNodeNameType,
        destinationActivityNameType:
          parentComponent.selectedNode.childNodeNameType,
      };
      this.connections.push(connectionObj);
      console.log('this.connections 🔥', this.connections);
    } else {
      //if created from root component (i.e segment)
      dynamicComponent.setInput('nodeInformation', this.selectedNode);
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
      // sourceActivityId: '',
      // sourceActivityNameType: '',
      // outcomeType: '',
      // destinationActivityId: '',
      // destinationActivityNameType: '',
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
      async (data: {
        x: number;
        y: number;
        componentId?: string;
        isChild?: boolean;
      }) => {
        console.log('component Position 💥', data, 'isChild', data.isChild);
        await this.populateActivity(data.componentId, data.x, data.y);
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
          'this.coOrdinatesOfChildComponents',
          this.coOrdinatesOfChildComponents
        );
        //Save X & Y coordinates of dynamic components into `dynamicComponentsObj` hash (both parent and child components)
        this.dynamicComponentsObj[data.componentId].xPos = data.x;
        this.dynamicComponentsObj[data.componentId].yPos = data.y;
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
      async (componentId: string) => {
        console.log('componentId should be removed', componentId);
        this.components = this.components.filter(
          (component) => component.instance.componentId !== componentId
        );
        this.componentsFromRoot = this.componentsFromRoot.filter(
          (component) => component.instance.componentId !== componentId
        );
        //remove child components & its config from `dynamicComponentsObj`
        const parentComponentID =
          this.dynamicComponentsObj[componentId].parentComponentId;

        if (parentComponentID) {
          const childIds: string[] =
            this.dynamicComponentsObj[componentId].childs;
          childIds.forEach((childId: string) => {
            delete this.dynamicComponentsObj[childId];
            this.coOrdinatesOfChildComponents =
              this.coOrdinatesOfChildComponents.filter(
                (data) => data.childComponentID !== childId
              );
          });
          delete this.dynamicComponentsObj[componentId];
        } else if (parentComponentID === '' || parentComponentID === null) {
          // childs components should be removed if parent gets deleted
          const childIds: string[] =
            this.dynamicComponentsObj[componentId].childs;
          childIds.forEach((childId: string) => {
            delete this.dynamicComponentsObj[childId];
            this.coOrdinatesOfChildComponents =
              this.coOrdinatesOfChildComponents.filter(
                (data) => data.childComponentID !== childId
              );
          });
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
        //remove child component coOrdinates from `coOrdinatesOfChildComponents`
        this.coOrdinatesOfChildComponents =
          this.coOrdinatesOfChildComponents.filter(
            (data) => data.childComponentID !== componentId
          );
        //atlast destroy child component
        dynamicComponent.destroy();
        await this.removeInvalidLines();
        this.removeInvalidChildComponents();
      }
    );
  }

  removeInvalidChildComponents = () => {
    setTimeout(() => {
      this.components.forEach(async (componet: any, index: any) => {
        if (
          componet.instance.parentElementRef &&
          componet.instance.parentElementRef.nativeElement.offsetHeight === 0 &&
          componet.instance.parentElementRef.nativeElement.offsetLeft === 0 &&
          componet.instance.parentElementRef.nativeElement.offsetTop === 0 &&
          componet.instance.parentElementRef.nativeElement.offsetWidth === 0 &&
          componet.instance.parentElementRef.nativeElement.offsetParent === null
        ) {
          componet.destroy();
          this.components.splice(index, 1);
          await this.removeInvalidLines();
          return this.removeInvalidChildComponents();
        }
      });
    }, 0);
  };

  removeInvalidLines = () => {
    return new Promise((resolve) => {
      this.linesArr.forEach((line: any, index: any) => {
        if (line) {
          (line.start.offsetHeight === 0 &&
            line.start.offsetLeft === 0 &&
            line.start.offsetTop === 0 &&
            line.start.offsetWidth === 0 &&
            line.start.offsetParent === null) ||
          (line.end.offsetHeight === 0 &&
            line.end.offsetLeft === 0 &&
            line.end.offsetTop === 0 &&
            line.end.offsetWidth === 0 &&
            line.end.offsetParent === null)
            ? (line.remove(), this.linesArr.splice(index, 1))
            : null;
          resolve(true);
        }
        resolve(true);
      });
    });
  };

  showModal = (e: any) => {
    this.nodeDate = {
      event: e,
      parentIndex: null,
      isChildrComponentCall: false,
    };
    this.displayModal = !this.displayModal;
    setTimeout(() => {
      this.modalDialog.showModal();
    }, 0);
  };

  openSegmentModal = (e: any) => {
    this.showSegmentModal = true;
    this.displayModal = !this.displayModal;
    setTimeout(() => {
      this.modalDialog.showModal();
    }, 0);
  };

  closeModal = () => {
    if (this.modalDialog) {
      this.modalDialog.closeModal();
      this.displayModal = false;
    }
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
      }, 1000);
    });
  };

  onAdd = (e) => {
    console.log('e🙌', e);
    this.closeModal();
    this.createComponent(this.nodeDate.event);
  };

  populateActivity = async (componentID: string, x: number, y: number) => {
    let obj = {};
    obj['id'] = componentID;
    obj['x'] = x;
    obj['y'] = y;
    this.activities.push(obj);
    console.log('activity🤖', this.activities);
  };

  ngOnDestroy(): void {
    this.removeSubscriptions.unsubscribe();
    this.sendSubscriptions.unsubscribe();
    this.linesSubscriptions.unsubscribe();
    this.components.forEach((component: ComponentRef<SingleBlockComponent>) => {
      component.destroy();
    });
  }
}
