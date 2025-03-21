import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TrophyOutlined,
  MoneyCollectOutlined,
  BugOutlined,
  BlockOutlined,
  PaperClipOutlined,
  TransactionOutlined,
  SnippetsOutlined,
  UsergroupDeleteOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  MessageOutlined,
  StockOutlined,
  EuroCircleOutlined,
  ScheduleOutlined,
  CheckSquareOutlined,
  GlobalOutlined,
  BankOutlined,
  BranchesOutlined,
  DeploymentUnitOutlined,
  CalendarOutlined,
  BulbOutlined,
  CrownOutlined,
  FireOutlined,
  BarChartOutlined,
  HomeOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  DollarOutlined,
  PoundOutlined,
  FileDoneOutlined,
  CommentOutlined,
  SettingOutlined,
  RiseOutlined,
  FundProjectionScreenOutlined,
  PlusCircleOutlined,
  UserOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

const extraNavvTree = [
  {
    key: 'extra',
    path: `${APP_PREFIX_PATH}/hrm`,
    title: 'HRM',
    icon: PlusCircleOutlined,
    breadcrumb: true,
    isGroupTitle: true,
    submenu: [

      {
        key: 'extra-hrm-employee',
        path: `${APP_PREFIX_PATH}/hrm/employee`,
        title: 'Employee',
        icon: IdcardOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-hrm-payroll',
        path: `${APP_PREFIX_PATH}/hrm/payroll`,
        title: 'PayRoll',
        icon: PoundOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-hrm-payroll-salary',
            path: `${APP_PREFIX_PATH}/hrm/payroll/salary`,
            title: 'Salary',
            icon: DollarOutlined,
            breadcrumb: true,
            submenu: []
          },

        ]
      },
      {
        key: 'extra-hrm-performance',
        path: `${APP_PREFIX_PATH}/hrm/performance`,
        title: 'Performance',
        icon: BarChartOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-hrm-performance-indicator',
            path: `${APP_PREFIX_PATH}/hrm/performance/indicator`,
            title: 'Indicator',
            icon: StockOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-performance-appraisal',
            path: `${APP_PREFIX_PATH}/hrm/performance/appraisal`,
            title: 'Appraisal',
            icon: TrophyOutlined,
            breadcrumb: true,
            submenu: []
          },

        ]
      },
      {
        key: 'extra-hrm-role',
        path: `${APP_PREFIX_PATH}/hrm/role`,
        title: 'Role',
        icon: CrownOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-hrm-branch',
        path: `${APP_PREFIX_PATH}/hrm/branch`,
        title: 'Branch',
        icon: BranchesOutlined,
        breadcrumb: true,
        submenu: []
      },

      {
        key: 'extra-hrm-designation',
        path: `${APP_PREFIX_PATH}/hrm/designation`,
        title: 'Designation',
        icon: SolutionOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-hrm-department',
        path: `${APP_PREFIX_PATH}/hrm/department`,
        title: 'Department',
        icon: BankOutlined,
        breadcrumb: true,
        submenu: []
      },

      {
        key: 'extra-hrm-attendance',
        path: `${APP_PREFIX_PATH}/hrm/attendance`,
        title: 'Attendance',
        icon: CalendarOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-hrm-attendance-attendancelist',
            path: `${APP_PREFIX_PATH}/hrm/attendance/attendancelist`,
            title: 'Attendance List',
            icon: CheckSquareOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-attendance-holidaylist',
            path: `${APP_PREFIX_PATH}/hrm/holiday/holidaylist`,
            title: 'Holiday List',
            icon: CalendarOutlined,
            breadcrumb: true,
            submenu: []
          },
        ]
      },
      {
        key: 'extra-hrm-leave',
        path: `${APP_PREFIX_PATH}/hrm/leave`,
        title: 'Leave Management',
        icon: CalendarOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-hrm-leave-leavelist',
            path: `${APP_PREFIX_PATH}/hrm/leave/leavelist`,
            title: 'Leave List',
            icon: ScheduleOutlined,
            breadcrumb: true,
            submenu: []
          },

        ]

      },

      {
        key: 'extra-hrm-meeting',
        path: `${APP_PREFIX_PATH}/hrm/meeting`,
        title: 'Meeting',
        icon: AppstoreOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-hrm-announcement',
        path: `${APP_PREFIX_PATH}/hrm/announcement`,
        title: 'Announcement',
        icon: FireOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-hrm-jobs',
        path: `${APP_PREFIX_PATH}/hrm/jobs`,
        title: 'Job',
        icon: CalendarOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-hrm-jobs-joblist',
            path: `${APP_PREFIX_PATH}/hrm/jobs/joblist`,
            title: 'Jobs',
            icon: ControlOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs-jobcandidate',
            path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate`,
            title: 'Job Candidate',
            icon: UsergroupAddOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs-jobonbording',
            path: `${APP_PREFIX_PATH}/hrm/jobs/jobonbording`,
            title: 'Job On-Bording',
            icon: DeploymentUnitOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs-jobapplication',
            path: `${APP_PREFIX_PATH}/hrm/jobs/jobapplication`,
            title: 'Job Application',
            icon: SolutionOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs-jobofferletter',
            path: `${APP_PREFIX_PATH}/hrm/jobs/jobofferletter`,
            title: 'Job Offer Letter',
            icon: SolutionOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs-interview',
            path: `${APP_PREFIX_PATH}/hrm/jobs/interview`,
            title: 'Interviews',
            icon: ScheduleOutlined,
            breadcrumb: true,
            submenu: []
          },

        ]

      },
    ]
  },
  {
    key: 'extra-hrm-document',
    path: `${APP_PREFIX_PATH}/hrm/document`,
    title: 'Document',
    icon: PaperClipOutlined,
    breadcrumb: true,
    submenu: []
  },
  {
    key: 'extra-hrm-trainingSetup',
    path: `${APP_PREFIX_PATH}/hrm/trainingSetup`,
    title: 'TrainingSetup',
    icon: CrownOutlined,
    breadcrumb: true,
    submenu: []
  },

  {
    key: 'setting',
    path: `${APP_PREFIX_PATH}/setting`,
    title: 'Setting',
    icon: SettingOutlined,
    breadcrumb: true,
    submenu: [
      {
        key: 'extra-superadmin-setting-general',
        path: `${APP_PREFIX_PATH}/setting/general`,
        title: 'General',
        icon: ControlOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-superadmin-setting-countries',
        path: `${APP_PREFIX_PATH}/setting/countries`,
        title: 'Countries',
        icon: GlobalOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-superadmin-setting-currencies',
        path: `${APP_PREFIX_PATH}/setting/currencies`,
        title: 'Currencies',
        icon: DollarOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-superadmin-setting-tax',
        path: `${APP_PREFIX_PATH}/setting/tax`,
        title: 'Tax',
        icon: MoneyCollectOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-superadmin-setting-plan',
        path: `${APP_PREFIX_PATH}/setting/plan`,
        title: 'Plan',
        icon: BlockOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-superadmin-setting-esignature',
        path: `${APP_PREFIX_PATH}/setting/esignature`,
        title: 'ESignature',
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: []
      },

    ]

  },


]

export { extraNavvTree };
// }
// ]


const extraNavvvTree = [
  {
    key: 'superadmin',
    path: `${APP_PREFIX_PATH}/superadmin`,
    title: 'SUPERADMIN',
    icon: PlusCircleOutlined,
    breadcrumb: true,
    isGroupTitle: true,
    submenu: [
      {
        key: 'superadmin-dashboard',
        path: `${APP_PREFIX_PATH}/superadmin/dashboard`,
        title: 'Dashboard',
        icon: HomeOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'superadmin-company',
        path: `${APP_PREFIX_PATH}/superadmin/company`,
        title: 'Company',
        icon: ScheduleOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'superadmin-plan',
        path: `${APP_PREFIX_PATH}/superadmin/plan`,
        title: 'Plan',
        icon: BlockOutlined,
        breadcrumb: true,
        submenu: []
      },

      {
        key: 'superadmin-subscribeduserplans',
        path: `${APP_PREFIX_PATH}/superadmin/subscribeduserplans`,
        title: 'Subscribed User Plans',
        icon: BlockOutlined,
        breadcrumb: true,
        submenu: []
      },

      {
        key: 'superadmin-notes',
        path: `${APP_PREFIX_PATH}/superadmin/notes`,
        title: 'Notes',
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'superadmin-policy',
        path: `${APP_PREFIX_PATH}/superadmin/policy`,
        title: 'Policy',
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: []
      },

      {
        key: 'setting',
        path: `${APP_PREFIX_PATH}/setting`,
        title: 'Setting',
        icon: SettingOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: 'extra-superadmin-setting-general',
            path: `${APP_PREFIX_PATH}/setting/general`,
            title: 'General',
            icon: ControlOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-payment',
            path: `${APP_PREFIX_PATH}/setting/payment`,
            title: 'Payment',
            icon: DollarOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-countries',
            path: `${APP_PREFIX_PATH}/setting/countries`,
            title: 'Countries',
            icon: GlobalOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-currencies',
            path: `${APP_PREFIX_PATH}/setting/currencies`,
            title: 'Currencies',
            icon: DollarOutlined,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-esignature',
            path: `${APP_PREFIX_PATH}/setting/esignature`,
            title: 'ESignature',
            icon: FileDoneOutlined,
            breadcrumb: true,
            submenu: []
          },

        ]

      },
      {
        key: 'superadmin-inquiry',
        path: `${APP_PREFIX_PATH}/superadmin/inquiry`,
        title: 'Inquiry',
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: []
      },

    ]


  }
]

export { extraNavvvTree };





const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/dashboards`,
  title: 'CRM',
  icon: DashboardOutlined,
  breadcrumb: true,
  isGroupTitle: true,
  submenu: [

    {
      key: 'extra-pages-profile',
      path: `${APP_PREFIX_PATH}/pages/profile`,
      title: 'Dashboard',
      icon: FileDoneOutlined,
      breadcrumb: true,
      submenu: []
    },

    {
      key: 'dashboards-project',
      path: `${APP_PREFIX_PATH}/dashboards/project`,
      title: 'Project',
      icon: BulbOutlined,
      breadcrumb: true,
      submenu: [
        {
          key: 'dashboards-project-list',
          path: `${APP_PREFIX_PATH}/dashboards/project/list`,
          title: 'Projects',
          icon: FundProjectionScreenOutlined,
          breadcrumb: true,
          submenu: []
        },

        {
          key: 'dashboards-project-Contract',
          path: `${APP_PREFIX_PATH}/dashboards/project/contract`,
          title: 'Contract',
          icon: SnippetsOutlined,
          breadcrumb: true,
          submenu: []
        },


      ]
    },
    {
      key: 'dashboards-sales',
      path: `${APP_PREFIX_PATH}/dashboards/sales`,
      title: 'Sales',
      icon: TransactionOutlined,
      breadcrumb: true,
      submenu: [
        {
          key: 'dashboards-sales-customer',
          path: `${APP_PREFIX_PATH}/dashboards/sales/customer`,
          title: 'Customer',
          icon: UsergroupDeleteOutlined,
          breadcrumb: true,
          submenu: []
        },
        {
          key: 'dashboards-sales-invoice',
          path: `${APP_PREFIX_PATH}/dashboards/sales/invoice`,
          title: 'Invoice',
          icon: FundProjectionScreenOutlined,
          breadcrumb: true,
          submenu: []
        },


        {
          key: 'dashboards-sales-revenue',
          path: `${APP_PREFIX_PATH}/dashboards/sales/revenue`,
          title: 'Revenue',
          icon: DollarOutlined,
          breadcrumb: true,
          submenu: []
        },
        // {
        //   key: 'dashboards-sales-estimates',
        //   path: `${APP_PREFIX_PATH}/dashboards/sales/estimates`,
        //   title: 'Estimates',
        //   icon: RiseOutlined,
        //   breadcrumb: true,
        //   submenu: []
        // },

        {
          key: 'dashboards-sales-creditnotes',
          path: `${APP_PREFIX_PATH}/dashboards/sales/creditnotes`,
          title: 'Credit Notes',
          icon: SnippetsOutlined,
          breadcrumb: true,
          submenu: []
        },
      ]
    },

    {
      key: 'dashboards-banking',
      path: `${APP_PREFIX_PATH}/dashboards/banking`,
      title: 'Banking',
      icon: BankOutlined,
      breadcrumb: true,
      submenu: [
        {
          key: 'dashboards-banking-account',
          path: `${APP_PREFIX_PATH}/dashboards/banking/account`,
          title: 'Account',
          icon: UsergroupDeleteOutlined,
          breadcrumb: true,
          submenu: []
        },
        {
          key: 'dashboards-banking-transfer',
          path: `${APP_PREFIX_PATH}/dashboards/banking/transfer`,
          title: 'Transfer',
          icon: DollarOutlined,
          breadcrumb: true,
          submenu: []
        },
      ]
    },

    {
      key: 'dashboards-purchase',
      path: `${APP_PREFIX_PATH}/dashboards/purchase`,
      title: 'Purchase',
      icon: BankOutlined,
      breadcrumb: true,
      submenu: [
        {
          key: 'dashboards-purchase-vendor',
          path: `${APP_PREFIX_PATH}/dashboards/purchase/vendor`,
          title: 'Vendor',
          icon: UsergroupDeleteOutlined,
          breadcrumb: true,
          submenu: []
        },

        {
          key: 'dashboards-purchase-billing',
          path: `${APP_PREFIX_PATH}/dashboards/sales/billing`,
          title: 'Billing',
          icon: EuroCircleOutlined,
          breadcrumb: true,
          submenu: []
        },
        {
          key: 'dashboards-purchase-debitnote',
          path: `${APP_PREFIX_PATH}/dashboards/purchase/debitnote`,
          title: 'Debit Note',
          icon: DollarOutlined,
          breadcrumb: true,
          submenu: []
        },
      ]
    },
    // {
    //   key: 'dashboards-project-scrumboard',
    //   path: `${APP_PREFIX_PATH}/dashboards/project/scrumboard`,

    //   title: 'Leads',
    //   icon: RiseOutlined,
    //   breadcrumb: false,
    //   submenu: []
    // },
    // {
    //   key: 'dashboards-leadcards',
    //   path: `${APP_PREFIX_PATH}/dashboards/leadcards`,
    //   title: 'Lead Cards',
    //   icon: RiseOutlined,
    //   breadcrumb: true,
    //   submenu: []
    // },

    {
      key: 'dashboards-lead',
      path: `${APP_PREFIX_PATH}/dashboards/lead`,
      title: 'Leads',
      icon: RiseOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-deal',
      path: `${APP_PREFIX_PATH}/dashboards/deal`,
      title: 'Deals',
      icon: FundProjectionScreenOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-proposal',
      path: `${APP_PREFIX_PATH}/dashboards/proposal`,
      title: 'Proposal',
      icon: FundProjectionScreenOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-Task',
      path: `${APP_PREFIX_PATH}/dashboards/task`,
      title: 'Task',
      icon: BugOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-TaskCalendar',
      path: `${APP_PREFIX_PATH}/dashboards/taskcalendar`,
      title: 'Task Calendar',
      icon: CalendarOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-systemsetup',
      path: `${APP_PREFIX_PATH}/dashboards/systemsetup`,
      title: 'CRM System Setup',
      icon: BugOutlined,
      breadcrumb: true,
      submenu: []
    },

    {
      key: 'dashboards-mail',
      path: `${APP_PREFIX_PATH}/dashboards/mail/inbox`,
      title: 'Mail',
      icon: MailOutlined,
      breadcrumb: true,
      submenu: []
    },

    {
      key: 'dashboards-chat',
      path: `${APP_PREFIX_PATH}/dashboards/chat`,
      title: 'chat',
      icon: MessageOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'dashboards-calendar',
      path: `${APP_PREFIX_PATH}/dashboards/calendar`,
      title: 'calendar',
      icon: CalendarOutlined,
      breadcrumb: true,
      submenu: []
    },


    // {
    //   key: 'extra-pages',
    //   path: `${APP_PREFIX_PATH}/pages`,
    //   title: 'sidenav.pages',
    //   icon: FileTextOutlined,
    //   breadcrumb: true,
    //   submenu: [

    //     {
    //       key: 'extra-pages-invoice',
    //       path: `${APP_PREFIX_PATH}/pages/invoice`,
    //       title: 'sidenav.pages.invoice',
    //       icon: FileDoneOutlined,
    //       breadcrumb: true,
    //       submenu: []
    //     },



    //   ]
    // },
    {
      key: 'extra-users',
      path: `${APP_PREFIX_PATH}/users`,
      title: 'User Management',
      icon: TeamOutlined,
      breadcrumb: true,
      submenu: [{
        key: 'extra-users-list',
        path: `${APP_PREFIX_PATH}/users/user-list`,
        title: 'Users',
        icon: TeamOutlined,
        breadcrumb: true,
        submenu: []
      },
      {
        key: 'extra-users-client-list',
        path: `${APP_PREFIX_PATH}/users/client-list`,
        title: 'Clients',
        icon: UserOutlined,
        breadcrumb: true,
        submenu: []
      },

      ]
    },

    {
      key: 'extra-pages-customersupports',
      path: `${APP_PREFIX_PATH}/pages/customersupports`,
      title: 'Supports',
      icon: CommentOutlined,
      breadcrumb: true,
      submenu: [
        {
          key: 'extra-pages-customersupports-ticket',
          path: `${APP_PREFIX_PATH}/pages/customersupports/ticket`,
          title: 'Ticket',
          icon: MenuUnfoldOutlined,
          breadcrumb: true,
          submenu: []
        },

      ]
    }


    // 
  ]
}]


export { dashBoardNavTree };


const navigationConfig = [
  ...dashBoardNavTree,
  ...extraNavvTree,
  ...extraNavvvTree,

]

export default navigationConfig;


