﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using RequestModels;

namespace SiteCore.Pages;

public class IndexModel : PageModel
{
    public List<Contact> Contacts { get; set; } = new List<Contact>();
    public int userId;

    public IndexModel()
    {
        
    }

    private async Task InitializeUserIdAsync()
    {
        string token = HttpContext.Request.Query["t"].ToString();
        userId = await GetUserIdBySessionAsync(token);
    }

    public async Task<IActionResult> OnGet(string searchText)
    {
        using(HttpClient _httpClient = new HttpClient()) {
            // Call the async method to initialize the userId property
            await InitializeUserIdAsync();

            if(userId == -1)
            {
                Response.Redirect("https://siteasp-mgg.azurewebsites.net/");
            }

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
        }

        return Page();
    }

    private async Task<int> GetUserIdBySessionAsync(string sessionToken)
    {
        int userId = -1;

        using (HttpClient _httpClient = new HttpClient())
        {
            try
            {
                // Create a UriBuilder to construct the URL for the GetUserIdBySession endpoint
                var uriBuilder = new UriBuilder(Program.API_URL);
                uriBuilder.Path = "api/Users/GetUserIdBySession";
                uriBuilder.Query = $"token={sessionToken}";

                // Send the GET request to the GetUserIdBySession endpoint
                var response = await _httpClient.GetAsync(uriBuilder.Uri);

                // Check if the request was successful (HTTP status code 200-299)
                if (response.IsSuccessStatusCode)
                {
                    // Read the response content (the userId)
                    userId = Int32.Parse(await response.Content.ReadAsStringAsync());

                    // Use the userId as needed
                    Console.WriteLine("User ID: " + userId);
                }
                else
                {
                    // Request was not successful, handle the error
                    Console.WriteLine("Error: " + response.StatusCode + " - " + response.ReasonPhrase);
                }
            }
            catch (Exception ex)
            {
                // Exception occurred, handle the error
                Console.WriteLine("Exception: " + ex.Message);
            }
        }

        return userId;
    }
}
