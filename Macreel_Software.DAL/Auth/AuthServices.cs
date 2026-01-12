using System.Data;
using Macreel_Software.Models;
using Macreel_Software.Services.MailSender;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Macreel_Software.DAL.Auth
{
    public class AuthServices : IAuthServices
    {
        private readonly IConfiguration _config;
        private readonly PasswordEncrypt _pass;

        public AuthServices(IConfiguration config, PasswordEncrypt pass)
        {
            _config = config;
            _pass = pass;
        }

        public async Task<UserData?> ValidateUserAsync(string userName, string enteredPassword)
        {
            UserData? user = null;

            try
            {
                using SqlConnection con =
                    new SqlConnection(_config.GetConnectionString("DefaultConnection"));

                using SqlCommand cmd = new SqlCommand("sp_Login", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserName", userName);
                cmd.Parameters.AddWithValue("@Action", "LOGIN");

                await con.OpenAsync();

                using SqlDataReader dr = await cmd.ExecuteReaderAsync();

                if (await dr.ReadAsync())
                {
                    string encryptedDbPassword = dr["Password"].ToString()!;
                    //string enteredPass = _pass.EncryptPassword(enteredPassword);
                    string decryptedDbPassword = _pass.DecryptPassword(encryptedDbPassword);

                 
                    if (decryptedDbPassword == enteredPassword)
                    {
                        user = new UserData
                        {
                            UserId = Convert.ToInt32(dr["UserId"]),
                            Username = dr["UserName"].ToString(),
                            Role = dr["Role"].ToString()
                        };
                    }
                }
            }
            catch
            {
                return null;
            }

            return user;
        }


        public async Task<bool> SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using SqlCommand cmd = new SqlCommand("sp_Login", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@RefreshToken", refreshToken);
                cmd.Parameters.AddWithValue("@ExpireDate", expiry);
                cmd.Parameters.AddWithValue("@Action", "UPDATE_REFRESH");

                await con.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0; 
            }
            catch (Exception ex)
            {
                return false;
            }
        }

      
    }
}
