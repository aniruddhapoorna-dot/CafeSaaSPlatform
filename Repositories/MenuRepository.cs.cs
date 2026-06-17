using CafeOrderSystem.Data;
using CafeOrderSystem.Interfaces;
using CafeOrderSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeOrderSystem.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly CafeDbContext _context;

        public MenuRepository(CafeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MenuItem>> GetAllItemsAsync()
            => await _context.MenuItems.ToListAsync();

        public async Task<MenuItem?> GetByIdAsync(int id)
            => await _context.MenuItems.FindAsync(id);

        public async Task AddAsync(MenuItem item)
        {
            await _context.MenuItems.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MenuItem item)
        {
            _context.MenuItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item != null)
            {
                _context.MenuItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}