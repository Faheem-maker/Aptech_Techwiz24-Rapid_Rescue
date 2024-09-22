using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidResecue.API.SignalR
{
    public class NotificationHub : Hub
    {
        public async Task SendMessage(int user, string message)
        => await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
