import { Request } from 'express'

import { Decision } from "../../core/entities/decision";
import { PolicyRequest } from '../../core/entities/policyRequest'
import { PDP } from "../PDP";

export class PEP {
    /**
     * The PEP or Policy Enforcement Point: it is responsible for protecting the apps & data you want to apply ABAC to. 
     * The PEP inspects the request and generates an authorization request from it which it sends to the PDP.
     */
    constructor(private readonly policyDecisionPoint: PDP) {}

    private createActionField(action: string): { [key: string]: any } {
        const actions = {
            GET: {   
                read: 'get'
            },
            POST: {
                write: 'post'
            },
            PUT: {
                write: 'put'
            },
            DELETE: {
                delete: 'delete'
            }
        }
        return actions[action] ?? {}
    }

    public async enforce(input: { request: Request, policiesName?: string[], roles?: string[] }): Promise<{ decision: Decision }> {
        const policyRequest = PolicyRequest.create({
            actions: this.createActionField(input.request.method),
            resource: {
                path: input.request.url,
                ...input.request['resource']
            },
            subjects: {
                role: 'user',
                ...input.request['subject']
            },
            context: {
                ip: input.request.ip,
                requestTime: new Date(),
                ...input.request['context'],
                ...input.request.params,
                ...input.request.query
            }
        })

        const { decision } = await this.policyDecisionPoint.evaluate({ policiesName: input.policiesName, roles: input.roles, policyRequest })

        return { decision }
    }
}