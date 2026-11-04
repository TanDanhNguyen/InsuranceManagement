using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Domain.Entities;

public class InsurancePolicy
{
    public int Id { get; set; }

    public string PolicyNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public string InsuranceType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Premium { get; set; }

    public PolicyStatus Status { get; set; } = PolicyStatus.Pending;

    public DateTime CreatedAtUtc { get; set; }

    // Navigation property
    public Customer Customer { get; set; } = null!;
}