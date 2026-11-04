namespace InsuranceManagement.Application.DTOs.InsurancePolicies;

public class UpdateInsurancePolicyRequest
{
    public string InsuranceType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
}