using InsuranceManagement.Domain.Entities;

namespace InsuranceManagement.Application.Interfaces.Repositories;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<List<Customer>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByEmailAsync(
        string email,
        int? excludeCustomerId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default);

    void Delete(Customer customer);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}