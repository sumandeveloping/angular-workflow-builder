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
import { DynamicComponentConfig } from 'src/shared/interfaces/configOptions.interface';
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
  linesMap = new Map<string, any>();
  displayModal: boolean = false;
  nodeDate = {
    parentIndex: null,
    isChildComponentCall: null,
  };
  removeSubscriptions: Subscription;
  sendSubscriptions: Subscription;
  linesSubscriptions: Subscription;

  /* -------------------------------------------------------------------------- */
  /*                                    DATA RELATED STUFF                                    */
  /* -------------------------------------------------------------------------- */
  connections: NodeConnections[] = []; // need to send this to BACKEND while SAVING
  activities = new Map<string, any>(); // need to send this to BACKEND while SAVING
  activityState: { state: any; type: string };
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

  public async createComponent(configOptions: DynamicComponentConfig) {
    const {
      isChildComponentCall,
      componentLabel,
      parentComponent,
      parentElementRef,
      parentIndex,
    } = configOptions;
    // this.container.clear();
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
    //Get position from dynamic component
    this.sendSubscriptions = dynamicComponent.instance.sendPosition.subscribe(
      async (data: {
        x: number;
        y: number;
        componentId?: string;
        isChild?: boolean;
      }) => {
        this.positionSubscriptionsHandler(data);
      }
    );

    //Get connected lines
    this.linesSubscriptions = dynamicComponent.instance.sendLines.subscribe(
      (linesObj: { componentId: string; line: any; label: string }) => {
        this.lineSubscriptionsHandler(linesObj);
      }
    );

    this.removeSubscriptions = dynamicComponent.instance.removeItem.subscribe(
      async (componentId: string) => {
        this.removeComponentHandler(componentId, dynamicComponent);
        await this.removeInvalidLines();
        this.removeInvalidChildComponents();
        this.removeInvalidsourceActivity(componentId);
      }
    );
  }

  //position subscriptions
  positionSubscriptionsHandler = (positionConfig: {
    x: number;
    y: number;
    componentId?: string;
    isChild?: boolean;
  }) => {
    let { x, y, componentId, isChild } = positionConfig;
    this.populateActivity(componentId, x, y);
    this.xCoOrdinates.push(x);
    this.YCoOrdinates.push(y);
    if (isChild)
      this.coOrdinatesOfChildComponents.push({
        x,
        y,
        childComponentID: componentId,
        isChild: isChild,
      });
    //Save X & Y coordinates of dynamic components into `dynamicComponentsObj` hash (both parent and child components)
    this.dynamicComponentsObj[componentId].xPos = x;
    this.dynamicComponentsObj[componentId].yPos = y;
  };

  lineSubscriptionsHandler = (lineConfig: {
    componentId: string;
    line: any;
    label: string;
  }) => {
    const { componentId, line, label } = lineConfig;
    if (label)
      line.setOptions({
        middleLabel: label,
      });

    this.linesMap.set(componentId, line);
  };

  removeComponentHandler(
    componentId: string,
    dynamicComponent: ComponentRef<SingleBlockComponent>
  ) {
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
      const childIds: string[] = this.dynamicComponentsObj[componentId].childs;
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
      const childIds: string[] = this.dynamicComponentsObj[componentId].childs;
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
  }

  removeInvalidChildComponents = () => {
    setTimeout(() => {
      this.components.forEach(
        async (component: ComponentRef<SingleBlockComponent>, index: any) => {
          if (
            component.instance.parentElementRef &&
            component.instance.parentElementRef.nativeElement.offsetHeight ===
              0 &&
            component.instance.parentElementRef.nativeElement.offsetLeft ===
              0 &&
            component.instance.parentElementRef.nativeElement.offsetTop === 0 &&
            component.instance.parentElementRef.nativeElement.offsetWidth ===
              0 &&
            component.instance.parentElementRef.nativeElement.offsetParent ===
              null
          ) {
            component.destroy();
            this.components.splice(index, 1);
            //remove from `activities`
            this.activities.delete(component.instance.componentId);
            await this.removeInvalidLines();
            return this.removeInvalidChildComponents();
          }
        }
      );
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

  removeInvalidsourceActivity = (componentId: string) => {
    this.connections = this.connections.filter(
      (item) =>
        item.sourceActivityId != componentId &&
        item.destinationActivityId != componentId
    );
  };

  showModal = (e: any) => {
    this.nodeDate = {
      parentIndex: null,
      isChildComponentCall: false,
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
    console.log('childNode', childNode);
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
      }, 400);
    });
  };

  onAdd = (e: any) => {
    this.activityState = {
      state: e,
      type: this.selectedNode.childNodeNameType,
    };
    this.closeModal();
    this.createComponent({ isChildComponentCall: false });
  };

  populateActivity = async (componentID: string, x: number, y: number) => {
    this.activities.set(componentID, {
      ...this.activities.get(componentID),
      ...{ id: componentID, x, y },
    });
    this.dynamicComponentsObj[componentID].activity = {
      ...this.activities.get(componentID),
    };
  };

  //SAVE builder
  onSaveWorkFlowBuilder = () => {
    let multiTouchCampaignConfig: { activities: any[]; connections: any[] } = {
      activities: [],
      connections: [],
    };
    let activities: any[] = [];
    for (const activity of this.activities.values()) {
      activities.push(activity);
    }

    multiTouchCampaignConfig.connections = this.connections;
    multiTouchCampaignConfig.activities = activities;

    const saveData = { multiTouchCampaignConfig };
    console.log('Data to be sended to Backend', saveData);
    //add toaster upon error/success
  };

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
