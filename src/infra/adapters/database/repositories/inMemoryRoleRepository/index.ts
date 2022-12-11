import { Role } from '../../../../../application/core/entities/role';
import { IDatabaseRepository } from '../IDatabaseRepository'

export class InMemoryRoleRepository implements IDatabaseRepository {

    private readonly roles = [{
        "id": "5e9f8f8f-f8f8-4f8f-8f8f-f8f8f8f8f8f8",
        "updatedAt": "2020-06-17T19:00:00.000Z",
        "createdAt": "2020-06-17T19:00:00.000Z",
        "name": "partner",
        "description": "Partner role",
        "policies": [{
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
        }]
    }]

    public async find<T>(input: { id: string | number }): Promise<T> {
        const role = this.roles.find(role => role.name === input.id);
        if(!role) return null;
        return Role.create(role) as any;
    }

    public async findByQuery<T>(input: { conditions: { [key: string]: any; }; }): Promise<T[]> {
        const roles = this.roles.filter(role => input.conditions.roles.includes(role.name));

        return roles.map(role => Role.create(role)) as any[];
    }
}