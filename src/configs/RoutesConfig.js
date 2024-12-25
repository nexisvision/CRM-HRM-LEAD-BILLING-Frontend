import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'login-1',
        path: `${AUTH_PREFIX_PATH}/login-1`,
        component: React.lazy(() => import('views/auth-views/authentication/login-1')),
    },
    {
        key: 'login-2',
        path: `${AUTH_PREFIX_PATH}/login-2`,
        component: React.lazy(() => import('views/auth-views/authentication/login-2')),
    },
    {
        key: 'register-1',
        path: `${AUTH_PREFIX_PATH}/register-1`,
        component: React.lazy(() => import('views/auth-views/authentication/register-1')),
    },
    {
        key: 'register-2',
        path: `${AUTH_PREFIX_PATH}/register-2`,
        component: React.lazy(() => import('views/auth-views/authentication/register-2')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    },
    {
        key: 'error-page-1',
        path: `${AUTH_PREFIX_PATH}/error-page-1`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
    },
    {
        key: 'error-page-2',
        path: `${AUTH_PREFIX_PATH}/error-page-2`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
    },
    // {
    //     key: 'customersupports',
    //     path: `${AUTH_PREFIX_PATH}/apps/customersupports`,
    //     component: React.lazy(() => import('views/app-views/pages/customersupports')),
    // },
    // {
    //     key: 'customersupports-ticket',
    //     path: `${AUTH_PREFIX_PATH}/apps/customersupports/ticket`,
    //     component: React.lazy(() => import('views/app-views/pages/customersupports/ticket')),
    // },
]

export const protectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards/default')),
    },
    {
        key: 'dashboard.analytic',
        path: `${APP_PREFIX_PATH}/dashboards/analytic`,
        component: React.lazy(() => import('views/app-views/dashboards/analytic')),
    },
    {
        key: 'dashboard.sales',
        path: `${APP_PREFIX_PATH}/dashboards/sales`,
        component: React.lazy(() => import('views/app-views/dashboards/sales2')),
    },
    {
        key: 'dashboard.superadmindashboard',
        path: `${APP_PREFIX_PATH}/dashboards/superadmindashboard`,
        component: React.lazy(() => import('views/app-views/dashboards/superadmindashboard')),
    },


    // 

    {
        key: 'dashboards.mail',
        path: `${APP_PREFIX_PATH}/dashboards/mail/*`,
        component: React.lazy(() => import('views/app-views/dashboards/mail')),
    },
    {
        key: 'dashboards.contacts',
        path: `${APP_PREFIX_PATH}/dashboards/contacts/*`,
        component: React.lazy(() => import('views/app-views/dashboards/contacts')),
    },
    {
        key: 'dashboards.chat',
        path: `${APP_PREFIX_PATH}/dashboards/chat/*`,
        component: React.lazy(() => import('views/app-views/dashboards/chat')),
    },
    {
        key: 'dashboards.calendar',
        path: `${APP_PREFIX_PATH}/dashboards/calendar`,
        component: React.lazy(() => import('views/app-views/dashboards/calendar')),
    },
    // {
    //     key: 'apps.project',
    //     path: `${APP_PREFIX_PATH}/apps/project`,
    //     component: React.lazy(() => import('views/app-views/apps/project')),
    // },
    {
        key: 'dashboard.project.list',
        path: `${APP_PREFIX_PATH}/dashboards/project/list`,
        component: React.lazy(() => import('views/app-views/dashboards/project/project-list/ProjectList')),
    },
    {
        key: 'dashboard.project.scrumboard',
        path: `${APP_PREFIX_PATH}/dashboards/project/scrumboard`,
        component: React.lazy(() => import('views/app-views/dashboards/project/scrumboard')),
    },
    {
        key: 'dashboard.project.lead',
        path: `${APP_PREFIX_PATH}/dashboards/project/lead`,
        component: React.lazy(() => import('views/app-views/dashboards/leads')),
    },
    {
        key: 'dashboard.project.deal',
        path: `${APP_PREFIX_PATH}/dashboards/project/deal`,
        component: React.lazy(() => import('views/app-views/dashboards/deals')),
    },
    {
        key: 'dashboard.project.contract',
        path: `${APP_PREFIX_PATH}/dashboards/project/contract`,
        component: React.lazy(() => import('views/app-views/dashboards/contract')),
    },
    {
        key: 'dashboard.project.bug',
        path: `${APP_PREFIX_PATH}/dashboards/project/bug`,
        component: React.lazy(() => import('views/app-views/dashboards/bug')),
    },
    {
        key: 'dashboard.project.task',
        path: `${APP_PREFIX_PATH}/dashboards/project/task`,
        component: React.lazy(() => import('views/app-views/dashboards/task')),
    },
    {
        key: 'dashboard.project.task',
        path: `${APP_PREFIX_PATH}/dashboards/project/task/viewtask`,
        component: React.lazy(() => import('views/app-views/dashboards/task/ViewTask')),
    },

    {
        key: 'dashboard.project.taskcalendar',
        path: `${APP_PREFIX_PATH}/dashboards/project/taskcalendar`,
        component: React.lazy(() => import('views/app-views/dashboards/taskcalendar')),
    },
    {
        key: 'dashboard.project.projectreport',
        path: `${APP_PREFIX_PATH}/dashboards/project/projectreport`,
        component: React.lazy(() => import('views/app-views/dashboards/projectreport')),
    },
     {
        key: 'dashboard.sales',
        path: `${APP_PREFIX_PATH}/dashboards/sales`,
        component: React.lazy(() => import('views/app-views/dashboards/project')),
    },
    {
        key: 'dashboards-sales-customer',
        path: `${APP_PREFIX_PATH}/dashboards/sales/customer`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/customer')),
    },
    {
        key: 'dashboards.sales.sale',
        path: `${APP_PREFIX_PATH}/dashboards/sales/invoice`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/invoice/InvoiceList')),
    },
    {
        key: 'dashboards.sales.payments',
        path: `${APP_PREFIX_PATH}/dashboards/sales/payments`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/payments')),
    },
    {
        key: 'dashboards.sales.revenue',
        path: `${APP_PREFIX_PATH}/dashboards/sales/revenue`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/revenue')),
    },
    {
        key: 'dashboards.sales.estimates',
        path: `${APP_PREFIX_PATH}/dashboards/sales/estimates`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/estimates')),
    },
    {
        key: 'dashboards.sales.expenses',
        path: `${APP_PREFIX_PATH}/dashboards/sales/expenses`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/expenses')),
    },
    {
        key: 'dashboards.sales.billing',
        path: `${APP_PREFIX_PATH}/dashboards/sales/billing`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/billing')),
    },
    {
        key: 'dashboards.sales.creditnotes',
        path: `${APP_PREFIX_PATH}/dashboards/sales/creditnotes`,
        component: React.lazy(() => import('views/app-views/dashboards/sales/creditnotes')),
    },




    {
        key: 'dashboards.ecommerce',
        path: `${APP_PREFIX_PATH}/dashboards/ecommerce`,
        component: React.lazy(() => import('views/app-views/dashboards/e-commerce')),
    },
    {
        key: 'dashboards.ecommerce.add-product',
        path: `${APP_PREFIX_PATH}/dashboards/ecommerce/add-product`,
        component: React.lazy(() => import('views/app-views/dashboards/e-commerce/add-product')),
    },
    {
        key: 'dashboards.ecommerce.edit-product',
        path: `${APP_PREFIX_PATH}/dashboards/ecommerce/edit-product/:id`,
        component: React.lazy(() => import('views/app-views/dashboards/e-commerce/edit-product')),
    },
    {
        key: 'dashboards.ecommerce.product-list',
        path: `${APP_PREFIX_PATH}/dashboards/ecommerce/product-list`,
        component: React.lazy(() => import('views/app-views/dashboards/e-commerce/product-list')),
    },
    {
        key: 'dashboards.ecommerce.orders',
        path: `${APP_PREFIX_PATH}/dashboards/ecommerce/orders`,
        component: React.lazy(() => import('views/app-views/dashboards/e-commerce/orders')),
    },


    // 
    
    // {
    //     key: 'apps',
    //     path: `${APP_PREFIX_PATH}/apps`,
    //     component: React.lazy(() => import('views/app-views/apps')),
    // },
    // {
    //     key: 'apps.mail',
    //     path: `${APP_PREFIX_PATH}/apps/mail/*`,
    //     component: React.lazy(() => import('views/app-views/apps/mail')),
    // },
    // {
    //     key: 'apps.mail',
    //     path: `${APP_PREFIX_PATH}/apps/contacts/*`,
    //     component: React.lazy(() => import('views/app-views/apps/contacts')),
    // },
    // {
    //     key: 'apps.chat',
    //     path: `${APP_PREFIX_PATH}/apps/chat/*`,
    //     component: React.lazy(() => import('views/app-views/apps/chat')),
    // },
    // {
    //     key: 'apps.calendar',
    //     path: `${APP_PREFIX_PATH}/apps/calendar`,
    //     component: React.lazy(() => import('views/app-views/apps/calendar')),
    // },
    // // {
    // //     key: 'apps.project',
    // //     path: `${APP_PREFIX_PATH}/apps/project`,
    // //     component: React.lazy(() => import('views/app-views/apps/project')),
    // // },
    // {
    //     key: 'apps.project.list',
    //     path: `${APP_PREFIX_PATH}/apps/project/list`,
    //     component: React.lazy(() => import('views/app-views/apps/project/project-list/ProjectList')),
    // },
    // {
    //     key: 'apps.project.scrumboard',
    //     path: `${APP_PREFIX_PATH}/apps/project/scrumboard`,
    //     component: React.lazy(() => import('views/app-views/apps/project/scrumboard')),
    // },
    // {
    //     key: 'apps.project.lead',
    //     path: `${APP_PREFIX_PATH}/apps/project/lead`,
    //     component: React.lazy(() => import('views/app-views/apps/leads')),
    // },
    // {
    //     key: 'apps.project.deal',
    //     path: `${APP_PREFIX_PATH}/apps/project/deal`,
    //     component: React.lazy(() => import('views/app-views/apps/deals')),
    // },
    // {
    //     key: 'apps.project.contract',
    //     path: `${APP_PREFIX_PATH}/apps/project/contract`,
    //     component: React.lazy(() => import('views/app-views/apps/contract')),
    // },
    // {
    //     key: 'apps.project.bug',
    //     path: `${APP_PREFIX_PATH}/apps/project/bug`,
    //     component: React.lazy(() => import('views/app-views/apps/bug')),
    // },
    // {
    //     key: 'apps.project.task',
    //     path: `${APP_PREFIX_PATH}/apps/project/task`,
    //     component: React.lazy(() => import('views/app-views/apps/task')),
    // },
    // {
    //     key: 'apps.project.task',
    //     path: `${APP_PREFIX_PATH}/apps/project/task/viewtask`,
    //     component: React.lazy(() => import('views/app-views/apps/task/ViewTask')),
    // },








    // {
    //     key: 'apps.project.taskcalendar',
    //     path: `${APP_PREFIX_PATH}/apps/project/taskcalendar`,
    //     component: React.lazy(() => import('views/app-views/apps/taskcalendar')),
    // },
    // {
    //     key: 'apps.project.projectreport',
    //     path: `${APP_PREFIX_PATH}/apps/project/projectreport`,
    //     component: React.lazy(() => import('views/app-views/apps/projectreport')),
    // },
    // {
    //     key: 'apps.project.deal.viewdeal',
    //     path: `${APP_PREFIX_PATH}/apps/project/deal/viewdeal`,
    //     component: React.lazy(() => import('views/app-views/apps/deals/ViewDeal ')),
    // },



    // {
    //     key: 'apps.sales',
    //     path: `${APP_PREFIX_PATH}/apps/sales`,
    //     component: React.lazy(() => import('views/app-views/apps/project')),
    // },
    // {
    //     key: 'apps-sales-customer',
    //     path: `${APP_PREFIX_PATH}/apps/sales/customer`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/customer')),
    // },
    // {
    //     key: 'apps.sales.sale',
    //     path: `${APP_PREFIX_PATH}/apps/sales/invoice`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/invoice/InvoiceList')),
    // },
    // {
    //     key: 'apps.sales.payments',
    //     path: `${APP_PREFIX_PATH}/apps/sales/payments`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/payments')),
    // },
    // {
    //     key: 'apps.sales.revenue',
    //     path: `${APP_PREFIX_PATH}/apps/sales/revenue`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/revenue')),
    // },
    // {
    //     key: 'apps.sales.estimates',
    //     path: `${APP_PREFIX_PATH}/apps/sales/estimates`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/estimates')),
    // },
    // {
    //     key: 'apps.sales.expenses',
    //     path: `${APP_PREFIX_PATH}/apps/sales/expenses`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/expenses')),
    // },
    // {
    //     key: 'apps.sales.creditnotes',
    //     path: `${APP_PREFIX_PATH}/apps/sales/creditnotes`,
    //     component: React.lazy(() => import('views/app-views/apps/sales/creditnotes')),
    // },




    // {
    //     key: 'apps.ecommerce',
    //     path: `${APP_PREFIX_PATH}/apps/ecommerce`,
    //     component: React.lazy(() => import('views/app-views/apps/e-commerce')),
    // },
    // {
    //     key: 'apps.ecommerce.add-product',
    //     path: `${APP_PREFIX_PATH}/apps/ecommerce/add-product`,
    //     component: React.lazy(() => import('views/app-views/apps/e-commerce/add-product')),
    // },
    // {
    //     key: 'apps.ecommerce.edit-product',
    //     path: `${APP_PREFIX_PATH}/apps/ecommerce/edit-product/:id`,
    //     component: React.lazy(() => import('views/app-views/apps/e-commerce/edit-product')),
    // },
    // {
    //     key: 'apps.ecommerce.product-list',
    //     path: `${APP_PREFIX_PATH}/apps/ecommerce/product-list`,
    //     component: React.lazy(() => import('views/app-views/apps/e-commerce/product-list')),
    // },
    // {
    //     key: 'apps.ecommerce.orders',
    //     path: `${APP_PREFIX_PATH}/apps/ecommerce/orders`,
    //     component: React.lazy(() => import('views/app-views/apps/e-commerce/orders')),
    // },
    {
        key: 'components.general',
        path: `${APP_PREFIX_PATH}/components/general`,
        component: React.lazy(() => import('views/app-views/components/general')),
    },
    {
        key: 'components.general.button',
        path: `${APP_PREFIX_PATH}/components/general/button`,
        component: React.lazy(() => import('views/app-views/components/general/button')),
    },
    {
        key: 'components.general.icon',
        path: `${APP_PREFIX_PATH}/components/general/icon`,
        component: React.lazy(() => import('views/app-views/components/general/icon')),
    },
    {
        key: 'components.general.typography',
        path: `${APP_PREFIX_PATH}/components/general/typography`,
        component: React.lazy(() => import('views/app-views/components/general/typography')),
    },
    {
        key: 'components.general',
        path: `${APP_PREFIX_PATH}/components/layout`,
        component: React.lazy(() => import('views/app-views/components/layout')),
    },
    {
        key: 'components.general.grid',
        path: `${APP_PREFIX_PATH}/components/layout/grid`,
        component: React.lazy(() => import('views/app-views/components/layout/grid')),
    },
    {
        key: 'components.general.layout',
        path: `${APP_PREFIX_PATH}/components/layout/layout`,
        component: React.lazy(() => import('views/app-views/components/layout/layout')),
    },
    {
        key: 'components.navigation',
        path: `${APP_PREFIX_PATH}/components/navigation`,
        component: React.lazy(() => import('views/app-views/components/navigation')),
    },
    {
        key: 'components.navigation.affix',
        path: `${APP_PREFIX_PATH}/components/navigation/affix`,
        component: React.lazy(() => import('views/app-views/components/navigation/affix')),
    },
    {
        key: 'components.navigation.breadcrumb',
        path: `${APP_PREFIX_PATH}/components/navigation/breadcrumb`,
        component: React.lazy(() => import('views/app-views/components/navigation/breadcrumb')),
    },
    {
        key: 'components.navigation.dropdown',
        path: `${APP_PREFIX_PATH}/components/navigation/dropdown`,
        component: React.lazy(() => import('views/app-views/components/navigation/dropdown')),
    },
    {
        key: 'components.navigation.menu',
        path: `${APP_PREFIX_PATH}/components/navigation/menu`,
        component: React.lazy(() => import('views/app-views/components/navigation/menu')),
    },
    {
        key: 'components.navigation.pagination',
        path: `${APP_PREFIX_PATH}/components/navigation/pagination`,
        component: React.lazy(() => import('views/app-views/components/navigation/pagination')),
    },
    {
        key: 'components.navigation.steps',
        path: `${APP_PREFIX_PATH}/components/navigation/steps`,
        component: React.lazy(() => import('views/app-views/components/navigation/steps')),
    },
    {
        key: 'components.data-entry',
        path: `${APP_PREFIX_PATH}/components/data-entry`,
        component: React.lazy(() => import('views/app-views/components/data-entry')),
    },
    {
        key: 'components.data-entry.auto-complete',
        path: `${APP_PREFIX_PATH}/components/data-entry/auto-complete`,
        component: React.lazy(() => import('views/app-views/components/data-entry/auto-complete')),
    },
    {
        key: 'components.data-entry.cascader',
        path: `${APP_PREFIX_PATH}/components/data-entry/cascader`,
        component: React.lazy(() => import('views/app-views/components/data-entry/cascader')),
    },
    {
        key: 'components.data-entry.checkbox',
        path: `${APP_PREFIX_PATH}/components/data-entry/checkbox`,
        component: React.lazy(() => import('views/app-views/components/data-entry/checkbox')),
    },
    {
        key: 'components.data-entry.date-picker',
        path: `${APP_PREFIX_PATH}/components/data-entry/date-picker`,
        component: React.lazy(() => import('views/app-views/components/data-entry/date-picker')),
    },
    {
        key: 'components.data-entry.form',
        path: `${APP_PREFIX_PATH}/components/data-entry/form`,
        component: React.lazy(() => import('views/app-views/components/data-entry/form')),
    },
    {
        key: 'components.data-entry.input',
        path: `${APP_PREFIX_PATH}/components/data-entry/input`,
        component: React.lazy(() => import('views/app-views/components/data-entry/input')),
    },
    {
        key: 'components.data-entry.input-number',
        path: `${APP_PREFIX_PATH}/components/data-entry/input-number`,
        component: React.lazy(() => import('views/app-views/components/data-entry/input-number')),
    },
    {
        key: 'components.data-entry.mentions',
        path: `${APP_PREFIX_PATH}/components/data-entry/mentions`,
        component: React.lazy(() => import('views/app-views/components/data-entry/mentions')),
    },
    {
        key: 'components.data-entry.radio',
        path: `${APP_PREFIX_PATH}/components/data-entry/radio`,
        component: React.lazy(() => import('views/app-views/components/data-entry/radio')),
    },
    {
        key: 'components.data-entry.rate',
        path: `${APP_PREFIX_PATH}/components/data-entry/rate`,
        component: React.lazy(() => import('views/app-views/components/data-entry/rate')),
    },
    {
        key: 'components.data-entry.select',
        path: `${APP_PREFIX_PATH}/components/data-entry/select`,
        component: React.lazy(() => import('views/app-views/components/data-entry/select')),
    },
    {
        key: 'components.data-entry.slider',
        path: `${APP_PREFIX_PATH}/components/data-entry/slider`,
        component: React.lazy(() => import('views/app-views/components/data-entry/slider')),
    },
    {
        key: 'components.data-entry.switch',
        path: `${APP_PREFIX_PATH}/components/data-entry/switch`,
        component: React.lazy(() => import('views/app-views/components/data-entry/switch')),
    },
    {
        key: 'components.data-entry.time-picker',
        path: `${APP_PREFIX_PATH}/components/data-entry/time-picker`,
        component: React.lazy(() => import('views/app-views/components/data-entry/time-picker')),
    },
    {
        key: 'components.data-entry.transfer',
        path: `${APP_PREFIX_PATH}/components/data-entry/transfer`,
        component: React.lazy(() => import('views/app-views/components/data-entry/transfer')),
    },
    {
        key: 'components.data-entry.tree-select',
        path: `${APP_PREFIX_PATH}/components/data-entry/tree-select`,
        component: React.lazy(() => import('views/app-views/components/data-entry/tree-select')),
    },
    {
        key: 'components.data-entry.upload',
        path: `${APP_PREFIX_PATH}/components/data-entry/upload`,
        component: React.lazy(() => import('views/app-views/components/data-entry/upload')),
    },
    {
        key: 'components.data-display',
        path: `${APP_PREFIX_PATH}/components/data-display`,
        component: React.lazy(() => import('views/app-views/components/data-display')),
    },
    {
        key: 'components.data-display.avatar',
        path: `${APP_PREFIX_PATH}/components/data-display/avatar`,
        component: React.lazy(() => import('views/app-views/components/data-display/avatar')),
    },
    {
        key: 'components.data-display.badge',
        path: `${APP_PREFIX_PATH}/components/data-display/badge`,
        component: React.lazy(() => import('views/app-views/components/data-display/badge')),
    },
    {
        key: 'components.data-display.calendar',
        path: `${APP_PREFIX_PATH}/components/data-display/calendar`,
        component: React.lazy(() => import('views/app-views/components/data-display/calendar')),
    },
    {
        key: 'components.data-display.card',
        path: `${APP_PREFIX_PATH}/components/data-display/card`,
        component: React.lazy(() => import('views/app-views/components/data-display/card')),
    },
    {
        key: 'components.data-display.carousel',
        path: `${APP_PREFIX_PATH}/components/data-display/carousel`,
        component: React.lazy(() => import('views/app-views/components/data-display/carousel')),
    },
    {
        key: 'components.data-display.collapse',
        path: `${APP_PREFIX_PATH}/components/data-display/collapse`,
        component: React.lazy(() => import('views/app-views/components/data-display/collapse')),
    },
    {
        key: 'components.data-display.comment',
        path: `${APP_PREFIX_PATH}/components/data-display/comment`,
        component: React.lazy(() => import('views/app-views/components/data-display/comment')),
    },
    {
        key: 'components.data-display.descriptions',
        path: `${APP_PREFIX_PATH}/components/data-display/descriptions`,
        component: React.lazy(() => import('views/app-views/components/data-display/descriptions')),
    },
    {
        key: 'components.data-display.empty',
        path: `${APP_PREFIX_PATH}/components/data-display/empty`,
        component: React.lazy(() => import('views/app-views/components/data-display/empty')),
    },
    {
        key: 'components.data-display.list',
        path: `${APP_PREFIX_PATH}/components/data-display/list`,
        component: React.lazy(() => import('views/app-views/components/data-display/list')),
    },
    {
        key: 'components.data-display.popover',
        path: `${APP_PREFIX_PATH}/components/data-display/popover`,
        component: React.lazy(() => import('views/app-views/components/data-display/popover')),
    },
    {
        key: 'components.data-display.statistic',
        path: `${APP_PREFIX_PATH}/components/data-display/statistic`,
        component: React.lazy(() => import('views/app-views/components/data-display/statistic')),
    },
    {
        key: 'components.data-display.table',
        path: `${APP_PREFIX_PATH}/components/data-display/table`,
        component: React.lazy(() => import('views/app-views/components/data-display/table')),
    },
    {
        key: 'components.data-display.tabs',
        path: `${APP_PREFIX_PATH}/components/data-display/tabs`,
        component: React.lazy(() => import('views/app-views/components/data-display/tabs')),
    },
    {
        key: 'components.data-display.tag',
        path: `${APP_PREFIX_PATH}/components/data-display/tag`,
        component: React.lazy(() => import('views/app-views/components/data-display/tag')),
    },
    {
        key: 'components.data-display.timeline',
        path: `${APP_PREFIX_PATH}/components/data-display/timeline`,
        component: React.lazy(() => import('views/app-views/components/data-display/timeline')),
    },
    {
        key: 'components.data-display.tooltip',
        path: `${APP_PREFIX_PATH}/components/data-display/tooltip`,
        component: React.lazy(() => import('views/app-views/components/data-display/tooltip')),
    },
    {
        key: 'components.data-display.tree',
        path: `${APP_PREFIX_PATH}/components/data-display/tree`,
        component: React.lazy(() => import('views/app-views/components/data-display/tree')),
    },
    {
        key: 'components.feedback',
        path: `${APP_PREFIX_PATH}/components/feedback`,
        component: React.lazy(() => import('views/app-views/components/feedback')),
    },
    {
        key: 'components.feedback.alert',
        path: `${APP_PREFIX_PATH}/components/feedback/alert`,
        component: React.lazy(() => import('views/app-views/components/feedback/alert')),
    },
    {
        key: 'components.feedback.drawer',
        path: `${APP_PREFIX_PATH}/components/feedback/drawer`,
        component: React.lazy(() => import('views/app-views/components/feedback/drawer')),
    },
    {
        key: 'components.feedback.message',
        path: `${APP_PREFIX_PATH}/components/feedback/message`,
        component: React.lazy(() => import('views/app-views/components/feedback/message')),
    },
    {
        key: 'components.feedback.modal',
        path: `${APP_PREFIX_PATH}/components/feedback/modal`,
        component: React.lazy(() => import('views/app-views/components/feedback/modal')),
    },
    {
        key: 'components.feedback.notification',
        path: `${APP_PREFIX_PATH}/components/feedback/notification`,
        component: React.lazy(() => import('views/app-views/components/feedback/notification')),
    },
    {
        key: 'components.feedback.popconfirm',
        path: `${APP_PREFIX_PATH}/components/feedback/popconfirm`,
        component: React.lazy(() => import('views/app-views/components/feedback/popconfirm')),
    },
    {
        key: 'components.feedback.progress',
        path: `${APP_PREFIX_PATH}/components/feedback/progress`,
        component: React.lazy(() => import('views/app-views/components/feedback/progress')),
    },
    {
        key: 'components.feedback.result',
        path: `${APP_PREFIX_PATH}/components/feedback/result`,
        component: React.lazy(() => import('views/app-views/components/feedback/result')),
    },
    {
        key: 'components.feedback.skeleton',
        path: `${APP_PREFIX_PATH}/components/feedback/skeleton`,
        component: React.lazy(() => import('views/app-views/components/feedback/skeleton')),
    },
    {
        key: 'components.feedback.spin',
        path: `${APP_PREFIX_PATH}/components/feedback/spin`,
        component: React.lazy(() => import('views/app-views/components/feedback/spin')),
    },
    {
        key: 'components.other',
        path: `${APP_PREFIX_PATH}/components/other`,
        component: React.lazy(() => import('views/app-views/components/other')),
    },
    {
        key: 'components.other',
        path: `${APP_PREFIX_PATH}/components/other`,
        component: React.lazy(() => import('views/app-views/components/other')),
    },
    {
        key: 'components.other',
        path: `${APP_PREFIX_PATH}/components/other`,
        component: React.lazy(() => import('views/app-views/components/other')),
    },
    {
        key: 'components.other.anchor',
        path: `${APP_PREFIX_PATH}/components/other/anchor`,
        component: React.lazy(() => import('views/app-views/components/other/anchor')),
    },
    {
        key: 'components.other.backtop',
        path: `${APP_PREFIX_PATH}/components/other/backtop`,
        component: React.lazy(() => import('views/app-views/components/other/backtop')),
    },
    {
        key: 'components.other.config-provider',
        path: `${APP_PREFIX_PATH}/components/other/config-provider`,
        component: React.lazy(() => import('views/app-views/components/other/config-provider')),
    },
    {
        key: 'components.other.divider',
        path: `${APP_PREFIX_PATH}/components/other/divider`,
        component: React.lazy(() => import('views/app-views/components/other/divider')),
    },
    {
        key: 'components.chart',
        path: `${APP_PREFIX_PATH}/components/charts`,
        component: React.lazy(() => import('views/app-views/components/charts')),
    },
    {
        key: 'components.chart.apex-charts',
        path: `${APP_PREFIX_PATH}/components/charts/apex-charts`,
        component: React.lazy(() => import('views/app-views/components/charts/apex')),
    },
    {
        key: 'components.chart.chartjs',
        path: `${APP_PREFIX_PATH}/components/charts/chartjs`,
        component: React.lazy(() => import('views/app-views/components/charts/chartjs')),
    },
    {
        key: 'components.maps',
        path: `${APP_PREFIX_PATH}/components/maps`,
        component: React.lazy(() => import('views/app-views/components/maps')),
    },
    {
        key: 'components.maps.simple-map',
        path: `${APP_PREFIX_PATH}/components/maps/simple-map`,
        component: React.lazy(() => import('views/app-views/components/maps/simple-map')),
    },
    {
        key: 'login-1',
        path: `${APP_PREFIX_PATH}/login-1`,
        component: React.lazy(() => import('views/auth-views/authentication/login-1')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'login-2',
        path: `${APP_PREFIX_PATH}/login-2`,
        component: React.lazy(() => import('views/auth-views/authentication/login-2')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'register-1',
        path: `${APP_PREFIX_PATH}/register-1`,
        component: React.lazy(() => import('views/auth-views/authentication/register-1')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'register-2',
        path: `${APP_PREFIX_PATH}/register-2`,
        component: React.lazy(() => import('views/auth-views/authentication/register-2')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'forgot-password',
        path: `${APP_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'error-page-1',
        path: `${APP_PREFIX_PATH}/error-page-1`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'error-page-2',
        path: `${APP_PREFIX_PATH}/error-page-2`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
        meta: {
            blankLayout: true
        }
    },
    {
        key: 'pages',
        path: `${APP_PREFIX_PATH}/pages`,
        component: React.lazy(() => import('views/app-views/pages')),
    },
    {
        key: 'pages.profile',
        path: `${APP_PREFIX_PATH}/pages/profile`,
        component: React.lazy(() => import('views/app-views/pages/profile')),
    },


    {
        key: 'hrm',
        path: `${APP_PREFIX_PATH}/hrm`,
        component: React.lazy(() => import('views/app-views/hrm')),
    },
    {
        key: 'hrm.employee',
        path: `${APP_PREFIX_PATH}/hrm/employee`,
        component: React.lazy(() => import('views/app-views/hrm/Employee')),
    },
    // {
    //     key: 'hrm.payroll',
    //     path: `${APP_PREFIX_PATH}/hrm/payroll`,
    //     component: React.lazy(() => import('views/app-views/hrm/PayRoll')),
    // },
    {
        key: 'hrm.payroll.salary',
        path: `${APP_PREFIX_PATH}/hrm/payroll/salary`,
        component: React.lazy(() => import('views/app-views/hrm/PayRoll/Salary')),
    },
    {
        key: 'hrm.payroll.salary',
        path: `${APP_PREFIX_PATH}/hrm/payroll/salary/setsalary`,
        component: React.lazy(() => import('views/app-views/hrm/PayRoll/Salary/SetSalary')),
    },
    {
        key: 'hrm.payroll.payslip',
        path: `${APP_PREFIX_PATH}/hrm/payroll/payslip`,
        component: React.lazy(() => import('views/app-views/hrm/PayRoll/PaySlip')),
    },


    {
        key: 'hrm.performance.indiactor',
        path: `${APP_PREFIX_PATH}/hrm/performance/indicator`,
        component: React.lazy(() => import('views/app-views/hrm/Performance/Indicator')),
    },
    {
        key: 'hrm.performance.appraisal',
        path: `${APP_PREFIX_PATH}/hrm/performance/appraisal`,
        component: React.lazy(() => import('views/app-views/hrm/Performance/Appraisal')),
    },
    {
        key: 'hrm.performance.goaltracking',
        path: `${APP_PREFIX_PATH}/hrm/performance/goaltracking`,
        component: React.lazy(() => import('views/app-views/hrm/Performance/Goaltracking')),
    },




    {
        key: 'hrm.role',
        path: `${APP_PREFIX_PATH}/hrm/role`,
        component: React.lazy(() => import('views/app-views/hrm/RoleAndPermission/Role')),
    },
    {
        key: 'hrm.permission',
        path: `${APP_PREFIX_PATH}/hrm/permission`,
        component: React.lazy(() => import('views/app-views/hrm/RoleAndPermission/Permission')),
    },
    {
        key: 'hrm.designation',
        path: `${APP_PREFIX_PATH}/hrm/designation`,
        component: React.lazy(() => import('views/app-views/hrm/Designation')),
    },

    {
        key: 'hrm.designation',
        path: `${APP_PREFIX_PATH}/hrm/designation/particulardesignation`,
        component: React.lazy(() => import('views/app-views/hrm/Designation/ParticularDesignation')),
    },
    {
        key: 'hrm.department',
        path: `${APP_PREFIX_PATH}/hrm/department`,
        component: React.lazy(() => import('views/app-views/hrm/Department')),
    },

    {
        key: 'hrm.department',
        path: `${APP_PREFIX_PATH}/hrm/department/particulardepartment`,
        component: React.lazy(() => import('views/app-views/hrm/Department/ParticularDepartment')),
    },

    {
        key: 'hrm.eventsetup',
        path: `${APP_PREFIX_PATH}/hrm/EventSetup`,
        component: React.lazy(() => import('views/app-views/hrm/EventSetup')),
    },

    {
        key: 'hrm.meeting',
        path: `${APP_PREFIX_PATH}/hrm/Meeting`,
        component: React.lazy(() => import('views/app-views/hrm/Meeting')),
    },
    {
        key: 'hrm.attendance',
        path: `${APP_PREFIX_PATH}/hrm/attendance`,
        component: React.lazy(() => import('views/app-views/hrm/Attendance')),
    },
    {
        key: 'hrm.attendance.attendancelist',
        path: `${APP_PREFIX_PATH}/hrm/attendance/attendancelist`,
        component: React.lazy(() => import('views/app-views/hrm/Attendance')),
    },
    {
        key: 'hrm.leave',
        path: `${APP_PREFIX_PATH}/hrm/leave`,
        component: React.lazy(() => import('views/app-views/hrm/Leaves')),
    },
    {
        key: 'hrm.leave.leavelist',
        path: `${APP_PREFIX_PATH}/hrm/leave/leavelist`,
        component: React.lazy(() => import('views/app-views/hrm/Leaves')),
    },
    {
        key: 'hrm.jobs',
        path: `${APP_PREFIX_PATH}/hrm/jobs`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs')),
    },
    {
        key: 'hrm.jobs',
        path: `${APP_PREFIX_PATH}/hrm/jobs/viewjob`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/ViewJob')),
    },

    {
        key: 'hrm.jobs',
        path: `${APP_PREFIX_PATH}/hrm/jobs/viewjobonbording`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/JobOnBording/ViewJobOnBording')),
    },

    {
        key: 'hrm.jobs.jobcandidate',
        path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate/viewjobcandidate`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/JobCandidate/ViewJobCandidate')),
    },




    {
        key: 'hrm.jobs.jobcandidate',
        path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/JobCandidate')),
    },
    {
        key: 'hrm.jobs.jobonbording',
        path: `${APP_PREFIX_PATH}/hrm/jobs/jobonbording`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/JobOnBording')),
    },
    {
        key: 'hrm.jobs.joblist',
        path: `${APP_PREFIX_PATH}/hrm/jobs/joblist`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs')),
    },
    {
        key: 'hrm.jobs.jobapplication',
        path: `${APP_PREFIX_PATH}/hrm/jobs/jobapplication`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/JobApplication')),
    },
    {
        key: 'hrm.jobs.interview',
        path: `${APP_PREFIX_PATH}/hrm/jobs/interview`,
        component: React.lazy(() => import('views/app-views/hrm/Jobs/Interview')),
    },
    {
        key: 'hrm.announcement',
        path: `${APP_PREFIX_PATH}/hrm/announcement`,
        component: React.lazy(() => import('views/app-views/hrm/Announcement')),
    },
    // {
    //     key: 'hrm.myattendance',
    //     path: `${APP_PREFIX_PATH}/hrm/myattendance`,
    //     component: React.lazy(() => import('views/app-views/hrm/MyAttendance')),
    // },

    {
        key: 'coupon',
        path: `${APP_PREFIX_PATH}/superadmin/coupon`,
        component: React.lazy(() => import('views/app-views/coupon')),
    },
    {
        key: 'notes',
        path: `${APP_PREFIX_PATH}/superadmin/notes`,
        component: React.lazy(() => import('views/app-views/notes')),
    },
    {
        key: 'company',
        path: `${APP_PREFIX_PATH}/superadmin/company`,
        component: React.lazy(() => import('views/app-views/company')),
    },
    {
        key: 'plan',
        path: `${APP_PREFIX_PATH}/superadmin/plan`,
        component: React.lazy(() => import('views/app-views/plan')),
    },
    {
        key: 'pages.invoice',
        path: `${APP_PREFIX_PATH}/pages/invoice`,
        component: React.lazy(() => import('views/app-views/pages/invoice')),
    },
    {
        key: 'pages.esignature',
        path: `${APP_PREFIX_PATH}/pages/esignature`,
        component: React.lazy(() => import('views/app-views/pages/esignature')),
    },
    {
        key: 'pages.pricing',
        path: `${APP_PREFIX_PATH}/pages/pricing`,
        component: React.lazy(() => import('views/app-views/pages/pricing')),
    },
    {
        key: 'pages.customersupports',
        path: `${APP_PREFIX_PATH}/pages/customersupports`,
        component: React.lazy(() => import('views/app-views/pages/customersupports')),
    },
    {
        key: 'pages.customersupports.ticket',
        path: `${APP_PREFIX_PATH}/pages/customersupports/ticket`,
        component: React.lazy(() => import('views/app-views/pages/customersupports/ticket')),
    },
    {
        key: 'pages.faq',
        path: `${APP_PREFIX_PATH}/pages/faq`,
        component: React.lazy(() => import('views/app-views/pages/faq')),
    },
    {
        key: 'pages.setting',
        path: `${APP_PREFIX_PATH}/pages/setting/*`,
        component: React.lazy(() => import('views/app-views/pages/setting')),
    },
    {
        key: 'users.user-list',
        path: `${APP_PREFIX_PATH}/users/user-list`,
        component: React.lazy(() => import('views/app-views/Users/user-list')),
    },
    {
        key: 'users.client-list',
        path: `${APP_PREFIX_PATH}/users/client-list`,
        component: React.lazy(() => import('views/app-views/Users/client-list')),
    },
    {
        key: 'users.client-user-list',
        path: `${APP_PREFIX_PATH}/users/client-user-list`,
        component: React.lazy(() => import('views/app-views/Users/client-user')),
    },
    
    {
        key: 'docs.documentation',
        path: `${APP_PREFIX_PATH}/docs/documentation/*`,
        component: React.lazy(() => import('views/app-views/docs')),
    }
]


// import React from 'react'
// import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

// export const publicRoutes = [
//     {
//         key: 'login',
//         path: `${AUTH_PREFIX_PATH}/login`,
//         component: React.lazy(() => import('views/auth-views/authentication/login')),
//     },
//     {
//         key: 'login-1',
//         path: `${AUTH_PREFIX_PATH}/login-1`,
//         component: React.lazy(() => import('views/auth-views/authentication/login-1')),
//     },
//     {
//         key: 'login-2',
//         path: `${AUTH_PREFIX_PATH}/login-2`,
//         component: React.lazy(() => import('views/auth-views/authentication/login-2')),
//     },
//     {
//         key: 'register-1',
//         path: `${AUTH_PREFIX_PATH}/register-1`,
//         component: React.lazy(() => import('views/auth-views/authentication/register-1')),
//     },
//     {
//         key: 'register-2',
//         path: `${AUTH_PREFIX_PATH}/register-2`,
//         component: React.lazy(() => import('views/auth-views/authentication/register-2')),
//     },
//     {
//         key: 'forgot-password',
//         path: `${AUTH_PREFIX_PATH}/forgot-password`,
//         component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
//     },
//     {
//         key: 'error-page-1',
//         path: `${AUTH_PREFIX_PATH}/error-page-1`,
//         component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
//     },
//     {
//         key: 'error-page-2',
//         path: `${AUTH_PREFIX_PATH}/error-page-2`,
//         component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
//     },
//     // {
//     //     key: 'customersupports',
//     //     path: `${AUTH_PREFIX_PATH}/apps/customersupports`,
//     //     component: React.lazy(() => import('views/app-views/pages/customersupports')),
//     // },
//     // {
//     //     key: 'customersupports-ticket',
//     //     path: `${AUTH_PREFIX_PATH}/apps/customersupports/ticket`,
//     //     component: React.lazy(() => import('views/app-views/pages/customersupports/ticket')),
//     // },
// ]

// export const protectedRoutes = [
//     {
//         key: 'dashboard.default',
//         path: `${APP_PREFIX_PATH}/dashboards/default`,
//         component: React.lazy(() => import('views/app-views/dashboards/default')),
//     },
//     {
//         key: 'dashboard.analytic',
//         path: `${APP_PREFIX_PATH}/dashboards/analytic`,
//         component: React.lazy(() => import('views/app-views/dashboards/analytic')),
//     },
//     {
//         key: 'dashboard.sales',
//         path: `${APP_PREFIX_PATH}/dashboards/sales`,
//         component: React.lazy(() => import('views/app-views/dashboards/sales')),
//     },
//     {
//         key: 'dashboard.superadmindashboard',
//         path: `${APP_PREFIX_PATH}/dashboards/superadmindashboard`,
//         component: React.lazy(() => import('views/app-views/dashboards/superadmindashboard')),
//     },
//     {
//         key: 'apps',
//         path: `${APP_PREFIX_PATH}/apps`,
//         component: React.lazy(() => import('views/app-views/apps')),
//     },
//     {
//         key: 'apps.mail',
//         path: `${APP_PREFIX_PATH}/apps/mail/*`,
//         component: React.lazy(() => import('views/app-views/apps/mail')),
//     },
//     {
//         key: 'apps.mail',
//         path: `${APP_PREFIX_PATH}/apps/contacts/*`,
//         component: React.lazy(() => import('views/app-views/apps/contacts')),
//     },
//     {
//         key: 'apps.chat',
//         path: `${APP_PREFIX_PATH}/apps/chat/*`,
//         component: React.lazy(() => import('views/app-views/apps/chat')),
//     },
//     {
//         key: 'apps.calendar',
//         path: `${APP_PREFIX_PATH}/apps/calendar`,
//         component: React.lazy(() => import('views/app-views/apps/calendar')),
//     },
//     {
//         key: 'apps.project',
//         path: `${APP_PREFIX_PATH}/apps/project`,
//         component: React.lazy(() => import('views/app-views/apps/project')),
//     },
//     {
//         key: 'apps.project.list',
//         path: `${APP_PREFIX_PATH}/apps/project/list`,
//         component: React.lazy(() => import('views/app-views/apps/project/project-list/ProjectList')),
//     },
//     {
//         key: 'apps.project.scrumboard',
//         path: `${APP_PREFIX_PATH}/apps/project/scrumboard`,
//         component: React.lazy(() => import('views/app-views/apps/project/scrumboard')),
//     },
//     {
//         key: 'apps.project.lead',
//         path: `${APP_PREFIX_PATH}/apps/project/lead`,
//         component: React.lazy(() => import('views/app-views/apps/leads')),
//     },
//     {
//         key: 'apps.project.deal',
//         path: `${APP_PREFIX_PATH}/apps/project/deal`,
//         component: React.lazy(() => import('views/app-views/apps/deals')),
//     },
//     {
//         key: 'apps.project.contract',
//         path: `${APP_PREFIX_PATH}/apps/project/contract`,
//         component: React.lazy(() => import('views/app-views/apps/contract')),
//     },
//     {
//         key: 'apps.project.bug',
//         path: `${APP_PREFIX_PATH}/apps/project/bug`,
//         component: React.lazy(() => import('views/app-views/apps/bug')),
//     },
//     {
//         key: 'apps.project.task',
//         path: `${APP_PREFIX_PATH}/apps/project/task`,
//         component: React.lazy(() => import('views/app-views/apps/task')),
//     },
//     {
//         key: 'apps.project.task',
//         path: `${APP_PREFIX_PATH}/apps/project/task/viewtask`,
//         component: React.lazy(() => import('views/app-views/apps/task/ViewTask')),
//     },








//     {
//         key: 'apps.project.taskcalendar',
//         path: `${APP_PREFIX_PATH}/apps/project/taskcalendar`,
//         component: React.lazy(() => import('views/app-views/apps/taskcalendar')),
//     },
//     {
//         key: 'apps.project.projectreport',
//         path: `${APP_PREFIX_PATH}/apps/project/projectreport`,
//         component: React.lazy(() => import('views/app-views/apps/projectreport')),
//     },
//     // {
//     //     key: 'apps.project.deal.viewdeal',
//     //     path: `${APP_PREFIX_PATH}/apps/project/deal/viewdeal`,
//     //     component: React.lazy(() => import('views/app-views/apps/deals/ViewDeal ')),
//     // },



//     {
//         key: 'apps.sales',
//         path: `${APP_PREFIX_PATH}/apps/sales`,
//         component: React.lazy(() => import('views/app-views/apps/project')),
//     },
//     {
//         key: 'apps-sales-customer',
//         path: `${APP_PREFIX_PATH}/apps/sales/customer`,
//         component: React.lazy(() => import('views/app-views/apps/sales/customer')),
//     },
//     {
//         key: 'apps.sales.sale',
//         path: `${APP_PREFIX_PATH}/apps/sales/invoice`,
//         component: React.lazy(() => import('views/app-views/apps/sales/invoice/InvoiceList')),
//     },
//     {
//         key: 'apps.sales.payments',
//         path: `${APP_PREFIX_PATH}/apps/sales/payments`,
//         component: React.lazy(() => import('views/app-views/apps/sales/payments')),
//     },
//     {
//         key: 'apps.sales.revenue',
//         path: `${APP_PREFIX_PATH}/apps/sales/revenue`,
//         component: React.lazy(() => import('views/app-views/apps/sales/revenue')),
//     },
//     {
//         key: 'apps.sales.estimates',
//         path: `${APP_PREFIX_PATH}/apps/sales/estimates`,
//         component: React.lazy(() => import('views/app-views/apps/sales/estimates')),
//     },
//     {
//         key: 'apps.sales.expenses',
//         path: `${APP_PREFIX_PATH}/apps/sales/expenses`,
//         component: React.lazy(() => import('views/app-views/apps/sales/expenses')),
//     },





//     {
//         key: 'apps.ecommerce',
//         path: `${APP_PREFIX_PATH}/apps/ecommerce`,
//         component: React.lazy(() => import('views/app-views/apps/e-commerce')),
//     },
//     {
//         key: 'apps.ecommerce.add-product',
//         path: `${APP_PREFIX_PATH}/apps/ecommerce/add-product`,
//         component: React.lazy(() => import('views/app-views/apps/e-commerce/add-product')),
//     },
//     {
//         key: 'apps.ecommerce.edit-product',
//         path: `${APP_PREFIX_PATH}/apps/ecommerce/edit-product/:id`,
//         component: React.lazy(() => import('views/app-views/apps/e-commerce/edit-product')),
//     },
//     {
//         key: 'apps.ecommerce.product-list',
//         path: `${APP_PREFIX_PATH}/apps/ecommerce/product-list`,
//         component: React.lazy(() => import('views/app-views/apps/e-commerce/product-list')),
//     },
//     {
//         key: 'apps.ecommerce.orders',
//         path: `${APP_PREFIX_PATH}/apps/ecommerce/orders`,
//         component: React.lazy(() => import('views/app-views/apps/e-commerce/orders')),
//     },
//     {
//         key: 'components.general',
//         path: `${APP_PREFIX_PATH}/components/general`,
//         component: React.lazy(() => import('views/app-views/components/general')),
//     },
//     {
//         key: 'components.general.button',
//         path: `${APP_PREFIX_PATH}/components/general/button`,
//         component: React.lazy(() => import('views/app-views/components/general/button')),
//     },
//     {
//         key: 'components.general.icon',
//         path: `${APP_PREFIX_PATH}/components/general/icon`,
//         component: React.lazy(() => import('views/app-views/components/general/icon')),
//     },
//     {
//         key: 'components.general.typography',
//         path: `${APP_PREFIX_PATH}/components/general/typography`,
//         component: React.lazy(() => import('views/app-views/components/general/typography')),
//     },
//     {
//         key: 'components.general',
//         path: `${APP_PREFIX_PATH}/components/layout`,
//         component: React.lazy(() => import('views/app-views/components/layout')),
//     },
//     {
//         key: 'components.general.grid',
//         path: `${APP_PREFIX_PATH}/components/layout/grid`,
//         component: React.lazy(() => import('views/app-views/components/layout/grid')),
//     },
//     {
//         key: 'components.general.layout',
//         path: `${APP_PREFIX_PATH}/components/layout/layout`,
//         component: React.lazy(() => import('views/app-views/components/layout/layout')),
//     },
//     {
//         key: 'components.navigation',
//         path: `${APP_PREFIX_PATH}/components/navigation`,
//         component: React.lazy(() => import('views/app-views/components/navigation')),
//     },
//     {
//         key: 'components.navigation.affix',
//         path: `${APP_PREFIX_PATH}/components/navigation/affix`,
//         component: React.lazy(() => import('views/app-views/components/navigation/affix')),
//     },
//     {
//         key: 'components.navigation.breadcrumb',
//         path: `${APP_PREFIX_PATH}/components/navigation/breadcrumb`,
//         component: React.lazy(() => import('views/app-views/components/navigation/breadcrumb')),
//     },
//     {
//         key: 'components.navigation.dropdown',
//         path: `${APP_PREFIX_PATH}/components/navigation/dropdown`,
//         component: React.lazy(() => import('views/app-views/components/navigation/dropdown')),
//     },
//     {
//         key: 'components.navigation.menu',
//         path: `${APP_PREFIX_PATH}/components/navigation/menu`,
//         component: React.lazy(() => import('views/app-views/components/navigation/menu')),
//     },
//     {
//         key: 'components.navigation.pagination',
//         path: `${APP_PREFIX_PATH}/components/navigation/pagination`,
//         component: React.lazy(() => import('views/app-views/components/navigation/pagination')),
//     },
//     {
//         key: 'components.navigation.steps',
//         path: `${APP_PREFIX_PATH}/components/navigation/steps`,
//         component: React.lazy(() => import('views/app-views/components/navigation/steps')),
//     },
//     {
//         key: 'components.data-entry',
//         path: `${APP_PREFIX_PATH}/components/data-entry`,
//         component: React.lazy(() => import('views/app-views/components/data-entry')),
//     },
//     {
//         key: 'components.data-entry.auto-complete',
//         path: `${APP_PREFIX_PATH}/components/data-entry/auto-complete`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/auto-complete')),
//     },
//     {
//         key: 'components.data-entry.cascader',
//         path: `${APP_PREFIX_PATH}/components/data-entry/cascader`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/cascader')),
//     },
//     {
//         key: 'components.data-entry.checkbox',
//         path: `${APP_PREFIX_PATH}/components/data-entry/checkbox`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/checkbox')),
//     },
//     {
//         key: 'components.data-entry.date-picker',
//         path: `${APP_PREFIX_PATH}/components/data-entry/date-picker`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/date-picker')),
//     },
//     {
//         key: 'components.data-entry.form',
//         path: `${APP_PREFIX_PATH}/components/data-entry/form`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/form')),
//     },
//     {
//         key: 'components.data-entry.input',
//         path: `${APP_PREFIX_PATH}/components/data-entry/input`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/input')),
//     },
//     {
//         key: 'components.data-entry.input-number',
//         path: `${APP_PREFIX_PATH}/components/data-entry/input-number`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/input-number')),
//     },
//     {
//         key: 'components.data-entry.mentions',
//         path: `${APP_PREFIX_PATH}/components/data-entry/mentions`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/mentions')),
//     },
//     {
//         key: 'components.data-entry.radio',
//         path: `${APP_PREFIX_PATH}/components/data-entry/radio`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/radio')),
//     },
//     {
//         key: 'components.data-entry.rate',
//         path: `${APP_PREFIX_PATH}/components/data-entry/rate`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/rate')),
//     },
//     {
//         key: 'components.data-entry.select',
//         path: `${APP_PREFIX_PATH}/components/data-entry/select`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/select')),
//     },
//     {
//         key: 'components.data-entry.slider',
//         path: `${APP_PREFIX_PATH}/components/data-entry/slider`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/slider')),
//     },
//     {
//         key: 'components.data-entry.switch',
//         path: `${APP_PREFIX_PATH}/components/data-entry/switch`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/switch')),
//     },
//     {
//         key: 'components.data-entry.time-picker',
//         path: `${APP_PREFIX_PATH}/components/data-entry/time-picker`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/time-picker')),
//     },
//     {
//         key: 'components.data-entry.transfer',
//         path: `${APP_PREFIX_PATH}/components/data-entry/transfer`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/transfer')),
//     },
//     {
//         key: 'components.data-entry.tree-select',
//         path: `${APP_PREFIX_PATH}/components/data-entry/tree-select`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/tree-select')),
//     },
//     {
//         key: 'components.data-entry.upload',
//         path: `${APP_PREFIX_PATH}/components/data-entry/upload`,
//         component: React.lazy(() => import('views/app-views/components/data-entry/upload')),
//     },
//     {
//         key: 'components.data-display',
//         path: `${APP_PREFIX_PATH}/components/data-display`,
//         component: React.lazy(() => import('views/app-views/components/data-display')),
//     },
//     {
//         key: 'components.data-display.avatar',
//         path: `${APP_PREFIX_PATH}/components/data-display/avatar`,
//         component: React.lazy(() => import('views/app-views/components/data-display/avatar')),
//     },
//     {
//         key: 'components.data-display.badge',
//         path: `${APP_PREFIX_PATH}/components/data-display/badge`,
//         component: React.lazy(() => import('views/app-views/components/data-display/badge')),
//     },
//     {
//         key: 'components.data-display.calendar',
//         path: `${APP_PREFIX_PATH}/components/data-display/calendar`,
//         component: React.lazy(() => import('views/app-views/components/data-display/calendar')),
//     },
//     {
//         key: 'components.data-display.card',
//         path: `${APP_PREFIX_PATH}/components/data-display/card`,
//         component: React.lazy(() => import('views/app-views/components/data-display/card')),
//     },
//     {
//         key: 'components.data-display.carousel',
//         path: `${APP_PREFIX_PATH}/components/data-display/carousel`,
//         component: React.lazy(() => import('views/app-views/components/data-display/carousel')),
//     },
//     {
//         key: 'components.data-display.collapse',
//         path: `${APP_PREFIX_PATH}/components/data-display/collapse`,
//         component: React.lazy(() => import('views/app-views/components/data-display/collapse')),
//     },
//     {
//         key: 'components.data-display.comment',
//         path: `${APP_PREFIX_PATH}/components/data-display/comment`,
//         component: React.lazy(() => import('views/app-views/components/data-display/comment')),
//     },
//     {
//         key: 'components.data-display.descriptions',
//         path: `${APP_PREFIX_PATH}/components/data-display/descriptions`,
//         component: React.lazy(() => import('views/app-views/components/data-display/descriptions')),
//     },
//     {
//         key: 'components.data-display.empty',
//         path: `${APP_PREFIX_PATH}/components/data-display/empty`,
//         component: React.lazy(() => import('views/app-views/components/data-display/empty')),
//     },
//     {
//         key: 'components.data-display.list',
//         path: `${APP_PREFIX_PATH}/components/data-display/list`,
//         component: React.lazy(() => import('views/app-views/components/data-display/list')),
//     },
//     {
//         key: 'components.data-display.popover',
//         path: `${APP_PREFIX_PATH}/components/data-display/popover`,
//         component: React.lazy(() => import('views/app-views/components/data-display/popover')),
//     },
//     {
//         key: 'components.data-display.statistic',
//         path: `${APP_PREFIX_PATH}/components/data-display/statistic`,
//         component: React.lazy(() => import('views/app-views/components/data-display/statistic')),
//     },
//     {
//         key: 'components.data-display.table',
//         path: `${APP_PREFIX_PATH}/components/data-display/table`,
//         component: React.lazy(() => import('views/app-views/components/data-display/table')),
//     },
//     {
//         key: 'components.data-display.tabs',
//         path: `${APP_PREFIX_PATH}/components/data-display/tabs`,
//         component: React.lazy(() => import('views/app-views/components/data-display/tabs')),
//     },
//     {
//         key: 'components.data-display.tag',
//         path: `${APP_PREFIX_PATH}/components/data-display/tag`,
//         component: React.lazy(() => import('views/app-views/components/data-display/tag')),
//     },
//     {
//         key: 'components.data-display.timeline',
//         path: `${APP_PREFIX_PATH}/components/data-display/timeline`,
//         component: React.lazy(() => import('views/app-views/components/data-display/timeline')),
//     },
//     {
//         key: 'components.data-display.tooltip',
//         path: `${APP_PREFIX_PATH}/components/data-display/tooltip`,
//         component: React.lazy(() => import('views/app-views/components/data-display/tooltip')),
//     },
//     {
//         key: 'components.data-display.tree',
//         path: `${APP_PREFIX_PATH}/components/data-display/tree`,
//         component: React.lazy(() => import('views/app-views/components/data-display/tree')),
//     },
//     {
//         key: 'components.feedback',
//         path: `${APP_PREFIX_PATH}/components/feedback`,
//         component: React.lazy(() => import('views/app-views/components/feedback')),
//     },
//     {
//         key: 'components.feedback.alert',
//         path: `${APP_PREFIX_PATH}/components/feedback/alert`,
//         component: React.lazy(() => import('views/app-views/components/feedback/alert')),
//     },
//     {
//         key: 'components.feedback.drawer',
//         path: `${APP_PREFIX_PATH}/components/feedback/drawer`,
//         component: React.lazy(() => import('views/app-views/components/feedback/drawer')),
//     },
//     {
//         key: 'components.feedback.message',
//         path: `${APP_PREFIX_PATH}/components/feedback/message`,
//         component: React.lazy(() => import('views/app-views/components/feedback/message')),
//     },
//     {
//         key: 'components.feedback.modal',
//         path: `${APP_PREFIX_PATH}/components/feedback/modal`,
//         component: React.lazy(() => import('views/app-views/components/feedback/modal')),
//     },
//     {
//         key: 'components.feedback.notification',
//         path: `${APP_PREFIX_PATH}/components/feedback/notification`,
//         component: React.lazy(() => import('views/app-views/components/feedback/notification')),
//     },
//     {
//         key: 'components.feedback.popconfirm',
//         path: `${APP_PREFIX_PATH}/components/feedback/popconfirm`,
//         component: React.lazy(() => import('views/app-views/components/feedback/popconfirm')),
//     },
//     {
//         key: 'components.feedback.progress',
//         path: `${APP_PREFIX_PATH}/components/feedback/progress`,
//         component: React.lazy(() => import('views/app-views/components/feedback/progress')),
//     },
//     {
//         key: 'components.feedback.result',
//         path: `${APP_PREFIX_PATH}/components/feedback/result`,
//         component: React.lazy(() => import('views/app-views/components/feedback/result')),
//     },
//     {
//         key: 'components.feedback.skeleton',
//         path: `${APP_PREFIX_PATH}/components/feedback/skeleton`,
//         component: React.lazy(() => import('views/app-views/components/feedback/skeleton')),
//     },
//     {
//         key: 'components.feedback.spin',
//         path: `${APP_PREFIX_PATH}/components/feedback/spin`,
//         component: React.lazy(() => import('views/app-views/components/feedback/spin')),
//     },
//     {
//         key: 'components.other',
//         path: `${APP_PREFIX_PATH}/components/other`,
//         component: React.lazy(() => import('views/app-views/components/other')),
//     },
//     {
//         key: 'components.other',
//         path: `${APP_PREFIX_PATH}/components/other`,
//         component: React.lazy(() => import('views/app-views/components/other')),
//     },
//     {
//         key: 'components.other',
//         path: `${APP_PREFIX_PATH}/components/other`,
//         component: React.lazy(() => import('views/app-views/components/other')),
//     },
//     {
//         key: 'components.other.anchor',
//         path: `${APP_PREFIX_PATH}/components/other/anchor`,
//         component: React.lazy(() => import('views/app-views/components/other/anchor')),
//     },
//     {
//         key: 'components.other.backtop',
//         path: `${APP_PREFIX_PATH}/components/other/backtop`,
//         component: React.lazy(() => import('views/app-views/components/other/backtop')),
//     },
//     {
//         key: 'components.other.config-provider',
//         path: `${APP_PREFIX_PATH}/components/other/config-provider`,
//         component: React.lazy(() => import('views/app-views/components/other/config-provider')),
//     },
//     {
//         key: 'components.other.divider',
//         path: `${APP_PREFIX_PATH}/components/other/divider`,
//         component: React.lazy(() => import('views/app-views/components/other/divider')),
//     },
//     {
//         key: 'components.chart',
//         path: `${APP_PREFIX_PATH}/components/charts`,
//         component: React.lazy(() => import('views/app-views/components/charts')),
//     },
//     {
//         key: 'components.chart.apex-charts',
//         path: `${APP_PREFIX_PATH}/components/charts/apex-charts`,
//         component: React.lazy(() => import('views/app-views/components/charts/apex')),
//     },
//     {
//         key: 'components.chart.chartjs',
//         path: `${APP_PREFIX_PATH}/components/charts/chartjs`,
//         component: React.lazy(() => import('views/app-views/components/charts/chartjs')),
//     },
//     {
//         key: 'components.maps',
//         path: `${APP_PREFIX_PATH}/components/maps`,
//         component: React.lazy(() => import('views/app-views/components/maps')),
//     },
//     {
//         key: 'components.maps.simple-map',
//         path: `${APP_PREFIX_PATH}/components/maps/simple-map`,
//         component: React.lazy(() => import('views/app-views/components/maps/simple-map')),
//     },
//     {
//         key: 'login-1',
//         path: `${APP_PREFIX_PATH}/login-1`,
//         component: React.lazy(() => import('views/auth-views/authentication/login-1')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'login-2',
//         path: `${APP_PREFIX_PATH}/login-2`,
//         component: React.lazy(() => import('views/auth-views/authentication/login-2')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'register-1',
//         path: `${APP_PREFIX_PATH}/register-1`,
//         component: React.lazy(() => import('views/auth-views/authentication/register-1')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'register-2',
//         path: `${APP_PREFIX_PATH}/register-2`,
//         component: React.lazy(() => import('views/auth-views/authentication/register-2')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'forgot-password',
//         path: `${APP_PREFIX_PATH}/forgot-password`,
//         component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'error-page-1',
//         path: `${APP_PREFIX_PATH}/error-page-1`,
//         component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'error-page-2',
//         path: `${APP_PREFIX_PATH}/error-page-2`,
//         component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
//         meta: {
//             blankLayout: true
//         }
//     },
//     {
//         key: 'pages',
//         path: `${APP_PREFIX_PATH}/pages`,
//         component: React.lazy(() => import('views/app-views/pages')),
//     },
//     {
//         key: 'pages.profile',
//         path: `${APP_PREFIX_PATH}/pages/profile`,
//         component: React.lazy(() => import('views/app-views/pages/profile')),
//     },


//     {
//         key: 'hrm',
//         path: `${APP_PREFIX_PATH}/hrm`,
//         component: React.lazy(() => import('views/app-views/hrm')),
//     },
//     {
//         key: 'hrm.employee',
//         path: `${APP_PREFIX_PATH}/hrm/employee`,
//         component: React.lazy(() => import('views/app-views/hrm/Employee')),
//     },
//     // {
//     //     key: 'hrm.payroll',
//     //     path: `${APP_PREFIX_PATH}/hrm/payroll`,
//     //     component: React.lazy(() => import('views/app-views/hrm/PayRoll')),
//     // },
//     {
//         key: 'hrm.payroll.salary',
//         path: `${APP_PREFIX_PATH}/hrm/payroll/salary`,
//         component: React.lazy(() => import('views/app-views/hrm/PayRoll/Salary')),
//     },
//     {
//         key: 'hrm.payroll.salary',
//         path: `${APP_PREFIX_PATH}/hrm/payroll/salary/setsalary`,
//         component: React.lazy(() => import('views/app-views/hrm/PayRoll/Salary/SetSalary')),
//     },
//     {
//         key: 'hrm.payroll.payslip',
//         path: `${APP_PREFIX_PATH}/hrm/payroll/payslip`,
//         component: React.lazy(() => import('views/app-views/hrm/PayRoll/PaySlip')),
//     },


//     {
//         key: 'hrm.performance.indiactor',
//         path: `${APP_PREFIX_PATH}/hrm/performance/indicator`,
//         component: React.lazy(() => import('views/app-views/hrm/Performance/Indicator')),
//     },
//     {
//         key: 'hrm.performance.appraisal',
//         path: `${APP_PREFIX_PATH}/hrm/performance/appraisal`,
//         component: React.lazy(() => import('views/app-views/hrm/Performance/Appraisal')),
//     },
//     {
//         key: 'hrm.performance.goaltracking',
//         path: `${APP_PREFIX_PATH}/hrm/performance/goaltracking`,
//         component: React.lazy(() => import('views/app-views/hrm/Performance/Goaltracking')),
//     },




//     {
//         key: 'hrm.role',
//         path: `${APP_PREFIX_PATH}/hrm/role`,
//         component: React.lazy(() => import('views/app-views/hrm/RoleAndPermission/Role')),
//     },
//     {
//         key: 'hrm.permission',
//         path: `${APP_PREFIX_PATH}/hrm/permission`,
//         component: React.lazy(() => import('views/app-views/hrm/RoleAndPermission/Permission')),
//     },
//     {
//         key: 'hrm.designation',
//         path: `${APP_PREFIX_PATH}/hrm/designation`,
//         component: React.lazy(() => import('views/app-views/hrm/Designation')),
//     },

//     {
//         key: 'hrm.designation',
//         path: `${APP_PREFIX_PATH}/hrm/designation/particulardesignation`,
//         component: React.lazy(() => import('views/app-views/hrm/Designation/ParticularDesignation')),
//     },
//     {
//         key: 'hrm.department',
//         path: `${APP_PREFIX_PATH}/hrm/department`,
//         component: React.lazy(() => import('views/app-views/hrm/Department')),
//     },

//     {
//         key: 'hrm.department',
//         path: `${APP_PREFIX_PATH}/hrm/department/particulardepartment`,
//         component: React.lazy(() => import('views/app-views/hrm/Department/ParticularDepartment')),
//     },

//     {
//         key: 'hrm.eventsetup',
//         path: `${APP_PREFIX_PATH}/hrm/EventSetup`,
//         component: React.lazy(() => import('views/app-views/hrm/EventSetup')),
//     },

//     {
//         key: 'hrm.meeting',
//         path: `${APP_PREFIX_PATH}/hrm/Meeting`,
//         component: React.lazy(() => import('views/app-views/hrm/Meeting')),
//     },
//     {
//         key: 'hrm.attendance',
//         path: `${APP_PREFIX_PATH}/hrm/attendance`,
//         component: React.lazy(() => import('views/app-views/hrm/Attendance')),
//     },
//     {
//         key: 'hrm.attendance.attendancelist',
//         path: `${APP_PREFIX_PATH}/hrm/attendance/attendancelist`,
//         component: React.lazy(() => import('views/app-views/hrm/Attendance')),
//     },
//     {
//         key: 'hrm.leave',
//         path: `${APP_PREFIX_PATH}/hrm/leave`,
//         component: React.lazy(() => import('views/app-views/hrm/Leaves')),
//     },
//     {
//         key: 'hrm.leave.leavelist',
//         path: `${APP_PREFIX_PATH}/hrm/leave/leavelist`,
//         component: React.lazy(() => import('views/app-views/hrm/Leaves')),
//     },
//     {
//         key: 'hrm.jobs',
//         path: `${APP_PREFIX_PATH}/hrm/jobs`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs')),
//     },
//     {
//         key: 'hrm.jobs',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/viewjob`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/ViewJob')),
//     },

//     {
//         key: 'hrm.jobs',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/viewjobonbording`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/JobOnBording/ViewJobOnBording')),
//     },

//     {
//         key: 'hrm.jobs.jobcandidate',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate/viewjobcandidate`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/JobCandidate/ViewJobCandidate')),
//     },




//     {
//         key: 'hrm.jobs.jobcandidate',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/jobcandidate`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/JobCandidate')),
//     },
//     {
//         key: 'hrm.jobs.jobonbording',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/jobonbording`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/JobOnBording')),
//     },
//     {
//         key: 'hrm.jobs.joblist',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/joblist`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs')),
//     },
//     {
//         key: 'hrm.jobs.jobapplication',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/jobapplication`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/JobApplication')),
//     },
//     {
//         key: 'hrm.jobs.interview',
//         path: `${APP_PREFIX_PATH}/hrm/jobs/interview`,
//         component: React.lazy(() => import('views/app-views/hrm/Jobs/Interview')),
//     },
//     {
//         key: 'hrm.announcement',
//         path: `${APP_PREFIX_PATH}/hrm/announcement`,
//         component: React.lazy(() => import('views/app-views/hrm/Announcement')),
//     },
//     // {
//     //     key: 'hrm.myattendance',
//     //     path: `${APP_PREFIX_PATH}/hrm/myattendance`,
//     //     component: React.lazy(() => import('views/app-views/hrm/MyAttendance')),
//     // },

//     {
//         key: 'coupon',
//         path: `${APP_PREFIX_PATH}/superadmin/coupon`,
//         component: React.lazy(() => import('views/app-views/coupon')),
//     },
//     {
//         key: 'notes',
//         path: `${APP_PREFIX_PATH}/superadmin/notes`,
//         component: React.lazy(() => import('views/app-views/notes')),
//     },
//     {
//         key: 'company',
//         path: `${APP_PREFIX_PATH}/superadmin/company`,
//         component: React.lazy(() => import('views/app-views/company')),
//     },
//     {
//         key: 'plan',
//         path: `${APP_PREFIX_PATH}/superadmin/plan`,
//         component: React.lazy(() => import('views/app-views/plan')),
//     },

//     {
//         key: 'pages.invoice',
//         path: `${APP_PREFIX_PATH}/pages/invoice`,
//         component: React.lazy(() => import('views/app-views/pages/invoice')),
//     },
//     {
//         key: 'pages.pricing',
//         path: `${APP_PREFIX_PATH}/pages/pricing`,
//         component: React.lazy(() => import('views/app-views/pages/pricing')),
//     },
//     {
//         key: 'pages.customersupports',
//         path: `${APP_PREFIX_PATH}/pages/customersupports`,
//         component: React.lazy(() => import('views/app-views/pages/customersupports')),
//     },
//     {
//         key: 'pages.customersupports.ticket',
//         path: `${APP_PREFIX_PATH}/pages/customersupports/ticket`,
//         component: React.lazy(() => import('views/app-views/pages/customersupports/ticket')),
//     },
//     {
//         key: 'pages.faq',
//         path: `${APP_PREFIX_PATH}/pages/faq`,
//         component: React.lazy(() => import('views/app-views/pages/faq')),
//     },
//     {
//         key: 'pages.setting',
//         path: `${APP_PREFIX_PATH}/pages/setting/*`,
//         component: React.lazy(() => import('views/app-views/pages/setting')),
//     },
//     {
//         key: 'users.user-list',
//         path: `${APP_PREFIX_PATH}/users/user-list`,
//         component: React.lazy(() => import('views/app-views/Users/user-list')),
//     },
//     {
//         key: 'users.client-list',
//         path: `${APP_PREFIX_PATH}/users/client-list`,
//         component: React.lazy(() => import('views/app-views/Users/client-list')),
//     },
//     {
//         key: 'users.client-user-list',
//         path: `${APP_PREFIX_PATH}/users/client-user-list`,
//         component: React.lazy(() => import('views/app-views/Users/client-user')),
//     },
    
//     {
//         key: 'docs.documentation',
//         path: `${APP_PREFIX_PATH}/docs/documentation/*`,
//         component: React.lazy(() => import('views/app-views/docs')),
//     }
// ]