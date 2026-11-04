using InsuranceManagement.Domain.Entities;

namespace InsuranceManagement.Application.Interfaces.Repositories;

public interface IInsurancePolicyRepository
{
    Task<List<InsurancePolicy>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<InsurancePolicy?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        InsurancePolicy policy,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        InsurancePolicy policy,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        InsurancePolicy policy,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByPolicyNumberAsync(
        string policyNumber,
        CancellationToken cancellationToken = default);
}