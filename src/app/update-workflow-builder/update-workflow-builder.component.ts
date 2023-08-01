import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/shared/components/modal/modal.component';
import { SingleBlockComponent } from 'src/shared/components/single-block/single-block.component';
import { UpdateSingleBlockComponent } from 'src/shared/components/update-single-block/update-single-block.component';
import { childComponentConfig } from 'src/shared/interfaces/child-component-config.interface';
import { dynamicComponentHash } from 'src/shared/interfaces/dynamic-component-hash.interface';
import { NodeConnections } from 'src/shared/interfaces/node-config.interface';
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
  // dynamicComponentsObj: dynamicComponentHash = {};
  xCoOrdinates: number[] = [];
  YCoOrdinates: number[] = [];
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
      xPos: 509.5,
      yPos: 364,
    },
  };
  componentsToRender: any[] = [];

  /* -------------------------------------------------------------------------- */
  /*                                    DATA RELATED STUFF                                    */
  /* -------------------------------------------------------------------------- */
  connections: NodeConnections[] = []; // need to send this to BACKEND while SAVING
  showSegmentModal: boolean = false;
  parentNodeArr: any[];
  nodeInformation: any;
  nodeType: string; // truthy / falsy / null
  nodeCategory: any; // action / decision / null
  childNodesObj: any;
  childNodesToConnect: any;
  nodeRules: any[];
  displayNode: boolean = false; //for modal
  loading: boolean = false; //for modal
  selectedNode: any = {}; //for modal
  disableModalSave: boolean = true;

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.builderID = this.activatedRoute.snapshot.queryParamMap.get('id');
    for (const key in this.dynamicComponentsObj) {
      this.componentsToRender.push({
        componentId: key,
        ...this.dynamicComponentsObj[key],
      });
    }
    console.log('componentsToRender 👽', this.componentsToRender);
    // node rules
    this.nodeRules = MULTITOUCH_NODE_RULES;
    this.parentNodeArr = this.nodeRules.filter(
      (node) => node.parentNodeName == 'null' && node.parentNodeId == 'null'
    );
    this.nodeInformation = this.parentNodeArr[0];
    console.log('Node Info', this.nodeInformation);
    this.nodeType = this.nodeInformation.parentNodeType;
    this.nodeCategory = this.nodeInformation.parentNodeCategory;
    this.childNodesToConnect = this.nodeInformation.childNodeIds;
    // new
  }

  ngAfterViewInit(): void {
    this.renderDynamicComponents();
  }

  renderDynamicComponents = async (): Promise<void> => {
    for (const comp of this.componentsToRender) {
      if (!comp.parentComponentId) {
        this.selectedNode =
          this.dynamicComponentsObj[comp.componentId].nodeInformation;
        console.log('selectedNode', comp.parentComponentId, this.selectedNode);
        await this.createComponent(false, true, comp.componentId);
      } else {
        // this.selectedNode =
        //   this.dynamicComponentsObj[comp.componentId].nodeInformation;
        // console.log('selectedNode', comp.parentComponentId, this.selectedNode);
        // // this.createComponent(true, true, comp.componentId);
        // await this.createComponent(true, true, comp.componentId);
      }
    }
  };

  public async createComponent(
    isChildComponentCall: boolean = false,
    isEditRendering?: boolean,
    editComponentId?: string,
    parentElementRef?: ElementRef,
    parentIndex?: number,
    parentComponent?: UpdateSingleBlockComponent
  ) {
    // this.container.clear();
    const dynamicComponent: ComponentRef<UpdateSingleBlockComponent> =
      this.container.createComponent<UpdateSingleBlockComponent>(
        UpdateSingleBlockComponent
      );

    let newComponentId: string;
    dynamicComponent.setInput('isCreatedFromChild', isChildComponentCall);
    if (isEditRendering) {
      newComponentId = editComponentId;
      dynamicComponent.setInput('componentId', editComponentId);
      dynamicComponent.setInput('isEditRendering', isEditRendering);
    } else {
      newComponentId = uuidv4();
      dynamicComponent.setInput('componentId', newComponentId);
      dynamicComponent.setInput('isEditRendering', isEditRendering);
    }

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
    if (!isEditRendering) {
      this.dynamicComponentsObj[newComponentId] = {
        parentComponentId: '',
        childs: [],
        connecters: [],
        nodeInformation: {},
      };
    }

    if (isChildComponentCall && !isEditRendering) {
      this.dynamicComponentsObj[parentComponent.componentId].childs.push(
        newComponentId
      );
      this.dynamicComponentsObj[newComponentId].parentComponentId =
        parentComponent.componentId;
      this.dynamicComponentsObj[newComponentId].nodeInformation =
        parentComponent.selectedNode;
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
        console.log('component Position 💥', data, 'isChild', data.isChild);
        this.xCoOrdinates.push(data.x);
        this.YCoOrdinates.push(data.y);
        if (data.isChild)
          this.coOrdinatesOfChildComponents.push({
            x: data.x,
            y: data.y,
            childComponentID: data.componentId,
            isChild: data.isChild,
          });
        console.log('xCoOrdinates💥', this.xCoOrdinates);
        console.log('YCoOrdinates💥', this.YCoOrdinates);
        console.log(
          'this.coOrdinatesOfChildComponents',
          this.coOrdinatesOfChildComponents
        );
        //Save X & Y coordinates of dynamic components into `dynamicComponentsObj` hash (both parent and child components)
        if (!isEditRendering) {
          this.dynamicComponentsObj[data.componentId].xPos = data.x;
          this.dynamicComponentsObj[data.componentId].yPos = data.y;
        }
      }
    );

    //Get connected lines
    this.linesSubscriptions = dynamicComponent.instance.sendLines.subscribe(
      (lines) => {
        this.linesArr.push(lines);
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
        // await this.removeInvalidLines();
        // this.removeInvalidChildComponents();
      }
    );
  }

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

  ngOnDestroy(): void {
    if (this.removeSubscriptions) this.removeSubscriptions.unsubscribe();
    if (this.sendSubscriptions) this.sendSubscriptions.unsubscribe();
    if (this.linesSubscriptions) this.linesSubscriptions.unsubscribe();
    this.components.forEach(
      (component: ComponentRef<UpdateSingleBlockComponent>) => {
        component.destroy();
      }
    );
    this.linesArr.forEach((line: any) => {
      line.remove();
    });
  }
}
