using InsuranceManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InsuranceManagement.Infrastructure.Persistence;

public class InsuranceManagementDbContext : DbContext
{
    public InsuranceManagementDbContext(
        DbContextOptions<InsuranceManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<InsurancePolicy> InsurancePolicies => Set<InsurancePolicy>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(InsuranceManagementDbContext).Assembly);
    }
}