
export interface LeaveRequest {
  id: number
  appliedDate: Date
  fromDate: Date
  toDate: Date
  leaveType: string
  description: string
  status: string 
}

import { TemplateRef } from "@angular/core";


export interface Task {
  id: number;
  title: string;
  assignedBy: string;
  assignedDate: string;
  completionDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
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
}

export interface LeaveRow {
  srNo: number;
  id: number;
  leaveName: string;
  description: string;
}
export interface EmpDashboardCount {
  TotalProjects: number;
  OngoingProjects : number;
  AssignedLeave: number;
  RequestedLeave: number;
  TotalTasks: number;
  CompletedTasks: number;
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
  completedDate: string; // or Date
  assignedBy: string;
  document1: string | null;
  document2: string | null;
  document1Path: string | null;
  document2Path: string | null;
}
export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
}
export type TableColumnType = 'text' | 'date' | 'custom';
export type TableColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: TableColumnType;
  align?: TableColumnAlign;
  width?: string;
  template?: TemplateRef<any>;
}

