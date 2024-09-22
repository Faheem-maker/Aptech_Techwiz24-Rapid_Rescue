using System;
using System.ComponentModel.DataAnnotations;

namespace RapidResecue.API.Models
{
    public class Ambulance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string VehicleNumber { get; set; }

        [Required]
        [Range(-90.0, 90.0)]
        public double Latitude { get; set; }

        [Required]
        [Range(-180.0, 180.0)]
        public double Longitude { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
