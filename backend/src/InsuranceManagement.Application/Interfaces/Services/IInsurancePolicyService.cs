using InsuranceManagement.Application.DTOs.InsurancePolicies;

namespace InsuranceManagement.Application.Interfaces.Services;

public interface IInsurancePolicyService
{
    Task<List<InsurancePolicyDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<InsurancePolicyDto> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<InsurancePolicyDto> CreateAsync(
        CreateInsurancePolicyRequest request,
        CancellationToken cancellationToken = default);

    Task<InsurancePolicyDto> UpdateAsync(
        int id,
        UpdateInsurancePolicyRequest request,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        int id,
        CancellationToken cancellationToken = default);
}