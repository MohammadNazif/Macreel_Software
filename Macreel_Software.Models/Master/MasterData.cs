using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Macreel_Software.Models.Master
{
    public class MasterData
    {

    }

    public class role
    {
        public int id { get; set; }
        public string rolename { get; set; }
     
    }
    public class department
    {
        public int id { get; set; }
        public string departmentName { get; set; }
    }

    public class designation
    {
        public int id { get; set; }
        public string designationName { get; set; }
    }
    public class technology
    {
        public int id { get; set; }
        public string SoftwareType { get; set; }
        public string technologyName { get; set; }
    }
    public class technologyDetails
    {
        public int? id { get; set; }
        public int? empId { get; set; }
        public int? technologyId { get; set; }
        public string? technologyName { get; set; }
        public string? empName { get; set; }
    }

 

   
}
