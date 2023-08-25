export const nodeProperties = [
  {
    displayName: 'Segment',
    description: '',
    category: 'Actions',
    icon: 'fa fa-list',
    model: {
      sources: {
        id: 'sources',
        label: 'Sources',
        type: 'select',
        hidden: false,
        linkedFields: true,
        value: null,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'Campaign List',
            value: 'CL',
          },
          {
            label: 'Segment List',
            value: 'SL',
          },
        ],
      },
      segmentList: {
        label: 'Segment list',
        type: 'select',
        link: 'sources',
        linkValue: 'SL',
        value: null,
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'Segment List 1',
            value: 'SL1',
          },
          {
            label: 'Segment List 2',
            value: 'SL2',
          },
        ],
      },
      campaignList: {
        label: 'Campaign list',
        type: 'select',
        link: 'sources',
        linkValue: 'CL',
        value: null,
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'Campaign List 1',
            value: 'CL1',
          },
          {
            label: 'Campaign List 2',
            value: 'CL2',
          },
        ],
      },
    },
  },
  {
    displayName: 'Send Email',
    description: 'Send the selected email to the lead.',
    category: 'Actions',
    icon: 'fa fa-envelope',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      executeThisEvent: {
        id: 'executeThisEvent',
        label: 'Execute this event',
        type: 'select',
        value: null,
        toolTip: true,
        toolTipText:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni, neque.',
        placeholder: "All date/time are based on the user's system timezone.",
        hidden: false,
        linkedFields: true,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'immediately',
            value: 'immediately',
          },
          {
            label: 'at a relative time period',
            value: 'at a relative time period',
          },
          {
            label: 'at a specific date/time',
            value: 'at a specific date/time',
          },
        ],
      },
      intervalValue: {
        label: 'Interval Value',
        type: 'number',
        value: null,
        placeholder: 'Should be a number.',
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      intervalUnit: {
        label: 'Interval Unit',
        type: 'select',
        value: null,
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'minute(s)',
            value: 'minute(s)',
          },
          {
            label: 'hour(s)',
            value: 'hour(s)',
          },
          {
            label: 'day(s)',
            value: 'day(s)',
          },
          {
            label: 'month(s)',
            value: 'month(s)',
          },
          {
            label: 'year(s)',
            value: 'year(s)',
          },
        ],
      },
      date: {
        type: 'date',
        value: null,
        label: 'Date',
        link: 'executeThisEvent',
        linkValue: 'at a specific date/time',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      subject: {
        label: 'Subject',
        type: 'text',
        value: null,
        placeholder: 'Subject of the email.',
        hidden: false,
      },
      senderName: {
        label: 'Sender Name',
        type: 'text',
        value: null,
        placeholder:
          "Sender's Name of the email that shows up on the recepient side.",
        hidden: false,
        rules: {
          required: true,
        },
      },
      emailToSend: {
        label: 'Email to send',
        type: 'select',
        value: null,
        placeholder: 'Choose the email to be sent.',
        hidden: false,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'Email 1',
            value: 'email 1',
          },
          {
            label: 'Email 2',
            value: 'email 2',
          },
        ],
      },
    },
  },
  {
    displayName: 'Inaction Send Email',
    description: '',
    category: 'Actions',
    icon: 'fa fa-envelope',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        placeholder: 'Name of the email is an internal name.',
        hidden: false,
        rules: {
          required: true,
        },
      },
      executeThisEvent: {
        id: 'executeThisEvent',
        label: 'Execute this event',
        type: 'select',
        value: null,
        placeholder: "All date/time are based on the user's system timezone.",
        hidden: false,
        linkedFields: true,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'at a relative time period',
            value: 'at a relative time period',
          },
          {
            label: 'at a specific date/time',
            value: 'at a specific date/time',
          },
        ],
      },
      intervalValue: {
        label: 'Interval Value',
        type: 'number',
        value: null,
        placeholder: 'Should be a number.',
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      intervalUnit: {
        label: 'Interval Unit',
        type: 'select',
        value: null,
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'minute(s)',
            value: 'minute(s)',
          },
          {
            label: 'hour(s)',
            value: 'hour(s)',
          },
          {
            label: 'day(s)',
            value: 'day(s)',
          },
          {
            label: 'month(s)',
            value: 'month(s)',
          },
          {
            label: 'year(s)',
            value: 'year(s)',
          },
        ],
      },
      date: {
        type: 'date',
        value: null,
        label: 'Date',
        link: 'executeThisEvent',
        linkValue: 'at a specific date/time',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      subject: {
        label: 'Subject',
        type: 'text',
        value: null,
        placeholder: 'Subject of the email.',
        hidden: false,
      },
      senderName: {
        label: 'Sender Name',
        type: 'text',
        value: null,
        placeholder:
          "Sender's Name of the email that shows up on the recepient side.",
        hidden: false,
        rules: {
          required: true,
        },
      },
      emailToSend: {
        label: 'Email to send',
        type: 'select',
        value: null,
        placeholder: 'Choose the email to be sent.',
        hidden: false,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'Email 1',
            value: 'email 1',
          },
          {
            label: 'Email 2',
            value: 'email 2',
          },
        ],
      },
    },
  },
  {
    displayName: 'Update lead',
    description:
      "Update the current lead's fields with the defined values from this action",
    category: 'Actions',
    icon: 'fa fa-address-card',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        placeholder: 'This is an internal name.',
        hidden: false,
        rules: {
          required: true,
        },
      },
      executeThisEvent: {
        id: 'executeThisEvent',
        label: 'Execute this event',
        type: 'select',
        value: null,
        placeholder: "All date/time are based on the user's system timezone.",
        hidden: false,
        linkedFields: true,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'immediately',
            value: 'immediately',
          },
          {
            label: 'at a relative time period',
            value: 'at a relative time period',
          },
          {
            label: 'at a specific date/time',
            value: 'at a specific date/time',
          },
        ],
      },
      intervalValue: {
        label: 'Interval Value',
        type: 'number',
        value: null,
        placeholder: 'Should be a number.',
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      intervalUnit: {
        label: 'Interval Unit',
        type: 'select',
        value: null,
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'minute(s)',
            value: 'minute(s)',
          },
          {
            label: 'hour(s)',
            value: 'hour(s)',
          },
          {
            label: 'day(s)',
            value: 'day(s)',
          },
          {
            label: 'month(s)',
            value: 'month(s)',
          },
          {
            label: 'year(s)',
            value: 'year(s)',
          },
        ],
      },
      date: {
        type: 'date',
        value: null,
        label: 'Date',
        link: 'executeThisEvent',
        linkValue: 'at a specific date/time',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      salutation: {
        label: 'Salutation',
        type: 'select',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'MR',
            value: 'MR',
          },
          {
            label: 'MRS',
            value: 'MRS',
          },
          {
            label: 'MS',
            value: 'MS',
          },
          {
            label: 'Dr.',
            value: 'Dr.',
          },
          {
            label: 'Prof',
            value: 'Prof',
          },
        ],
      },
      firstName: {
        label: 'First Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      lastName: {
        label: 'Last Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      primaryPhone: {
        label: 'Primary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      mobile: {
        label: 'Mobile',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      email: {
        label: 'Email',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
          email: true,
        },
      },
      assignedTo: {
        label: 'Assigned To',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: '7d288264-8e0f-4754-9890-ca340c131070',
            label: 'Suman Tapader',
          },
          {
            value: 'c963eb90-2dcb-43d9-b72e-105b202779eb',
            label: 'Yerram  Reddy',
          },
          {
            value: '8671a467-8f8a-4635-a73b-3477d4f1616c',
            label: 'Test User',
          },
          {
            value: 'afe47ceb-e027-4f24-9036-a40ba0176acf',
            label: 'Aritri Saha',
          },
          {
            value: '006bec23-e632-4f85-9ebd-76154f191b66',
            label: 'Akshit Singh',
          },
          {
            value: 'b5fefdcd-1094-4b08-81a1-b5053582a888',
            label: 'Smita Chakravarty',
          },
          {
            value: 'c6f4f8e6-7e43-4122-9be0-3ae20688f91b',
            label: 'Anjan Chakraborty',
          },
        ],
      },
      leadSource: {
        label: 'Lead Source',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Advertisement',
            label: 'Advertisement',
          },
          {
            value: 'Customer Event',
            label: 'Customer Event',
          },
          {
            value: 'Employee Referral',
            label: 'Employee Referral',
          },
          {
            value: 'External Referral',
            label: 'External Referral',
          },
          {
            value: 'Google AdWords',
            label: 'Google AdWords',
          },
          {
            value: 'Partner',
            label: 'Partner',
          },
          {
            value: 'Purchased List',
            label: 'Purchased List',
          },
          {
            value: 'Trade Show',
            label: 'Trade Show',
          },
          {
            value: 'Webinar',
            label: 'Webinar',
          },
          {
            value: 'Website',
            label: 'Website',
          },
        ],
      },
      leadRating: {
        label: 'Lead Rating',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'COLD',
            label: 'COLD',
          },
          {
            value: 'WARM',
            label: 'WARM',
          },
          {
            value: 'HOT',
            label: 'HOT',
          },
        ],
      },
      secondaryPhone: {
        label: 'Secondary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      jobTitle: {
        label: 'Job Title',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      followUpDate: {
        label: 'Follow up date',
        type: 'date',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      companyName: {
        label: 'Company Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      website: {
        label: 'Website',
        type: 'text',
        value: null,
        hidden: false,
      },
      noOfEmployee: {
        label: 'Number of Employee',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: '1-10',
            label: '1-10',
          },
          {
            value: '11-100',
            label: '11-100',
          },
          {
            value: '101-500',
            label: '101-500',
          },
          {
            value: '501-1000',
            label: '501-1000',
          },
          {
            value: '1001-5000',
            label: '1001-5000',
          },
          {
            value: '5000+',
            label: '5000+',
          },
        ],
      },
      annualRevenue: {
        label: 'Annual Revenue',
        type: 'text',
        value: null,
        hidden: false,
      },
      state: {
        label: 'State/Province',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Aargau',
            label: 'Aargau',
          },
          {
            value: 'Aberdeen',
            label: 'Aberdeen',
          },
          {
            value: 'Aberdeenshire',
            label: 'Aberdeenshire',
          },
          {
            value: 'Abia',
            label: 'Abia',
          },
          {
            value: 'Abidjan',
            label: 'Abidjan',
          },
          {
            value: 'Abim District',
            label: 'Abim District',
          },
        ],
      },
      city: {
        label: 'City',
        type: 'text',
        value: null,
        hidden: false,
      },
      industry: {
        label: 'Industry Type',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Agriculture',
            label: 'Agriculture',
          },
          {
            value: 'Apparel',
            label: 'Apparel',
          },
          {
            value: 'Banking',
            label: 'Banking',
          },
          {
            value: 'Biotechnology',
            label: 'Biotechnology',
          },
          {
            value: 'Chemicals',
            label: 'Chemicals',
          },
          {
            value: 'Communications',
            label: 'Communications',
          },
        ],
      },
      zipcode: {
        label: 'Zip/Postal Code',
        type: 'text',
        value: null,
        hidden: false,
      },
      country: {
        label: 'Country',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Afghanistan',
            label: 'Afghanistan',
          },
          {
            value: 'Aland Islands',
            label: 'Aland Islands',
          },
          {
            value: 'Albania',
            label: 'Albania',
          },
          {
            value: 'Algeria',
            label: 'Algeria',
          },
          {
            value: 'American Samoa',
            label: 'American Samoa',
          },
          {
            value: 'Andorra',
            label: 'Andorra',
          },
        ],
      },
      companyPrimaryPhone: {
        label: 'Company Primary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      addressLine1: {
        label: 'Address Line 1',
        type: 'text',
        value: null,
        hidden: false,
      },
      addressLine2: {
        label: 'Address Line 2',
        type: 'text',
        value: null,
        hidden: false,
      },
    },
  },
  {
    displayName: 'Inaction Update Lead',
    description: '',
    category: 'Actions',
    icon: 'fa fa-address-card',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        placeholder: 'This is an internal name.',
        hidden: false,
        rules: {
          required: true,
        },
      },
      executeThisEvent: {
        id: 'executeThisEvent',
        label: 'Execute this event',
        type: 'select',
        value: null,
        placeholder: "All date/time are based on the user's system timezone.",
        hidden: false,
        linkedFields: true,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'at a relative time period',
            value: 'at a relative time period',
          },
          {
            label: 'at a specific date/time',
            value: 'at a specific date/time',
          },
        ],
      },
      intervalValue: {
        label: 'Interval Value',
        type: 'number',
        value: null,
        placeholder: 'Should be a number.',
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      intervalUnit: {
        label: 'Interval Unit',
        type: 'select',
        value: null,
        link: 'executeThisEvent',
        linkValue: 'at a relative time period',
        hidden: true,
        requiredWhenDisplayed: true,
        options: [
          {
            label: 'minute(s)',
            value: 'minute(s)',
          },
          {
            label: 'hour(s)',
            value: 'hour(s)',
          },
          {
            label: 'day(s)',
            value: 'day(s)',
          },
          {
            label: 'month(s)',
            value: 'month(s)',
          },
          {
            label: 'year(s)',
            value: 'year(s)',
          },
        ],
      },
      date: {
        type: 'date',
        value: null,
        label: 'Date',
        link: 'executeThisEvent',
        linkValue: 'at a specific date/time',
        hidden: true,
        requiredWhenDisplayed: true,
      },
      salutation: {
        label: 'Salutation',
        type: 'select',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
        options: [
          {
            label: 'MR',
            value: 'MR',
          },
          {
            label: 'MRS',
            value: 'MRS',
          },
          {
            label: 'MS',
            value: 'MS',
          },
          {
            label: 'Dr.',
            value: 'Dr.',
          },
          {
            label: 'Prof',
            value: 'Prof',
          },
        ],
      },
      firstName: {
        label: 'First Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      lastName: {
        label: 'Last Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      primaryPhone: {
        label: 'Primary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      mobile: {
        label: 'Mobile',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      email: {
        label: 'Email',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
          email: true,
        },
      },
      assignedTo: {
        label: 'Assigned To',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: '7d288264-8e0f-4754-9890-ca340c131070',
            label: 'Suman Tapader',
          },
          {
            value: 'c963eb90-2dcb-43d9-b72e-105b202779eb',
            label: 'Yerram  Reddy',
          },
          {
            value: '8671a467-8f8a-4635-a73b-3477d4f1616c',
            label: 'Test User',
          },
          {
            value: 'afe47ceb-e027-4f24-9036-a40ba0176acf',
            label: 'Aritri Saha',
          },
          {
            value: '006bec23-e632-4f85-9ebd-76154f191b66',
            label: 'Akshit Singh',
          },
          {
            value: 'b5fefdcd-1094-4b08-81a1-b5053582a888',
            label: 'Smita Chakravarty',
          },
          {
            value: 'c6f4f8e6-7e43-4122-9be0-3ae20688f91b',
            label: 'Anjan Chakraborty',
          },
        ],
      },
      leadSource: {
        label: 'Lead Source',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Advertisement',
            label: 'Advertisement',
          },
          {
            value: 'Customer Event',
            label: 'Customer Event',
          },
          {
            value: 'Employee Referral',
            label: 'Employee Referral',
          },
          {
            value: 'External Referral',
            label: 'External Referral',
          },
          {
            value: 'Google AdWords',
            label: 'Google AdWords',
          },
          {
            value: 'Partner',
            label: 'Partner',
          },
          {
            value: 'Purchased List',
            label: 'Purchased List',
          },
          {
            value: 'Trade Show',
            label: 'Trade Show',
          },
          {
            value: 'Webinar',
            label: 'Webinar',
          },
          {
            value: 'Website',
            label: 'Website',
          },
        ],
      },
      leadRating: {
        label: 'Lead Rating',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'COLD',
            label: 'COLD',
          },
          {
            value: 'WARM',
            label: 'WARM',
          },
          {
            value: 'HOT',
            label: 'HOT',
          },
        ],
      },
      secondaryPhone: {
        label: 'Secondary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      jobTitle: {
        label: 'Job Title',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      followUpDate: {
        label: 'Follow up date',
        type: 'date',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      companyName: {
        label: 'Company Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      website: {
        label: 'Website',
        type: 'text',
        value: null,
        hidden: false,
      },
      noOfEmployee: {
        label: 'Number of Employee',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: '1-10',
            label: '1-10',
          },
          {
            value: '11-100',
            label: '11-100',
          },
          {
            value: '101-500',
            label: '101-500',
          },
          {
            value: '501-1000',
            label: '501-1000',
          },
          {
            value: '1001-5000',
            label: '1001-5000',
          },
          {
            value: '5000+',
            label: '5000+',
          },
        ],
      },
      annualRevenue: {
        label: 'Annual Revenue',
        type: 'text',
        value: null,
        hidden: false,
      },
      state: {
        label: 'State/Province',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Aargau',
            label: 'Aargau',
          },
          {
            value: 'Aberdeen',
            label: 'Aberdeen',
          },
          {
            value: 'Aberdeenshire',
            label: 'Aberdeenshire',
          },
          {
            value: 'Abia',
            label: 'Abia',
          },
          {
            value: 'Abidjan',
            label: 'Abidjan',
          },
          {
            value: 'Abim District',
            label: 'Abim District',
          },
        ],
      },
      city: {
        label: 'City',
        type: 'text',
        value: null,
        hidden: false,
      },
      industry: {
        label: 'Industry Type',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Agriculture',
            label: 'Agriculture',
          },
          {
            value: 'Apparel',
            label: 'Apparel',
          },
          {
            value: 'Banking',
            label: 'Banking',
          },
          {
            value: 'Biotechnology',
            label: 'Biotechnology',
          },
          {
            value: 'Chemicals',
            label: 'Chemicals',
          },
          {
            value: 'Communications',
            label: 'Communications',
          },
        ],
      },
      zipcode: {
        label: 'Zip/Postal Code',
        type: 'text',
        value: null,
        hidden: false,
      },
      country: {
        label: 'Country',
        type: 'select',
        value: null,
        hidden: false,
        options: [
          {
            value: 'Afghanistan',
            label: 'Afghanistan',
          },
          {
            value: 'Aland Islands',
            label: 'Aland Islands',
          },
          {
            value: 'Albania',
            label: 'Albania',
          },
          {
            value: 'Algeria',
            label: 'Algeria',
          },
          {
            value: 'American Samoa',
            label: 'American Samoa',
          },
          {
            value: 'Andorra',
            label: 'Andorra',
          },
        ],
      },
      companyPrimaryPhone: {
        label: 'Company Primary Phone',
        type: 'number',
        value: null,
        placeholder: 'Format should be like 91-9876543210',
        hidden: false,
        rules: {
          required: true,
          maxLength: 12,
          pattern: '[0-9]*',
        },
      },
      addressLine1: {
        label: 'Address Line 1',
        type: 'text',
        value: null,
        hidden: false,
      },
      addressLine2: {
        label: 'Address Line 2',
        type: 'text',
        value: null,
        hidden: false,
      },
    },
  },
  {
    displayName: 'Open Email',
    description:
      "Trigger actions when an email is opened. Connect a 'Send Email' action to the top of this decision.",
    category: 'Decision',
    icon: 'fa fa-envelope-open',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
    },
  },
  {
    displayName: 'Download Asset',
    description: 'Trigger actions upon downloading an asset.',
    category: 'Decision',
    icon: 'fa fa-download',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      limitToAsset: {
        label: 'Limit To Asset',
        type: 'select',
        value: null,
        placeholder: 'Select the asset this trigger applies to.',
        hidden: false,
        options: [
          {
            value: '90e777da-42e7-423c-81a1-3e0b2a61f3c9',
            label: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx',
          },
          {
            value: '736a0dda-6955-414c-b024-2f8dc4648852',
            label: 'Aps3',
          },
        ],
      },
    },
  },
  {
    displayName: 'Visit Landing Page',
    description: 'Trigger actions on a page/url hit.',
    category: 'Decision',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      limitToPage: {
        label: 'Limit To Page',
        type: 'select',
        value: null,
        placeholder: 'Select the pages this trigger applies to.',
        hidden: false,
        options: [
          {
            value: '90e777da-42e7-423c-81a1-3e0b2a61f3c9',
            label: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx',
          },
          {
            value: '736a0dda-6955-414c-b024-2f8dc4648852',
            label: 'Aps3',
          },
        ],
      },
    },
  },
  {
    displayName: 'Submits form',
    description: 'Trigger actions when a lead submits a form',
    category: 'Decision',
    icon: 'fa fa-arrow-circle-right',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      limitToForm: {
        label: 'Limit to Form',
        type: 'select',
        value: null,
        placeholder: 'Select the pages this trigger applies to.',
        hidden: false,
        options: [
          {
            value: '90e777da-42e7-423c-81a1-3e0b2a61f3c9',
            label: 'New Dynamic Form',
          },
          {
            value: '736a0dda-6955-414c-b024-2f8dc4648852',
            label: 'Register Form',
          },
        ],
      },
    },
  },
  // new data model
  //lead status
  {
    displayName: 'Update Lead Status',
    description: 'Update lead status with the defined value from this action',
    category: 'ACTION',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      leadStatus: {
        label: 'Lead Status',
        type: 'select',
        value: null,
        placeholder: 'Change lead status to...',
        hidden: false,
        options: [
          {
            value: 'uuid-clickedThrough',
            label: 'Clicked Through',
          },
          {
            value: 'uuid-converted',
            label: 'Converted',
          },
          {
            value: 'uuid-formSubmitted',
            label: 'Form Submitted',
          },
        ],
      },
    },
  },
  //lead score
  {
    displayName: 'Change Lead Score',
    description:
      "This action will add the specified value to the lead's existing score",
    category: 'ACTION',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      leadScore: {
        label: 'Lead Score',
        type: 'number',
        value: null,
        placeholder: 'Change lead score to...',
        hidden: false,
      },
    },
  },
  //lead rating
  {
    displayName: 'Change Lead Rating',
    description: 'Change lead rating with the defined value from this action',
    category: 'ACTION',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      leadRating: {
        label: 'Lead Rating',
        type: 'select',
        value: null,
        placeholder: 'Change lead rating to...',
        hidden: false,
        options: [
          {
            value: 'uuid-cold',
            label: 'COLD',
          },
          {
            value: 'uuid-warm',
            label: 'WARM',
          },
          {
            value: 'uuid-hot',
            label: 'HOT',
          },
        ],
      },
    },
  },
  //lead owner
  {
    displayName: 'Change Lead Owner',
    description: 'Change lead owner with the defined value from this action',
    category: 'ACTION',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      leadOwner: {
        label: 'Lead Owner',
        type: 'select',
        value: null,
        placeholder: 'Change lead owner to...',
        hidden: false,
        options: [
          {
            value: 'uuid-suman',
            label: 'Suman Tapader',
          },
          {
            value: 'uuid-akshit',
            label: 'Akshit Singh',
          },
          {
            value: 'uuid-smita',
            label: 'Smita Chakraborty',
          },
        ],
      },
    },
  },
  //change assignee
  {
    displayName: 'Change Assign Lead To',
    description: 'Change lead assignee with the defined value from this action',
    category: 'ACTION',
    icon: 'fa fa-window-maximize',
    model: {
      name: {
        label: 'Name',
        type: 'text',
        value: null,
        hidden: false,
        rules: {
          required: true,
        },
      },
      assignedTo: {
        label: 'Assign To',
        type: 'select',
        value: null,
        placeholder: 'Assign lead to...',
        hidden: false,
        options: [
          {
            value: 'uuid-suman',
            label: 'Suman Tapader',
          },
          {
            value: 'uuid-akshit',
            label: 'Akshit Singh',
          },
          {
            value: 'uuid-smita',
            label: 'Smita Chakraborty',
          },
        ],
      },
    },
  },
];
