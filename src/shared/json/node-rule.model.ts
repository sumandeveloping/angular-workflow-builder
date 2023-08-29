export const MULTITOUCH_NODE_RULES = [
  {
    parentNodeId: 'null',
    parentNodeName: 'null',
    parentNodeNameType: 'null',
    parentNodeType: null,
    parentNodeCategory: 'null',
    // childNodeIds: ['Segment'],
    childNodeIds: [
      {
        id: 'UUID-segment',
        childNodeName: 'Segment',
        childNodeNameType: 'segment',
        childNodeDescription:
          'Contacts that are members of the selected segments will be automatically added to this campaign.',
        parentNodeCategory: 'ACTION',
      },
      {
        id: 'UUID-contactForm',
        childNodeName: 'Contact Form',
        childNodeNameType: 'contactForm',
        childNodeDescription: 'Future version',
        parentNodeCategory: 'ACTION',
      },
    ],
  },
  {
    parentNodeId: 'UUID-segment',
    parentNodeName: 'Segment',
    parentNodeNameType: 'segment',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description:
      'Contacts that are members of the selected segments will be automatically added to this campaign.', //new
    // childNodeIds: ['Send Email', 'Update Lead'],
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // {
      //   id: 'UUID-updateLead',
      //   childNodeName: 'Update Lead',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-contactForm',
    parentNodeName: 'Contact Form',
    parentNodeNameType: 'contactForm',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    // childNodeIds: ['Send Email', 'Update Lead'],
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // {
      //   id: 'UUID-updateLead',
      //   childNodeName: 'Update Lead',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-sendEmail',
    parentNodeName: 'Send Email',
    parentNodeNameType: 'sendEmail',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description: 'Send the selected email to the lead.', //new
    childNodeIds: [
      {
        id: 'UUID-openEmail',
        childNodeName: 'Open Email',
        childNodeNameType: 'openEmail',
        childNodeCategory: 'DECISION',
        childNodeDescription:
          "Trigger actions when an email is opened. Connect a 'Send Email' action to the top of this decision.",
      },
      {
        id: 'UUID-downloadAsset',
        childNodeName: 'Download Asset',
        childNodeNameType: 'downloadAsset',
        childNodeCategory: 'DECISION',
        childNodeDescription: 'Trigger actions upon downloading an asset.',
      },
      {
        id: 'UUID-visitLandingPage',
        childNodeName: 'Visit Landing Page',
        childNodeNameType: 'visitLandingPage',
        childNodeCategory: 'DECISION',
        childNodeDescription: 'Trigger actions on a page/url hit.',
      },
      {
        id: 'UUID-submitForm',
        childNodeName: 'Submit Form',
        childNodeNameType: 'submitForm',
        childNodeCategory: 'DECISION',
        childNodeDescription: 'Trigger actions when a lead submits a form',
      },
      {
        id: 'UUID-notOpenedEmail',
        childNodeName: 'Not Opened Email',
        childNodeNameType: 'notOpenedEmail',
        childNodeCategory: 'DECISION',
      },
      {
        id: 'UUID-clickThrough',
        childNodeName: 'Click Through',
        childNodeNameType: 'clickThrough',
        childNodeCategory: 'DECISION',
      },
      {
        id: 'UUID-registerForEventOrWebinar',
        childNodeName: 'Register For Event Or Webinar',
        childNodeNameType: 'registerForEventOrWebinar',
        childNodeCategory: 'DECISION',
      },
    ],
  },
  // NEW ACTIONS
  {
    parentNodeId: 'UUID-updateLeadStatus',
    parentNodeName: 'Update Lead Status',
    parentNodeNameType: 'updateLeadStatus',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description: 'Update lead status with the defined value from this action',
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   // nodeType: 'Truthy',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-changeLeadScore',
    parentNodeName: 'Change Lead Score',
    parentNodeNameType: 'changeLeadScore',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description:
      "This action will add the specified value to the lead's existing score",
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   // nodeType: 'Truthy',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-changeLeadRating',
    parentNodeName: 'Change Lead Rating',
    parentNodeNameType: 'changeLeadRating',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description: 'Change lead rating with the defined value from this action',
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   // nodeType: 'Truthy',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-changeLeadOwner',
    parentNodeName: 'Change Lead Owner',
    parentNodeNameType: 'changeLeadOwner',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description: 'Change lead owner with the defined value from this action',
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   // nodeType: 'Truthy',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  {
    parentNodeId: 'UUID-changeAssignLeadTo',
    parentNodeName: 'Change Assign Lead To',
    parentNodeNameType: 'changeAssignLeadTo',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description: 'Change lead assignee with the defined value from this action',
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   // nodeType: 'Truthy',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  // End of new actions
  //start of old actions
  {
    parentNodeId: 'UUID-updateLead',
    parentNodeName: 'Update Lead',
    parentNodeNameType: 'updateLead',
    parentNodeType: null,
    parentNodeCategory: 'ACTION',
    description:
      "Update the current lead's fields with the defined values from this action",
    childNodeIds: [
      // {
      //   id: 'UUID-sendEmail',
      //   childNodeName: 'Send Email',
      //   childNodeNameType: 'sendEmail',
      //   childNodeDescription: 'Send the selected email to the lead.',
      //   childNodeCategory: 'ACTION',
      // },
    ],
  },
  // {
  //   parentNodeId: 'UUID-inactionSendEmail',
  //   parentNodeName: 'Inaction Send Email',
  //   parentNodeNameType: 'inactionSendEmail',
  //   parentNodeType: null,
  //   parentNodeCategory: 'ACTION',
  //   // childNodeIds: [
  //   //   'Send Email',
  //   //   'Update Lead',
  //   //   'Open Email',
  //   //   'Download Asset',
  //   //   'Visit Landing Page',
  //   //   'Submit Form',
  //   // ],
  //   childNodeIds: [
  //     {
  //       id: 'UUID-sendEmail',
  //       childNodeName: 'Send Email',
  //       childNodeNameType: 'sendEmail',
  //       childNodeDescription: 'Send the selected email to the lead.',
  //       childNodeCategory: 'ACTION',
  //     },
  //     {
  //       id: 'UUID-updateLead',
  //       childNodeName: 'Update Lead',
  //       childNodeNameType: 'updateLead',
  //       childNodeCategory: 'ACTION',
  //     },
  //     {
  //       id: 'UUID-openEmail',
  //       childNodeName: 'Open Email',
  //       childNodeNameType: 'openEmail',
  //       childNodeCategory: 'DECISION',
  //       childNodeDescription:
  //         "Trigger actions when an email is opened. Connect a 'Send Email' action to the top of this decision.",
  //     },
  //     {
  //       id: 'UUID-downloadAsset',
  //       childNodeName: 'Download Asset',
  //       childNodeNameType: 'downloadAsset',
  //       childNodeCategory: 'DECISION',
  //       childNodeDescription: 'Trigger actions upon downloading an asset.',
  //     },
  //     {
  //       id: 'UUID-visitLandingPage',
  //       childNodeName: 'Visit Landing Page',
  //       childNodeNameType: 'visitLandingPage',
  //       childNodeCategory: 'DECISION',
  //       childNodeDescription: 'Trigger actions on a page/url hit.',
  //     },
  //     {
  //       id: 'UUID-submitForm',
  //       childNodeName: 'Submit Form',
  //       childNodeNameType: 'submitForm',
  //       childNodeCategory: 'DECISION',
  //       childNodeDescription: 'Trigger actions when a lead submits a form',
  //     },
  //   ],
  // },
  // {
  //   parentNodeId: 'UUID-inactionUpdateLead',
  //   parentNodeName: 'Inaction Update Lead',
  //   parentNodeNameType: 'inactionUpdateLead',
  //   parentNodeType: null,
  //   parentNodeCategory: 'ACTION',
  //   // childNodeIds: ['Send Email'],
  //   childNodeIds: [
  //     {
  //       id: 'UUID-sendEmail',
  //       childNodeName: 'Send Email',
  //       childNodeNameType: 'sendEmail',
  //       childNodeDescription: 'Send the selected email to the lead.',
  //       childNodeCategory: 'ACTION',
  //     },
  //   ],
  // },
  // ========== END OF ACTION BLOCK =================================
  // ===== START OF DECISION BLOCKS ===========================
  {
    parentNodeId: 'UUID-openEmail', // id of 'Open Email'
    parentNodeName: 'Open Email',
    parentNodeNameType: 'openEmail',
    parentNodeType: null,
    // parentNodeType: ParentNodeType.TRUTHY,
    // childNodeIds: ['Send Email', 'Update Lead'],
    parentNodeCategory: 'DECISION',
    description:
      "Trigger actions when an email is opened. Connect a 'Send Email' action to the top of this decision.",
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // UPDATE LEAD
      {
        id: 'UUID-updateLead',
        childNodeName: 'Update Lead',
        childNodeNameType: 'updateLead',
        childNodeDescription:
          "Update the current lead's fields with the defined values from this action",
        childNodeCategory: 'ACTION',
      },
      // END UPDATE LEAD
    ],
  },
  {
    parentNodeId: 'UUID-downloadAsset',
    parentNodeName: 'Download Asset',
    parentNodeNameType: 'downloadAsset',
    parentNodeType: null,
    parentNodeCategory: 'DECISION',
    description: 'Trigger actions upon downloading an asset.',
    // parentNodeType: ParentNodeType.TRUTHY,
    // childNodeIds: ['Send Email', 'Update Lead'],
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // UPDATE LEAD
      {
        id: 'UUID-updateLead',
        childNodeName: 'Update Lead',
        childNodeNameType: 'updateLead',
        childNodeDescription:
          "Update the current lead's fields with the defined values from this action",
        childNodeCategory: 'ACTION',
      },
      // END UPDATE LEAD
    ],
  },
  {
    parentNodeId: 'UUID-visitLandingPage',
    parentNodeName: 'Visit Landing Page',
    parentNodeNameType: 'visitLandingPage',
    parentNodeType: null,
    parentNodeCategory: 'DECISION',
    description: 'Trigger actions on a page/url hit.',
    // parentNodeType: ParentNodeType.TRUTHY,
    // childNodeIds: ['Send Email', 'Update Lead'],
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // UPDATE LEAD
      {
        id: 'UUID-updateLead',
        childNodeName: 'Update Lead',
        childNodeNameType: 'updateLead',
        childNodeDescription:
          "Update the current lead's fields with the defined values from this action",
        childNodeCategory: 'ACTION',
      },
      // END UPDATE LEAD
    ],
  },
  {
    parentNodeId: 'UUID-submitForm',
    parentNodeName: 'Submit Form',
    parentNodeNameType: 'submitForm',
    parentNodeType: null,
    parentNodeCategory: 'DECISION',
    description: 'Trigger actions when a lead submits a form',
    // parentNodeType: ParentNodeType.TRUTHY,
    // childNodeIds: ['Send Email', 'Update Lead'],
    childNodeIds: [
      {
        id: 'UUID-sendEmail',
        childNodeName: 'Send Email',
        childNodeNameType: 'sendEmail',
        childNodeDescription: 'Send the selected email to the lead.',
        childNodeCategory: 'ACTION',
      },
      // UPDATE LEAD
      {
        id: 'UUID-updateLead',
        childNodeName: 'Update Lead',
        childNodeNameType: 'updateLead',
        childNodeDescription:
          "Update the current lead's fields with the defined values from this action",
        childNodeCategory: 'ACTION',
      },
      // END UPDATE LEAD
    ],
  },
  // ===== END OF DECISION BLOCKS ===========================
];
