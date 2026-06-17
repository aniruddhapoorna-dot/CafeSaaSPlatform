using Microsoft.EntityFrameworkCore;
using CafeOrderSystem.Models;

namespace CafeOrderSystem.Data
{
    public class CafeDbContext : DbContext
    {
        public CafeDbContext(DbContextOptions<CafeDbContext> options) : base(options)
        {
        }

        public DbSet<MenuItem> MenuItems { get; set; }
        // We will add 'Orders' here in the next phase
    }
}
