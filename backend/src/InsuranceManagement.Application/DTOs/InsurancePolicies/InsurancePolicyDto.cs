namespace InsuranceManagement.Application.DTOs.InsurancePolicies;
public class InsurancePolicyDto
{
    public int Id { get; set; }

    public string PolicyNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public string ProductCode { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string InsuranceType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Premium { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }
}