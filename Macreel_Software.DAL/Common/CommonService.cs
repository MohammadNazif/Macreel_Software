using Microsoft.AspNetCore.Http;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Macreel_Software.Models.Common;
namespace Macreel_Software.DAL.Common
{
    public class CommonService : ICommonServices
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _conn;

        public CommonService(IConfiguration config)
        {
            _config = config;

          
            string connectionString = _config.GetConnectionString("DefaultConnection");
            _conn = new SqlConnection(connectionString);
        }

        public async Task<List<state>> GetAllState()
        {
            List<state> list = new List<state>();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_state", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAllState");

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {

                            state s = new state
                            {
                                stateId = Convert.ToInt32(reader["id"]),
                                stateName = reader["stateName"].ToString()
                            };
                            list.Add(s);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.Close();
            }

            return list;
        }

        public async Task<List<city>> getCityById(int stateId)
        {
            List<city> list = new List<city>();
            try
            {
                using(SqlCommand cmd=new SqlCommand("sp_state", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getCityByStateId");
                    cmd.Parameters.AddWithValue("@id", stateId);
                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();
                    using(SqlDataReader sdr=await cmd.ExecuteReaderAsync())
                    {
                        while(await sdr.ReadAsync())
                        {
                            list.Add(new city
                            {
                                cityId = Convert.ToInt32(sdr["id"]),
                                stateId = Convert.ToInt32(sdr["stateId"]),
                                stateName = sdr["stateName"].ToString(),
                                cityName = sdr["cityName"].ToString(),
                            });
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
            return list;
        }
    }

}
