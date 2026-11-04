
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Domain.Enums;

public class InsurancePolicy
{
    public int Id { get; set; }

    public string PolicyNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public string InsuranceType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Premium { get; set; }

    public PolicyStatus Status { get; set; } = PolicyStatus.Pending;

    public DateTime CreatedAtUtc { get; set; }

    // Navigation properties
    public Customer Customer { get; set; } = null!;

    public InsuranceProduct Product { get; set; } = null!;
}
