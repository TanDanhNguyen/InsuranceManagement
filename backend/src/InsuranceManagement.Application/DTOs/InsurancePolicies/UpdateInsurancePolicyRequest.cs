namespace InsuranceManagement.Application.DTOs.InsurancePolicies;
public class UpdateInsurancePolicyRequest
{
    public int ProductId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Premium { get; set; }
}