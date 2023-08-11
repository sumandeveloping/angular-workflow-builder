import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
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

declare var bootstrap: any;

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
  linesMap = new Map<string, any>();
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
  connections: NodeConnections[] = []; // need to send this to BACKEND while SAVING
  activities = new Map<string, any>(); // need to send this to BACKEND while SAVING
  activityState: { state: any };
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

  constructor(
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    this.NodeNameType = NodeNameType;
  }

  ngOnInit(): void {
    this.initializeNodeInformation();
  }

  ngAfterViewInit(): void {
    this.showModal({});
    this.cdr.detectChanges();
  }

  initializeNodeInformation() {
    this.nodeProperties = nodeProperties;
    this.nodeRules = MULTITOUCH_NODE_RULES;
    this.parentNodeArr = this.nodeRules.filter(
      (node) => node.parentNodeName == 'null' && node.parentNodeId == 'null'
    );
    this.nodeInformation = this.parentNodeArr[0];
    this.nodeType = this.nodeInformation.parentNodeType;
    this.nodeCategory = this.nodeInformation.parentNodeCategory;
    this.childNodesToConnect = this.nodeInformation.childNodeIds;
  }

  public async createComponent(
    e: any,
    isChildComponentCall: boolean = false,
    componentLabel: string,
    parentElementRef?: ElementRef,
    parentIndex?: number,
    parentComponent?: SingleBlockComponent
  ) {
    // this.container.clear();
    console.log('YOLOOOOO', parentComponent?.activityState);

    const dynamicComponent: ComponentRef<SingleBlockComponent> =
      this.container.createComponent<SingleBlockComponent>(
        SingleBlockComponent
      );

    const newComponentId = uuidv4();
    dynamicComponent.setInput('isCreatedFromChild', isChildComponentCall);
    dynamicComponent.setInput('componentId', newComponentId);
    dynamicComponent.setInput('lineLabel', componentLabel);

    //ADD logic for hashing components ID ** Important **
    this.dynamicComponentsObj[newComponentId] = {
      parentComponentId: '',
      childs: [],
      connecters: [],
      nodeInformation: {},
      activity: {},
    };
    if (isChildComponentCall) {
      dynamicComponent.setInput('parentIndex', parentIndex);
      dynamicComponent.setInput('parentElementRef', parentElementRef);
      dynamicComponent.setInput('parentDynamicComponent', parentComponent);
      dynamicComponent.setInput(
        'nodeInformation',
        parentComponent.selectedNode
      );
      //store the component connections for backend -- need to send this while saving * Important
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
      /* -------------------------------------------------------------------------- */
      /*                                     xx                                     */
      /* -------------------------------------------------------------------------- */
      // storing information in dynamicComponentsObj Hash
      this.dynamicComponentsObj[parentComponent.componentId].childs.push(
        newComponentId
      );
      this.dynamicComponentsObj[newComponentId].parentComponentId =
        parentComponent.componentId;
      this.dynamicComponentsObj[newComponentId].nodeInformation =
        parentComponent.selectedNode;
      // store activity to send to the BACKEND
      this.activities.set(newComponentId, { ...parentComponent.activityState });
      this.dynamicComponentsObj[newComponentId].activity = {
        ...parentComponent.activityState,
      };
    } else {
      //if created from root component (i.e segment)
      dynamicComponent.setInput('nodeInformation', this.selectedNode);
      // storing information in dynamicComponentsObj Hash
      this.dynamicComponentsObj[newComponentId].nodeInformation =
        this.selectedNode;
      this.componentsFromRoot.push(dynamicComponent);
      // store activity to send to the BACKEND
      this.activities.set(newComponentId, {
        ...this.activityState,
        blocking: false,
        executed: false,
        faulted: false,
      });
      this.dynamicComponentsObj[newComponentId].activity = {
        ...this.activityState,
        blocking: false,
        executed: false,
        faulted: false,
      };
    }
    this.components.push(dynamicComponent);
    dynamicComponent.setInput(
      'index',
      this.components.indexOf(dynamicComponent)
    );
    //Get position from dynamic component
    this.sendSubscriptions = dynamicComponent.instance.sendPosition.subscribe(
      async (data: {
        x: number;
        y: number;
        componentId?: string;
        isChild?: boolean;
      }) => {
        let { x, y, componentId, isChild } = data;
        console.log(
          'component Position 💥🔥',
          data,
          'isChild',
          isChild,
          this.activityState
        );
        this.populateActivity(componentId, x, y);
        this.xCoOrdinates.push(x);
        this.YCoOrdinates.push(y);
        if (data.isChild)
          this.coOrdinatesOfChildComponents.push({
            x,
            y,
            childComponentID: componentId,
            isChild: isChild,
          });
        console.log(
          'this.coOrdinatesOfChildComponents',
          this.coOrdinatesOfChildComponents
        );
        //Save X & Y coordinates of dynamic components into `dynamicComponentsObj` hash (both parent and child components)
        this.dynamicComponentsObj[data.componentId].xPos = x;
        this.dynamicComponentsObj[data.componentId].yPos = y;
      }
    );

    //Get connected lines
    this.linesSubscriptions = dynamicComponent.instance.sendLines.subscribe(
      (linesObj: { componentId: string; line: any; label: string }) => {
        const { componentId, line, label } = linesObj;
        label
          ? linesObj.line.setOptions({
              endPlug: 'hand',
              middleLabel: label,
            })
          : line.setOptions({ endPlug: 'disc' });
        this.linesMap.set(componentId, line);
      }
    );

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
        //remove components activity
        this.activities.delete(componentId);
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
      this.linesMap.forEach((line, key, map) => {
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
            ? (line.remove(), this.linesMap.delete(key))
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
    this.displayModal = true;
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
      // this.displayModal = false;
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
    this.activityState = { state: e };
    this.closeModal();
    this.createComponent(this.nodeDate.event, false, 'Label');
    let myToastEl = document.getElementById('liveToast');
    let toast = new bootstrap.Toast(myToastEl, { delay: 5000 });
    toast.show();
  };

  populateActivity = async (componentID: string, x: number, y: number) => {
    console.log('ACTIVITY SETUP', this.activities.get(componentID));
    this.activities.set(componentID, {
      ...this.activities.get(componentID),
      ...{ id: componentID, x, y },
    });
    this.dynamicComponentsObj[componentID].activity = {
      ...this.activities.get(componentID),
    };
    console.log(
      'activity🤖',
      this.activities.values(),
      this.dynamicComponentsObj
    );
  };

  // // Additional
  // showToast = (e: Event) => {};

  ngOnDestroy(): void {
    if (this.removeSubscriptions) this.removeSubscriptions.unsubscribe();
    if (this.sendSubscriptions) this.sendSubscriptions.unsubscribe();
    if (this.linesSubscriptions) this.linesSubscriptions.unsubscribe();
    this.components.forEach((component: ComponentRef<SingleBlockComponent>) => {
      component.destroy();
    });
    this.linesMap.forEach((line, key, map) => {
      line.remove();
      map.delete(key);
    });
  }
}
