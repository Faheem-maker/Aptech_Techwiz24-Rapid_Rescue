using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RapidResecue.API.Models;
using RapidResecue.API.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidResecue.API.Services
{
    public class Notifications
    {
        private IHubContext<NotificationHub> hub;

        public Notifications(IHubContext<NotificationHub> hub)
        {
            this.hub = hub;
        }

        public async void AddNotification(Notification notification)
        {
            await hub.Clients.All.SendAsync("Data", JsonConvert.SerializeObject(notification));
        }
    }
}
