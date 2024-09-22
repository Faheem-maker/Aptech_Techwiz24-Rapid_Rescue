using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidResecue.API.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Title { get; set; }
        public string Action { get; set; }
        public int RefId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }
}
