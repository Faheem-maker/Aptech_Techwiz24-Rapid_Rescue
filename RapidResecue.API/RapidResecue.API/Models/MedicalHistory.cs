using System;
using System.ComponentModel.DataAnnotations;

namespace RapidResecue.API.Models
{
    public class MedicalHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Type { get; set; } // e.g., "Diagnosis", "Surgery", "Allergy"

        [Required]
        public string Description { get; set; } // Detailed description of the medical event

        [Required]
        public DateTime Date { get; set; } // Date when the medical event occurred

        [Required]
        public int PatientId { get; set; } // Foreign key to User (the patient)

        public User Patient { get; set; } // Navigation property to User (the patient)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
