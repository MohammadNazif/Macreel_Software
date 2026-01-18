import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProjectService } from '../../../../core/services/add-project.service';
import { Project } from '../../../../core/models/employee.interface';

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
  ) { }

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
      webSkill: [''],
      webEmpId: [''],

      // digital marketing
      SEO: [''],
      SMO: [''],
      GMB: [''],
      paidAds: ['']
    });

  }

  //   get category(): string {
  //   return this.projectForm.get('category')?.value || '';
  // }

  get category(): 'Software' | 'Website' | 'Digital Marketing' | '' {
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


  // onSelectMobileEmployee(empId: any) {
  //   this.projectForm.patchValue({ mobileEmpId: empId });
  //   this.addProjectService.getProjectDetailsByEmpId(empId).subscribe({
  //     next: res => this.selectedEmployeeProjects = res?.data || [],
  //     error: err => this.selectedEmployeeProjects = []
  //   });
  // }

  onSelectMobileEmployee(empId: any) {
    if (!empId) return;

    const id = Number(empId);
    this.addProjectService.getProjectDetailsByEmpId(id).subscribe({
      next: res => this.selectedEmployeeProjects = res?.data || [],
      error: () => this.selectedEmployeeProjects = []
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

  // onSelectWebEmployee(empId: any) {
  //   const id = Number(empId);
  //   this.projectForm.patchValue({ webEmpId: id });
  //   this.addProjectService.getProjectDetailsByEmpId(id).subscribe({
  //     next: res => this.selectedEmployeeProjects = res?.data || [],
  //     error: err => this.selectedEmployeeProjects = []
  //   });
  // }

  onSelectWebEmployee(empId: any) {
    if (!empId) return;

    const id = Number(empId);
    this.addProjectService.getProjectDetailsByEmpId(id).subscribe({
      next: res => this.selectedEmployeeProjects = res?.data || [],
      error: () => this.selectedEmployeeProjects = []
    });
  }

  edit(p: Project) {
  this.addProjectService.getProjectById(p.id).subscribe({
    next: (res) => {
      if (res && res.data && res.data.length) {
        const projectData = res.data[0];

        // Patch form values
        this.projectForm.patchValue({
          category: projectData.category,
          projectTitle: projectData.projectTitle,
          description: projectData.description,
          startDate: projectData.startDate ? projectData.startDate.split('T')[0] : '',
          assignDate: projectData.assignDate ? projectData.assignDate.split('T')[0] : '',
          endDate: projectData.endDate ? projectData.endDate.split('T')[0] : '',
          completionDate: projectData.completionDate ? projectData.completionDate.split('T')[0] : '',
          SEO: projectData.seo,
          SMO: projectData.smo,
          GMB: projectData.gmb,
          paidAds: projectData.paidAds,
          isMobileSoftware: projectData.app === 'App',
          isWebSoftware: projectData.web === 'Web',
          isAndroid: projectData.androidApp === 'Android',
          isIOS: projectData.iosApp === 'IOS',
          mobileSkill: projectData.appTechnology,
          mobileEmpId: projectData.appEmpId,
          webSkill: projectData.webTechnology,
          webEmpId: projectData.webEmpId
        });

        // If you want, you can navigate to same page without reloading:
        // this.router.navigate(['/home/admin/add-project'], { state: { project: projectData } });
      } else {
        Swal.fire('Error', 'Project not found', 'error');
      }
    },
    error: () => {
      Swal.fire('Error', 'Failed to fetch project', 'error');
    }
  });
}



  // ================= FORM SUBMISSION =================

  submitProject() {

    if (this.projectForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields Missing',
        text: 'Please fill required fields',
      });
      return;
    }

    const formData = new FormData();
    const f = this.projectForm.value;

    // ================= BASIC FIELDS =================
    formData.append('category', f.category);
    formData.append('projectTitle', f.projectTitle);
    formData.append('description', f.description || '');
    formData.append('startDate', f.startDate);
    formData.append('assignDate', f.assignDate);
    formData.append('endDate', f.endDate || '');
    formData.append('completionDate', f.completionDate || '');

    // ================= SOFTWARE TYPE =================
    if (f.isMobileSoftware) {
      formData.append('app', 'App');   // ✅ BACKEND KEY

      if (f.isAndroid) {
        formData.append('androidApp', 'Android');
      }

      if (f.isIOS) {
        formData.append('iosApp', 'IOS');
      }

      if (f.mobileSkill) {
        formData.append('appTechnology', f.mobileSkill);
      }

      if (f.mobileEmpId) {
        formData.append('appEmpId', f.mobileEmpId);
      }
    }

    if (f.isWebSoftware) {
      formData.append('web', 'Web');   // ✅ BACKEND KEY

      if (f.webSkill) {
        formData.append('webTechnology', f.webSkill);
      }

      if (f.webEmpId) {
        formData.append('webEmpId', f.webEmpId);
      }
    }

    // ================= DIGITAL MARKETING =================
    if (f.category === 'Digital Marketing') {
      formData.append('SEO', f.SEO || '');
      formData.append('SMO', f.SMO || '');
      formData.append('GMB', f.GMB || '');
      formData.append('paidAds', f.paidAds || '');
    }

    // ================= FILES =================
    const sop = this.sopFile?.nativeElement.files?.[0];
    if (sop) formData.append('sopDocument', sop);

    const techDoc = this.technicalFile?.nativeElement.files?.[0];
    if (techDoc) formData.append('technicalDocument', techDoc);

    // ================= API CALL =================
    this.addProjectService.addProject(formData).subscribe({
      next: res => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Project Added',
            text: res.message,
            confirmButtonColor: '#3085d6',
          });;
          this.projectForm.reset();
          this.sopFile.nativeElement.value = '';
          this.technicalFile.nativeElement.value = '';
          this.selectedEmployeeProjects = [];
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.message || 'Error adding project',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while adding project!',
        });
      }
    });
  }

}
