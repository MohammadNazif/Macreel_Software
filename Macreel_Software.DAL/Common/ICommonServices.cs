using Macreel_Software.Models.Common;
using Microsoft.AspNetCore.Http;

namespace Macreel_Software.DAL.Common
{
    public interface ICommonServices
    {
        Task<List<state>> GetAllState();

        Task<List<city>> getCityById(int stateId);
    }
}
