
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
  assignedBy: string;
  assignedDate: string;
  completionDate: string;
  taskStatus: string;
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
export interface LeaveBalance {
  leaveType: string;
  assignedLeave: number;
  usedLeave: number;
  remainingLeave: number;
}
