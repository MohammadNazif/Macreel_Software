using Macreel_Software.DAL.Common;
using Macreel_Software.DAL.Master;
using Macreel_Software.Models.Master;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Macreel_Software.Server;
using Macreel_Software.Models;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private readonly IMasterService _service;

        public MasterController(IMasterService service)
        {
            _service = service;
        }

        #region role api
        [HttpPost("insertRole")]
        public async Task<IActionResult> addrole([FromBody] role data)
        {
            try
            {
                int result = await _service.InsertRole(data);

                if (result == 1)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Role inserted successfully"
                    ));
                }

                if (result == 2)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Role updated successfully"
                    ));
                }

                if (result == -1)
                {
                    return StatusCode(409, ApiResponse<object>.FailureResponse(
                        "Role already exists",
                        409
                    ));
                }

                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Some error occurred while saving role",
                    400
                ));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                    "Internal server error",
                    500
                ));
            }
        }


        [HttpGet("getAllRole")]
        public async Task<IActionResult> getAllRole(string? searchTerm = null,int? pageNumber = null, int?pageSize = null)
        {
            try
            {
                ApiResponse<List<role>> result =
                    await _service.getAllRole(searchTerm, pageNumber, pageSize);

      
                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<role>>.FailureResponse(
                    "An error occurred while fetching role",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }

        [HttpGet("getRoleById")]
        public async Task<IActionResult> getRoleById(int roleId)
        {
            try
            {
          
                var result = await _service.getAllRoleById(roleId);

           
                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<role>.FailureResponse(
                    "An error occurred while fetching role.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpGet("deleteRoleById")]
        public async Task<IActionResult> deleteRoleById(int roleId)
        {
            try
            {
                var res = await _service.deleteRoleById(roleId);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Role deleted successfully!!!"
                     
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Role not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting role.",
                    error = ex.Message
                });
            }
        }

        #endregion

        #region department api

        [HttpPost("insertDepartment")]
        public async Task<IActionResult> addDepartment([FromBody] department data)
        {
            try
            {
                int result = await _service.insertDepartment(data);

                if (result == 1)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Department inserted successfully"
                    ));
                }

                if (result == 2)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Department updated successfully"
                    ));
                }

                if (result == -1)
                {
                    return StatusCode(409, ApiResponse<object>.FailureResponse(
                        "Department already exists",
                        409
                    ));
                }

                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Some error occurred while saving department",
                    400
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                    "Internal server error",
                    500
                ));
            }
        }


        [HttpGet("getAllDepartment")]
        public async Task<IActionResult> getAllDepartment( string? searchTerm = null,int? pageNumber = null,
     int? pageSize = null)
        {
            try
            {
                var response = await _service.getAllDepartment(searchTerm, pageNumber, pageSize);

                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<department>>.FailureResponse(
                    "An unexpected error occurred",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }



        [HttpGet("getDepartmentById")]
        public async Task<IActionResult> getDepartmentById(int depId)
        {
            try
            {
                var response = await _service.getAllDepartmentById(depId);

                if (response.Success)
                {
                    return Ok(response);
                }
                else
                {
                    return StatusCode(response.StatusCode, response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<department>>.FailureResponse(
                    "An unexpected error occurred while fetching Department.",
                    500,
                    errorCode: "EXCEPTION"
                ));
            }
        }


        [HttpGet("deleteDepartmentById")]
        public async Task<IActionResult> deleteDepartmetById(int depId)
        {
            try
            {
                var res = await _service.deleteDepartmentById(depId);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Department deleted successfully!!!"

                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Department not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting Department.",
                    error = ex.Message
                });
            }
        }
        #endregion

        #region designation

        [HttpPost("insertDesignation")]
        public async Task<IActionResult> AddDesignation([FromBody] designation data)
        {
            try
            {
                int result = await _service.InsertDesignation(data);

                if (result == 1)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Designation inserted successfully"
                    ));
                }

                if (result == 2)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Designation updated successfully"
                    ));
                }

                if (result == -1)
                {
                    return StatusCode(409, ApiResponse<object>.FailureResponse(
                        "Designation already exists",
                        409
                    ));
                }

                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Some error occurred while saving designation",
                    400
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                    "Internal server error",
                    500
                ));
            }
        }


        [HttpGet("getAllDesignation")]
        public async Task<IActionResult> getAllDesignation( string? searchTerm = null,int? pageNumber = null,
        int? pageSize = null)
        {
            try
            {
                var response = await _service.getAllDesignation(searchTerm, pageNumber, pageSize);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<designation>>.FailureResponse(
                    "An error occurred while fetching designation",
                    500,
                    errorCode: "SERVER_ERROR"
                ));
            }
        }


        [HttpGet("getDesignationById")]
        public async Task<IActionResult> getDesignationById(int desId)
        {
            try
            {
                var response = await _service.getAllDesignationById(desId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<designation>>.FailureResponse(
                    "An error occurred while fetching designation.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }



        [HttpGet("deleteDesignationById")]
        public async Task<IActionResult> deleteDesignationById(int desId)
        {
            try
            {
                var res = await _service.deleteDesignationById(desId);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Designation deleted successfully!!!"

                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Designation not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting Designation.",
                    error = ex.Message
                });
            }
        }
        #endregion

    }
}
