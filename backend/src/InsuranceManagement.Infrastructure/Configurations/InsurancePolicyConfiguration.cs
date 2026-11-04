using InsuranceManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InsuranceManagement.Infrastructure.Persistence.Configurations;

public class InsurancePolicyConfiguration
    : IEntityTypeConfiguration<InsurancePolicy>
{
    public void Configure(EntityTypeBuilder<InsurancePolicy> builder)
    {
        builder.ToTable("InsurancePolicies");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PolicyNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.PolicyNumber)
            .IsUnique();

        builder.Property(x => x.InsuranceType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Premium)
            .HasPrecision(18, 2);

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}