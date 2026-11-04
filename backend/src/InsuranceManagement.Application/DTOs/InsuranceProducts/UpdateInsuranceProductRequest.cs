
namespace InsuranceManagement.Application.DTOs.InsuranceProducts;

public class UpdateInsuranceProductRequest
{
    public string ProductName { get; set; } = string.Empty;

    public string InsuranceType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePremium { get; set; }

    public bool IsActive { get; set; }
}
