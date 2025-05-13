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
        var apiKey = "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";
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress("onsiteapp.np@gmail.com", "Booklett");
        var to = new EmailAddress(receptor);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
 
        var response = await client.SendEmailAsync(msg);

        Console.WriteLine($"SendGrid Status: {response.StatusCode}");
    }
}
