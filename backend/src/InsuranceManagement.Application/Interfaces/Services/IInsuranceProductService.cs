using InsuranceManagement.Application.DTOs.InsuranceProducts;

namespace InsuranceManagement.Application.Interfaces;

public interface IInsuranceProductService
{
    Task<List<InsuranceProductDto>> GetAllAsync();

    Task<InsuranceProductDto?> GetByIdAsync(int id);

    Task<InsuranceProductDto> CreateAsync(
        CreateInsuranceProductRequest request);

    Task<InsuranceProductDto?> UpdateAsync(
        int id,
        UpdateInsuranceProductRequest request);

    Task<bool> DeleteAsync(int id);
}