import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import user from "../views/auth-views/auth-reducers/UserSlice"
import role from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice'
import employee from "../views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice"
import ClientData from "../views/app-views/company/CompanyReducers/CompanySlice"
import Department from "../views/app-views/hrm/Department/DepartmentReducers/DepartmentSlice"
import Designation from "../views/app-views/hrm/Designation/DesignationReducers/DesignationSlice"
import Leave from "../views/app-views/hrm/Leaves/LeaveReducer/LeaveSlice"
import Plan from "../views/app-views/plan/PlanReducers/PlanSlice"
import Meeting from "../views/app-views/hrm/Meeting/MeetingReducer/MeetingSlice"
import Announce from "../views/app-views/hrm/Announcement/AnnouncementReducer/AnnouncementSlice"
import Project from "../views/app-views/dashboards/project/project-list/projectReducer/ProjectSlice"
import TaskCalander from "../views/app-views/dashboards/taskcalendar/TaskCalendarReducer/TaskCalendarSlice"
import Tags from "../views/app-views/dashboards/project/project-list/tagReducer/TagSlice"
import Leads from "../views/app-views/dashboards/leads/LeadReducers/LeadSlice"
import EventSetup from "../views/app-views/hrm/EventSetup/EventSetupService/EventSetupSlice"
import Deals from "../views/app-views/dashboards/deals/DealReducers/DealSlice"
import SubClient from "../views/app-views/Users/client-list/CompanyReducers/CompanySlice"
import Contract from "../views/app-views/dashboards/contract/ContractReducers/ContractSlice"
import countries from "../views/app-views/setting/countries/countriesreducer/countriesSlice"
import currencies from "../views/app-views/setting/currencies/currenciesreducer/currenciesSlice"
import Milestone from "../views/app-views/dashboards/project/milestone/minestoneReducer/minestoneSlice"
import Expense from "../views/app-views/dashboards/project/expenses/Expencereducer/ExpenseSlice"
import Payment from "../views/app-views/dashboards/project/payment/PaymentReducer/paymentSlice"
import Notes from "../views/app-views/dashboards/project/notes/NotesReducer/NotesSlice"
import Product from "../views/app-views/dashboards/project/product/ProductReducer/ProductsSlice"
import Tasks from "../views/app-views/dashboards/project/task/TaskReducer/TaskSlice"
import Lable from "../views/app-views/dashboards/project/milestone/LableReducer/LableSlice"

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        user,
        role,
        employee,
        ClientData,
        Department,
        Designation,
        Leave,
        Plan,
        Meeting,
        Announce,
        Project,
        TaskCalander,
        Tags,
        Leads,
        EventSetup,
        Deals,
        SubClient,
        Contract,
        countries,
        currencies,
        Milestone,
        Expense,
        Payment,
        Notes,
        Product,
        Tasks,
        Lable,
        // employee,
        // department,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
