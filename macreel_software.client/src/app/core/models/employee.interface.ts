export interface Task {
  id: number;
  title: string;
  assignedBy: string;
  assignedDate: string;
  completionDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}
