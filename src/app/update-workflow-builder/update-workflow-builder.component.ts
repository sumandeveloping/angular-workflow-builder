import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/shared/components/modal/modal.component';
import { SingleBlockComponent } from 'src/shared/components/single-block/single-block.component';
import { UpdateSingleBlockComponent } from 'src/shared/components/update-single-block/update-single-block.component';
import { childComponentConfig } from 'src/shared/interfaces/child-component-config.interface';
import { DynamicComponentEditConfig } from 'src/shared/interfaces/configOptions.interface';
import { dynamicComponentHash } from 'src/shared/interfaces/dynamic-component-hash.interface';
import { NodeConnections } from 'src/shared/interfaces/node-config.interface';
import { nodeProperties } from 'src/shared/json/node-data.model';
import { MULTITOUCH_NODE_RULES } from 'src/shared/json/node-rule.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-update-workflow-builder',
  templateUrl: './update-workflow-builder.component.html',
  styleUrls: ['./update-workflow-builder.component.scss'],
})
export class UpdateWorkflowBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('builderStartPoint', { read: ElementRef })
  builderStartPoint: ElementRef;
  @ViewChild('dynamicComponentWrapper', { read: ElementRef, static: false })
  dynamicComponentWrapper: ElementRef;
  @ViewChild('dynamicComponents', { read: ViewContainerRef })
  container: ViewContainerRef;
  @ViewChild('modalDialog') modalDialog: ModalComponent;
  components: ComponentRef<UpdateSingleBlockComponent>[] = [];
  componentsFromRoot: ComponentRef<UpdateSingleBlockComponent>[] = [];
  xCoOrdinates: number[] = [];
  YCoOrdinates: number[] = [];
  coOrdinatesOfChildComponents: childComponentConfig[] = [];
  linesMap = new Map<string, any>();
  displayModal: boolean = false;
  nodeDate = {
    event: null,
    parentIndex: null,
    isChildComponentCall: null,
  };
  removeSubscriptions: Subscription;
  sendSubscriptions: Subscription;
  linesSubscriptions: Subscription;
  // =========================
  builderID: string;
  dynamicComponentsObj: dynamicComponentHash = {
    '686456a0-6c0d-48be-9987-346dc56e714c': {
      parentComponentId: '',
      childs: ['99819ba5-3317-424d-8358-60cd02bb579b'],
      connecters: [],
      nodeInformation: {
        id: 'UUID-segment',
        childNodeName: 'Segment',
        childNodeNameType: 'segment',
        parentNodeCategory: 'ACTION',
      },
      activity: {
        state: {
          sources: 'CL',
          segmentList: null,
          campaignList: 'CL1',
        },
        blocking: false,
        executed: false,
        faulted: false,
      },
      xPos: 634.5,
      yPos: 100,
    },
    '99819ba5-3317-424d-8358-60cd02bb579b': {
      parentComponentId: '686456a0-6c0d-48be-9987-346dc56e714c',
      childs: [
        'a22bde8c-b97e-4fdd-857e-ff5a069cbf9f',
        'a6c6b0f1-67b9-4122-8438-287fc5d0b18e',
      ],
      connecters: [],
      nodeInformation: {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeCategory: 'ACTION',
      },
      activity: {
        state: {
          name: 'Demo Email',
          executeThisEvent: 'immediately',
          intervalValue: null,
          intervalUnit: null,
          date: null,
          subject: 'Demo Subject',
          senderName: 'Suman',
          emailToSend: 'email 1',
        },
      },
      xPos: 509.5,
      yPos: 188,
    },
    'a22bde8c-b97e-4fdd-857e-ff5a069cbf9f': {
      parentComponentId: '99819ba5-3317-424d-8358-60cd02bb579b',
      childs: ['6c65fcff-0c79-437b-8d77-524f95d88df3'],
      connecters: [],
      nodeInformation: {
        id: 'UUID-openEmail',
        childNodeName: 'Open Email',
        childNodeNameType: 'openEmail',
        childNodeCategory: 'DECISION',
      },
      activity: {
        state: {
          name: 'Opening an Email',
        },
      },
      xPos: 509.5,
      yPos: 276,
    },
    'a6c6b0f1-67b9-4122-8438-287fc5d0b18e': {
      parentComponentId: '99819ba5-3317-424d-8358-60cd02bb579b',
      childs: [],
      connecters: [],
      nodeInformation: {
        id: 'UUID-downloadAsset',
        childNodeName: 'Download Asset',
        childNodeNameType: 'downloadAsset',
        childNodeCategory: 'DECISION',
      },
      activity: {
        state: {
          name: 'Downloading Asset',
          limitToAsset: '90e777da-42e7-423c-81a1-3e0b2a61f3c9',
        },
      },
      xPos: 259.5,
      yPos: 276,
    },
    '6c65fcff-0c79-437b-8d77-524f95d88df3': {
      parentComponentId: 'a22bde8c-b97e-4fdd-857e-ff5a069cbf9f',
      childs: [],
      connecters: [],
      nodeInformation: {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        nodeType: 'Truthy',
        childNodeCategory: 'ACTION',
      },
      activity: {
        state: {
          name: 'Test Email',
          executeThisEvent: 'immediately',
          intervalValue: null,
          intervalUnit: null,
          date: null,
          subject: 'Test Subject',
          senderName: 'Suman Tapader',
          emailToSend: 'email 2',
          decisionOutcome: 'positive',
        },
      },
      xPos: 509.5,
      yPos: 364,
    },
  };
  componentsToRender: any[] = [];

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
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.builderID = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.initializeNodeInformation();
  }

  ngAfterViewInit(): void {
    this.renderDynamicComponents();
    this.cdr.detectChanges();
  }

  initializeNodeInformation() {
    for (const key in this.dynamicComponentsObj) {
      this.componentsToRender.push({
        componentId: key,
        ...this.dynamicComponentsObj[key],
      });
    }
    console.log('componentsToRender 👽', this.componentsToRender);
    // node rules
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

  renderDynamicComponents = async (): Promise<void> => {
    for (const comp of this.componentsToRender) {
      if (!comp.parentComponentId) {
        this.selectedNode =
          this.dynamicComponentsObj[comp.componentId].nodeInformation;
        await this.createComponent({
          isChildComponentCall: false,
          isEditRendering: true,
          editComponentId: comp.componentId,
        });
      }
    }
  };

  public async createComponent(configOptions: DynamicComponentEditConfig) {
    const {
      isChildComponentCall,
      componentLabel,
      parentComponent,
      parentElementRef,
      parentIndex,
      isEditRendering,
      editComponentId,
    } = configOptions;
    const dynamicComponent: ComponentRef<UpdateSingleBlockComponent> =
      this.container.createComponent<UpdateSingleBlockComponent>(
        UpdateSingleBlockComponent
      );

    let newComponentId: string;
    dynamicComponent.setInput('isCreatedFromChild', isChildComponentCall);
    dynamicComponent.setInput('lineLabel', componentLabel);
    /* -------------------------------------------------------------------------- */
    /*    Two block is =>  `isEditRendering` & `!isEditRendering`            
      Inside these two block there will be another two blocks
      Another Two block is => `isChildComponentCall`   & `!isChildComponentCall`                                           */
    /* -------------------------------------------------------------------------- */
    if (isEditRendering) {
      //It means dynamic components are created based on the previously stored data (i.e, dynamicComponentsObj Hash)
      newComponentId = editComponentId;
      dynamicComponent.setInput('componentId', editComponentId);
      dynamicComponent.setInput('isEditRendering', isEditRendering);

      if (isChildComponentCall) {
        this.activities.set(editComponentId, {
          ...this.dynamicComponentsObj[editComponentId].activity,
        });
      } else if (!isChildComponentCall) {
        this.componentsFromRoot.push(dynamicComponent);
        this.activities.set(editComponentId, {
          ...this.dynamicComponentsObj[editComponentId].activity,
        });
      }
    } else if (!isEditRendering) {
      //it means when new dynamic components are created *Manually* clicking on the Modal
      newComponentId = uuidv4();
      dynamicComponent.setInput('componentId', newComponentId);
      dynamicComponent.setInput('isEditRendering', isEditRendering);
      this.dynamicComponentsObj[newComponentId] = {
        parentComponentId: '',
        childs: [],
        connecters: [],
        nodeInformation: {},
        activity: {},
      };
      //irrespective of `isEditRendering` value
      if (isChildComponentCall) {
        this.dynamicComponentsObj[parentComponent.componentId].childs.push(
          newComponentId
        );
        this.dynamicComponentsObj[newComponentId].parentComponentId =
          parentComponent.componentId;
        this.dynamicComponentsObj[newComponentId].nodeInformation =
          parentComponent.selectedNode;
        // store activity to send to the BACKEND
        this.activities.set(newComponentId, {
          ...parentComponent.activityState,
        });
        //set property on Dynamic components
      } else if (!isChildComponentCall) {
        this.componentsFromRoot.push(dynamicComponent);
        this.activities.set(newComponentId, {
          ...this.activityState,
          blocking: false,
          executed: false,
          faulted: false,
        });
      }
    }
    // irrespective of `isEditRendering` value
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
    //saving index and raw components
    this.components.push(dynamicComponent);
    dynamicComponent.setInput(
      'index',
      this.components.indexOf(dynamicComponent)
    );

    //Get position from dynamic component
    this.sendSubscriptions = dynamicComponent.instance.sendPosition.subscribe(
      (data: {
        x: number;
        y: number;
        componentId?: string;
        isChild?: boolean;
        isEditRendering?: boolean;
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
    isEditRendering?: boolean;
  }) => {
    let { x, y, componentId, isChild, isEditRendering } = positionConfig;
    this.populateActivity(componentId, x, y, isEditRendering);
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
    if (!isEditRendering) {
      this.dynamicComponentsObj[componentId].xPos = x;
      this.dynamicComponentsObj[componentId].yPos = y;
    }
  };
  //Get connected lines
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
    dynamicComponent: ComponentRef<UpdateSingleBlockComponent>
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
        async (
          component: ComponentRef<UpdateSingleBlockComponent>,
          index: any
        ) => {
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
      event: e,
      parentIndex: null,
      isChildComponentCall: false,
    };
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
      }, 400);
    });
  };

  onAdd = (e: any) => {
    this.activityState = { state: e };
    this.closeModal();
    this.createComponent({
      isChildComponentCall: false,
      isEditRendering: false,
    });
  };

  populateActivity = async (
    componentID: string,
    x: number,
    y: number,
    isEditRendering: boolean
  ) => {
    this.activities.set(componentID, {
      ...this.activities.get(componentID),
      ...{ id: componentID, x, y },
    });
    if (!isEditRendering) {
      this.dynamicComponentsObj[componentID].activity = {
        ...this.activities.get(componentID),
      };
    }
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
    this.components.forEach(
      (component: ComponentRef<UpdateSingleBlockComponent>) => {
        component.destroy();
      }
    );
    this.linesMap.forEach((line, key, map) => {
      line.remove();
      map.delete(key);
    });
  }
}
