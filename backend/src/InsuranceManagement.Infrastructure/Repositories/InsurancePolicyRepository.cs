using InsuranceManagement.Application.Interfaces.Repositories;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InsuranceManagement.Infrastructure.Repositories;

public class InsurancePolicyRepository : IInsurancePolicyRepository
{
    private readonly InsuranceManagementDbContext _context;

    public InsurancePolicyRepository(InsuranceManagementDbContext context)
    {
        _context = context;
    }

    public async Task<List<InsurancePolicy>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.InsurancePolicies
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<InsurancePolicy?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.InsurancePolicies
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(
        InsurancePolicy policy,
        CancellationToken cancellationToken = default)
    {
        await _context.InsurancePolicies.AddAsync(policy, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(
    InsurancePolicy policy,
    CancellationToken cancellationToken = default)
    {
        _context.InsurancePolicies.Update(policy);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(
        InsurancePolicy policy,
        CancellationToken cancellationToken = default)
    {
        _context.InsurancePolicies.Remove(policy);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByPolicyNumberAsync(
        string policyNumber,
        CancellationToken cancellationToken = default)
    {
        return await _context.InsurancePolicies
            .AnyAsync(x => x.PolicyNumber == policyNumber, cancellationToken);
    }
}