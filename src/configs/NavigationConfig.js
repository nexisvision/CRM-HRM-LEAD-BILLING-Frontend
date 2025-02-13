import { 
  DashboardOutlined, 
  AppstoreOutlined,
  FileTextOutlined,
  // SettingOutlined,
  // DollarOutlined,
  MoneyCollectOutlined,
  AntDesignOutlined,
  BugOutlined,
  SafetyOutlined,
  BlockOutlined,
  PaperClipOutlined,
  StopOutlined,
  SnippetsOutlined,
  DotChartOutlined,
  UsergroupDeleteOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  ContactsOutlined,
  MessageOutlined,
  PicRightOutlined,
  StockOutlined,
  PullRequestOutlined,
  EuroCircleOutlined,
  ScheduleOutlined,
  CheckSquareOutlined,
  GlobalOutlined ,
  // SolutionOutlined,
  BankOutlined,
  BranchesOutlined, 
  DeploymentUnitOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  CrownOutlined,
  FireOutlined,
  BarChartOutlined,
  HomeOutlined,
  CompassOutlined,
  AppstoreAddOutlined,
  LayoutOutlined,
  EditOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  DollarOutlined,
  PoundOutlined,
  DesktopOutlined,
  FileDoneOutlined,
  CommentOutlined,
  RobotOutlined,
  SettingOutlined,
  RiseOutlined,
  FundProjectionScreenOutlined,
  PlusCircleOutlined,
  FundOutlined,
  ShoppingCartOutlined,
  UserOutlined,

  BookOutlined,
  FileUnknownOutlined,
  ProfileOutlined,
  AlertOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { AiOutlineDollar, AiOutlineBarChart  } from "react-icons/ai";
import { Spin } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';




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
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'extra-hrm-payroll',
            path: `${APP_PREFIX_PATH}/hrm/payroll`, 
            title: 'PayRoll',
            icon: PoundOutlined,
            breadcrumb: false,
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
            breadcrumb: false,
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
                icon: '',
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
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'extra-hrm-branch',
            path: `${APP_PREFIX_PATH}/hrm/branch`,
            title: 'Branch',
            icon: BranchesOutlined,
            breadcrumb: false,
            submenu: []
          },
         
          {
            key: 'extra-hrm-designation',
            path: `${APP_PREFIX_PATH}/hrm/designation`,
            title: 'Designation',
            icon: SolutionOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'extra-hrm-department',
            path: `${APP_PREFIX_PATH}/hrm/department`,
            title: 'Department',
            icon: BankOutlined,
            breadcrumb: false,
            submenu: []
          },
         
          {
            key: 'extra-hrm-attendance',
            path: `${APP_PREFIX_PATH}/hrm/attendance`,
            title: 'Attendance',
            icon:  CalendarOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'extra-hrm-attendance-attendancelist',
                path: `${APP_PREFIX_PATH}/hrm/attendance/attendancelist`,
                title: 'Attendance List',
                icon: '',
                breadcrumb: true,
                submenu: []
              },
             
            ]
          },
          {
            key: 'extra-hrm-leave',
            path: `${APP_PREFIX_PATH}/hrm/leave`,
            title: 'Leave Management',
            icon:  CalendarOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'extra-hrm-leave-leavelist',
                path: `${APP_PREFIX_PATH}/hrm/leave/leavelist`,
                title: 'Leave List',
                icon: '',
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
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'extra-hrm-announcement',
            path: `${APP_PREFIX_PATH}/hrm/announcement`,
            title: 'Announcement',
            icon: FireOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'extra-hrm-jobs',  
            path: `${APP_PREFIX_PATH}/hrm/jobs`,
            title: 'Job',
            icon:  CalendarOutlined,
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
        icon: PaperClipOutlined ,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'extra-hrm-trainingSetup',
        path: `${APP_PREFIX_PATH}/hrm/trainingSetup`,
        title: 'TrainingSetup',
        icon: CrownOutlined,
        breadcrumb: false,
        submenu: []
      },

      {
        key: 'setting',
        path: `${APP_PREFIX_PATH}/setting`,
        title: 'Setting',
        icon:  SettingOutlined ,
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
            icon: GlobalOutlined ,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-currencies',
            path: `${APP_PREFIX_PATH}/setting/currencies`,
            title: 'Currencies',
            icon: DollarOutlined ,
            breadcrumb: true,
            submenu: []
          },
          {
            key: 'extra-superadmin-setting-tax',
            path: `${APP_PREFIX_PATH}/setting/tax`,
            title: 'Tax',
            icon: MoneyCollectOutlined ,
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
    title: 'SuperAdmin',
    icon: PlusCircleOutlined,
    breadcrumb: true,
    isGroupTitle: true,
    submenu: [
      {
        key: 'superadmin-dashboard',
        path: `${APP_PREFIX_PATH}/superadmin/dashboard`,
        title: 'Dashboard',
        icon: HomeOutlined ,
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
        key: 'superadmin-planrequest',
        path: `${APP_PREFIX_PATH}/superadmin/planrequest`,
        title: 'Plan Request',
        icon: PullRequestOutlined ,
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
            icon:  SettingOutlined ,
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
                icon: GlobalOutlined ,
                breadcrumb: true,
                submenu: []
              },
              {
                key: 'extra-superadmin-setting-currencies',
                path: `${APP_PREFIX_PATH}/setting/currencies`,
                title: 'Currencies',
                icon: DollarOutlined ,
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
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: 'dashboards-default',
      path: `${APP_PREFIX_PATH}/dashboards/default`,  
      title: 'Contacts',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'dashboards-analytic',
      path: `${APP_PREFIX_PATH}/dashboards/analytic`,
      title: 'sidenav.dashboard.analytic',
      icon: DotChartOutlined,
      breadcrumb: false,
      submenu: []
    },
    // {
    //   key: 'dashboards-crm',
    //   path: `${APP_PREFIX_PATH}/dashboards/crm`,
    //   title: 'Dashboard',
    //   icon: HomeOutlined ,
    //   breadcrumb: false,
    //   submenu: []

    // },
   

    {
            key: 'dashboards-project',
            path: `${APP_PREFIX_PATH}/dashboards/project`,
            title: 'project',
            icon: BulbOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'dashboards-project-list',
                path: `${APP_PREFIX_PATH}/dashboards/project/list`,
                title: 'Projects',
                icon: FundProjectionScreenOutlined,
                breadcrumb: false,
                submenu: []
              },
          
              {
                key: 'dashboards-project-Contract',
                path: `${APP_PREFIX_PATH}/dashboards/project/contract`,
                title: 'Contract',
                icon: SnippetsOutlined,
                breadcrumb: false,
                submenu: []
              },
            
      
            ]
          },
          {
            key: 'dashboards-sales',
            path: `${APP_PREFIX_PATH}/dashboards/sales`,
            title: 'Sales',
            icon: BulbOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'dashboards-sales-customer',
                path: `${APP_PREFIX_PATH}/dashboards/sales/customer`,
                title: 'Customer',
                icon: UsergroupDeleteOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-sales-invoice',
                path: `${APP_PREFIX_PATH}/dashboards/sales/invoice`,
                title: 'Invoice',
                icon: FundProjectionScreenOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-sales-billing',
                path: `${APP_PREFIX_PATH}/dashboards/sales/billing`,
                title: 'Billing',
                icon: EuroCircleOutlined,
                breadcrumb: false,
                submenu: []
              },
             
              {
                key: 'dashboards-sales-revenue',
                path: `${APP_PREFIX_PATH}/dashboards/sales/revenue`,
                title: 'Revenue',
                icon: DollarOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-sales-estimates',
                path: `${APP_PREFIX_PATH}/dashboards/sales/estimates`,
                title: 'Estimates',
                icon: RiseOutlined,
                breadcrumb: false,
                submenu: []
              },
             
              {
                key: 'dashboards-sales-creditnotes',
                path: `${APP_PREFIX_PATH}/dashboards/sales/creditnotes`,
                title: 'Credit Notes',
                icon: EuroCircleOutlined,
                breadcrumb: false,
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
          {
            key: 'dashboards-leadcards',
            path: `${APP_PREFIX_PATH}/dashboards/leadcards`,
            title: 'LeadCards',
            icon: RiseOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-lead',
            path: `${APP_PREFIX_PATH}/dashboards/lead`,
            title: 'Leads',
            icon: RiseOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-deal',
            path: `${APP_PREFIX_PATH}/dashboards/deal`,
            title: 'Deals',
            icon: FundProjectionScreenOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-proposal',
            path: `${APP_PREFIX_PATH}/dashboards/proposal`,
            title: 'Proposal',
            icon: FundProjectionScreenOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-Task',
            path: `${APP_PREFIX_PATH}/dashboards/task`,
            title: 'Task',
            icon: BugOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-TaskCalendar',
            path: `${APP_PREFIX_PATH}/dashboards/taskcalendar`,
            title: 'Task Calendar',
            icon: CalendarOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-systemsetup',
            path: `${APP_PREFIX_PATH}/dashboards/systemsetup`,
            title: 'CRM System Setup',
            icon: BugOutlined,
            breadcrumb: false,
            submenu: []
          },
          
          {
            key: 'dashboards-mail',
            path: `${APP_PREFIX_PATH}/dashboards/mail/inbox`,
            title: 'Mail',
            icon: MailOutlined,
            breadcrumb: false,
            submenu: []
          },
       
          {
            key: 'dashboards-chat',
            path: `${APP_PREFIX_PATH}/dashboards/chat`,
            title: 'chat',
            icon: MessageOutlined,
            breadcrumb: false,
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
      
         
          {
            key: 'extra-pages',
            path: `${APP_PREFIX_PATH}/pages`,
            title: 'sidenav.pages',
            icon: FileTextOutlined,
            breadcrumb: true,
            submenu: [
              
              {
                key: 'extra-pages-invoice',
                path: `${APP_PREFIX_PATH}/pages/invoice`,
                title: 'sidenav.pages.invoice',
                icon: FileDoneOutlined,
                breadcrumb: true,
                submenu: []
              },
              {
                key: 'extra-pages-profile',
                path: `${APP_PREFIX_PATH}/pages/profile`,
                title: 'sidenav.pages.profile',
                icon: FileDoneOutlined,
                breadcrumb: true,
                submenu: []
              },

            
            ]
          },
          { 
            key: 'extra-users',
            path: `${APP_PREFIX_PATH}/users`,
            title: 'User Management',
            icon: TeamOutlined,
            breadcrumb: true,
            submenu: [ {
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
            
          ]},

          {
            key: 'extra-pages-customersupports',
            path: `${APP_PREFIX_PATH}/pages/customersupports`,
            title: 'Supports',
            icon:  CommentOutlined,
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
  // ...appsNavTree,
  // ...extraNavTree,
  ...extraNavvTree,
  ...extraNavvvTree,
  // ...componentsNavTree,

  // ...docsNavTree
]

export default navigationConfig;


