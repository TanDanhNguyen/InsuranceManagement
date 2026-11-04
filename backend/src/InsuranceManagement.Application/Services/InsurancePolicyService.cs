using InsuranceManagement.Application.DTOs.InsurancePolicies;
using InsuranceManagement.Application.Interfaces;
using InsuranceManagement.Application.Interfaces.Repositories;
using InsuranceManagement.Application.Interfaces.Services;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Application.Services;

public class InsurancePolicyService : IInsurancePolicyService
{
    private readonly IInsurancePolicyRepository _policyRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IInsuranceProductRepository _productRepository;

    public InsurancePolicyService(
        IInsurancePolicyRepository policyRepository,
        ICustomerRepository customerRepository,
        IInsuranceProductRepository productRepository)
    {
        _policyRepository = policyRepository;
        _customerRepository = customerRepository;
        _productRepository = productRepository;
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
            request.StartDate,
            request.EndDate,
            request.Premium);

        var customer = await _customerRepository.GetByIdAsync(
            request.CustomerId, cancellationToken);

        if (customer == null)
            throw new KeyNotFoundException("Customer not found.");

        var product = await _productRepository.GetByIdAsync(
            request.ProductId);

        if (product == null)
            throw new KeyNotFoundException("Insurance product not found.");

        if (!product.IsActive)
            throw new InvalidOperationException(
                "Cannot create policy with an inactive product.");

        var policy = new InsurancePolicy
        {
            PolicyNumber = await GeneratePolicyNumberAsync(cancellationToken),
            CustomerId = request.CustomerId,
            ProductId = product.Id,
            Product = product,
            InsuranceType = product.InsuranceType,
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
            request.StartDate,
            request.EndDate,
            request.Premium);

        var policy = await _policyRepository.GetByIdAsync(
            id, cancellationToken);

        if (policy == null)
            throw new KeyNotFoundException("Insurance policy not found.");

        var product = await _productRepository.GetByIdAsync(
            request.ProductId);

        if (product == null)
            throw new KeyNotFoundException("Insurance product not found.");

        if (!product.IsActive)
            throw new InvalidOperationException(
                "Cannot assign an inactive product to a policy.");

        policy.ProductId = product.Id;
        policy.Product = product;
        policy.InsuranceType = product.InsuranceType;
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
        DateTime startDate,
        DateTime endDate,
        decimal premium)
    {
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
            ProductId = policy.ProductId,
            ProductCode = policy.Product?.ProductCode ?? string.Empty,
            ProductName = policy.Product?.ProductName ?? string.Empty,
            InsuranceType = policy.Product?.InsuranceType
                ?? policy.InsuranceType,
            StartDate = policy.StartDate,
            EndDate = policy.EndDate,
            Premium = policy.Premium,
            Status = policy.Status.ToString(),
            CreatedAtUtc = policy.CreatedAtUtc
        };
    }
}