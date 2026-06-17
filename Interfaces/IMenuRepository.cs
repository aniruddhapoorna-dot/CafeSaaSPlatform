using CafeOrderSystem.Models;

namespace CafeOrderSystem.Interfaces
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetAllItemsAsync();
        Task<MenuItem?> GetByIdAsync(int id);
        Task AddAsync(MenuItem item);
        Task UpdateAsync(MenuItem item);
        Task DeleteAsync(int id);
    }
}
