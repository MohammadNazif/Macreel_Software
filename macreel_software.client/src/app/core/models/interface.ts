export interface LeaveRequest {
  id: number
  applieddate: Date
  fromDate: Date
  toDate: Date
  leaveName: string
  description: string
  // status: string 
}
export interface Task {
  id: number;
  title: string;
  assignedBy: string;
  assignedDate: string;
  completionDate: string;
  status: string;
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

export interface LeaveBalance {
  leaveType: string;
  assignedLeave: number;
  usedLeave: number;
  remainingLeave: number;
}