using CafeOrderSystem.Interfaces;
using CafeOrderSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CafeOrderSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuRepository _repository;

        // Constructor Injection
        public MenuController(IMenuRepository repository)
        {
            _repository = repository;
        }

        // 1. GET: api/menu (For Customers and Owners)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenu()
        {
            var items = await _repository.GetAllItemsAsync();
            return Ok(items);
        }

        // 2. POST: api/menu (For the Owner to add a new dish)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MenuItem>> AddDish(MenuItem item)
        {
            await _repository.AddAsync(item);
            return CreatedAtAction(nameof(GetMenu), new { id = item.id }, item);
        }

        // 3. DELETE: api/menu/5 (For the Owner to remove a dish)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDish(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }

    }
}