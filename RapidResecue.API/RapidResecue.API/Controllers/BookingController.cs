using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RapidResecue.API.Models;
using RapidResecue.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidResecue.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Notifications notification;

        public BookingsController(ApplicationDbContext context, Notifications notification)
        {
            _context = context;
            this.notification = notification;
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
        {
            if (booking == null || booking.PatientId <= 0)
            {
                return BadRequest("Booking details are required.");
            }

            // Check if the patient exists
            var patient = await _context.Users.FindAsync(booking.PatientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Set default values for the booking
            booking.Status = "Pending"; // Default status
            booking.BookingAt = DateTime.UtcNow; // Set booking time

            // Add the booking to the context
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            var notification = new Notification()
            {
                Action = "NOFITIFY",
                RefId = booking.Id,
                Title = "A new request is received!",
                UserId = 7,
                CreatedAt = DateTime.Now,
            };

            this.notification.AddNotification(notification);
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("admin")]
        public async Task<List<Booking>> GetPendingBookings()
        {
            return await _context.Bookings
                .Where(b => b.Status == "Pending")
                .OrderByDescending(b => b.Emergency) // Descending for high emergency first
                .ThenBy(b => b.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("driver/{id}")]
        public async Task<Booking> GetDriverBooking(int id)
        {
            return await _context.Bookings
                .Where(b => (b.Status != "Completed" && (b.Status != "Pending" || b.PatientId == id )) && (b.DriverId == id || b.PatientId == id))
                .OrderByDescending(b => b.Emergency) // Descending for high emergency first
                .ThenBy(b => b.CreatedAt)
                .Include(b => b.Ambulance)
                .FirstOrDefaultAsync();
        }

        [HttpPatch]  // Define the HTTP method for updating resources
        [Route("status/{id}/{status}")]  // Define the route with parameters
        public async Task<IActionResult> UpdateBookingStatus(int id, string status)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            booking.Status = status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating booking");
            }

            string title = "";

            switch (status)
            {
                case "En-Route":
                    title = "The ambulance is on the route to your location";
                    break;
                case "Arrived":
                    title = "The driver has reached your location";
                    break;
                case "Transporting Patient":
                    title = "The ambulance has picked up the patient";
                    break;
                case "Completed":
                    title = "The trip has been completed";
                    break;
                default:
                    break;
            }

            var notification = new Notification()
            {
                Action = "NOFITIFY",
                RefId = booking.Id,
                Title = title,
                UserId = booking.PatientId,
                CreatedAt = DateTime.Now,
            };

            this.notification.AddNotification(notification);
            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            notification = new Notification()
            {
                Action = "NOFITIFY",
                RefId = booking.Id,
                Title = title,
                UserId = 7,
                CreatedAt = DateTime.Now,
            };

            this.notification.AddNotification(notification);
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true });
        }

        [HttpPost("dispatch/{bookingId}/{ambulanceId}/{driverId}")]
        public async Task<IActionResult> DispatchBooking(int bookingId, int ambulanceId, int driverId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);

            if (booking == null)
            {
                return NotFound();
            }

            // Check if the ambulance and driver are available
            var ambulance = await _context.Ambulances.FindAsync(ambulanceId);
            var driver = await _context.Users.FindAsync(driverId);

            if (ambulance == null || driver == null)
            {
                return BadRequest("Invalid ambulance or driver ID");
            }

            // Update the booking information
            booking.AmbulanceId = ambulanceId;
            booking.DriverId = driverId;
            booking.Status = "Dispatched";

            // Save the changes to the database
            await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();

            var notification = new Notification()
            {
                Action = "NOFITIFY",
                RefId = booking.Id,
                Title = "An ambulance is dispatched to your location!",
                UserId = booking.PatientId,
                CreatedAt = DateTime.Now,
            };

            this.notification.AddNotification(notification);
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();

            notification = new Notification()
            {
                Action = "NOFITIFY",
                RefId = booking.Id,
                Title = "A booking has been assigned to you!",
                UserId = driverId,
                CreatedAt = DateTime.Now,
            };

            this.notification.AddNotification(notification);
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true });
        }

        // GET: api/bookings/5
        // [HttpGet("{id}")]
        //public async Task<IActionResult> GetBooking(int id)
        //{
        //    var booking = await _context.Bookings
        //        .Include(b => b.Patient) // Include patient details
        //        .FirstOrDefaultAsync(b => b.Id == id);

        //    if (booking == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(booking);
        //}

        [HttpGet("notification")]
        public async void SendNotification()
        {
            this.notification.AddNotification(new Notification()
            {
                Title = "Test",
                UserId = 0,
                RefId = 0,
                CreatedAt = DateTime.Now,
                ReadAt = DateTime.MaxValue,
                Action = "NOTIFICATOIN"
            });
        }
    }
}
