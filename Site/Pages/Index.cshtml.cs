using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using RequestModels;

namespace SiteCore.Pages;

public class IndexModel : PageModel
{
    public List<Contact> Contacts { get; set; } = new List<Contact>();
    public IndexModel(ILogger<IndexModel> logger)
    {
    }

    public async Task<IActionResult> OnGet(string searchText)
    {
        HttpClient _httpClient = new HttpClient();
        int userId = 1;

        _httpClient.BaseAddress = new Uri(Program.API_URL);

        try
        {
            var url = $"api/Contacts/{userId}";
            var response = await _httpClient.GetAsync(url);


            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var contacts = JsonConvert.DeserializeObject<Contact[]>(responseContent);

                //This should be and enpoint that searches and just returns what is relevant
                if (!string.IsNullOrEmpty(searchText))
                {
                    contacts = contacts.Where(c =>
                        c.Name.Contains(searchText, StringComparison.OrdinalIgnoreCase) ||
                        c.Phone.Contains(searchText, StringComparison.OrdinalIgnoreCase) ||
                        c.Email.Contains(searchText, StringComparison.OrdinalIgnoreCase))
                    .ToArray();
                }
                Contacts.AddRange(contacts);
                
            }
            else
            {
                // Handle unsuccessful API response
                //TODO return StatusCode((int)response.StatusCode, "API error");
            }
        }
        catch (HttpRequestException)
        {
            // Handle any network-related errors
            //TODO return StatusCode(500, $"Network error: {ex.Message}");
        }

        return Page();
    }
}
