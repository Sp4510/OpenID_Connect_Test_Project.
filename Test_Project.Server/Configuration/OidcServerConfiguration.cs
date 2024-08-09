using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace Test_Project.Server.Configuration
{
    public static class OidcServerConfiguration
    {
        public const string ServerName = "Test API";
        public const string TestClientID = "test_spa";
        public const string SwaggerClientID = "swagger_ui";

        public static async Task RegisterClientApplicationsAsync(IServiceProvider provider)
        {
            var manager = provider.GetRequiredService<IOpenIddictApplicationManager>();

            if (await manager.FindByClientIdAsync(TestClientID)is null)
            {
                await manager.CreateAsync(new OpenIddictApplicationDescriptor
                {
                    ClientId = TestClientID,
                    ClientType = ClientTypes.Public,
                    DisplayName = "Test",
                    Permissions =
                    {
                        Permissions.Endpoints.Token,
                        Permissions.GrantTypes.Password,
                        Permissions.GrantTypes.RefreshToken,
                        Permissions.Scopes.Profile,
                        Permissions.Scopes.Email,
                        Permissions.Scopes.Address,
                        Permissions.Scopes.Phone,
                        Permissions.Scopes.Roles,
                    }
                });
            }
        }
    }
}
