using System;

namespace BookLibrary.Service;

public interface IEmailService
{
        Task SendEmail(string receptor, string subject, string body);
}