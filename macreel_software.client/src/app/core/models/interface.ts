
export interface LeaveRequest {
  id: number
  applieddate: Date
  fromDate: Date
  toDate: Date
  leaveName: string
  description: string
  // status: string
}

import { TemplateRef } from "@angular/core";

export interface Task {
  id: number;
  title: string;
  assignedByName: string;
  assignedDate: string;
  completionDate: string;
  taskStatus: string;
  adminTaskStatus:string;
  documents :[];
}


export interface Project {
  id: number;
  category: string;
  projectTitle: string;
  description: string;
  startDate: string;
  assignDate: string;
  endDate: string;
  completionDate: string;
  webEmpName?: string;
  appEmpName?: string;
  seo?: string;
  smo?: string;
  paidAds?: string;
  gmb?: string;
  delayedDays? : number;
}

export interface LeaveRow {
  srNo: number;
  id: number;
  leaveName: string;
  description: string;
}
export interface EmpDashboardCount {
  totalProjects: number;
  ongoingProjects : number;
  assignedLeave: number;
  requestedLeave: number;
  totalTasks: number;
  completedTasks: number;
}
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
export interface Task {
  id: number;
  empId: number;
  empName: string;
  title: string;
  description: string;
  completedDate: Date; // or Date
  assignedBy: string;
  document1: string | null;
  document2: string | null;
  document1Path: string | null;
  document2Path: string | null;
  uploadedDocuments?: string[] | null; 
}
export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
}
export type TableColumnType = 'text' | 'date' | 'custom' | 'time' | 'checkbox'  | 'number';
export type TableColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: TableColumnType;
  align?: TableColumnAlign;
  width?: string;           
  clickable?: boolean;
  route?: string;           
  apiActions?: string[];    
  template?: TemplateRef<any>;
  formatter?: (value: any, row?: T) => any;
}
export interface LeaveBalance {
  leaveType: string;
  assignedLeave: number;
  usedLeave: number;
  remainingLeave: number;
}
export interface Attendance {
   EmpCode : number;
  EmpName : string;
  attendanceDate :Date;
  status : string;
  inTime : string;
  outTime :string;
  day :Date;
  Month  :Date;
  Year :Date;
  totalHours : number;
}

export interface AdminDashboard{
  totalProjects:number;
  ongoingProjects:number;
  totalEmployees:number;
  absentEmployee:number;
  totalTasks:number;
  completedTask:number;
  leaveRequest:number;
  upcomingLeaves:number;
}


export interface Page {
  id: number;
  pageName: string;
  pageUrl: string;
  checked : boolean;
}
export interface PageAssign {
  pageId: number;
}

export interface AssignRolePages {
  roleId: number;
  pages: PageAssign[];
}

export interface employee {
  srNo: number;
  id: number,
  name: string;
  empCode: number;
  empName: string;
  designationName: string;
  empEmail: string;
  Contact: number;
 emailId :string;
 mobile :number;
}
export interface PageRow {
  pageId: number;
  pageName: string;
  pageUrl: string;
  checked: boolean;
}