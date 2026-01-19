using Macreel_Software.DAL.Master;
using Macreel_Software.Models.Master;
using Microsoft.AspNetCore.Mvc;
using Macreel_Software.Models;
using Microsoft.AspNetCore.Authorization;

namespace Macreel_Software.Server.Controllers
{
    [Authorize(Roles ="admin")]
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

        [HttpDelete("deleteRoleById")]
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


        [HttpDelete("deleteDepartmentById")]
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


        [HttpDelete("deleteDesignationById")]
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

        #region technology api

        [HttpPost("insertTechnology")]
        public async Task<IActionResult> insertTechnology([FromBody]technology data)
        {
            try
            {
                string[] softwareTypes = new string[] { "app", "web" };
                if (!softwareTypes.Contains(data.SoftwareType))
                {
                    return Ok(ApiResponse<object>.FailureResponse(
                        "Software type should be only web/app",
                        400
                        ));
                }
                int result = await _service.insertTechnology(data);

                if (result == 1)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Technology inserted successfully"
                    ));
                }

                if (result == 2)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                        null,
                        "Technology updated successfully"
                    ));
                }

                if (result == -1)
                {
                    return StatusCode(409, ApiResponse<object>.FailureResponse(
                        "Technology already exists",
                        409
                    ));
                }

                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Some error occurred while saving Technology",
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


        [HttpGet("GetAllTechnology")]
        public async Task<IActionResult> getAllTechnology(string? searchTerm,
          int? pageNumber,
          int? pageSize)
        {
            try
            {
                var result = await _service.getAllTechnology(searchTerm, pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<technology>>.FailureResponse(
                    "An error occurred while fetching technology",
                    500,
                    errorCode: "SERVER_ERROR"
                ));
            }
        }



        [HttpGet("GetAllTechnologyById")]
        public async Task<IActionResult> getAllTechnologybyId(int id)
        {
            try
            {
                var result = await _service.getAllTechnologyById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<technology>>.FailureResponse(
                    "An error occurred while fetching technology",
                    500,
                    errorCode: "SERVER_ERROR"
                ));
            }
        }

        [HttpDelete("deleteTechnologyById")]
        public async Task<IActionResult> DeleteTechnologyById(int id)
        {
            try
            {
                bool isDeleted = await _service.deleteTechnologyById(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        status = true,
                        statusCode = 200,
                        message = "Technology deleted successfully."
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        statusCode = 404,
                        message = "Technology not found or already deleted."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    statusCode = 500,
                    message = "An error occurred while deleting technology.",
                    error = ex.Message
                });
            }
        }
        #endregion

        #region
        [HttpGet("EmpListForWebTypeByTechId")]
        public async Task<IActionResult> EmpListForWebTypeByTechId(int techId)
        {
            try
            {
                var result = await _service.EmpListForWebByTechId(techId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ApiResponse<List<technologyDetails>>.FailureResponse("An error occured while fetching skills for web type!!", 500, errorCode: "Server_Error"));
            }
        }

        [HttpGet("EmpListForAppBtTechId")]
        public async Task<IActionResult> EmpListForAppBtTechId(int techId)
        {
            try
            {
                var result = await _service.empListForAppByTechId(techId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ApiResponse<List<technologyDetails>>.FailureResponse("An error occured while fetching skills for App type!!", 500, errorCode: "Server_Error"));
            }
        }

        #endregion

    }
}
