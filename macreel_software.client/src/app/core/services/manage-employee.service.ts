import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageEmployeeService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addEmployee(employee: any): Observable<any> {
    const formData = this.createEmployeeFormData(employee);
    return this.http.post(
      `${this.baseUrl}Admin/insertEmployeeRegistration`,
      formData
    );
  }

  private createEmployeeFormData(employee: any): FormData {
    const formData = new FormData();

    // ===== TEXT FIELDS =====
    formData.append('EmpRoleId', employee.empRoleId?.toString() || '');
    formData.append('EmpCode', employee.empCode || '');
    formData.append('EmpName', employee.empName || '');
    formData.append('Mobile', employee.mobile || '');
    formData.append('DepartmentId', employee.departmentId?.toString() || '');
    formData.append('DesignationId', employee.designationId?.toString() || '');
    formData.append('EmailId', employee.emailId || '');
    formData.append('Salary', employee.salary?.toString() || '');
    formData.append('DateOfJoining', employee.dateOfJoining || '');
    formData.append('Password', employee.password || '');
    formData.append('Dob', employee.dob || '');
    formData.append('Gender', employee.gender || '');
    formData.append('Nationality', employee.nationality || '');
    formData.append('MaritalStatus', employee.maritalStatus || '');
    formData.append('PresentAddress', employee.presentAddress || '');
    formData.append('StateId', employee.stateId?.toString() || '');
    formData.append('CityId', employee.cityId?.toString() || '');
    formData.append('Pincode', employee.pincode || '');
    formData.append('BankName', employee.bankName || '');
    formData.append('AccountNo', employee.accountNo || '');
    formData.append('IfscCode', employee.ifscCode || '');
    formData.append('BankBranch', employee.bankBranch || '');
    formData.append('EmergencyContactPersonName', employee.emergencyContactPersonName || '');
    formData.append('EmergencyContactNum', employee.emergencyContactNum || '');
    formData.append('CompanyName', employee.companyName || '');
    formData.append('YearOfExperience', employee.yearOfExperience?.toString() || '');
    formData.append('Technology', employee.technology || '');
    formData.append('CompanyContactNo', employee.companyContactNo || '');
    formData.append('AddedBy', employee.addedBy?.toString() || '1');

    // ===== FILES =====
    this.appendFile(formData, 'ProfilePic', employee.profilePic);
    this.appendFile(formData, 'AadharImg', employee.aadharImg);
    this.appendFile(formData, 'PanImg', employee.panImg);
    this.appendFile(formData, 'ExperienceCertificate', employee.experienceCertificate);
    this.appendFile(formData, 'TenthCertificate', employee.tenthCertificate);
    this.appendFile(formData, 'TwelthCertificate', employee.twelthCertificate);
    this.appendFile(formData, 'GraduationCertificate', employee.graduationCertificate);
    this.appendFile(formData, 'MastersCertificate', employee.mastersCertificate);

    return formData;
  }

  private appendFile(formData: FormData, key: string, file: File | null) {
    if (file) {
      formData.append(key, file, file.name);
    }
  }
}
