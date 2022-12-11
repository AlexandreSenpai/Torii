import { PolicyRequest } from "../src/application/core/entities/policyRequest"

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
    expect(request).toBeInstanceOf(PolicyRequest)
    expect(request.props.actions.read).toBe('get')
    expect(request.id).toBeDefined()
    expect(request.interactionTime).toBeInstanceOf(Date)
    expect(request.props.subjects.email).toBe('alexandreramos@gmail.com')
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
    })
    const jsonObject = request.toJSON()
    expect(jsonObject).toBeInstanceOf(Object)
})