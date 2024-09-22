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
    public class MedicalHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public MedicalHistoryController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET api/medicalhistory
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetMedicalHistories(int id)
        {
            var medicalHistories = await _dbContext.MedicalHistories.Where(m => m.PatientId == id).ToListAsync();
            return Ok(medicalHistories);
        }

        // GET api/medicalhistory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalHistory(int id)
        {
            var medicalHistory = await _dbContext.MedicalHistories.FirstOrDefaultAsync(m => m.Id == id);
            if (medicalHistory == null)
            {
                return NotFound();
            }
            return Ok(medicalHistory);
        }

        // POST api/medicalhistory
        [HttpPost]
        public async Task<IActionResult> CreateMedicalHistory(MedicalHistory medicalHistory)
        {
            _dbContext.MedicalHistories.Add(medicalHistory);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMedicalHistory), new { id = medicalHistory.Id }, medicalHistory);
        }

        // PUT api/medicalhistory/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateMedicalHistory(int id, MedicalHistory medicalHistory)
        {
            var existingMedicalHistory = await _dbContext.MedicalHistories.FirstOrDefaultAsync(m => m.Id == id);
            if (existingMedicalHistory == null)
            {
                return NotFound();
            }

            existingMedicalHistory.Type = medicalHistory.Type;
            existingMedicalHistory.UpdatedAt = DateTime.Now;
            existingMedicalHistory.Description = medicalHistory.Description;
            existingMedicalHistory.Date = medicalHistory.Date;

            _dbContext.Entry(existingMedicalHistory).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/medicalhistory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalHistory(int id)
        {
            var medicalHistory = await _dbContext.MedicalHistories.FirstOrDefaultAsync(m => m.Id == id);
            if (medicalHistory == null)
            {
                return NotFound();
            }

            _dbContext.MedicalHistories.Remove(medicalHistory);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
