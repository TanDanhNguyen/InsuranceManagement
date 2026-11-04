using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Domain.Entities;

public class Customer
{
    public int Id { get; private set; }

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PhoneNumber { get; private set; } = string.Empty;

    public DateTime DateOfBirth { get; private set; }

    public string Address { get; private set; } = string.Empty;

    public CustomerStatus Status { get; private set; }

    private Customer()
    {
    }

    public Customer(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        DateTime dateOfBirth,
        string address)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        DateOfBirth = dateOfBirth;
        Address = address;
        Status = CustomerStatus.Active;
    }

    public void Update(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        DateTime dateOfBirth,
        string address,
        CustomerStatus status)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        DateOfBirth = dateOfBirth;
        Address = address;
        Status = status;
    }
}