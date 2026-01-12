using Microsoft.AspNetCore.Http;
namespace Macreel_Software.Models.Master
{
    public class AdminData
    {

    }

    public class employeeRegistration
    {
        public int Id { get; set; }

        public int? EmpRoleId { get; set; }
        public string? roleName { get; set; }
        public int? EmpCode { get; set; }

        public string? EmpName { get; set; }
        public string? Mobile { get; set; }

        public int? DepartmentId { get; set; }
        public string? departmentName { get; set; }
        public int? DesignationId { get; set; }
        public string? designationName { get; set; }

        public int? ReportingManagerId { get; set; }

        public string? EmailId { get; set; }
        public DateTime DateOfJoining { get; set; }
        public int? Salary { get; set; }

        public string? Password { get; set; }

        public IFormFile? ProfilePic { get; set; }
        public IFormFile? AadharImg { get; set; }
        public IFormFile? PanImg { get; set; }

        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IfscCode { get; set; }
        public string? BankBranch { get; set; }

        public DateTime Dob { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? MaritalStatus { get; set; }

        public string? PresentAddress { get; set; }
        public int? StateId { get; set; }
        public string? stateName { get; set; }
        public int? CityId { get; set; }
        public string? cityName { get; set; }
        public string? Pincode { get; set; }

        public string? EmergencyContactPersonName { get; set; }
        public string? EmergencyContactNum { get; set; }

        public string? CompanyName { get; set; }
        public int? YearOfExperience { get; set; }
        public string? Technology { get; set; }
        public string? CompanyContactNo { get; set; }

        public int? addedBy { get; set; }

        public IFormFile? ExperienceCertificate { get; set; }
        public IFormFile? TenthCertificate { get; set; }
        public IFormFile? TwelthCertificate { get; set; }
        public IFormFile? GraduationCertificate { get; set; }
        public IFormFile? MastersCertificate { get; set; }

        public string? ProfilePicPath { get; set; }
        public string? AadharImgPath { get; set; }
        public string? PanImgPath { get; set; }


        public string? ExperienceCertificatePath { get; set; }


        public string? TenthCertificatePath { get; set; }
        public string? TwelthCertificatePath { get; set; }
        public string? GraduationCertificatePath { get; set; }
        public string? MastersCertificatePath { get; set; }
    

     
    }
    public class ReportingManger
    {
        public int id { get; set; }
        public string ReportingManagerName { get; set; }
    }

    public class DbResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public int? EmpId { get; set; }
    }

    public class Leave
    {
        public int Id { get; set; }
        public string leaveName { get; set; }
        public string description { get; set; }
    }

    public class assignLeave
    {
        public int EmployeeId { get; set; }

        public string Leave { get; set; }   
        public string leaveNo { get; set; } 

        public string[] NoOfLeave { get; set; }
        public string[] LeaveType { get; set; }
    }

    public class showLeave
    {
        public int id { get; set; }

        public string leaveType { get; set; }
        public int? noOfLeave { get; set; }
    }






}
