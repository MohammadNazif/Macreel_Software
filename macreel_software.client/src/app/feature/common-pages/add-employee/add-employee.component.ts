import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageEmployeeService } from '../../../core/services/manage-employee.service';
import { ManageMasterdataService } from '../../../core/services/manage-masterdata.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  standalone: false,
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  step = 1;
  isLoading = false;
  roles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  reportingManagers: any[] = [];
  technologies: any[] = [];
  employeeForm!: FormGroup;
  profilePic?: File;
  aadharImg?: File;
  panImg?: File;
  experienceCertificate?: File;
  tenthCertificate?: File;
  twelthCertificate?: File;
  graduationCertificate?: File;
  mastersCertificate?: File;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  technologyCtrl = new FormControl('');

  selectedTechnologies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: ManageEmployeeService,
    private masterService: ManageMasterdataService,
    private route: ActivatedRoute,
    private router: Router,
    private announcer: LiveAnnouncer
  ) { }

  employeeId!: number;
  isEditMode = false;

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
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

      // 🔥 IMPORTANT - Multi select array
      skillIds: [[]],

      companyName: [''],
      yearOfExperience: [''],
      technology: [''],
      companyContactNo: [''],

      addedBy: [1]
    });

    this.loadMasters();
    this.loadStates();
    this.loadReportingManagers();

    this.loadTechnologies();

    
  this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

  if (this.employeeId) {
    this.isEditMode = true;
    this.employeeForm.get('password')?.disable();
    this.employeeForm.get('emailId')?.disable();
    this.getEmployeeById(this.employeeId);
  }
  }

private loadTechnologies(): Promise<void> {
  return new Promise((resolve) => {
    this.masterService.getAllTechnology(1, 100).subscribe(res => {
      this.technologies = res?.data ?? [];
      resolve();
    });
  });
}


  private loadMasters(): void {
    this.masterService.getRoles(1, 100).subscribe(res => this.roles = res?.data ?? []);
    this.masterService.getDepartment().subscribe(res => this.departments = res?.data ?? []);
    this.masterService.getDesignation().subscribe(res => this.designations = res?.data ?? []);
  }

  private loadStates(): void {
    this.employeeService.getAllStateList().subscribe(res => {
      if (res?.status) {
        this.states = res.stateList ?? [];
      }
    });
  }

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
        this.employeeForm.get('cityId')?.setValue('');
      }
    });
  }

  private loadReportingManagers(): void {
    this.employeeService.getReportingManager().subscribe(res => {
      if (res?.success) {
        this.reportingManagers = res.data ?? [];
      }
    });
  }

  // ================= TECHNOLOGY CHIP LOGIC =================

  onTechnologySelected(event: MatAutocompleteSelectedEvent): void {
    const techId = event.option.value;
    const tech = this.technologies.find(t => t.id === techId);

    if (tech && !this.selectedTechnologies.some(t => t.id === techId)) {
      this.selectedTechnologies.push(tech);

      const ids = this.selectedTechnologies.map(t => t.id);
      // this.employeeForm.get('technologyId')?.setValue(ids);
      this.employeeForm.get('skillIds')?.setValue(ids);

    }

    this.technologyCtrl.setValue('');
    event.option.deselect();
  }

  removeTechnology(tech: any): void {
    this.selectedTechnologies = this.selectedTechnologies.filter(t => t.id !== tech.id);

    const ids = this.selectedTechnologies.map(t => t.id);
    this.employeeForm.get('skillIds')?.setValue(ids);

    this.announcer.announce(`Removed ${tech.technologyName}`);
  }


  // ================= EDIT MODE =================

  imageBaseUrl = 'https://localhost:7253/api/';

  getEmployeeById(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((res: any) => {
      if (res.success && res.data?.length) {
        const emp = res.data[0];

        this.employeeForm.patchValue({
          empRoleId: Number(emp.empRoleId),
          empCode: emp.empCode,
          empName: emp.empName,
          mobile: emp.mobile,
          departmentId: Number(emp.departmentId),
          designationId: Number(emp.designationId),
          salary: emp.salary,
          dateOfJoining: emp.dateOfJoining?.substring(0, 10),
          dob: emp.dob?.substring(0, 10),
          gender: emp.gender,
          nationality: emp.nationality,
          maritalStatus: emp.maritalStatus,
          presentAddress: emp.presentAddress,
          stateId: Number(emp.stateId),
          reportingManagerId: Number(emp.reportingManagerId),
          pincode: emp.pincode,
          bankName: emp.bankName,
          accountNo: emp.accountNo,
          ifscCode: emp.ifscCode,
          bankBranch: emp.bankBranch,
          emergencyContactPersonName: emp.emergencyContactPersonName,
          emergencyContactNum: emp.emergencyContactNum,
          companyName: emp.companyName,
          yearOfExperience: emp.yearOfExperience,
          technology: emp.technology,
          companyContactNo: emp.companyContactNo,
        });

       if (emp.skill && emp.skill.length) {

        // Wait for technologies to load first
        this.loadTechnologies().then(() => {

          const skillIds = emp.skill.map((s: any) => s.id);

          this.selectedTechnologies = this.technologies.filter(t =>
            skillIds.includes(t.id)
          );

          this.employeeForm.get('skillIds')?.setValue(skillIds);
        });
      }

        if (emp.stateId) {
          this.employeeService.getCityByStateId(emp.stateId).subscribe((res: any) => {
            this.cities = res.cityList ?? [];
            this.employeeForm.get('cityId')?.setValue(emp.cityId);
          });
        }
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

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    switch (type) {
      case 'profile': this.profilePic = file; break;
      case 'aadhar': this.aadharImg = file; break;
      case 'pan': this.panImg = file; break;
      case 'experience': this.experienceCertificate = file; break;
      case 'tenth': this.tenthCertificate = file; break;
      case 'twelth': this.twelthCertificate = file; break;
      case 'graduation': this.graduationCertificate = file; break;
      case 'masters': this.mastersCertificate = file; break;
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || this.isLoading) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const rawValue = this.employeeForm.getRawValue();

    Object.entries(rawValue).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

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
