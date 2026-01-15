import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
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
technologies: any[] = [];

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
    private masterService: ManageMasterdataService,
     private route: ActivatedRoute,
     private router: Router
  ) { }

  employeeId!: number;
isEditMode = false;


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
      technologyId: [''],

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
    this.loadTechnologies();

     // 👇 EDIT MODE CHECK
  this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

  if (this.employeeId) {
    this.isEditMode = true;

      // 🔥 password disable + validators remove
  this.employeeForm.get('password')?.reset();
  this.employeeForm.get('password')?.clearValidators();
  this.employeeForm.get('password')?.disable();
  this.employeeForm.get('password')?.updateValueAndValidity();

  this.employeeForm.get('emailId')?.reset();
  this.employeeForm.get('emailId')?.clearValidators();
  this.employeeForm.get('emailId')?.disable();
  this.employeeForm.get('emailId')?.updateValueAndValidity();

    this.getEmployeeById(this.employeeId);
  }
  }

  private loadTechnologies(): void {
  this.masterService.getAllTechnology(1, 100).subscribe(res => {
    this.technologies = res?.data ?? [];
  });
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

  // ===== IMAGE PREVIEWS (EDIT MODE) =====
profilePicPreview: string | null = null;
aadharImgPreview: string | null = null;
panImgPreview: string | null = null;
experiencePreview: string | null = null;
tenthPreview: string | null = null;
twelthPreview: string | null = null;
graduationPreview: string | null = null;
mastersPreview: string | null = null;


// API base url (agar alag ho)
imageBaseUrl = 'https://localhost:7253/api/'; // apna backend url


  getEmployeeById(id: number) {
  this.employeeService.getEmployeeById(id).subscribe((res: any) => {
    if (res.success && res.data?.length) {
      const emp = res.data[0];

      this.employeeForm.patchValue({
        // empRoleId: emp.empRoleId,
        empRoleId: Number(emp.empRoleId),
        empCode: emp.empCode,
        empName: emp.empName,
        mobile: emp.mobile,
        // departmentId: emp.departmentId,
        departmentId: Number(emp.departmentId),
        // designationId: emp.designationId,
        designationId: Number(emp.designationId),
        //emailId: emp.emailId,
        salary: emp.salary,
        dateOfJoining: emp.dateOfJoining?.substring(0, 10),
        dob: emp.dob?.substring(0, 10),
        gender: emp.gender,
        nationality: emp.nationality,
        maritalStatus: emp.maritalStatus,
        presentAddress: emp.presentAddress,
        // stateId: emp.stateId,
        stateId: Number(emp.stateId),
        // reportingManagerId: emp.reportingManagerId,
        reportingManagerId: Number(emp.reportingManagerId),
        pincode: emp.pincode,
        bankName: emp.bankName,
        accountNo: emp.accountNo,
        ifscCode: emp.ifscCode,
        bankBranch: emp.bankBranch,
        emergencyContactPersonName: emp.emergencyContactPersonName,
        emergencyContactNum: emp.emergencyContactNum,
        technologyId: emp.technologyId,
        // profilePicPath:emp.profilePicPath,
        // aadharImgPath:emp.aadharImgPath,
        // panImgPath:emp.panImgPath,

        companyName:emp.companyName,
        yearOfExperience:emp.yearOfExperience,
        technology:emp.technology,
        companyContactNo:emp.companyContactNo,
        // experienceCertificatePath:emp.experienceCertificatePath,
        // tenthCertificatePath:emp.tenthCertificatePath,
        // twelthCertificatePath:emp.twelthCertificatePath,
        // graduationCertificatePath:emp.graduationCertificatePath,
        // mastersCertificatePath:emp.mastersCertificatePath
      });

            // 🔥 IMAGE PREVIEWS
      this.profilePicPreview = emp.profilePicPath
        ? this.imageBaseUrl + emp.profilePicPath
        : null;

      this.aadharImgPreview = emp.aadharImgPath
        ? this.imageBaseUrl + emp.aadharImgPath
        : null;

      this.panImgPreview = emp.panImgPath
        ? this.imageBaseUrl + emp.panImgPath
        : null;

      this.experiencePreview = emp.experienceCertificatePath
        ? this.imageBaseUrl + emp.experienceCertificatePath
        : null;

      this.tenthPreview = emp.tenthCertificatePath
        ? this.imageBaseUrl + emp.tenthCertificatePath
        : null;

      this.twelthPreview = emp.twelthCertificatePath
        ? this.imageBaseUrl + emp.twelthCertificatePath
        : null;

      this.graduationPreview = emp.graduationCertificatePath
        ? this.imageBaseUrl + emp.graduationCertificatePath
        : null;

      this.mastersPreview = emp.mastersCertificatePath
        ? this.imageBaseUrl + emp.mastersCertificatePath
        : null;

      // 👇 State ke basis pe City load
      if (emp.stateId) {
        this.employeeService.getCityByStateId(emp.stateId).subscribe((res: any) => {
          this.cities = res.cityList ?? [];
          this.employeeForm.get('cityId')?.setValue(emp.cityId);
        });
      }
    }
  });
}

  // ================= SUBMIT update =================
// onSubmit(): void {
//   if (this.employeeForm.invalid || this.isLoading) {
//     this.employeeForm.markAllAsTouched();
//     return;
//   }

//   const formData = new FormData();
//   const rawValue = this.employeeForm.getRawValue();

//   // 🔑 ID MUST
//   formData.append('Id', this.employeeId.toString());

//   Object.entries(rawValue).forEach(([key, value]) => {
//     if (value !== null && value !== undefined && value !== '') {
//       formData.append(key, value.toString());
//     }
//   });

//   // FILES
//   if (this.profilePic) formData.append('ProfilePic', this.profilePic);
//   if (this.aadharImg) formData.append('AadharImg', this.aadharImg);
//   if (this.panImg) formData.append('PanImg', this.panImg);
//   if (this.experienceCertificate) formData.append('ExperienceCertificate', this.experienceCertificate);
//   if (this.tenthCertificate) formData.append('TenthCertificate', this.tenthCertificate);
//   if (this.twelthCertificate) formData.append('TwelthCertificate', this.twelthCertificate);
//   if (this.graduationCertificate) formData.append('GraduationCertificate', this.graduationCertificate);
//   if (this.mastersCertificate) formData.append('MastersCertificate', this.mastersCertificate);

//   this.isLoading = true;

//   const apiCall = this.employeeService.updateEmployee(formData);

//   // apiCall
//   //   .pipe(finalize(() => this.isLoading = false))
//   //   .subscribe({
//   //     next: () => {
//   //       Swal.fire('Success', 'Employee updated successfully', 'success');
//   //     },
//   //     error: () => {
//   //       Swal.fire('Error', 'API Error occurred', 'error');
//   //     }
//   //   });

// apiCall
//   .pipe(finalize(() => this.isLoading = false))
//   .subscribe({
//     next: () => {
//       Swal.fire({
//         title: 'Success',
//         text: 'Employee updated successfully',
//         icon: 'success',
//         confirmButtonText: 'OK'
//       }).then(() => {
//         // ✅ Redirect to Employee List
//         this.router.navigate(['/home/employee-list']);
//       });
//     },
//     error: () => {
//       Swal.fire('Error', 'API Error occurred', 'error');
//     }
//   });


// }

onSubmit(): void {
  if (this.employeeForm.invalid || this.isLoading) {
    this.employeeForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  const rawValue = this.employeeForm.getRawValue();

  Object.entries(rawValue).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
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

  // 🔥 ADD vs UPDATE decision
  const apiCall = this.isEditMode
    ? this.employeeService.updateEmployee(
        (() => {
          formData.append('Id', this.employeeId.toString());
          return formData;
        })()
      )
    : this.employeeService.addEmployee(formData);

  apiCall
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: () => {
        Swal.fire(
          'Success',
          this.isEditMode ? 'Employee updated successfully' : 'Employee added successfully',
          'success'
        ).then(() => {
          this.router.navigate(['/home/employee-list']);
        });
      },
      error: () => {
        Swal.fire('Error', 'API Error occurred', 'error');
      }
    });
}


  // onSubmit(): void {
  //   if (this.employeeForm.invalid || this.isLoading) {
  //     this.employeeForm.markAllAsTouched();
  //     return;
  //   }

  //   const formData = new FormData();

  //   Object.entries(this.employeeForm.value).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined) {
  //       formData.append(key, value.toString());
  //     }
  //   });

  //   // FILES
  //   if (this.profilePic) formData.append('ProfilePic', this.profilePic);
  //   if (this.aadharImg) formData.append('AadharImg', this.aadharImg);
  //   if (this.panImg) formData.append('PanImg', this.panImg);
  //   if (this.experienceCertificate) formData.append('ExperienceCertificate', this.experienceCertificate);
  //   if (this.tenthCertificate) formData.append('TenthCertificate', this.tenthCertificate);
  //   if (this.twelthCertificate) formData.append('TwelthCertificate', this.twelthCertificate);
  //   if (this.graduationCertificate) formData.append('GraduationCertificate', this.graduationCertificate);
  //   if (this.mastersCertificate) formData.append('MastersCertificate', this.mastersCertificate);

  //   this.isLoading = true;

  //   Swal.fire({
  //     title: 'Submitting...',
  //     didOpen: () => Swal.showLoading(),
  //     allowOutsideClick: false
  //   });

  //   this.employeeService.addEmployee(formData)
  //     .pipe(finalize(() => this.isLoading = false))
  //     .subscribe({
  //       next: () => {
  //         Swal.fire('Success', 'Employee added successfully', 'success');
  //         this.employeeForm.reset({ addedBy: 1 });
  //         this.resetFiles();
  //         this.step = 1;
  //       },
  //       error: () => {
  //         Swal.fire('Error', 'API Error occurred', 'error');
  //       }
  //     });
  // }


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
