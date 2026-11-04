using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsuranceManagement.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductIdToInsurancePolicy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "InsurancePolicies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_ProductId",
                table: "InsurancePolicies",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_InsurancePolicies_InsuranceProducts_ProductId",
                table: "InsurancePolicies",
                column: "ProductId",
                principalTable: "InsuranceProducts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsurancePolicies_InsuranceProducts_ProductId",
                table: "InsurancePolicies");

            migrationBuilder.DropIndex(
                name: "IX_InsurancePolicies_ProductId",
                table: "InsurancePolicies");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "InsurancePolicies");
        }
    }
}
