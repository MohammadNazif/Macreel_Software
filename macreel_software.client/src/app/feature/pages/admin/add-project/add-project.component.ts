import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProjectService } from '../../../../core/services/add-project.service';

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'] 
})




export class AddProjectComponent implements OnInit {

  @ViewChild('sopFile') sopFile!: ElementRef<HTMLInputElement>;
  @ViewChild('technicalFile') technicalFile!: ElementRef<HTMLInputElement>;

  projectForm!: FormGroup;

  allTechnologies: any[] = [];
  mobileSkills: any[] = [];
  webSkills: any[] = [];
  filteredMobileEmployees: any[] = [];
  filteredWebEmployees: any[] = [];

  selectedEmployeeProjects: any[] = [];
  selectedEmployeeDetails: any = null;

  constructor(
    private fb: FormBuilder,
    private masterService: ManageMasterdataService,
    private addProjectService: AddProjectService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadTechnologies();

     // Mobile Skill change
  this.projectForm.get('mobileSkill')?.valueChanges.subscribe(val => {
    this.onMobileSkillChange(val);
  });

  // Mobile Employee change
  this.projectForm.get('mobileEmpId')?.valueChanges.subscribe(val => {
    this.onSelectMobileEmployee(val);
  });

  // Web Skill change
  this.projectForm.get('webSkill')?.valueChanges.subscribe(val => {
    this.onWebSkillChange(val);
  });

  // Web Employee change
  this.projectForm.get('webEmpId')?.valueChanges.subscribe(val => {
    this.onSelectWebEmployee(val);
  });
  }



  initForm() {
   this.projectForm = this.fb.group({
  category: ['', Validators.required],
  projectTitle: ['', Validators.required],
  description: [''],
  startDate: ['', Validators.required],
  assignDate: ['', Validators.required],
  endDate: [''],
  completionDate: [''],

  // software type
  isMobileSoftware: [false],
  isWebSoftware: [false],
  isAndroid: [false],
  isIOS: [false],

  // mobile
  mobileSkill: [''],
  mobileEmpId: [''],

  // web
  webSkill: ['null'],
  webEmpId: ['null'],

  // digital marketing
  SEO: [''],
  SMO: [''],
  GMB: [''],
  paidAds: ['']
});

  }

  get category(): string {
  return this.projectForm.get('category')?.value || '';
}

get isMobileSoftware(): boolean {
  return this.projectForm.get('isMobileSoftware')?.value;
}

get isWebSoftware(): boolean {
  return this.projectForm.get('isWebSoftware')?.value;
}

  // ================= LOAD TECHNOLOGIES =================
  loadTechnologies() {
    this.masterService.getAllTechnology(1, 100).subscribe({
      next: (res: any) => {
        this.allTechnologies = res?.data || [];
        this.mobileSkills = this.allTechnologies.filter(t => t.softwareType?.toLowerCase() === 'app');
        this.webSkills = this.allTechnologies.filter(t => t.softwareType?.toLowerCase() === 'web');
      },
      error: err => console.error(err)
    });
  }

  onCategoryChange() {
    this.projectForm.patchValue({
      isMobileSoftware: false,
      isWebSoftware: false,
      isAndroid: false,
      isIOS: false,
      mobileSkill: '',
      webSkill: '',
      mobileEmpId: '',
      webEmpId: '',
      SEO: '',
      SMO: '',
      GMB: '',
      paidAds: ''
    });
    this.filteredMobileEmployees = [];
    this.filteredWebEmployees = [];
  }

  // ================= MOBILE METHODS =================
onMobileSkillChange(skillId: any) {
  const id = skillId ? Number(skillId) : null;
  if (!id) {
    this.filteredMobileEmployees = [];
    return;
  }
  this.addProjectService.getEmpListForAppByTechId(id).subscribe({
    next: res => this.filteredMobileEmployees = res?.data || [],
    error: err => this.filteredMobileEmployees = []
  });
}


  onSelectMobileEmployee(empId: any) {
    this.projectForm.patchValue({ mobileEmpId: empId });
    this.addProjectService.getProjectDetailsByEmpId(empId).subscribe({
      next: res => this.selectedEmployeeProjects = res?.data || [],
      error: err => this.selectedEmployeeProjects = []
    });
  }

  // ================= WEB METHODS =================
onWebSkillChange(skillId: any) {
  const id = skillId ? Number(skillId) : null;
  if (!id) {
    this.filteredWebEmployees = [];
    return;
  }
  this.addProjectService.getEmpListForWebByTechId(id).subscribe({
    next: res => this.filteredWebEmployees = res?.data || [],
    error: err => this.filteredWebEmployees = []
  });
}

onSelectWebEmployee(empId: any) {
  const id = Number(empId);
  this.projectForm.patchValue({ webEmpId: id });
  this.addProjectService.getProjectDetailsByEmpId(id).subscribe({
    next: res => this.selectedEmployeeProjects = res?.data || [],
    error: err => this.selectedEmployeeProjects = []
  });
}


  // ================= FORM SUBMISSION =================
  submitProject() {
    if (this.projectForm.invalid) {
      alert('Please fill required fields');
      return;
    }

    const formData = new FormData();
    Object.entries(this.projectForm.value).forEach(([key, value]: any) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });

    // FILES
    const sop = this.sopFile?.nativeElement.files?.[0];
    if(sop) formData.append('sopDocument', sop);

    const techDoc = this.technicalFile?.nativeElement.files?.[0];
    if(techDoc) formData.append('technicalDocument', techDoc);

   this.addProjectService.addProject(formData).subscribe({
      next: res => {
        if(res.success) {
          alert(res.message);
          this.projectForm.reset();
          this.sopFile.nativeElement.value = '';
          this.technicalFile.nativeElement.value = '';
        } else alert(res.message || 'Error adding project');
      },
      error: err => {
        console.error(err);
        alert('Something went wrong while adding project.');
      }
    });
  }

}
