import { Decision } from "../../core/entities/decision"
import { PolicyRequest } from '../../core/entities/policy-request'
import { PDP } from "../PDP";

type AllowedActions = "GET" | "POST" | "PUT" | "DELETE"

export interface RequestDTO {
    resource: { [key: string]: any }, 
    subject: { [key: string]: any }, 
    context: { [key: string]: any },
    action: { [key: string]: any }
} 

export class PEP {
    /**
     * The PEP or Policy Enforcement Point: it is responsible for protecting the apps & data you want to apply ABAC to. 
     * The PEP inspects the request and generates an authorization request from it which it sends to the PDP.
     */
    constructor(private readonly policyDecisionPoint: PDP) {}

    private createActionField(action: AllowedActions): { [key: string]: any } {
        const actions = {
            GET: {
                query: 'get'
            },
            POST: {
                mutation: 'post'
            },
            PUT: {
                mutation: 'put'
            },
            DELETE: {
                mutation: 'delete'
            }
        }
        return actions[action] ?? {}
    }

    public async enforce(input: { request: RequestDTO, policiesName: string[] }): Promise<{ decision: Decision }> {

        const policyRequest = PolicyRequest.create({
            actions: this.createActionField(input.request?.action?.method),
            resource: {
                ...input.request['resource']
            },
            subjects: {
                role: 'user',
                ...input.request['subject']
            },
            context: {
                requestTime: new Date(),
                ...input.request['context'],
            }
        })

        const { decision } = await this.policyDecisionPoint.evaluate({ policiesName: input.policiesName, policyRequest })

        return { decision }
    }
}