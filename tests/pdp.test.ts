import { Policy } from "../src/application/core/entities/policy"
import { PolicyRequest } from "../src/application/core/entities/policyRequest"
import { PDP } from "../src/application/layers/PDP"
import { PIP } from "../src/application/layers/PIP"
import { InMemoryPolicyRepository } from "../src/infra/adapters/database/repositories/inMemoryPolicyRepository"
import { InMemoryRoleRepository } from "../src/infra/adapters/database/repositories/inMemoryRoleRepository"

const policy = Policy.create({
    "effect": "allow",
    appliesTo: ['partner'],
    "actions": {
        "read": {
            "expression": "equalTo",
            "value": "get"
        }
    },
    "subjects": {
        "email": {
            "expression": "equalTo",
            "value": "alexandre.ramos@hvarconsulting.com.br"
        },
        "name": {
            "expression": "equalTo",
            "value": "Alexandre Ramos"
        }
    },
    "resource": {
        "path": {
            "expression": "equalTo",
            "value": "/auth/rest/healthcheck"
        }
    },
    "context": {},
    "name": "alexandre-com-queijo",
    "createdAt": "2022-03-14T05:44:58.119Z",
    "updatedAt": "2022-03-14T05:44:58.119Z",
    "id": "815e82fb-20ec-4951-b85d-de694b806f02",
    "description": "Policy created to grant access just for Alexandre to resource /healthcheck from auth service"
})

const policy2 = Policy.create({
    "effect": "allow",
    "appliesTo": ['partner'],
    "actions": {
        "read": {
            "expression": "equalTo",
            "value": "get"
        }
    },
    "subjects": {
        "name": {
            "expression": "equalTo",
            "value": "$.subjects.nickname"
        }
    },
    "resource": {
        "path": {
            "expression": "equalTo",
            "value": "/auth/rest/healthcheck"
        }
    },
    "context": {},
    "name": "alexandre-com-queijo",
    "createdAt": "2022-03-14T05:44:58.119Z",
    "updatedAt": "2022-03-14T05:44:58.119Z",
    "id": "815e82fb-20ec-4951-b85d-de694b806f02",
    "description": "Policy created to grant access just for Alexandre to resource /healthcheck from auth service"
})

const policy3 = Policy.create({
    "effect": "allow",
    "appliesTo": ['partner'],
    "actions": {
        "read": {
            "expression": "equalTo",
            "value": "get"
        }
    },
    "subjects": {},
    "resource": {
        "path": {
            "expression": "equalTo",
            "value": "/auth/rest*"
        }
    },
    "context": {},
    "name": "alexandre-com-queijo",
    "createdAt": "2022-03-14T05:44:58.119Z",
    "updatedAt": "2022-03-14T05:44:58.119Z",
    "id": "815e82fb-20ec-4951-b85d-de694b806f02",
    "description": "Policy created to grant access just for Alexandre to resource /healthcheck from auth service"
})

it('should navigate through object using array of keys', () => {
    const obj = {
        a: {
            b: 1
        },
        x: {
            y: 2
        }
    }
    const path = ['a', 'b']

    const value = path.reduce((previous_value, current_value) => {
        return previous_value[current_value]
    }, obj)

    expect(value).toBe(1)
})

it('should return true while validating subject field', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/healthcheck"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'Alexandre Ramos'
        },
        context: {}
    })
    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));

    const result = sut.checkField({ fieldKey: 'subjects', field: policy.props.subjects, policyRequest })

    expect(result.grant).toBeTruthy()
})

it('should return false while validating subject field', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/healthcheck"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'Alexandre Brito'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkField({ fieldKey: 'subjects', field: policy.props.subjects, policyRequest })

    expect(result.grant).toBeFalsy()
})

it('should return true while validating subject field comparing to other values from the request', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/healthcheck"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'ale',
            nickname: 'ale'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkField({ fieldKey: 'subjects', field: policy2.props.subjects, policyRequest })

    expect(result.grant).toBeTruthy()
})

it('should return false while validating subject field comparing to other values from the request', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/healthcheck"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'ale',
            nickname: 'teste'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkField({ fieldKey: 'subjects', field: policy2.props.subjects, policyRequest })

    expect(result.grant).toBeFalsy()
})

it('should return true to all fields policy validations', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/healthcheck"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'Alexandre Ramos',
            nickname: 'teste'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkPolicyFields({ policy: policy, policyRequest })

    expect(result.grant).toBeTruthy()

})

it('should return false if any field fails in policy validations', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'Alexandre Ramos',
            nickname: 'teste'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkPolicyFields({ policy: policy, policyRequest })

    expect(result.grant).toBeFalsy()
})

it('should return false if action is different that the policy', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            write: 'post'
        },
        resource: {
            path: "/auth"
        },
        subjects: {
            email: 'alexandre.ramos@hvarconsulting.com.br',
            name: 'Alexandre Ramos',
            nickname: 'teste'
        },
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkPolicyFields({ policy: policy, policyRequest })

    expect(result.grant).toBeFalsy()
})

it('should return false if path is different that the policy even if path has * at the end.', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth"
        },
        subjects: {},
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkPolicyFields({ policy: policy3, policyRequest })

    expect(result.grant).toBeFalsy()
})

it('should return true if path has relative paths afterwards *.', () => {
    const policyRequest = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        resource: {
            path: "/auth/rest/teste"
        },
        subjects: {},
        context: {}
    })

    const sut = new PDP(new PIP(
        new InMemoryPolicyRepository(),
        new InMemoryRoleRepository()
    ));
    const result = sut.checkPolicyFields({ policy: policy3, policyRequest })

    expect(result.grant).toBeTruthy()
})