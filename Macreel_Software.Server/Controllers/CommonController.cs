using Macreel_Software.DAL;
using Macreel_Software.DAL.Auth;
using Macreel_Software.DAL.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ICommonServices _service;

        public CommonController(ICommonServices service)
        {
            _service = service;
        }

        [HttpGet("getAllStateList")]
        public async Task<IActionResult> getAllState()
        {
            try
            {
                var data = await _service.GetAllState(); 

                if (data != null && data.Count > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "State list fetched successfully!!",
                        stateList = data
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404, 
                        message = "No data found!!"
                    });
                }
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while fetching states.",
                    error = ex.Message
                });
            }
        }
        [HttpGet("GetCityByStateId")]
        public async Task<IActionResult> getCityByStateId(int stateId)
        {
            try
            {
                var data = await _service.getCityById(stateId);
                if (data != null && data.Any())
                {
                    return Ok(new
                    {
                        status=true,
                        StatusCode=200,
                        message="City List by state id fetch successfully!!",
                        CityList=data
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "No data found!!"
                  
                    });
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while fetching cities.",
                    error = ex.Message
                });
            }
        }

    }
}
