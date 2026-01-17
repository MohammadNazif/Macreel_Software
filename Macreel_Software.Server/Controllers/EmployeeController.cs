using Macreel_Software.DAL.Employee;
using Macreel_Software.Models;
using Macreel_Software.Models.Employee;
using Microsoft.AspNetCore.Mvc;
namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;
        private readonly int _userId;

        public EmployeeController(IEmployeeService service,IHttpContextAccessor http)
        {
            _service = service;
            var user = http.HttpContext?.User;
            if(user != null && user.Identity?.IsAuthenticated == true)
            {
                _userId = Convert.ToInt32(user.FindFirst("UserId")?.Value);
            }
        }

        [HttpPost("saveRuleBookResponseByEmpId")]
        public async Task<IActionResult> SaveRuleBookResponse([FromForm] EmployeeData data)
        {
            if (data == null)
            {
                return BadRequest(new
                {
                    status = false,
                    statusCode = 400,
                    message = "Invalid request data."
                });
            }

            try
            {
                bool res = await _service.insertResponseByEmpId(data);

                if (res)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                         null,
                         "RuleBook inserted successfully"
                     ));
                }
                else
                {

                    return BadRequest(ApiResponse<object>.FailureResponse(
                        "Some error occurred while saving rulebook response",
                        400
                    ));
                }
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                   "Internal server error",
                   500
               ));
            }
        }


        [HttpGet("AssignedLeaveListByEmpId")]
        public async Task<IActionResult> assignedLeaveList(int empId, string? searchTerm,int? pageNumber,int? pageSize)
        {
            try
            {
                ApiResponse<List<assignedLeave>> result =
                    await _service.AssignedLeaveListByEmpId(empId,searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<assignedLeave>>.FailureResponse(
                    "An error occurred while fetching assigned leave",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }

        [HttpPost("insertApplyLeaveByEmpId")]
        public async Task<IActionResult> insertApplyLeaveByEmpId([FromForm] applyLeave data)
        {
            if (data == null)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Invalid request data.",
                    400
                ));
            }

            if (!data.fromDate.HasValue || !data.toDate.HasValue)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "From date and To date are required.",
                    400
                ));
            }

            DateTime fromDate = data.fromDate.Value.Date;
            DateTime toDate = data.toDate.Value.Date;

            if (fromDate > toDate)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "From date cannot be greater than To date.",
                    400
                ));
            }

            try
            {
                bool res = await _service.insertApplyLeaveByEmpId(data);
                if (res)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                     null,
                       data.id > 0 ? "Applied leave updated successfully" : "Leave applied successfully"
                    ));
                }
                else
                {
                    return Ok(ApiResponse<object>.FailureResponse(
                     
                       data.id > 0 ? "Some error occured during update applied leave" : "Some error occured during save applied leave",
                       400
                    ));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    ex.Message,
                    400
                ));
            }
        }



        [HttpGet("ApplyLeaveListByEmpId")]
        public async Task<IActionResult> ApplyLeaveListByEmpId(int empId, string? searchTerm, int? pageNumber, int? pageSize)
        {
            try
            {
                ApiResponse<List<applyLeave>> result =
                    await _service.applyLeaveListByEmpId(empId, searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<applyLeave>>.FailureResponse(
                    "An error occurred while fetching  apply leave",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpGet("getAssignLeaveById")]
        public async Task<IActionResult> getAssignLeaveById(int id,int empId)
        {
            try
            {

                var result = await _service.getAllApplyLeaveById(id,empId);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<role>.FailureResponse(
                    "An error occurred while fetching apply leave.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }

        [HttpDelete("deleteAssignLeaveById")]
        public async Task<IActionResult> deleteAssignLeaveById(int id,int empId)
        {
            try
            {
                var res = await _service.deleteApplyLeaveById(id,empId);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Apply leave deleted successfully!!!"

                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Apply leave not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting Apply leave.",
                    error = ex.Message
                });
            }
        }
    }
}
