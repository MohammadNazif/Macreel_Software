import { Component, OnInit } from '@angular/core';

interface Qualification {
  sno: number;
  degree: string;
  institution: string;
  year: string;
  attachment?: string | null;
}

interface Employee {
  // Personal Info
  name: string;
  empCode: string;
  dob: string;
  age?: number;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  mobile?: string;
  email?: string;
  state?: string;
  city?: string;
  presentAddress?: string;

  // Professional Info
  status?: string;
  department?: string;
  designation?: string;
  designationType?: string;
  joiningDate?: string;
  reportingManager?: string;
  salary?: number;
  yearOfExperience?: number | null;

  // Academic / Professional Qualifications
  qualifications?: Qualification[] | null;

  // Bank & Identity Info
  bankName?: string | null;
  accountNumber?: string | null;
  ifsc?: string | null;
  pan?: string | null;
  panAttachment?: string | null;
  aadhaar?: string | null;
  aadhaarAttachment?: string | null;
  passport?: string | null;
  passportAttachment?: string | null;

  // Previous Employment
  previousEmployer?: string | null;
  previousFrom?: string | null;
  previousTo?: string | null;
}

@Component({
  selector: 'app-employee-details',
  standalone:false,
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employee: Employee = {
    name: 'Mimansa',
    empCode: '123',
    dob: '2000-01-20',
    age: 26,
    gender: 'Female',
    nationality: 'Indian',
    maritalStatus: 'Unmarried',
    mobile: '7896541230',
    email: 'mannu967774@gmail.com',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    presentAddress: 'Noida',

    department: 'Web Development',
    designation: '.NET Developer',
    designationType: 'Employee',
    joiningDate: '2026-01-20',
    reportingManager: 'Admin',
    salary: 10000,
    status: 'Active',
    yearOfExperience: 0,

    qualifications: [
      { sno: 1, degree: 'B.Tech', institution: 'ABC University', year: '2018', attachment: null },
      { sno: 2, degree: 'M.Tech', institution: 'XYZ University', year: '2020', attachment: null }
    ],

    bankName: 'dgbdf',
    accountNumber: '7988964561521',
    ifsc: '987948456656',
    pan: 'POKPS6483E',
    panAttachment: null,
    aadhaar: '574861577125',
    aadhaarAttachment: null,
    passport: null,
    passportAttachment: null,

    previousEmployer: null,
    previousFrom: null,
    previousTo: null
  };

  constructor() { }

  ngOnInit(): void {
    // Optionally replace this with API call to fetch employee details
  }

}
