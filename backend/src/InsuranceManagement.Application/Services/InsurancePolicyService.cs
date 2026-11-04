using InsuranceManagement.Application.DTOs.InsurancePolicies;
using InsuranceManagement.Application.Interfaces.Repositories;
using InsuranceManagement.Application.Interfaces.Services;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Application.Services;

public class InsurancePolicyService : IInsurancePolicyService
{
    private readonly IInsurancePolicyRepository _policyRepository;
    private readonly ICustomerRepository _customerRepository;

    public InsurancePolicyService(
        IInsurancePolicyRepository policyRepository,
        ICustomerRepository customerRepository)
    {
        _policyRepository = policyRepository;
        _customerRepository = customerRepository;
    }

    public async Task<List<InsurancePolicyDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var policies = await _policyRepository.GetAllAsync(cancellationToken);

        return policies.Select(MapToDto).ToList();
    }

    public async Task<InsurancePolicyDto> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid policy ID.");

        var policy = await _policyRepository.GetByIdAsync(
            id, cancellationToken);

        if (policy == null)
            throw new KeyNotFoundException("Insurance policy not found.");

        return MapToDto(policy);
    }

    public async Task<InsurancePolicyDto> CreateAsync(
        CreateInsurancePolicyRequest request,
        CancellationToken cancellationToken = default)
    {
        ValidatePolicy(
            request.InsuranceType,
            request.StartDate,
            request.EndDate,
            request.Premium);

        var customer = await _customerRepository.GetByIdAsync(
            request.CustomerId, cancellationToken);

        if (customer == null)
            throw new KeyNotFoundException("Customer not found.");

        var policy = new InsurancePolicy
        {
            PolicyNumber = await GeneratePolicyNumberAsync(cancellationToken),
            CustomerId = request.CustomerId,
            InsuranceType = request.InsuranceType.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Premium = request.Premium,
            Status = PolicyStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _policyRepository.AddAsync(policy, cancellationToken);

        return MapToDto(policy);
    }

    public async Task<InsurancePolicyDto> UpdateAsync(
        int id,
        UpdateInsurancePolicyRequest request,
        CancellationToken cancellationToken = default)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid policy ID.");

        ValidatePolicy(
            request.InsuranceType,
            request.StartDate,
            request.EndDate,
            request.Premium);

        var policy = await _policyRepository.GetByIdAsync(
            id, cancellationToken);

        if (policy == null)
            throw new KeyNotFoundException("Insurance policy not found.");

        policy.InsuranceType = request.InsuranceType.Trim();
        policy.StartDate = request.StartDate;
        policy.EndDate = request.EndDate;
        policy.Premium = request.Premium;

        await _policyRepository.UpdateAsync(policy, cancellationToken);

        return MapToDto(policy);
    }

    public async Task DeleteAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid policy ID.");

        var policy = await _policyRepository.GetByIdAsync(
            id, cancellationToken);

        if (policy == null)
            throw new KeyNotFoundException("Insurance policy not found.");

        await _policyRepository.DeleteAsync(policy, cancellationToken);
    }

    private async Task<string> GeneratePolicyNumberAsync(
        CancellationToken cancellationToken)
    {
        string policyNumber;

        do
        {
            policyNumber = $"POL-{Guid.NewGuid():N}"
                .Substring(0, 12)
                .ToUpperInvariant();
        }
        while (await _policyRepository.ExistsByPolicyNumberAsync(
            policyNumber, cancellationToken));

        return policyNumber;
    }

    private static void ValidatePolicy(
        string insuranceType,
        DateTime startDate,
        DateTime endDate,
        decimal premium)
    {
        if (string.IsNullOrWhiteSpace(insuranceType))
            throw new ArgumentException("Insurance type is required.");

        if (startDate >= endDate)
            throw new ArgumentException(
                "End date must be later than start date.");

        if (premium <= 0)
            throw new ArgumentException(
                "Premium must be greater than zero.");
    }

    private static InsurancePolicyDto MapToDto(InsurancePolicy policy)
    {
        return new InsurancePolicyDto
        {
            Id = policy.Id,
            PolicyNumber = policy.PolicyNumber,
            CustomerId = policy.CustomerId,
            InsuranceType = policy.InsuranceType,
            StartDate = policy.StartDate,
            EndDate = policy.EndDate,
            Premium = policy.Premium,
            Status = policy.Status.ToString(),
            CreatedAtUtc = policy.CreatedAtUtc
        };
    }
}