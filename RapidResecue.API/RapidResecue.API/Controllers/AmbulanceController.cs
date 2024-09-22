using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RapidResecue.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidResecue.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AmbulancesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AmbulancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ambulance>>> GetAmbulances()
        {
            return await _context.Ambulances.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ambulance>> GetAmbulance(int id)
        {
            var ambulance = await _context.Ambulances.FindAsync(id);
            if (ambulance == null)
            {
                return NotFound();
            }

            return ambulance;

        }

        [HttpPatch("location/{id}/{lat}/{lon}")]
        public async Task<ActionResult> UpdateLocation(int id, float lat, float lon)
        {
            var ambulance = await _context.Ambulances.Where(a => a.Id == id)
                .FirstAsync();

            ambulance.Latitude = lat;
            ambulance.Longitude = lon;

            _context.Entry(ambulance).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("location/{id}")]
        public async Task<ActionResult> GetLocation(int id)
        {
            var ambulance = await _context.Ambulances.Where(a => a.Id == id)
                .FirstAsync();

            return Ok(new { lat = ambulance.Latitude, lon = ambulance.Longitude });
        }

        [HttpPost("")]
        public async Task<ActionResult<Ambulance>>
 PostAmbulance(Ambulance ambulance)
        {
            _context.Ambulances.Add(ambulance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAmbulance), new
            {
                id = ambulance.Id
            }, ambulance);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PutAmbulance(int id, Ambulance ambulance)
        {
            var toUpdate = await _context.Ambulances.Where(u => u.Id == id).FirstOrDefaultAsync();
            toUpdate.VehicleNumber = ambulance.VehicleNumber;
            _context.Entry(toUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAmbulance(int
 id)
        {
            var ambulance = await _context.Ambulances.FindAsync(id);
            if (ambulance == null)
            {
                return NotFound();
            }

            _context.Ambulances.Remove(ambulance);
            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}
