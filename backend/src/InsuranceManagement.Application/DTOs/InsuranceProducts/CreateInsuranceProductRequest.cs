
namespace InsuranceManagement.Application.DTOs.InsuranceProducts;

public class CreateInsuranceProductRequest
{
    public string ProductCode { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string InsuranceType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePremium { get; set; }
}
