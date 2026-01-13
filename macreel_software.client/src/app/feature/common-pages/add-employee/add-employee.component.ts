import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ManageEmployeeService } from '../../../core/services/manage-employee.service';
import { ManageMasterdataService } from '../../../core/services/manage-masterdata.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  standalone :false,
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  // ================= UI STATE =================
  step = 1;
  isLoading = false;

  // ================= MASTER DATA =================
  roles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

states: any[] = [];
cities: any[] = [];
reportingManagers: any[] = [];

  // ================= FORM =================
  employeeForm!: FormGroup;

  // ================= FILES =================
  profilePic?: File;
  aadharImg?: File;
  panImg?: File;
  experienceCertificate?: File;
  tenthCertificate?: File;
  twelthCertificate?: File;
  graduationCertificate?: File;
  mastersCertificate?: File;

  constructor(
    private fb: FormBuilder,
    private employeeService: ManageEmployeeService,
    private masterService: ManageMasterdataService
  ) { }

  // ================= INIT =================
  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      // ===== STEP 1 (REQUIRED) =====
      empRoleId: ['', Validators.required],
      empCode: [''],
      empName: ['', Validators.required],
      mobile: ['', Validators.required],
      departmentId: ['', Validators.required],
      designationId: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      salary: [''],
      dateOfJoining: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      gender: [''],
      nationality: [''],
      maritalStatus: [''],
      presentAddress: [''],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      reportingManagerId: [''],
      pincode: [''],
      bankName: [''],
      accountNo: [''],
      ifscCode: [''],
      bankBranch: [''],
      emergencyContactPersonName: [''],
      emergencyContactNum: [''],

      // ===== STEP 2 (OPTIONAL) =====
      companyName: [''],
      yearOfExperience: [''],
      technology: [''],
      companyContactNo: [''],

      // SYSTEM
      addedBy: [1]
    });
    this.loadMasters();
    this.loadStates();
    this.loadReportingManagers();
  }
  // ================= MASTER DATA =================
  private loadMasters(): void {
    this.masterService.getRoles(1, 100).subscribe(res => this.roles = res?.data ?? []);
    this.masterService.getDepartment().subscribe(res => this.departments = res?.data ?? []);
    this.masterService.getDesignation().subscribe(res => this.designations = res?.data ?? []);
  }

  // Load states dynamically
private loadStates(): void {
  this.employeeService.getAllStateList().subscribe(res => {
    if (res?.status) {
      this.states = res.stateList ?? [];
    }
  });
}

// When a state is selected, load its cities
onStateChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  const stateId = select.value;

  if (!stateId) {
    this.cities = [];
    this.employeeForm.get('cityId')?.setValue('');
    return;
  }

  this.employeeService.getCityByStateId(+stateId).subscribe(res => {
    if (res?.status) {
      this.cities = res.cityList ?? [];
      this.employeeForm.get('cityId')?.setValue(''); // reset city selection
    }
  });
}

// Load reporting managers
private loadReportingManagers(): void {
  this.employeeService.getReportingManager().subscribe(res => {
    if (res?.success) {
      this.reportingManagers = res.data ?? [];
    }
  });
}

  // ================= STEP CONTROL =================
  // nextStep(): void {
  //   if (this.employeeForm.invalid) {
  //     this.employeeForm.markAllAsTouched();
  //     Swal.fire('Validation Error', 'Please fill required fields', 'warning');
  //     return;
  //   }
  //   this.step = 2;
  // }

  nextStep(): void {
    const step1Controls = [
      'empRoleId', 'empName', 'mobile', 'departmentId',
      'designationId', 'emailId', 'dateOfJoining',
      'dob', 'password', 'stateId', 'cityId'
    ];

    step1Controls.forEach(control => {
      this.employeeForm.get(control)?.markAsTouched();
    });

    const step1Invalid = step1Controls.some(
      control => this.employeeForm.get(control)?.invalid
    );

    if (step1Invalid) {
      Swal.fire('Required Fields Missing', 'Please fill all mandatory fields', 'warning');
      return;
    }

    this.step = 2;
  }


  prevStep(): void {
    this.step = 1;
  }

  // ================= FILE HANDLER =================
  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const fileMap: Record<string, File> = {
      profile: file,
      aadhar: file,
      pan: file,
      experience: file,
      tenth: file,
      twelth: file,
      graduation: file,
      masters: file
    };

    switch (type) {
      case 'profile': this.profilePic = fileMap[type]; break;
      case 'aadhar': this.aadharImg = fileMap[type]; break;
      case 'pan': this.panImg = fileMap[type]; break;
      case 'experience': this.experienceCertificate = fileMap[type]; break;
      case 'tenth': this.tenthCertificate = fileMap[type]; break;
      case 'twelth': this.twelthCertificate = fileMap[type]; break;
      case 'graduation': this.graduationCertificate = fileMap[type]; break;
      case 'masters': this.mastersCertificate = fileMap[type]; break;
    }
  }

  // ================= SUBMIT =================
  onSubmit(): void {
    if (this.employeeForm.invalid || this.isLoading) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.entries(this.employeeForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // FILES
    if (this.profilePic) formData.append('ProfilePic', this.profilePic);
    if (this.aadharImg) formData.append('AadharImg', this.aadharImg);
    if (this.panImg) formData.append('PanImg', this.panImg);
    if (this.experienceCertificate) formData.append('ExperienceCertificate', this.experienceCertificate);
    if (this.tenthCertificate) formData.append('TenthCertificate', this.tenthCertificate);
    if (this.twelthCertificate) formData.append('TwelthCertificate', this.twelthCertificate);
    if (this.graduationCertificate) formData.append('GraduationCertificate', this.graduationCertificate);
    if (this.mastersCertificate) formData.append('MastersCertificate', this.mastersCertificate);

    this.isLoading = true;

    Swal.fire({
      title: 'Submitting...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false
    });

    this.employeeService.addEmployee(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Employee added successfully', 'success');
          this.employeeForm.reset({ addedBy: 1 });
          this.resetFiles();
          this.step = 1;
        },
        error: () => {
          Swal.fire('Error', 'API Error occurred', 'error');
        }
      });
  }


  // ================= RESET FILES =================
  private resetFiles(): void {
    this.profilePic =
      this.aadharImg =
      this.panImg =
      this.experienceCertificate =
      this.tenthCertificate =
      this.twelthCertificate =
      this.graduationCertificate =
      this.mastersCertificate = undefined;
  }
}
