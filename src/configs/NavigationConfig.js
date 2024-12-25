import { 
  DashboardOutlined, 
  AppstoreOutlined,
  FileTextOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  AntDesignOutlined,
  BugOutlined,
  SafetyOutlined,
  BlockOutlined,
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
  EuroCircleOutlined,
  ScheduleOutlined,
  CheckSquareOutlined,
  // SolutionOutlined,
  BankOutlined,
  DeploymentUnitOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  CrownOutlined,
  FireOutlined,
  BarChartOutlined,
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

// const extraNavTree = [
//   {
//     key: 'extra',
//     path: `${APP_PREFIX_PATH}/pages`,
//     title: 'user management',
//     icon: PlusCircleOutlined,
//     breadcrumb: true,
//     isGroupTitle: true,
//     submenu: [
//       // {
//       //   key: 'extra-pages',
//       //   path: `${APP_PREFIX_PATH}/pages`,
//       //   title: 'sidenav.pages',
//       //   icon: FileTextOutlined,
//       //   breadcrumb: true,
//       //   submenu: [
//       //     {
//       //       key: 'extra-pages-profile',
//       //       path: `${APP_PREFIX_PATH}/pages/profile`,
//       //       title: 'sidenav.pages.profile',
//       //       icon: SolutionOutlined,
//       //       breadcrumb: false,
//       //       submenu: []
//       //     },
          
         
//       //     {
//       //       key: 'extra-pages-invoice',
//       //       path: `${APP_PREFIX_PATH}/pages/invoice`,
//       //       title: 'sidenav.pages.invoice',
//       //       icon: FileDoneOutlined,
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     // {
//       //     //   key: 'extra-pages-pricing',
//       //     //   path: `${APP_PREFIX_PATH}/pages/pricing`,
//       //     //   title: 'sidenav.pages.pricing',
//       //     //   icon: CreditCardOutlined,
//       //     //   breadcrumb: true,
//       //     //   submenu: []
//       //     // },
//       //     // {
//       //     //   key: 'extra-pages-faq',
//       //     //   path: `${APP_PREFIX_PATH}/pages/faq`,
//       //     //   title: 'sidenav.pages.faq',
//       //     //   icon: '',
//       //     //   breadcrumb: false,
//       //     //   submenu: []
//       //     // },
//       //     // {
//       //     //   key: 'extra-pages-setting',
//       //     //   path: `${APP_PREFIX_PATH}/pages/setting`,
//       //     //   title: 'sidenav.pages.setting',
//       //     //   icon: SettingOutlined,
//       //     //   breadcrumb: true,
//       //     //   submenu: []
//       //     // },
//       //     {
//       //       key: 'extra-pages-customersupports',
//       //       path: `${APP_PREFIX_PATH}/pages/customersupports`,
//       //       title: 'Supports',
//       //       icon:  CommentOutlined,
//       //       breadcrumb: true,
//       //       submenu: [
//       //         {
//       //           key: 'extra-pages-customersupports-ticket',
//       //           path: `${APP_PREFIX_PATH}/pages/customersupports/ticket`,
//       //           title: 'Ticket',
//       //           icon: MenuUnfoldOutlined,
//       //           breadcrumb: true,
//       //           submenu: []
//       //         },
//       //         // {
//       //         //   key: 'extra-errors-error-2',
//       //         //   path: `${APP_PREFIX_PATH}/error-page-2`,
//       //         //   title: 'sidenav.errors.error.2',
//       //         //   icon: '',
//       //         //   breadcrumb: true,
//       //         //   submenu: []
//       //         // }
//       //       ]
//       //     }
//       //   ]
//       // },
//       // { 
//       //   key: 'extra-users',
//       //   path: `${APP_PREFIX_PATH}/users`,
//       //   title: 'User Management',
//       //   icon: TeamOutlined,
//       //   breadcrumb: true,
//       //   submenu: [ {
//       //     key: 'extra-users-list',
//       //     path: `${APP_PREFIX_PATH}/users/user-list`,
//       //     title: 'Users',
//       //     icon: TeamOutlined,
//       //     breadcrumb: true,
//       //     submenu: []
//       //   },
//       //   {
//       //     key: 'extra-users-client-list',
//       //     path: `${APP_PREFIX_PATH}/users/client-list`,
//       //     title: 'Clients',
//       //     icon: UserOutlined,
//       //     breadcrumb: true,
//       //     submenu: []
//       //   },
//       //   {
//       //     key: 'extra-users-client-user-list',
//       //     path: `${APP_PREFIX_PATH}/users/client-user-list`,
//       //     title: 'Client Users',
//       //     icon: UserOutlined,
//       //     breadcrumb: true,
//       //     submenu: []
//       //   },]},

//       // {
//       //   key: 'extra-auth',
//       //   path: `${APP_PREFIX_PATH}`,
//       //   title: 'sidenav.authentication',
//       //   icon: SafetyOutlined,
//       //   breadcrumb: true,
//       //   submenu: [
//       //     {
//       //       key: 'extra-auth-login-1',
//       //       path: `${APP_PREFIX_PATH}/login-1`,
//       //       title: 'sidenav.authentication.login.1',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     {
//       //       key: 'extra-auth-login-2',
//       //       path: `${APP_PREFIX_PATH}/login-2`,
//       //       title: 'sidenav.authentication.login.2',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     {
//       //       key: 'extra-auth-register-1',
//       //       path: `${APP_PREFIX_PATH}/register-1`,
//       //       title: 'sidenav.authentication.register.1',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     {
//       //       key: 'extra-auth-register-2',
//       //       path: `${APP_PREFIX_PATH}/register-2`,
//       //       title: 'sidenav.authentication.register.2',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     {
//       //       key: 'extra-auth-forgot-password',
//       //       path: `${APP_PREFIX_PATH}/forgot-password`,
//       //       title: 'sidenav.authentication.forgetPassword',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     }
//       //   ]
//       // },
//       // {
//       //   key: 'extra-errors',
//       //   path: `${APP_PREFIX_PATH}/error-1`,
//       //   title: 'sidenav.errors',
//       //   icon: StopOutlined,
//       //   breadcrumb: true,
//       //   submenu: [
//       //     {
//       //       key: 'extra-errors-error-1',
//       //       path: `${APP_PREFIX_PATH}/error-page-1`,
//       //       title: 'sidenav.errors.error.1',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     },
//       //     {
//       //       key: 'extra-errors-error-2',
//       //       path: `${APP_PREFIX_PATH}/error-page-2`,
//       //       title: 'sidenav.errors.error.2',
//       //       icon: '',
//       //       breadcrumb: true,
//       //       submenu: []
//       //     }
//       //   ]
//       // },
          
//     ]
//   }
// ]




const extraNavvTree = [
  {
    key: 'extra',
    path: `${APP_PREFIX_PATH}/hrm`,
    title: 'HRM',
    icon: PlusCircleOutlined,
    breadcrumb: true,
    isGroupTitle: true,
    submenu: [
      // {
      //   key: 'extra-hrm',
      //   path: `${APP_PREFIX_PATH}/hrm`,
      //   title: 'HRM',
      //   icon: FileTextOutlined,
      //   breadcrumb: true,
      //   submenu: [
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
              {
                key: 'extra-hrm-payroll-payslip',
                path: `${APP_PREFIX_PATH}/hrm/payroll/payslip`,
                title: 'PaySlip',
                icon: FileTextOutlined,
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
              {
                key: 'extra-hrm-performance-goaltracking',
                path: `${APP_PREFIX_PATH}/hrm/performance/goaltracking`,
                title: 'GoalTracking',
                icon: DeploymentUnitOutlined,
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
            key: 'extra-hrm-permission',
            path: `${APP_PREFIX_PATH}/hrm/permission`,
            title: 'Permission',
            icon: CheckSquareOutlined,
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
              // {
              //   key: 'extra-hrm-attendance-myattendance',
              //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
              //   title: 'My Attendance',
              //   icon: '',
              //   breadcrumb: true,
              //   submenu: []
              // }
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
              // {
              //   key: 'extra-hrm-attendance-myattendance',
              //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
              //   title: 'My Attendance',
              //   icon: '',
              //   breadcrumb: true,
              //   submenu: []
              // }
            ]
            
          },
          {
            key: 'extra-hrm-eventsetup',
            path: `${APP_PREFIX_PATH}/hrm/eventsetup`,
            title: 'EventSetup',
            icon: AlertOutlined,
            breadcrumb: false,
            submenu: []
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
                key: 'extra-hrm-jobs-interview',
                path: `${APP_PREFIX_PATH}/hrm/jobs/interview`,
                title: 'Interviews',
                icon: ScheduleOutlined,
                breadcrumb: true,
                submenu: []
              },
              // {
              //   key: 'extra-hrm-attendance-myattendance',
              //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
              //   title: 'My Attendance',
              //   icon: '',
              //   breadcrumb: true,
              //   submenu: []
              // }
            ]
            
          },
        ]
      },

      
    ]
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
        key: 'superadmin-coupon',
        path: `${APP_PREFIX_PATH}/superadmin/coupon`,
        title: 'Coupon',
        icon: FileTextOutlined,
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
    ]
  }
]









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
    {
      key: 'dashboards-sales',
      path: `${APP_PREFIX_PATH}/dashboards/sales`,
      title: 'Sales Pipeline Management',
      icon: FundOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'dashboards-superadmindashboard',
      path: `${APP_PREFIX_PATH}/dashboards/superadmindashboard`,
      title: 'Super Admin Dashboard',
      icon: PicRightOutlined,
      breadcrumb: false,
      submenu: []
    },
    // 
   
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
                key: 'dashboards-project-scrumboard',
                path: `${APP_PREFIX_PATH}/dashboards/project/scrumboard`,
                title: 'Leads',
                icon: RiseOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-project-lead',
                path: `${APP_PREFIX_PATH}/dashboards/project/lead`,
                title: 'Leadss',
                icon: RiseOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-project-deal',
                path: `${APP_PREFIX_PATH}/dashboards/project/deal`,
                title: 'Deals',
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
              {
                key: 'dashboards-project-Bug',
                path: `${APP_PREFIX_PATH}/dashboards/project/bug`,
                title: 'Bug',
                icon: BugOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-project-Task',
                path: `${APP_PREFIX_PATH}/dashboards/project/task`,
                title: 'Task',
                icon: BugOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-project-TaskCalendar',
                path: `${APP_PREFIX_PATH}/dashboards/project/taskcalendar`,
                title: 'Task Calendar',
                icon: CalendarOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-project-projectreport',
                path: `${APP_PREFIX_PATH}/dashboards/project/projectreport`,
                title: 'Project Report',
                icon: FundProjectionScreenOutlined,
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
                key: 'dashboards-sales-payments',
                path: `${APP_PREFIX_PATH}/dashboards/sales/payments`,
                title: 'Payments',
                icon: DollarOutlined,
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
                key: 'dashboards-sales-expenses',
                path: `${APP_PREFIX_PATH}/dashboards/sales/expenses`,
                title: 'Expenses',
                icon: EuroCircleOutlined,
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
          {
            key: 'dashboards-contacts',
            path: `${APP_PREFIX_PATH}/dashboards/contacts`,
            title: 'Contacts',
            icon: ContactsOutlined,
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'dashboards-mail',
            path: `${APP_PREFIX_PATH}/dashboards/mail/inbox`,
            title: 'mail',
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
            key: 'dashboards-ecommerce',
            path: `${APP_PREFIX_PATH}/dashboards/ecommerce`,
            title: 'ecommerce',
            icon: ShoppingCartOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'dashboards-ecommerce-productList',
                path: `${APP_PREFIX_PATH}/dashboards/ecommerce/product-list`,
                title: 'productList',
                icon: '',
                breadcrumb: true,
                submenu: []
              },
              {
                key: 'dashboards-ecommerce-addProduct',
                path: `${APP_PREFIX_PATH}/dashboards/ecommerce/add-product`,
                title: 'addProduct',
                icon: AppstoreAddOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-ecommerce-editProduct',
                path: `${APP_PREFIX_PATH}/dashboards/ecommerce/edit-product/12`,
                title: 'editProduct',
                icon: EditOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'dashboards-ecommerce-orders',
                path: `${APP_PREFIX_PATH}/dashboards/ecommerce/orders`,
                title: 'orders',
                icon: '',
                breadcrumb: false,
                submenu: []
              }
            ]
          },
          {
            key: 'extra-pages',
            path: `${APP_PREFIX_PATH}/pages`,
            title: 'sidenav.pages',
            icon: FileTextOutlined,
            breadcrumb: true,
            submenu: [
              {
                key: 'extra-pages-profile',
                path: `${APP_PREFIX_PATH}/pages/profile`,
                title: 'sidenav.pages.profile',
                icon: SolutionOutlined,
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'extra-pages-invoice',
                path: `${APP_PREFIX_PATH}/pages/invoice`,
                title: 'sidenav.pages.invoice',
                icon: FileDoneOutlined,
                breadcrumb: true,
                submenu: []
              },
             
              {
                key: 'extra-pages-esignature',
                path: `${APP_PREFIX_PATH}/pages/esignature`,
                title: 'esignature',
                icon: FileDoneOutlined,
                breadcrumb: true,
                submenu: []
              },
              // {
              //   key: 'extra-pages-pricing',
              //   path: `${APP_PREFIX_PATH}/pages/pricing`,
              //   title: 'sidenav.pages.pricing',
              //   icon: CreditCardOutlined,
              //   breadcrumb: true,
              //   submenu: []
              // },
              // {
              //   key: 'extra-pages-faq',
              //   path: `${APP_PREFIX_PATH}/pages/faq`,
              //   title: 'sidenav.pages.faq',
              //   icon: '',
              //   breadcrumb: false,
              //   submenu: []
              // },
              // {
              //   key: 'extra-pages-setting',
              //   path: `${APP_PREFIX_PATH}/pages/setting`,
              //   title: 'sidenav.pages.setting',
              //   icon: SettingOutlined,
              //   breadcrumb: true,
              //   submenu: []
              // },
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
                  // {
                  //   key: 'extra-errors-error-2',
                  //   path: `${APP_PREFIX_PATH}/error-page-2`,
                  //   title: 'sidenav.errors.error.2',
                  //   icon: '',
                  //   breadcrumb: true,
                  //   submenu: []
                  // }
                ]
              }
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
            {
              key: 'extra-users-client-user-list',
              path: `${APP_PREFIX_PATH}/users/client-user-list`,
              title: 'Client Users',
              icon: UserOutlined,
              breadcrumb: true,
              submenu: []
            },
          ]},
          
        
    // 
  ]
}]

// const appsNavTree = [{
//   key: 'apps',
//   path: `${APP_PREFIX_PATH}/apps`,
//   title: 'sidenav.apps',
//   icon: AppstoreOutlined,
//   breadcrumb: false,
//   isGroupTitle: true,
//   submenu: [
//     {
//       key: 'apps-project',
//       path: `${APP_PREFIX_PATH}/apps/project`,
//       title: 'sidenav.apps.project',
//       icon: BulbOutlined,
//       breadcrumb: true,
//       submenu: [
//         // {
//         //   key: 'apps-project-list',
//         //   path: `${APP_PREFIX_PATH}/apps/project/list`,
//         //   title: 'Projects',
//         //   icon: FundProjectionScreenOutlined,
//         //   breadcrumb: false,
//         //   submenu: []
//         // },
//         {
//           key: 'apps-project-scrumboard',
//           path: `${APP_PREFIX_PATH}/apps/project/scrumboard`,
//           title: 'Leads',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-lead',
//           path: `${APP_PREFIX_PATH}/apps/project/lead`,
//           title: 'Leadss',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-deal',
//           path: `${APP_PREFIX_PATH}/apps/project/deal`,
//           title: 'Deals',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Contract',
//           path: `${APP_PREFIX_PATH}/apps/project/contract`,
//           title: 'Contract',
//           icon: SnippetsOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Bug',
//           path: `${APP_PREFIX_PATH}/apps/project/bug`,
//           title: 'Bug',
//           icon: BugOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Task',
//           path: `${APP_PREFIX_PATH}/apps/project/task`,
//           title: 'Task',
//           icon: BugOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-TaskCalendar',
//           path: `${APP_PREFIX_PATH}/apps/project/taskcalendar`,
//           title: 'Task Calendar',
//           icon: CalendarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-projectreport',
//           path: `${APP_PREFIX_PATH}/apps/project/projectreport`,
//           title: 'Project Report',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },

//       ]
//     },
//     {
//       key: 'apps-sales',
//       path: `${APP_PREFIX_PATH}/apps/sales`,
//       title: 'Sales',
//       icon: BulbOutlined,
//       breadcrumb: true,
//       submenu: [
//         {
//           key: 'apps-sales-customer',
//           path: `${APP_PREFIX_PATH}/apps/sales/customer`,
//           title: 'Customer',
//           icon: UsergroupDeleteOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-invoice',
//           path: `${APP_PREFIX_PATH}/apps/sales/invoice`,
//           title: 'Invoice',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-payments',
//           path: `${APP_PREFIX_PATH}/apps/sales/payments`,
//           title: 'Payments',
//           icon: DollarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-revenue',
//           path: `${APP_PREFIX_PATH}/apps/sales/revenue`,
//           title: 'Revenue',
//           icon: DollarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-estimates',
//           path: `${APP_PREFIX_PATH}/apps/sales/estimates`,
//           title: 'Estimates',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-expenses',
//           path: `${APP_PREFIX_PATH}/apps/sales/expenses`,
//           title: 'Expenses',
//           icon: EuroCircleOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-creditnotes',
//           path: `${APP_PREFIX_PATH}/apps/sales/creditnotes`,
//           title: 'Credit Notes',
//           icon: EuroCircleOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//       ]
//     },
//     {
//       key: 'apps-contacts',
//       path: `${APP_PREFIX_PATH}/apps/contacts`,
//       title: 'Contacts',
//       icon: ContactsOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'apps-mail',
//       path: `${APP_PREFIX_PATH}/apps/mail/inbox`,
//       title: 'sidenav.apps.mail',
//       icon: MailOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
 
//     {
//       key: 'apps-chat',
//       path: `${APP_PREFIX_PATH}/apps/chat`,
//       title: 'sidenav.apps.chat',
//       icon: MessageOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'apps-calendar',
//       path: `${APP_PREFIX_PATH}/apps/calendar`,
//       title: 'sidenav.apps.calendar',
//       icon: CalendarOutlined,
//       breadcrumb: true,
//       submenu: []
//     },

//     {
//       key: 'apps-ecommerce',
//       path: `${APP_PREFIX_PATH}/apps/ecommerce`,
//       title: 'sidenav.apps.ecommerce',
//       icon: ShoppingCartOutlined,
//       breadcrumb: true,
//       submenu: [
//         {
//           key: 'apps-ecommerce-productList',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/product-list`,
//           title: 'sidenav.apps.ecommerce.productList',
//           icon: '',
//           breadcrumb: true,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-addProduct',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/add-product`,
//           title: 'sidenav.apps.ecommerce.addProduct',
//           icon: AppstoreAddOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-editProduct',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/edit-product/12`,
//           title: 'sidenav.apps.ecommerce.editProduct',
//           icon: EditOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-orders',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/orders`,
//           title: 'sidenav.apps.ecommerce.orders',
//           icon: '',
//           breadcrumb: false,
//           submenu: []
//         }
//       ]
//     }
//   ]
// }]

// const componentsNavTree = [
//   {
//     key: 'components',
//     path: `${APP_PREFIX_PATH}/components`,
//     title: 'sidenav.components',
//     icon: AntDesignOutlined,
//     breadcrumb: true,
//     isGroupTitle: true,
//     submenu: [
//       {
//         key: 'components-general',
//         path: `${APP_PREFIX_PATH}/components/general`,
//         title: 'sidenav.components.general',
//         icon: InfoCircleOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-general-button',
//             path: `${APP_PREFIX_PATH}/components/general/button`,
//             title: 'sidenav.components.general.button',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-general-icon',
//             path: `${APP_PREFIX_PATH}/components/general/icon`,
//             title: 'sidenav.components.general.icon',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-general-typography',
//             path: `${APP_PREFIX_PATH}/components/general/typography`,
//             title: 'sidenav.components.general.typography',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-layout',
//         path: `${APP_PREFIX_PATH}/components/layout`,
//         title: 'sidenav.components.layout',
//         icon: LayoutOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-layout-grid',
//             path: `${APP_PREFIX_PATH}/components/layout/grid`,
//             title: 'sidenav.components.layout.grid',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-layout-layout',
//             path: `${APP_PREFIX_PATH}/components/layout/layout`,
//             title: 'sidenav.components.layout.layout',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-navigation',
//         path: `${APP_PREFIX_PATH}/components/navigation`,
//         title: 'sidenav.components.navigation',
//         icon: CompassOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-navigation-affix',
//             path: `${APP_PREFIX_PATH}/components/navigation/affix`,
//             title: 'sidenav.components.navigation.affix',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-navigation-breadcrumb',
//             path: `${APP_PREFIX_PATH}/components/navigation/breadcrumb`,
//             title: 'sidenav.components.navigation.breadcrumb',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-navigation-dropdown',
//             path: `${APP_PREFIX_PATH}/components/navigation/dropdown`,
//             title: 'sidenav.components.navigation.dropdown',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-navigation-menu',
//             path: `${APP_PREFIX_PATH}/components/navigation/menu`,
//             title: 'sidenav.components.navigation.menu',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-navigation-pagination',
//             path: `${APP_PREFIX_PATH}/components/navigation/pagination`,
//             title: 'sidenav.components.navigation.pagination',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-navigation-steps',
//             path: `${APP_PREFIX_PATH}/components/navigation/steps`,
//             title: 'sidenav.components.navigation.steps',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-data-entry',
//         path: `${APP_PREFIX_PATH}/components/data-entry`,
//         title: 'sidenav.components.dataEntry',
//         icon: FileDoneOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-data-entry-auto-complete',
//             path: `${APP_PREFIX_PATH}/components/data-entry/auto-complete`,
//             title: 'sidenav.components.dataEntry.autoComplete',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-checkbox',
//             path: `${APP_PREFIX_PATH}/components/data-entry/checkbox`,
//             title: 'sidenav.components.dataEntry.checkbox',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-cascader',
//             path: `${APP_PREFIX_PATH}/components/data-entry/cascader`,
//             title: 'sidenav.components.dataEntry.cascader',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-date-picker',
//             path: `${APP_PREFIX_PATH}/components/data-entry/date-picker`,
//             title: 'sidenav.components.dataEntry.datePicker',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-form',
//             path: `${APP_PREFIX_PATH}/components/data-entry/form`,
//             title: 'sidenav.components.dataEntry.form',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-input-number',
//             path: `${APP_PREFIX_PATH}/components/data-entry/input-number`,
//             title: 'sidenav.components.dataEntry.inputNumber',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-input',
//             path: `${APP_PREFIX_PATH}/components/data-entry/input`,
//             title: 'sidenav.components.dataEntry.input',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-mentions',
//             path: `${APP_PREFIX_PATH}/components/data-entry/mentions`,
//             title: 'sidenav.components.dataEntry.mentions',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-rate',
//             path: `${APP_PREFIX_PATH}/components/data-entry/rate`,
//             title: 'sidenav.components.dataEntry.rate',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-radio',
//             path: `${APP_PREFIX_PATH}/components/data-entry/radio`,
//             title: 'sidenav.components.dataEntry.radio',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-switch',
//             path: `${APP_PREFIX_PATH}/components/data-entry/switch`,
//             title: 'sidenav.components.dataEntry.switch',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-slider',
//             path: `${APP_PREFIX_PATH}/components/data-entry/slider`,
//             title: 'sidenav.components.dataEntry.slider',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-select',
//             path: `${APP_PREFIX_PATH}/components/data-entry/select`,
//             title: 'sidenav.components.dataEntry.select',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-tree-select',
//             path: `${APP_PREFIX_PATH}/components/data-entry/tree-select`,
//             title: 'sidenav.components.dataEntry.treeSelect',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-transfer',
//             path: `${APP_PREFIX_PATH}/components/data-entry/transfer`,
//             title: 'sidenav.components.dataEntry.transfer',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-time-picker',
//             path: `${APP_PREFIX_PATH}/components/data-entry/time-picker`,
//             title: 'sidenav.components.dataEntry.timePicker',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-entry-upload',
//             path: `${APP_PREFIX_PATH}/components/data-entry/upload`,
//             title: 'sidenav.components.dataEntry.upload',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//         ]
//       },
//       {
//         key: 'components-data-display',
//         path: `${APP_PREFIX_PATH}/components/data-display`,
//         title: 'sidenav.components.dataDisplay',
//         icon: DesktopOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-data-display-avatar',
//             path: `${APP_PREFIX_PATH}/components/data-display/avatar`,
//             title: 'sidenav.components.dataDisplay.avatar',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-badge',
//             path: `${APP_PREFIX_PATH}/components/data-display/badge`,
//             title: 'sidenav.components.dataDisplay.badge',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-collapse',
//             path: `${APP_PREFIX_PATH}/components/data-display/collapse`,
//             title: 'sidenav.components.dataDisplay.collapse',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-carousel',
//             path: `${APP_PREFIX_PATH}/components/data-display/carousel`,
//             title: 'sidenav.components.dataDisplay.carousel',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-card',
//             path: `${APP_PREFIX_PATH}/components/data-display/card`,
//             title: 'sidenav.components.dataDisplay.card',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-calendar',
//             path: `${APP_PREFIX_PATH}/components/data-display/calendar`,
//             title: 'sidenav.components.dataDisplay.calendar',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-descriptions',
//             path: `${APP_PREFIX_PATH}/components/data-display/descriptions`,
//             title: 'sidenav.components.dataDisplay.descriptions',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-empty',
//             path: `${APP_PREFIX_PATH}/components/data-display/empty`,
//             title: 'sidenav.components.dataDisplay.empty',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-list',
//             path: `${APP_PREFIX_PATH}/components/data-display/list`,
//             title: 'sidenav.components.dataDisplay.list',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-popover',
//             path: `${APP_PREFIX_PATH}/components/data-display/popover`,
//             title: 'sidenav.components.dataDisplay.popover',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-statistic',
//             path: `${APP_PREFIX_PATH}/components/data-display/statistic`,
//             title: 'sidenav.components.dataDisplay.statistic',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-tree',
//             path: `${APP_PREFIX_PATH}/components/data-display/tree`,
//             title: 'sidenav.components.dataDisplay.tree',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-tooltip',
//             path: `${APP_PREFIX_PATH}/components/data-display/tooltip`,
//             title: 'sidenav.components.dataDisplay.tooltip',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-timeline',
//             path: `${APP_PREFIX_PATH}/components/data-display/timeline`,
//             title: 'sidenav.components.dataDisplay.timeline',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-tag',
//             path: `${APP_PREFIX_PATH}/components/data-display/tag`,
//             title: 'sidenav.components.dataDisplay.tag',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-tabs',
//             path: `${APP_PREFIX_PATH}/components/data-display/tabs`,
//             title: 'sidenav.components.dataDisplay.tabs',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-data-display-table',
//             path: `${APP_PREFIX_PATH}/components/data-display/table`,
//             title: 'sidenav.components.dataDisplay.table',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//         ]
//       },
//       {
//         key: 'components-feedback',
//         path: `${APP_PREFIX_PATH}/components/feedback`,
//         title: 'sidenav.components.feedback',
//         icon: CommentOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-feedback-alert',
//             path: `${APP_PREFIX_PATH}/components/feedback/alert`,
//             title: 'sidenav.components.feedback.alert',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-drawer',
//             path: `${APP_PREFIX_PATH}/components/feedback/drawer`,
//             title: 'sidenav.components.feedback.drawer',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-modal',
//             path: `${APP_PREFIX_PATH}/components/feedback/modal`,
//             title: 'sidenav.components.feedback.modal',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-message',
//             path: `${APP_PREFIX_PATH}/components/feedback/message`,
//             title: 'sidenav.components.feedback.message',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-notification',
//             path: `${APP_PREFIX_PATH}/components/feedback/notification`,
//             title: 'sidenav.components.feedback.notification',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-progress',
//             path: `${APP_PREFIX_PATH}/components/feedback/progress`,
//             title: 'sidenav.components.feedback.progress',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-popconfirm',
//             path: `${APP_PREFIX_PATH}/components/feedback/popconfirm`,
//             title: 'sidenav.components.feedback.popconfirm',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-result',
//             path: `${APP_PREFIX_PATH}/components/feedback/result`,
//             title: 'sidenav.components.feedback.result',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-spin',
//             path: `${APP_PREFIX_PATH}/components/feedback/spin`,
//             title: 'sidenav.components.feedback.spin',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-feedback-skeleton',
//             path: `${APP_PREFIX_PATH}/components/feedback/skeleton`,
//             title: 'sidenav.components.feedback.skeleton',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-other',
//         path: `${APP_PREFIX_PATH}/components/other`,
//         title: 'sidenav.components.other',
//         icon: RobotOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-other-anchor',
//             path: `${APP_PREFIX_PATH}/components/other/anchor`,
//             title: 'sidenav.components.other.anchor',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-other-backtop',
//             path: `${APP_PREFIX_PATH}/components/other/backtop`,
//             title: 'sidenav.components.other.backtop',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-other-config-provider',
//             path: `${APP_PREFIX_PATH}/components/other/config-provider`,
//             title: 'sidenav.components.other.configProvider',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-other-divider',
//             path: `${APP_PREFIX_PATH}/components/other/divider`,
//             title: 'sidenav.components.other.divider',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-charts',
//         path: `${APP_PREFIX_PATH}/components/charts`,
//         title: 'sidenav.charts',
//         icon: PieChartOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'components-charts-apex',
//             path: `${APP_PREFIX_PATH}/components/charts/apex-charts`,
//             title: 'sidenav.charts.apex',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'components-charts-chartjs',
//             path: `${APP_PREFIX_PATH}/components/charts/chartjs`,
//             title: 'sidenav.charts.chartjs',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'components-maps',
//         path: `${APP_PREFIX_PATH}/components/maps`,
//         title: 'sidenav.maps',
//         icon: EnvironmentOutlined,
//         breadcrumb: true,
//         submenu: [
//           // {
//           //   key: 'components-maps-google',
//           //   path: `${APP_PREFIX_PATH}/components/maps/google-map`,
//           //   title: 'sidenav.maps.google',
//           //   icon: '',
//           //   breadcrumb: true,
//           //   submenu: []
//           // },
//           {
//             key: 'components-maps-simple',
//             path: `${APP_PREFIX_PATH}/components/maps/simple-map`,
//             title: 'sidenav.maps.simple',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       }
//     ]
//   }
// ]

// const docsNavTree = [{
//   key: 'docs',
//   path: `${APP_PREFIX_PATH}/docs`,
//   title: 'sidenav.docs',
//   icon: BookOutlined,
//   breadcrumb: false,
//   isGroupTitle: true,
//   submenu: [
//     {
//       key: 'docs-documentation',
//       path: `${APP_PREFIX_PATH}/docs/documentation`,
//       title: 'sidenav.docs.documentation',
//       icon: FileUnknownOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'docs-changelog',
//       path: `${APP_PREFIX_PATH}/docs/documentation/changelog`,
//       title: 'sidenav.docs.changelog',
//       icon: ProfileOutlined,
//       breadcrumb: false,
//       submenu: []
//     }
//   ]
// }]

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







// import { 
//   DashboardOutlined, 
//   AppstoreOutlined,
//   FileTextOutlined,
//   PieChartOutlined,
//   EnvironmentOutlined,
//   AntDesignOutlined,
//   BugOutlined,
//   SafetyOutlined,
//   BlockOutlined,
//   StopOutlined,
//   SnippetsOutlined,
//   DotChartOutlined,
//   UsergroupDeleteOutlined,
//   MailOutlined,
//   MenuUnfoldOutlined,
//   TeamOutlined,
//   ContactsOutlined,
//   MessageOutlined,
//   PicRightOutlined,
//   StockOutlined,
//   EuroCircleOutlined,
//   ScheduleOutlined,
//   CheckSquareOutlined,
//   // SolutionOutlined,
//   BankOutlined,
//   DeploymentUnitOutlined,
//   CreditCardOutlined,
//   CalendarOutlined,
//   BulbOutlined,
//   InfoCircleOutlined,
//   CrownOutlined,
//   FireOutlined,
//   BarChartOutlined,
//   CompassOutlined,
//   AppstoreAddOutlined,
//   LayoutOutlined,
//   EditOutlined,
//   IdcardOutlined,
//   UsergroupAddOutlined,
//   SolutionOutlined,
//   DollarOutlined,
//   PoundOutlined,
//   DesktopOutlined,
//   FileDoneOutlined,
//   CommentOutlined,
//   RobotOutlined,
//   SettingOutlined,
//   RiseOutlined,
//   FundProjectionScreenOutlined,
//   PlusCircleOutlined,
//   FundOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
//   BookOutlined,
//   FileUnknownOutlined,
//   ProfileOutlined,
//   AlertOutlined,
//   ControlOutlined
// } from '@ant-design/icons';
// import { AiOutlineDollar, AiOutlineBarChart  } from "react-icons/ai";
// import { Spin } from 'antd';
// import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
// import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

// const extraNavTree = [
//   {
//     key: 'extra',
//     path: `${APP_PREFIX_PATH}/pages`,
//     title: 'sidenav.pages',
//     icon: PlusCircleOutlined,
//     breadcrumb: true,
//     isGroupTitle: true,
//     submenu: [
//       {
//         key: 'extra-pages',
//         path: `${APP_PREFIX_PATH}/pages`,
//         title: 'sidenav.pages',
//         icon: FileTextOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'extra-pages-profile',
//             path: `${APP_PREFIX_PATH}/pages/profile`,
//             title: 'sidenav.pages.profile',
//             icon: SolutionOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
          
         
//           {
//             key: 'extra-pages-invoice',
//             path: `${APP_PREFIX_PATH}/pages/invoice`,
//             title: 'sidenav.pages.invoice',
//             icon: FileDoneOutlined,
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-pages-pricing',
//             path: `${APP_PREFIX_PATH}/pages/pricing`,
//             title: 'sidenav.pages.pricing',
//             icon: CreditCardOutlined,
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-pages-faq',
//             path: `${APP_PREFIX_PATH}/pages/faq`,
//             title: 'sidenav.pages.faq',
//             icon: '',
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-pages-setting',
//             path: `${APP_PREFIX_PATH}/pages/setting`,
//             title: 'sidenav.pages.setting',
//             icon: SettingOutlined,
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-pages-customersupports',
//             path: `${APP_PREFIX_PATH}/pages/customersupports`,
//             title: 'Supports',
//             icon:  CommentOutlined,
//             breadcrumb: true,
//             submenu: [
//               {
//                 key: 'extra-pages-customersupports-ticket',
//                 path: `${APP_PREFIX_PATH}/pages/customersupports/ticket`,
//                 title: 'Ticket',
//                 icon: MenuUnfoldOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-errors-error-2',
//                 path: `${APP_PREFIX_PATH}/error-page-2`,
//                 title: 'sidenav.errors.error.2',
//                 icon: '',
//                 breadcrumb: true,
//                 submenu: []
//               }
//             ]
//           }
//         ]
//       },
//       { 
//         key: 'extra-users',
//         path: `${APP_PREFIX_PATH}/users`,
//         title: 'User Management',
//         icon: TeamOutlined,
//         breadcrumb: true,
//         submenu: [ {
//           key: 'extra-users-list',
//           path: `${APP_PREFIX_PATH}/users/user-list`,
//           title: 'Users',
//           icon: TeamOutlined,
//           breadcrumb: true,
//           submenu: []
//         },
//         {
//           key: 'extra-users-client-list',
//           path: `${APP_PREFIX_PATH}/users/client-list`,
//           title: 'Clients',
//           icon: UserOutlined,
//           breadcrumb: true,
//           submenu: []
//         },
//         {
//           key: 'extra-users-client-user-list',
//           path: `${APP_PREFIX_PATH}/users/client-user-list`,
//           title: 'Client Users',
//           icon: UserOutlined,
//           breadcrumb: true,
//           submenu: []
//         },]},

//       {
//         key: 'extra-auth',
//         path: `${APP_PREFIX_PATH}`,
//         title: 'sidenav.authentication',
//         icon: SafetyOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'extra-auth-login-1',
//             path: `${APP_PREFIX_PATH}/login-1`,
//             title: 'sidenav.authentication.login.1',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-auth-login-2',
//             path: `${APP_PREFIX_PATH}/login-2`,
//             title: 'sidenav.authentication.login.2',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-auth-register-1',
//             path: `${APP_PREFIX_PATH}/register-1`,
//             title: 'sidenav.authentication.register.1',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-auth-register-2',
//             path: `${APP_PREFIX_PATH}/register-2`,
//             title: 'sidenav.authentication.register.2',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-auth-forgot-password',
//             path: `${APP_PREFIX_PATH}/forgot-password`,
//             title: 'sidenav.authentication.forgetPassword',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
//       {
//         key: 'extra-errors',
//         path: `${APP_PREFIX_PATH}/error-1`,
//         title: 'sidenav.errors',
//         icon: StopOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'extra-errors-error-1',
//             path: `${APP_PREFIX_PATH}/error-page-1`,
//             title: 'sidenav.errors.error.1',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           },
//           {
//             key: 'extra-errors-error-2',
//             path: `${APP_PREFIX_PATH}/error-page-2`,
//             title: 'sidenav.errors.error.2',
//             icon: '',
//             breadcrumb: true,
//             submenu: []
//           }
//         ]
//       },
          
//     ]
//   }
// ]




// const extraNavvTree = [
//   {
//     key: 'extra',
//     path: `${APP_PREFIX_PATH}/hrm`,
//     title: 'HRM',
//     icon: PlusCircleOutlined,
//     breadcrumb: true,
//     isGroupTitle: true,
//     submenu: [
//       {
//         key: 'extra-hrm',
//         path: `${APP_PREFIX_PATH}/hrm`,
//         title: 'HRM',
//         icon: FileTextOutlined,
//         breadcrumb: true,
//         submenu: [
//           {
//             key: 'extra-hrm-employee',
//             path: `${APP_PREFIX_PATH}/hrm/employee`,
//             title: 'Employee',
//             icon: IdcardOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-payroll',
//             path: `${APP_PREFIX_PATH}/hrm/payroll`,
//             title: 'PayRoll',
//             icon: PoundOutlined,
//             breadcrumb: false,
//             submenu: [
//               {
//                 key: 'extra-hrm-payroll-salary',
//                 path: `${APP_PREFIX_PATH}/hrm/payroll/salary`,
//                 title: 'Salary',
//                 icon: DollarOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-payroll-payslip',
//                 path: `${APP_PREFIX_PATH}/hrm/payroll/payslip`,
//                 title: 'PaySlip',
//                 icon: FileTextOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//             ]
//           },
//           {
//             key: 'extra-hrm-performance',
//             path: `${APP_PREFIX_PATH}/hrm/performance`,
//             title: 'Performance',
//             icon: BarChartOutlined,
//             breadcrumb: false,
//             submenu: [
//               {
//                 key: 'extra-hrm-performance-indicator',
//                 path: `${APP_PREFIX_PATH}/hrm/performance/indicator`,
//                 title: 'Indicator',
//                 icon: StockOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-performance-appraisal',
//                 path: `${APP_PREFIX_PATH}/hrm/performance/appraisal`,
//                 title: 'Appraisal',
//                 icon: '',
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-performance-goaltracking',
//                 path: `${APP_PREFIX_PATH}/hrm/performance/goaltracking`,
//                 title: 'GoalTracking',
//                 icon: DeploymentUnitOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//             ]
//           },
//           {
//             key: 'extra-hrm-role',
//             path: `${APP_PREFIX_PATH}/hrm/role`,
//             title: 'Role',
//             icon: CrownOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-permission',
//             path: `${APP_PREFIX_PATH}/hrm/permission`,
//             title: 'Permission',
//             icon: CheckSquareOutlined,
//             breadcrumb: false,
//             submenu: []   
//           },
//           {
//             key: 'extra-hrm-designation',
//             path: `${APP_PREFIX_PATH}/hrm/designation`,
//             title: 'Designation',
//             icon: SolutionOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-department',
//             path: `${APP_PREFIX_PATH}/hrm/department`,
//             title: 'Department',
//             icon: BankOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-attendance',
//             path: `${APP_PREFIX_PATH}/hrm/attendance`,
//             title: 'Attendance',
//             icon:  CalendarOutlined,
//             breadcrumb: true,
//             submenu: [
//               {
//                 key: 'extra-hrm-attendance-attendancelist',
//                 path: `${APP_PREFIX_PATH}/hrm/attendance/attendancelist`,
//                 title: 'Attendance List',
//                 icon: '',
//                 breadcrumb: true,
//                 submenu: []
//               },
//               // {
//               //   key: 'extra-hrm-attendance-myattendance',
//               //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
//               //   title: 'My Attendance',
//               //   icon: '',
//               //   breadcrumb: true,
//               //   submenu: []
//               // }
//             ]
//           },
//           {
//             key: 'extra-hrm-leave',
//             path: `${APP_PREFIX_PATH}/hrm/leave`,
//             title: 'Leave Management',
//             icon:  CalendarOutlined,
//             breadcrumb: true,
//             submenu: [
//               {
//                 key: 'extra-hrm-leave-leavelist',
//                 path: `${APP_PREFIX_PATH}/hrm/leave/leavelist`,
//                 title: 'Leave List',
//                 icon: '',
//                 breadcrumb: true,
//                 submenu: []
//               },
//               // {
//               //   key: 'extra-hrm-attendance-myattendance',
//               //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
//               //   title: 'My Attendance',
//               //   icon: '',
//               //   breadcrumb: true,
//               //   submenu: []
//               // }
//             ]
            
//           },
//           {
//             key: 'extra-hrm-eventsetup',
//             path: `${APP_PREFIX_PATH}/hrm/eventsetup`,
//             title: 'EventSetup',
//             icon: AlertOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-meeting',
//             path: `${APP_PREFIX_PATH}/hrm/meeting`,
//             title: 'Meeting',
//             icon: AppstoreOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-announcement',
//             path: `${APP_PREFIX_PATH}/hrm/announcement`,
//             title: 'Announcement',
//             icon: FireOutlined,
//             breadcrumb: false,
//             submenu: []
//           },
//           {
//             key: 'extra-hrm-jobs',
//             path: `${APP_PREFIX_PATH}/hrm/jobs`,
//             title: 'Job',
//             icon:  CalendarOutlined,
//             breadcrumb: true,
//             submenu: [
//               {
//                 key: 'extra-hrm-jobs-joblist',
//                 path: `${APP_PREFIX_PATH}/hrm/jobs/joblist`,
//                 title: 'Jobs',
//                 icon: ControlOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-jobs-jobcandidate',
//                 path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate`,
//                 title: 'Job Candidate',
//                 icon: UsergroupAddOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-jobs-jobonbording',
//                 path: `${APP_PREFIX_PATH}/hrm/jobs/jobonbording`,
//                 title: 'Job On-Bording',
//                 icon: DeploymentUnitOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-jobs-jobapplication',
//                 path: `${APP_PREFIX_PATH}/hrm/jobs/jobapplication`,
//                 title: 'Job Application',
//                 icon: SolutionOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               {
//                 key: 'extra-hrm-jobs-interview',
//                 path: `${APP_PREFIX_PATH}/hrm/jobs/interview`,
//                 title: 'Interviews',
//                 icon: ScheduleOutlined,
//                 breadcrumb: true,
//                 submenu: []
//               },
//               // {
//               //   key: 'extra-hrm-attendance-myattendance',
//               //   path: `${APP_PREFIX_PATH}/hrm-attendance-myattendance`,
//               //   title: 'My Attendance',
//               //   icon: '',
//               //   breadcrumb: true,
//               //   submenu: []
//               // }
//             ]
            
//           },
//         ]
//       },

      
//     ]
//   }
// ]

// const extraNavvvTree = [
//   {
//     key: 'superadmin',
//     path: `${APP_PREFIX_PATH}/superadmin`,
//     title: 'SuperAdmin',
//     icon: PlusCircleOutlined,
//     breadcrumb: true,
//     isGroupTitle: true,
//     submenu: [
//       {
//         key: 'superadmin-company',
//         path: `${APP_PREFIX_PATH}/superadmin/company`,
//         title: 'Company',
//         icon: ScheduleOutlined,
//         breadcrumb: true,
//         submenu: []
//       },
//       {
//         key: 'superadmin-plan',
//         path: `${APP_PREFIX_PATH}/superadmin/plan`,
//         title: 'Plan',
//         icon: BlockOutlined,
//         breadcrumb: true,
//         submenu: []
//       },
//       {
//         key: 'superadmin-coupon',
//         path: `${APP_PREFIX_PATH}/superadmin/coupon`,
//         title: 'Coupon',
//         icon: FileTextOutlined,
//         breadcrumb: true,
//         submenu: []
//       },
//       {
//         key: 'superadmin-notes',
//         path: `${APP_PREFIX_PATH}/superadmin/notes`,
//         title: 'Notes',
//         icon: FileTextOutlined,
//         breadcrumb: true,
//         submenu: []
//       },
//     ]
//   }
// ]









// const dashBoardNavTree = [{
//   key: 'dashboards',
//   path: `${APP_PREFIX_PATH}/dashboards`,
//   title: 'CRM',
//   icon: DashboardOutlined,
//   breadcrumb: false,
//   isGroupTitle: true,
//   submenu: [
//     {
//       key: 'dashboards-default',
//       path: `${APP_PREFIX_PATH}/dashboards/default`,  
//       title: 'Contacts',
//       icon: DashboardOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'dashboards-analytic',
//       path: `${APP_PREFIX_PATH}/dashboards/analytic`,
//       title: 'sidenav.dashboard.analytic',
//       icon: DotChartOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'dashboards-sales',
//       path: `${APP_PREFIX_PATH}/dashboards/sales`,
//       title: 'Sales Pipeline Management',
//       icon: FundOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'dashboards-superadmindashboard',
//       path: `${APP_PREFIX_PATH}/dashboards/superadmindashboard`,
//       title: 'Super Admin Dashboard',
//       icon: PicRightOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//   ]
// }]

// const appsNavTree = [{
//   key: 'apps',
//   path: `${APP_PREFIX_PATH}/apps`,
//   title: 'sidenav.apps',
//   icon: AppstoreOutlined,
//   breadcrumb: false,
//   isGroupTitle: true,
//   submenu: [
//     {
//       key: 'apps-project',
//       path: `${APP_PREFIX_PATH}/apps/project`,
//       title: 'sidenav.apps.project',
//       icon: BulbOutlined,
//       breadcrumb: true,
//       submenu: [
//         {
//           key: 'apps-project-list',
//           path: `${APP_PREFIX_PATH}/apps/project/list`,
//           title: 'Projects',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-scrumboard',
//           path: `${APP_PREFIX_PATH}/apps/project/scrumboard`,
//           title: 'Leads',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-lead',
//           path: `${APP_PREFIX_PATH}/apps/project/lead`,
//           title: 'Leadss',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-deal',
//           path: `${APP_PREFIX_PATH}/apps/project/deal`,
//           title: 'Deals',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Contract',
//           path: `${APP_PREFIX_PATH}/apps/project/contract`,
//           title: 'Contract',
//           icon: SnippetsOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Bug',
//           path: `${APP_PREFIX_PATH}/apps/project/bug`,
//           title: 'Bug',
//           icon: BugOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-Task',
//           path: `${APP_PREFIX_PATH}/apps/project/task`,
//           title: 'Task',
//           icon: BugOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-TaskCalendar',
//           path: `${APP_PREFIX_PATH}/apps/project/taskcalendar`,
//           title: 'Task Calendar',
//           icon: CalendarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-project-projectreport',
//           path: `${APP_PREFIX_PATH}/apps/project/projectreport`,
//           title: 'Project Report',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },

//       ]
//     },
//     {
//       key: 'apps-sales',
//       path: `${APP_PREFIX_PATH}/apps/sales`,
//       title: 'Sales',
//       icon: BulbOutlined,
//       breadcrumb: true,
//       submenu: [
//         {
//           key: 'apps-sales-customer',
//           path: `${APP_PREFIX_PATH}/apps/sales/customer`,
//           title: 'Customer',
//           icon: UsergroupDeleteOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-invoice',
//           path: `${APP_PREFIX_PATH}/apps/sales/invoice`,
//           title: 'Invoice',
//           icon: FundProjectionScreenOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-payments',
//           path: `${APP_PREFIX_PATH}/apps/sales/payments`,
//           title: 'Payments',
//           icon: DollarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-revenue',
//           path: `${APP_PREFIX_PATH}/apps/sales/revenue`,
//           title: 'Revenue',
//           icon: DollarOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-estimates',
//           path: `${APP_PREFIX_PATH}/apps/sales/estimates`,
//           title: 'Estimates',
//           icon: RiseOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-sales-expenses',
//           path: `${APP_PREFIX_PATH}/apps/sales/expenses`,
//           title: 'Expenses',
//           icon: EuroCircleOutlined,
//           breadcrumb: false,
//           submenu: []
//         }
//       ]
//     },
//     {
//       key: 'apps-contacts',
//       path: `${APP_PREFIX_PATH}/apps/contacts`,
//       title: 'Contacts',
//       icon: ContactsOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'apps-mail',
//       path: `${APP_PREFIX_PATH}/apps/mail/inbox`,
//       title: 'sidenav.apps.mail',
//       icon: MailOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
 
//     {
//       key: 'apps-chat',
//       path: `${APP_PREFIX_PATH}/apps/chat`,
//       title: 'sidenav.apps.chat',
//       icon: MessageOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'apps-calendar',
//       path: `${APP_PREFIX_PATH}/apps/calendar`,
//       title: 'sidenav.apps.calendar',
//       icon: CalendarOutlined,
//       breadcrumb: true,
//       submenu: []
//     },

//     {
//       key: 'apps-ecommerce',
//       path: `${APP_PREFIX_PATH}/apps/ecommerce`,
//       title: 'sidenav.apps.ecommerce',
//       icon: ShoppingCartOutlined,
//       breadcrumb: true,
//       submenu: [
//         {
//           key: 'apps-ecommerce-productList',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/product-list`,
//           title: 'sidenav.apps.ecommerce.productList',
//           icon: '',
//           breadcrumb: true,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-addProduct',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/add-product`,
//           title: 'sidenav.apps.ecommerce.addProduct',
//           icon: AppstoreAddOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-editProduct',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/edit-product/12`,
//           title: 'sidenav.apps.ecommerce.editProduct',
//           icon: EditOutlined,
//           breadcrumb: false,
//           submenu: []
//         },
//         {
//           key: 'apps-ecommerce-orders',
//           path: `${APP_PREFIX_PATH}/apps/ecommerce/orders`,
//           title: 'sidenav.apps.ecommerce.orders',
//           icon: '',
//           breadcrumb: false,
//           submenu: []
//         }
//       ]
//     }
//   ]
// }]

// // const componentsNavTree = [
// //   {
// //     key: 'components',
// //     path: `${APP_PREFIX_PATH}/components`,
// //     title: 'sidenav.components',
// //     icon: AntDesignOutlined,
// //     breadcrumb: true,
// //     isGroupTitle: true,
// //     submenu: [
// //       {
// //         key: 'components-general',
// //         path: `${APP_PREFIX_PATH}/components/general`,
// //         title: 'sidenav.components.general',
// //         icon: InfoCircleOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-general-button',
// //             path: `${APP_PREFIX_PATH}/components/general/button`,
// //             title: 'sidenav.components.general.button',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-general-icon',
// //             path: `${APP_PREFIX_PATH}/components/general/icon`,
// //             title: 'sidenav.components.general.icon',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-general-typography',
// //             path: `${APP_PREFIX_PATH}/components/general/typography`,
// //             title: 'sidenav.components.general.typography',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-layout',
// //         path: `${APP_PREFIX_PATH}/components/layout`,
// //         title: 'sidenav.components.layout',
// //         icon: LayoutOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-layout-grid',
// //             path: `${APP_PREFIX_PATH}/components/layout/grid`,
// //             title: 'sidenav.components.layout.grid',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-layout-layout',
// //             path: `${APP_PREFIX_PATH}/components/layout/layout`,
// //             title: 'sidenav.components.layout.layout',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-navigation',
// //         path: `${APP_PREFIX_PATH}/components/navigation`,
// //         title: 'sidenav.components.navigation',
// //         icon: CompassOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-navigation-affix',
// //             path: `${APP_PREFIX_PATH}/components/navigation/affix`,
// //             title: 'sidenav.components.navigation.affix',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-navigation-breadcrumb',
// //             path: `${APP_PREFIX_PATH}/components/navigation/breadcrumb`,
// //             title: 'sidenav.components.navigation.breadcrumb',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-navigation-dropdown',
// //             path: `${APP_PREFIX_PATH}/components/navigation/dropdown`,
// //             title: 'sidenav.components.navigation.dropdown',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-navigation-menu',
// //             path: `${APP_PREFIX_PATH}/components/navigation/menu`,
// //             title: 'sidenav.components.navigation.menu',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-navigation-pagination',
// //             path: `${APP_PREFIX_PATH}/components/navigation/pagination`,
// //             title: 'sidenav.components.navigation.pagination',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-navigation-steps',
// //             path: `${APP_PREFIX_PATH}/components/navigation/steps`,
// //             title: 'sidenav.components.navigation.steps',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-data-entry',
// //         path: `${APP_PREFIX_PATH}/components/data-entry`,
// //         title: 'sidenav.components.dataEntry',
// //         icon: FileDoneOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-data-entry-auto-complete',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/auto-complete`,
// //             title: 'sidenav.components.dataEntry.autoComplete',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-checkbox',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/checkbox`,
// //             title: 'sidenav.components.dataEntry.checkbox',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-cascader',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/cascader`,
// //             title: 'sidenav.components.dataEntry.cascader',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-date-picker',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/date-picker`,
// //             title: 'sidenav.components.dataEntry.datePicker',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-form',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/form`,
// //             title: 'sidenav.components.dataEntry.form',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-input-number',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/input-number`,
// //             title: 'sidenav.components.dataEntry.inputNumber',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-input',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/input`,
// //             title: 'sidenav.components.dataEntry.input',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-mentions',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/mentions`,
// //             title: 'sidenav.components.dataEntry.mentions',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-rate',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/rate`,
// //             title: 'sidenav.components.dataEntry.rate',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-radio',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/radio`,
// //             title: 'sidenav.components.dataEntry.radio',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-switch',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/switch`,
// //             title: 'sidenav.components.dataEntry.switch',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-slider',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/slider`,
// //             title: 'sidenav.components.dataEntry.slider',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-select',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/select`,
// //             title: 'sidenav.components.dataEntry.select',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-tree-select',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/tree-select`,
// //             title: 'sidenav.components.dataEntry.treeSelect',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-transfer',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/transfer`,
// //             title: 'sidenav.components.dataEntry.transfer',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-time-picker',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/time-picker`,
// //             title: 'sidenav.components.dataEntry.timePicker',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-entry-upload',
// //             path: `${APP_PREFIX_PATH}/components/data-entry/upload`,
// //             title: 'sidenav.components.dataEntry.upload',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //         ]
// //       },
// //       {
// //         key: 'components-data-display',
// //         path: `${APP_PREFIX_PATH}/components/data-display`,
// //         title: 'sidenav.components.dataDisplay',
// //         icon: DesktopOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-data-display-avatar',
// //             path: `${APP_PREFIX_PATH}/components/data-display/avatar`,
// //             title: 'sidenav.components.dataDisplay.avatar',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-badge',
// //             path: `${APP_PREFIX_PATH}/components/data-display/badge`,
// //             title: 'sidenav.components.dataDisplay.badge',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-collapse',
// //             path: `${APP_PREFIX_PATH}/components/data-display/collapse`,
// //             title: 'sidenav.components.dataDisplay.collapse',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-carousel',
// //             path: `${APP_PREFIX_PATH}/components/data-display/carousel`,
// //             title: 'sidenav.components.dataDisplay.carousel',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-card',
// //             path: `${APP_PREFIX_PATH}/components/data-display/card`,
// //             title: 'sidenav.components.dataDisplay.card',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-calendar',
// //             path: `${APP_PREFIX_PATH}/components/data-display/calendar`,
// //             title: 'sidenav.components.dataDisplay.calendar',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-descriptions',
// //             path: `${APP_PREFIX_PATH}/components/data-display/descriptions`,
// //             title: 'sidenav.components.dataDisplay.descriptions',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-empty',
// //             path: `${APP_PREFIX_PATH}/components/data-display/empty`,
// //             title: 'sidenav.components.dataDisplay.empty',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-list',
// //             path: `${APP_PREFIX_PATH}/components/data-display/list`,
// //             title: 'sidenav.components.dataDisplay.list',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-popover',
// //             path: `${APP_PREFIX_PATH}/components/data-display/popover`,
// //             title: 'sidenav.components.dataDisplay.popover',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-statistic',
// //             path: `${APP_PREFIX_PATH}/components/data-display/statistic`,
// //             title: 'sidenav.components.dataDisplay.statistic',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-tree',
// //             path: `${APP_PREFIX_PATH}/components/data-display/tree`,
// //             title: 'sidenav.components.dataDisplay.tree',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-tooltip',
// //             path: `${APP_PREFIX_PATH}/components/data-display/tooltip`,
// //             title: 'sidenav.components.dataDisplay.tooltip',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-timeline',
// //             path: `${APP_PREFIX_PATH}/components/data-display/timeline`,
// //             title: 'sidenav.components.dataDisplay.timeline',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-tag',
// //             path: `${APP_PREFIX_PATH}/components/data-display/tag`,
// //             title: 'sidenav.components.dataDisplay.tag',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-tabs',
// //             path: `${APP_PREFIX_PATH}/components/data-display/tabs`,
// //             title: 'sidenav.components.dataDisplay.tabs',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-data-display-table',
// //             path: `${APP_PREFIX_PATH}/components/data-display/table`,
// //             title: 'sidenav.components.dataDisplay.table',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //         ]
// //       },
// //       {
// //         key: 'components-feedback',
// //         path: `${APP_PREFIX_PATH}/components/feedback`,
// //         title: 'sidenav.components.feedback',
// //         icon: CommentOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-feedback-alert',
// //             path: `${APP_PREFIX_PATH}/components/feedback/alert`,
// //             title: 'sidenav.components.feedback.alert',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-drawer',
// //             path: `${APP_PREFIX_PATH}/components/feedback/drawer`,
// //             title: 'sidenav.components.feedback.drawer',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-modal',
// //             path: `${APP_PREFIX_PATH}/components/feedback/modal`,
// //             title: 'sidenav.components.feedback.modal',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-message',
// //             path: `${APP_PREFIX_PATH}/components/feedback/message`,
// //             title: 'sidenav.components.feedback.message',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-notification',
// //             path: `${APP_PREFIX_PATH}/components/feedback/notification`,
// //             title: 'sidenav.components.feedback.notification',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-progress',
// //             path: `${APP_PREFIX_PATH}/components/feedback/progress`,
// //             title: 'sidenav.components.feedback.progress',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-popconfirm',
// //             path: `${APP_PREFIX_PATH}/components/feedback/popconfirm`,
// //             title: 'sidenav.components.feedback.popconfirm',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-result',
// //             path: `${APP_PREFIX_PATH}/components/feedback/result`,
// //             title: 'sidenav.components.feedback.result',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-spin',
// //             path: `${APP_PREFIX_PATH}/components/feedback/spin`,
// //             title: 'sidenav.components.feedback.spin',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-feedback-skeleton',
// //             path: `${APP_PREFIX_PATH}/components/feedback/skeleton`,
// //             title: 'sidenav.components.feedback.skeleton',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-other',
// //         path: `${APP_PREFIX_PATH}/components/other`,
// //         title: 'sidenav.components.other',
// //         icon: RobotOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-other-anchor',
// //             path: `${APP_PREFIX_PATH}/components/other/anchor`,
// //             title: 'sidenav.components.other.anchor',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-other-backtop',
// //             path: `${APP_PREFIX_PATH}/components/other/backtop`,
// //             title: 'sidenav.components.other.backtop',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-other-config-provider',
// //             path: `${APP_PREFIX_PATH}/components/other/config-provider`,
// //             title: 'sidenav.components.other.configProvider',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-other-divider',
// //             path: `${APP_PREFIX_PATH}/components/other/divider`,
// //             title: 'sidenav.components.other.divider',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-charts',
// //         path: `${APP_PREFIX_PATH}/components/charts`,
// //         title: 'sidenav.charts',
// //         icon: PieChartOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           {
// //             key: 'components-charts-apex',
// //             path: `${APP_PREFIX_PATH}/components/charts/apex-charts`,
// //             title: 'sidenav.charts.apex',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           },
// //           {
// //             key: 'components-charts-chartjs',
// //             path: `${APP_PREFIX_PATH}/components/charts/chartjs`,
// //             title: 'sidenav.charts.chartjs',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       },
// //       {
// //         key: 'components-maps',
// //         path: `${APP_PREFIX_PATH}/components/maps`,
// //         title: 'sidenav.maps',
// //         icon: EnvironmentOutlined,
// //         breadcrumb: true,
// //         submenu: [
// //           // {
// //           //   key: 'components-maps-google',
// //           //   path: `${APP_PREFIX_PATH}/components/maps/google-map`,
// //           //   title: 'sidenav.maps.google',
// //           //   icon: '',
// //           //   breadcrumb: true,
// //           //   submenu: []
// //           // },
// //           {
// //             key: 'components-maps-simple',
// //             path: `${APP_PREFIX_PATH}/components/maps/simple-map`,
// //             title: 'sidenav.maps.simple',
// //             icon: '',
// //             breadcrumb: true,
// //             submenu: []
// //           }
// //         ]
// //       }
// //     ]
// //   }
// // ]

// const docsNavTree = [{
//   key: 'docs',
//   path: `${APP_PREFIX_PATH}/docs`,
//   title: 'sidenav.docs',
//   icon: BookOutlined,
//   breadcrumb: false,
//   isGroupTitle: true,
//   submenu: [
//     {
//       key: 'docs-documentation',
//       path: `${APP_PREFIX_PATH}/docs/documentation`,
//       title: 'sidenav.docs.documentation',
//       icon: FileUnknownOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'docs-changelog',
//       path: `${APP_PREFIX_PATH}/docs/documentation/changelog`,
//       title: 'sidenav.docs.changelog',
//       icon: ProfileOutlined,
//       breadcrumb: false,
//       submenu: []
//     }
//   ]
// }]

// const navigationConfig = [
//   ...dashBoardNavTree,
//   ...appsNavTree,
//   ...extraNavTree,
//   ...extraNavvTree,
//   ...extraNavvvTree,
//   // ...componentsNavTree,
  
//   ...docsNavTree
// ]

// export default navigationConfig;
