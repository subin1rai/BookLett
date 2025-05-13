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
        var apiKey = _config["SendGrid:ApiKey"];
        Console.WriteLine("🔐 SendGrid API Key Length: " + (apiKey?.Length ?? 0));  // Debug output

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("❌ API Key not found. Check environment variables or config setup.");
            return;
        }

        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("np05cp4a220125@iic.edu.np", "Subin Rai");
        var to = new EmailAddress(receptor);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
        var response = await client.SendEmailAsync(msg);

        Console.WriteLine($"📬 SendGrid Status: {response.StatusCode}");
    }
}
