using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenIddict.Validation.AspNetCore;
using Test_Project.Server.Configuration;
using Test_Project.Server.DbContext;
using static OpenIddict.Abstractions.OpenIddictConstants;

var builder = WebApplication.CreateBuilder(args);

var corsname = "_cors";

// Add services to the container.

//DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Local"));
    options.UseOpenIddict();
});

// Add Identity and Configure Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.ClaimsIdentity.UserNameClaimType = Claims.Name;
    options.ClaimsIdentity.UserIdClaimType = Claims.Subject;
    options.ClaimsIdentity.EmailClaimType = Claims.Email;
    options.ClaimsIdentity.RoleClaimType = Claims.Role;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add OpenId Services
builder.Services.AddOpenIddict()
    .AddCore(options =>
    {
        options.UseEntityFrameworkCore()
               .UseDbContext<ApplicationDbContext>();
    })
    .AddServer(options =>
    {
        options.SetTokenEndpointUris("connect/token");

        options.AllowPasswordFlow()
               .AllowRefreshTokenFlow();

        options.RegisterScopes(
            Scopes.Profile,
            Scopes.Email,
            Scopes.Address,
            Scopes.Phone,
            Scopes.Roles
        );

        if (builder.Environment.IsDevelopment())
        {
            options.AddDevelopmentEncryptionCertificate()
                   .AddDevelopmentSigningCertificate();
        }
        options.SetAccessTokenLifetime(TimeSpan.FromSeconds(10));
        options.SetIdentityTokenLifetime(TimeSpan.FromSeconds(10));

        options.UseAspNetCore()
               .EnableTokenEndpointPassthrough();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    });

//Add Authentication Scheme
builder.Services.AddAuthentication(options => 
{ 
    options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsname, policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();    
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
    
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsname);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Configure the  RegisterClientApplication
using var scope = app.Services.CreateScope();

await OidcServerConfiguration.RegisterClientApplicationsAsync(scope.ServiceProvider);

app.Run();
