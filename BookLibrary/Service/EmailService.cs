using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using BookLibrary.Service;

public class EmailServices : IEmailService
{
    private readonly IConfiguration _config;

    public EmailServices(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmail(string receptor, string subject, string body)
    {
        var apiKey = Environment.GetEnvironmentVariable("SendGrid:ApiKey");
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress("onsiteapp.np@gmail.com", "Booklett");
        var to = new EmailAddress(receptor);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
 
        var response = await client.SendEmailAsync(msg);

        Console.WriteLine($"SendGrid Status: {response.StatusCode}");
    }
}
