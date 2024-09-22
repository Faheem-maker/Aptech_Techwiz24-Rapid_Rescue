using System;
using System.ComponentModel.DataAnnotations;

namespace RapidResecue.API.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Status { get; set; } // e.g., "Pending", "In Progress", "Completed"


        public int? AmbulanceId { get; set; } // Foreign key to Ambulance

        public Ambulance Ambulance { get; set; } // Navigation property to Ambulance

        public string Address { get; set; }
        public string Hospital { get; set; }

        [Required]
        public int PatientId { get; set; } // Foreign key to User (patient)

        public User Patient { get; set; } // Navigation property to User (patient)

        public int? DriverId { get; set; } // Foreign key to User (patient)

        public User Driver { get; set; } // Navigation property to User (patient)

        [Required]
        public DateTime BookingAt { get; set; } = DateTime.UtcNow;

        public DateTime? PickedUpAt { get; set; } // Nullable in case not yet picked up

        public int? Rating { get; set; } // Nullable, can be set after the ride

        public DateTime? CompletedAt { get; set; } // Nullable, can be set after completion

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool Emergency { get; set; } = false;
    }
}
