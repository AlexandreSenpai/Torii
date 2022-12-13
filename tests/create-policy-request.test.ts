import { expect, it } from 'vitest';
import { PolicyRequest } from '../src/application/core/entities/policy-request'

it('should instantiate correctly a policy request', () => {
    const request = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        context: {
            ip: '0.0.0.0/0'
        },
        resource: {
            path: '/'
        },
        subjects: {
            email: 'alexandreramos@gmail.com'
        }
    })

    const data = request.data()
    expect(request).toBeInstanceOf(PolicyRequest)
    expect(data.actions.read).toBe('get')
    expect(data.id).toBeDefined()
    expect(data.subjects.email).toBe('alexandreramos@gmail.com')
})

it('should merge the policy request and return a JSON successfully', () => {
    const request = PolicyRequest.create({
        actions: {
            read: 'get'
        },
        context: {
            ip: '0.0.0.0/0'
        },
        resource: {
            path: '/'
        },
        subjects: {
            email: 'alexandreramos@gmail.com'
        }
    }).data()

    console.log(request)

    expect(request).toBeInstanceOf(Object)
})