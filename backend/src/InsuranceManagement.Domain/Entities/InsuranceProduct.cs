
namespace InsuranceManagement.Domain.Entities;

public class InsuranceProduct
{
    public int Id { get; set; }

    public string ProductCode { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string InsuranceType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePremium { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
