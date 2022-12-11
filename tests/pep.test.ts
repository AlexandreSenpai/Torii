import { Request } from "express";
import { PDP } from "../src/application/layers/PDP";
import { PEP } from "../src/application/layers/PEP";
import { PIP } from "../src/application/layers/PIP";
import { InMemoryPolicyRepository } from '../src/infra/adapters/database/repositories/inMemoryPolicyRepository';
import { InMemoryRoleRepository } from "../src/infra/adapters/database/repositories/inMemoryRoleRepository";

it('should enforce and grant access', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = { 
        method: 'GET', 
        url: '/', 
        ip: '0.0.0.0/0', 
        subject: { 
            email: 'alexandre.brito@hvarconsulting.com.br', 
            name: 'Alexandre Brito', 
            role: 'partner' 
        } 
    } as unknown as Request
    const { decision } = await sut.enforce({ request: mockRequest, policiesName: ['policy1'] });
    expect(decision.props.grant).toBe(true);
})

it('should enforce and deny access because theres no policies that applies to an user without role', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = { 
        method: 'GET', 
        url: '/', 
        ip: '0.0.0.0/0', 
        subject: {} 
    } as unknown as Request
    const { decision } = await sut.enforce({ request: mockRequest, policiesName: ['policy1'] });
    expect(decision.props.grant).toBe(false);
    expect(decision.props.reason[0]).toBe("There's no policies that applies to this role.");
})

it('should enforce and deny access because no policies or role identifiers were provided.', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = { 
        method: 'GET', 
        url: '/', 
        ip: '0.0.0.0/0', 
        subject: {} 
    } as unknown as Request
    const { decision } = await sut.enforce({ request: mockRequest, policiesName: [] });
    expect(decision.props.grant).toBe(false);
    expect(decision.props.reason[0]).toBe("Any Policies or Roles were provided to this route.");
})

it('should enforce and deny access because the requester is trying to access another resource.', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = {
        method: 'GET',
        url: '/healthcheck',
        ip: '0.0.0.0/0',
        subject: {
            role: 'partner',
            email: 'alexandre.brito@hvarconsulting.com.br',
            name: 'Alexandre Brito' 
        }
    } as unknown as Request
    
    const { decision } = await sut.enforce({ request: mockRequest, policiesName: ['policy1'] });
    expect(decision.props.grant).toBe(false);
    expect(decision.props.reason[0]).toBe("'path' does not match the expression.");
})

it('should enforce and grant access because there\'s policies inside of provided role that allows access to this user.', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = {
        method: 'GET',
        url: '/',
        ip: '0.0.0.0/0',
        subject: {
            role: 'partner',
            email: 'alexandre.brito@hvarconsulting.com.br',
            name: 'Alexandre Brito' 
        }
    } as unknown as Request
    const { decision } = await sut.enforce({ request: mockRequest, roles: ['partner'] });
    expect(decision.props.grant).toBe(true);
})

it('should enforce and deny access because there\'s no policies inside of provided role that allows access to this user.', async () => {
    const sut = new PEP(new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    )));
    const mockRequest = {
        method: 'GET',
        url: '/',
        ip: '0.0.0.0/0',
        subject: {
            role: 'partner',
            email: 'alexandre.brito@hvarconsulting.com.br',
            name: 'Alexandre Brito' 
        }
    } as unknown as Request
    const { decision } = await sut.enforce({ request: mockRequest, roles: ['admin'] });
    expect(decision.props.grant).toBe(false);
})
