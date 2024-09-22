using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using RapidResecue.API.Models;
using System.Collections.Generic;

namespace RapidResecue.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("notifications/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId) {
            return Ok(await _context.Notifications
                    .Where(n => n.UserId == userId && n.ReadAt == null)
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(5).ToListAsync());
        }

        [HttpDelete("notifications/{userId}")]
        public async Task<IActionResult> ReadNotifications(int userId)
        {
            var list = await _context.Notifications
                    .Where(n => n.UserId == userId && n.ReadAt == null)
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(5).ToListAsync();

            foreach (var item in list)
            {
                item.ReadAt = DateTime.Now;
                _context.Entry(item).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Success = true });
        }

        // POST: api/auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] LoginModel user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("User details are required.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict("Email already exists.");
            }

            var newUser = new User();
            newUser.Email = user.Email;

            // Hash password before storing
            newUser.Password = HashPassword(user.Password);
            newUser.Role = "Patient"; // Default role for patients

            newUser.PhoneNumber = "";

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { id = newUser.Id, email = newUser.Email, role = newUser.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            // Get user from database by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null)
            {
                return NotFound("Invalid email or password.");
            }

            // Validate password (assuming HashPassword function exists)
            if (!VerifyPassword(login.Password, user.Password))
            {
                return NotFound("Invalid email or password."); // Avoid revealing if email exists
            }

            return Ok(new { id = user.Id, email = user.Email, role = user.Role });
        }

        // POST: api/auth/create-driver
        [HttpPost("create-driver")]
        public async Task<IActionResult> CreateDriver([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Driver details are required.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict("Email already exists.");
            }

            // Hash password before storing
            user.Password = HashPassword(user.Password);
            user.Role = "Driver"; // Assign role as Driver

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // GET: api/auth/user/5
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPatch("user/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            var toUpdate = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
            toUpdate.Email = user.Email;

            if (!string.IsNullOrEmpty(user.Password) && user.Password != "null")
            {
                toUpdate.Password = HashPassword(user.Password);
            }
            toUpdate.PhoneNumber = user.PhoneNumber;

            user.Id = id;
            _context.Users.Update(toUpdate);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            _context.Users.Remove(await _context.Users.FindAsync(new { Id = id }));
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("drivers")]
        public async Task<IActionResult> GetDrivers()
        {
            var drivers = await _context.Users.Where(u => u.Role == "Driver").ToListAsync();

            return Ok(drivers);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);

                var hash = sha256.ComputeHash(bytes);

                return Convert.ToBase64String(hash)
         == hashedPassword;
            }
        }
    }
}
