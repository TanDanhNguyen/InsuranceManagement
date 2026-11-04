using Microsoft.Extensions.DependencyInjection;
using InsuranceManagement.Application.Interfaces.Services;
using InsuranceManagement.Application.Services;

namespace InsuranceManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IInsurancePolicyService, InsurancePolicyService>();

        return services;
    }
}