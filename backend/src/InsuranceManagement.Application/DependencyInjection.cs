using InsuranceManagement.Application.Interfaces;
using InsuranceManagement.Application.Interfaces.Services;
using InsuranceManagement.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace InsuranceManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IInsurancePolicyService, InsurancePolicyService>();
        services.AddScoped<IInsuranceProductService, InsuranceProductService>();

        return services;
    }
}