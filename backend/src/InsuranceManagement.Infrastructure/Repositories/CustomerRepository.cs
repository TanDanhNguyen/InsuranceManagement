using InsuranceManagement.Application.Interfaces.Repositories;
using InsuranceManagement.Domain.Entities;
using InsuranceManagement.Domain.Enums;
using InsuranceManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InsuranceManagement.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly InsuranceManagementDbContext _context;

    public CustomerRepository(InsuranceManagementDbContext context)
    {
        _context = context;
    }

    public async Task<Customer?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<List<Customer>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Customers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim();

            query = query.Where(x =>
                x.FirstName.Contains(keyword) ||
                x.LastName.Contains(keyword) ||
                x.Email.Contains(keyword) ||
                x.PhoneNumber.Contains(keyword));
        }

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<CustomerStatus>(
                status.Trim(),
                true,
                out var customerStatus) &&
            Enum.IsDefined(customerStatus))
        {
            query = query.Where(x => x.Status == customerStatus);
        }

        return await query
            .OrderBy(x => x.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(
        string email,
        int? excludeCustomerId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Customers
            .Where(x => x.Email == email);

        if (excludeCustomerId.HasValue)
        {
            query = query.Where(
                x => x.Id != excludeCustomerId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default)
    {
        await _context.Customers.AddAsync(
            customer,
            cancellationToken);
    }

    public void Delete(Customer customer)
    {
        _context.Customers.Remove(customer);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}