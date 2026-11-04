namespace InsuranceManagement.Application.DTOs.InsurancePolicies;
public class CreateInsurancePolicyRequest
{
    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public decimal Premium { get; set; }
}