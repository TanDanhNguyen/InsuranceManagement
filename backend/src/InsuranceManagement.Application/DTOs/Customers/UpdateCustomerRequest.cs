using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Application.DTOs.Customers;

public class UpdateCustomerRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public string Address { get; set; } = string.Empty;

    public CustomerStatus Status { get; set; }
}