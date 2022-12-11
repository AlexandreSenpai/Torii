import { Policy } from '../../../../../application/core/entities/policy';
import { IDatabaseRepository } from '../IDatabaseRepository'

export class InMemoryPolicyRepository implements IDatabaseRepository {

    private readonly policies = [{
        "id": "5e9f8f8f-f8f8-4f8f-8f8f-f8f8f8f8f8f8",
        "updatedAt": "2020-06-17T19:00:00.000Z",
        "createdAt": "2020-06-17T19:00:00.000Z",
        "name": "policy1",
        "description": "Policy created to grant access just for Alexandre to resource /healthcheck from auth service",
        "effect": "allow",
        "appliesTo": ['partner'],
        "actions": {
            "read": {
                "expression": "equalTo",
                "value": "get"
            }
        },
        "subjects": { 
            "email": {
                "expression": "equalTo",
                "value": "alexandre.brito@hvarconsulting.com.br"
            },
            "name": {
                "expression": "equalTo",
                "value": "Alexandre Brito"
            }
        },
        "resource": {
            "path": {
                "expression": "equalTo",
                "value": "/"
            }
        },
        "context": {}
    },
    {
        "id": "5e9f8f8f-f8f8-4f8f-8f8f-f8f8f8f8f8f8",
        "updatedAt": "2020-06-17T19:00:00.000Z",
        "createdAt": "2020-06-17T19:00:00.000Z",
        "name": "policy2",
        "description": "opa",
        "effect": "deny",
        "appliesTo": ['partner'],
        "actions": {
            "read": {
                "expression": "equalTo",
                "value": "get"
            }
        },
        "subjects": { 
            "email": {
                "expression": "equalTo",
                "value": "alexandre.brito@hvarconsulting.com.br"
            }
        },
        "resource": {
            "path": {
                "expression": "equalTo",
                "value": "/"
            }
        },
        "context": {}
    }]

    public async find<T>(input: { id: string | number }): Promise<T> {
        const policy = this.policies.find(policy => policy.name === input.id);
        if(!policy) return null;
        return Policy.create(policy) as any;
    }

    public async findByQuery<T>(input: { conditions: { [key: string]: any; }; }): Promise<T[]> {
        const policies = this.policies.filter(policy => input.conditions.policiesNames.includes(policy.name));

        return policies.map(policy => Policy.create(policy)) as any[];
    }
}