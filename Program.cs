using System.Text;
using CafeOrderSystem.Data;
using CafeOrderSystem.Interfaces;
using CafeOrderSystem.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Register DbContext (in-memory)
builder.Services.AddDbContext<CafeDbContext>(options =>
    options.UseInMemoryDatabase("CafeDb"));

// 4. Register Repository for DI
builder.Services.AddScoped<IMenuRepository, MenuRepository>();

var app = builder.Build();

// 5. Seed / Ensure DB Created
// 5. Seed / Ensure DB Created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CafeDbContext>();
    db.Database.EnsureCreated();
}

// 6. Middleware Pipeline (Order matters!)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS before Authorization and Controllers
app.UseCors("AllowAngular");

// NOTE: Authentication MUST precede Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();