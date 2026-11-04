
using InsuranceManagement.Application.Interfaces;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InsuranceManagement.Infrastructure.Repositories;

public class InsuranceProductRepository : IInsuranceProductRepository
{
    private readonly InsuranceManagementDbContext _context;

    public InsuranceProductRepository(InsuranceManagementDbContext context)
    {
        _context = context;
    }

    public async Task<List<InsuranceProduct>> GetAllAsync()
    {
        return await _context.InsuranceProducts
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync();
    }

    public async Task<InsuranceProduct?> GetByIdAsync(int id)
    {
        return await _context.InsuranceProducts
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<InsuranceProduct?> GetByProductCodeAsync(string productCode)
    {
        return await _context.InsuranceProducts
            .FirstOrDefaultAsync(x => x.ProductCode == productCode);
    }

    public async Task AddAsync(InsuranceProduct product)
    {
        await _context.InsuranceProducts.AddAsync(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(InsuranceProduct product)
    {
        _context.InsuranceProducts.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(InsuranceProduct product)
    {
        _context.InsuranceProducts.Remove(product);
        await _context.SaveChangesAsync();
    }
}
