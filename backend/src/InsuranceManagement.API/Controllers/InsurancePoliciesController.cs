using InsuranceManagement.Application.DTOs.InsurancePolicies;
using InsuranceManagement.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsurancePoliciesController : ControllerBase
{
    private readonly IInsurancePolicyService _policyService;

    public InsurancePoliciesController(
        IInsurancePolicyService policyService)
    {
        _policyService = policyService;
    }

    [HttpGet]
    public async Task<ActionResult<List<InsurancePolicyDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var policies = await _policyService.GetAllAsync(cancellationToken);

        return Ok(policies);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<InsurancePolicyDto>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var policy = await _policyService.GetByIdAsync(
            id, cancellationToken);

        return Ok(policy);
    }

    [HttpPost]
    public async Task<ActionResult<InsurancePolicyDto>> Create(
        [FromBody] CreateInsurancePolicyRequest request,
        CancellationToken cancellationToken)
    {
        var policy = await _policyService.CreateAsync(
            request, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = policy.Id },
            policy);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<InsurancePolicyDto>> Update(
        int id,
        [FromBody] UpdateInsurancePolicyRequest request,
        CancellationToken cancellationToken)
    {
        var policy = await _policyService.UpdateAsync(
            id, request, cancellationToken);

        return Ok(policy);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken)
    {
        await _policyService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}