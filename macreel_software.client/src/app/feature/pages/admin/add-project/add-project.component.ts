import { Component, OnInit } from '@angular/core';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';
import { AddProjectService } from '../../../../core/services/add-project.service';

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit {

  constructor(
    private masterService: ManageMasterdataService,
    private addProjectService: AddProjectService
  ) {}

  ngOnInit() {
    this.loadTechnologies();
  }

  // ========== CATEGORY ==========
  category: string = '';

  // ========== SOFTWARE TYPE CHECKBOXES ==========
  isMobileSoftware: boolean = false;
  isWebSoftware: boolean = false;

  // ========== MOBILE ==========
  isAndroid: boolean = false;
  isIOS: boolean = false;

  selectedMobileSkill: number | null = null;
  selectedMobileEmployee: any = null;
  selectedMobileEmployeeId: number | null = null;
  filteredMobileEmployees: any[] = [];

  // ========== WEB ==========
  selectedWebSkill: number | null = null;
  selectedWebEmployee: any = null;
  selectedWebEmployeeId: number | null = null;
  filteredWebEmployees: any[] = [];

  // ======== TECHNOLOGY LIST (API) ========
  allTechnologies: any[] = [];
  mobileSkills: any[] = [];
  webSkills: any[] = [];

  // ================= LOAD TECHNOLOGY FROM API =================
  loadTechnologies() {
    this.masterService.getAllTechnology(1, 100).subscribe({
      next: (res: any) => {
        this.allTechnologies = res?.data || [];

       this.mobileSkills = this.allTechnologies.filter(
  t => t.softwareType?.toLowerCase() === 'app'
);

        this.webSkills = this.allTechnologies.filter(
          t => t.softwareType?.toLowerCase() === 'web'
        );

        console.log('All Tech:', this.allTechnologies);
        console.log('Mobile Skills:', this.mobileSkills);
        console.log('Web Skills:', this.webSkills);
      },
      error: (err) => {
        console.error('Error fetching technologies:', err);
      }
    });
  }

  // ================= CATEGORY CHANGE =================
  onCategoryChange() {
    this.isMobileSoftware = false;
    this.isWebSoftware = false;

    this.selectedMobileSkill = null;
    this.selectedWebSkill = null;
    this.filteredMobileEmployees = [];
    this.filteredWebEmployees = [];
    this.selectedMobileEmployee = null;
    this.selectedWebEmployee = null;
    this.selectedMobileEmployeeId = null;
    this.selectedWebEmployeeId = null;
  }

  // ===================== MOBILE METHODS =====================

  onMobileCheckboxChange() {
    if (!this.isMobileSoftware) {
      this.isAndroid = false;
      this.isIOS = false;
      this.selectedMobileSkill = null;
      this.filteredMobileEmployees = [];
      this.selectedMobileEmployee = null;
      this.selectedMobileEmployeeId = null;
    }
  }

  // 🔹 MOBILE SKILL SELECT → CALL API
  onMobileSkillChange(skillId: any) {
    const id = Number(skillId);
    this.selectedMobileSkill = id;
    this.selectedMobileEmployee = null;
    this.selectedMobileEmployeeId = null;

    this.addProjectService.getEmpListForAppByTechId(id).subscribe({
      next: (res: any) => {
        this.filteredMobileEmployees = res?.data || [];
        console.log("Mobile Employees:", this.filteredMobileEmployees);
      },
      error: (err) => {
        console.error("Error fetching mobile employees:", err);
        this.filteredMobileEmployees = [];
      }
    });
  }

  onSelectEmployeeById(empId: any) {
    const id = Number(empId);
    this.selectedMobileEmployee =
      this.filteredMobileEmployees.find(e => e.id === id) || null;
  }

  // ===================== WEB METHODS =====================

  onWebCheckboxChange() {
    if (!this.isWebSoftware) {
      this.selectedWebSkill = null;
      this.filteredWebEmployees = [];
      this.selectedWebEmployee = null;
      this.selectedWebEmployeeId = null;
    }
  }

  // 🔹 WEB SKILL SELECT → CALL API
  onWebSkillChange(skillId: any) {
    const id = Number(skillId);
    this.selectedWebSkill = id;
    this.selectedWebEmployee = null;
    this.selectedWebEmployeeId = null;

    this.addProjectService.getEmpListForWebByTechId(id).subscribe({
      next: (res: any) => {
        this.filteredWebEmployees = res?.data || [];
        console.log("Web Employees:", this.filteredWebEmployees);
      },
      error: (err) => {
        console.error("Error fetching web employees:", err);
        this.filteredWebEmployees = [];
      }
    });
  }

  onSelectWebEmployeeById(empId: any) {
    const id = Number(empId);
    this.selectedWebEmployee =
      this.filteredWebEmployees.find(e => e.id === id) || null;
  }
}
