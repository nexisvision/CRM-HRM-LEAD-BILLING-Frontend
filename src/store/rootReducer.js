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
        // employee,
        // department,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
