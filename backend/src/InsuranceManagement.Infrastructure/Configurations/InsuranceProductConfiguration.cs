
using InsuranceManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InsuranceManagement.Infrastructure.Persistence.Configurations;

public class InsuranceProductConfiguration
    : IEntityTypeConfiguration<InsuranceProduct>
{
    public void Configure(EntityTypeBuilder<InsuranceProduct> builder)
    {
        builder.ToTable("InsuranceProducts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ProductCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.ProductCode)
            .IsUnique();

        builder.Property(x => x.ProductName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.InsuranceType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.BasePremium)
            .HasPrecision(18, 2);

        builder.Property(x => x.IsActive)
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();
    }
}
