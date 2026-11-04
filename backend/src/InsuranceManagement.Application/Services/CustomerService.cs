using System.Net.Mail;
using InsuranceManagement.Application.DTOs.Customers;
using InsuranceManagement.Application.Interfaces.Repositories;
using InsuranceManagement.Application.Interfaces.Services;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Domain.Enums;

namespace InsuranceManagement.Application.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<List<CustomerDto>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken = default)
    {
        var customers = await _customerRepository.GetAllAsync(
            search, status, cancellationToken);

        return customers.Select(MapToDto).ToList();
    }

    public async Task<CustomerDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(
            id, cancellationToken);

        return customer is null ? null : MapToDto(customer);
    }

    public async Task<CustomerDto> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        ValidateCustomer(request.FirstName, request.LastName,
            request.Email, request.PhoneNumber,
            request.DateOfBirth, request.Address);

        if (await _customerRepository.ExistsByEmailAsync(
            request.Email.Trim(), cancellationToken: cancellationToken))
        {
            throw new InvalidOperationException(
                "A customer with this email already exists.");
        }

        var customer = new Customer(
            request.FirstName.Trim(),
            request.LastName.Trim(),
            request.Email.Trim(),
            request.PhoneNumber.Trim(),
            request.DateOfBirth,
            request.Address.Trim());

        await _customerRepository.AddAsync(customer, cancellationToken);
        await _customerRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(customer);
    }

    public async Task<CustomerDto?> UpdateAsync(
        int id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(
            id, cancellationToken);

        if (customer is null)
            return null;

        ValidateCustomer(request.FirstName, request.LastName,
            request.Email, request.PhoneNumber,
            request.DateOfBirth, request.Address);

        if (!Enum.IsDefined(request.Status))
            throw new ArgumentException("Invalid customer status.");

        if (await _customerRepository.ExistsByEmailAsync(
            request.Email.Trim(), id, cancellationToken))
        {
            throw new InvalidOperationException(
                "A customer with this email already exists.");
        }

        customer.Update(
            request.FirstName.Trim(),
            request.LastName.Trim(),
            request.Email.Trim(),
            request.PhoneNumber.Trim(),
            request.DateOfBirth,
            request.Address.Trim(),
            request.Status);

        await _customerRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(customer);
    }

    public async Task<bool> DeleteAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(
            id, cancellationToken);

        if (customer is null)
            return false;

        _customerRepository.Delete(customer);

        await _customerRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static void ValidateCustomer(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        DateTime dateOfBirth,
        string address)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException("First name is required.");

        if (string.IsNullOrWhiteSpace(lastName))
            throw new ArgumentException("Last name is required.");

        if (string.IsNullOrWhiteSpace(email) ||
            !MailAddress.TryCreate(email.Trim(), out _))
            throw new ArgumentException("Invalid email address.");

        if (string.IsNullOrWhiteSpace(phoneNumber))
            throw new ArgumentException("Phone number is required.");

        if (dateOfBirth.Date >= DateTime.UtcNow.Date)
            throw new ArgumentException("Date of birth must be in the past.");

        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Address is required.");
    }

    private static CustomerDto MapToDto(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            DateOfBirth = customer.DateOfBirth,
            Address = customer.Address,
            Status = customer.Status.ToString()
        };
    }
}