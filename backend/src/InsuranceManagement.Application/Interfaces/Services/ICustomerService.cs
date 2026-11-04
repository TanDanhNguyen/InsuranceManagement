using InsuranceManagement.Application.DTOs.Customers;

namespace InsuranceManagement.Application.Interfaces.Services;

public interface ICustomerService
{
    Task<List<CustomerDto>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken = default);

    Task<CustomerDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<CustomerDto> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default);

    Task<CustomerDto?> UpdateAsync(
        int id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        int id,
        CancellationToken cancellationToken = default);
}