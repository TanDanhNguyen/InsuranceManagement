
using InsuranceManagement.Domain.Entities;

namespace InsuranceManagement.Application.Interfaces;

public interface IInsuranceProductRepository
{
    Task<List<InsuranceProduct>> GetAllAsync();

    Task<InsuranceProduct?> GetByIdAsync(int id);

    Task<InsuranceProduct?> GetByProductCodeAsync(string productCode);

    Task AddAsync(InsuranceProduct product);

    Task UpdateAsync(InsuranceProduct product);

    Task DeleteAsync(InsuranceProduct product);
}
