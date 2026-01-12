import { Component, OnInit } from '@angular/core';
import { ManageEmployeeService } from '../../../../core/services/manage-employee.service';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';

@Component({
  selector: 'app-add-employee',
  standalone: false,
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  // ================= UI STATE =================
  step = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // ================= DROPDOWNS (API DATA) =================
  roles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

  // ================= EMPLOYEE MODEL =================
  employee: any = {
    empRoleId: null,
    empCode: '',
    empName: '',
    mobile: '',
    emailId: '',
    departmentId: null,
    designationId: null,
    salary: '',
    dateOfJoining: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    presentAddress: '',
    stateId: '',
    cityId: '',
    pincode: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    bankBranch: '',
    emergencyContactPersonName: '',
    emergencyContactNum: '',
    companyName: '',
    yearOfExperience: '',
    technology: '',
    companyContactNo: '',
    addedBy: 1,

    profilePic: null,
    aadharImg: null,
    panImg: null,
    experienceCertificate: null,
    tenthCertificate: null,
    twelthCertificate: null,
    graduationCertificate: null,
    mastersCertificate: null
  };

  constructor(
    private employeeService: ManageEmployeeService,
    private masterService: ManageMasterdataService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadRoles();
    this.loadDepartments();
    this.loadDesignations();
  }

  // ================= MASTER DATA =================
  loadRoles() {
    this.masterService.getRoles(1, 100).subscribe({
      next: res => this.roles = res.data ?? [],
      error: () => console.error('Roles load failed')
    });
  }

  loadDepartments() {
    this.masterService.getDepartment().subscribe({
      next: res => this.departments = res.data ?? [],
      error: () => console.error('Departments load failed')
    });
  }

  loadDesignations() {
    this.masterService.getDesignation().subscribe({
      next: res => this.designations = res.data ?? [],
      error: () => console.error('Designations load failed')
    });
  }

  // ================= STEP CONTROL =================
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // ================= FILE HANDLERS =================
  onProfilePicSelected(e: any) {
    this.employee.profilePic = e.target.files[0];
  }

  onAadharImgSelected(e: any) {
    this.employee.aadharImg = e.target.files[0];
  }

  onPanImgSelected(e: any) {
    this.employee.panImg = e.target.files[0];
  }

  onExperienceCertificateSelected(e: any) {
    this.employee.experienceCertificate = e.target.files[0];
  }

  onTenthCertificateSelected(e: any) {
    this.employee.tenthCertificate = e.target.files[0];
  }

  onTwelthCertificateSelected(e: any) {
    this.employee.twelthCertificate = e.target.files[0];
  }

  onGraduationCertificateSelected(e: any) {
    this.employee.graduationCertificate = e.target.files[0];
  }

  onMastersCertificateSelected(e: any) {
    this.employee.mastersCertificate = e.target.files[0];
  }

  // ================= SUBMIT =================
  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        this.successMessage = 'Employee added successfully ✅';
        this.isLoading = false;
        this.step = 1;
      },
      error: () => {
        this.errorMessage = 'Something went wrong ❌';
        this.isLoading = false;
      }
    });
  }
}
