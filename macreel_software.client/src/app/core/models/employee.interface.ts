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


