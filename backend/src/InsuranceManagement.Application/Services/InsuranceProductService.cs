
using InsuranceManagement.Application.DTOs.InsuranceProducts;
using InsuranceManagement.Application.Interfaces;
using InsuranceManagement.Domain.Entities;

namespace InsuranceManagement.Application.Services;

public class InsuranceProductService : IInsuranceProductService
{
    private readonly IInsuranceProductRepository _repository;

    public InsuranceProductService(
        IInsuranceProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<InsuranceProductDto>> GetAllAsync()
    {
        var products = await _repository.GetAllAsync();

        return products.Select(MapToDto).ToList();
    }

    public async Task<InsuranceProductDto?> GetByIdAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid product ID.");

        var product = await _repository.GetByIdAsync(id);

        return product == null ? null : MapToDto(product);
    }

    public async Task<InsuranceProductDto> CreateAsync(
        CreateInsuranceProductRequest request)
    {
        ValidateProduct(
            request.ProductCode,
            request.ProductName,
            request.InsuranceType,
            request.BasePremium);

        var productCode = request.ProductCode.Trim().ToUpperInvariant();

        var existingProduct =
            await _repository.GetByProductCodeAsync(productCode);

        if (existingProduct != null)
            throw new InvalidOperationException(
                "Product code already exists.");

        var product = new InsuranceProduct
        {
            ProductCode = productCode,
            ProductName = request.ProductName.Trim(),
            InsuranceType = request.InsuranceType.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            BasePremium = request.BasePremium,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(product);

        return MapToDto(product);
    }

    public async Task<InsuranceProductDto?> UpdateAsync(
        int id,
        UpdateInsuranceProductRequest request)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid product ID.");

        ValidateProduct(
            null,
            request.ProductName,
            request.InsuranceType,
            request.BasePremium);

        var product = await _repository.GetByIdAsync(id);

        if (product == null)
            return null;

        product.ProductName = request.ProductName.Trim();
        product.InsuranceType = request.InsuranceType.Trim();
        product.Description = request.Description?.Trim()
            ?? string.Empty;
        product.BasePremium = request.BasePremium;
        product.IsActive = request.IsActive;

        await _repository.UpdateAsync(product);

        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Invalid product ID.");

        var product = await _repository.GetByIdAsync(id);

        if (product == null)
            return false;

        await _repository.DeleteAsync(product);

        return true;
    }

    private static void ValidateProduct(
        string? productCode,
        string productName,
        string insuranceType,
        decimal basePremium)
    {
        if (productCode != null)
        {
            if (string.IsNullOrWhiteSpace(productCode))
                throw new ArgumentException("Product code is required.");

            if (productCode.Trim().Length > 50)
                throw new ArgumentException(
                    "Product code cannot exceed 50 characters.");
        }

        if (string.IsNullOrWhiteSpace(productName))
            throw new ArgumentException("Product name is required.");

        if (productName.Trim().Length > 200)
            throw new ArgumentException(
                "Product name cannot exceed 200 characters.");

        if (string.IsNullOrWhiteSpace(insuranceType))
            throw new ArgumentException("Insurance type is required.");

        if (insuranceType.Trim().Length > 100)
            throw new ArgumentException(
                "Insurance type cannot exceed 100 characters.");

        if (basePremium <= 0)
            throw new ArgumentException(
                "Base premium must be greater than zero.");
    }

    private static InsuranceProductDto MapToDto(
        InsuranceProduct product)
    {
        return new InsuranceProductDto
        {
            Id = product.Id,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            InsuranceType = product.InsuranceType,
            Description = product.Description,
            BasePremium = product.BasePremium,
            IsActive = product.IsActive,
            CreatedAtUtc = product.CreatedAtUtc
        };
    }
}
