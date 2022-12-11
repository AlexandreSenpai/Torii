import { PIP } from "../PIP";

import { Decision, Grant } from '../../core/entities/decision'
import { Expressions } from '../../expressions'
import { Policy } from "../../core/entities/policy";
import { PolicyRequest } from "../../core/entities/policyRequest";

export class PDP {
    /**
     * The PDP or Policy Decision Point is the brain of the architecture. 
     * This is the piece which evaluates incoming requests against policies it has been configured with. 
     * The PDP returns a Permit/ Deny decision. The PDP may also use PIPs to retrieve missing metadata
     */
    constructor(private readonly policyInformationPoint: PIP) {}

    public checkField(input: { fieldKey: string, field: { [key: string]: any }, policyRequest: PolicyRequest }): { grant: boolean, reason: string } {
        for(const field in input.field) {
            const expressionIdentifier = input.field[field].expression;
            const expressionFunction = Expressions.getExpression({ expressionValue: expressionIdentifier })
            
            if(!expressionFunction) return { grant: false, 
                                             reason: `'${field}' inexistent expression.` }

            const subjectValuePath = input.field[field].value

            if(subjectValuePath.startsWith("$.")) {

                const path = [...subjectValuePath.replace('$.', '').split(".")]

                // this expression goes through the policy request fields and returns the value based on the path array
                // e.g: ['subjects', 'email']
                // { subjects: { email: 'teste' } }
                // { email: 'teste' }
                // subjectValue = teste

                const subjectValue = path.reduce((current_object_value, next_object_key) => {
                    if(!current_object_value) return null
                    return current_object_value[next_object_key]
                }, input.policyRequest.props)

                if(!expressionFunction({ value: input.policyRequest.props[input.fieldKey][field], compareTo: subjectValue })) return { grant: false, 
                                                                                                                                       reason: `You're not allowed to access this route because '${field}' does not match the expression.` }
                
            }else{
                if(!expressionFunction({ value: input.policyRequest.props[input.fieldKey][field], compareTo: input.field[field].value })) return { grant: false, 
                                                                                                                                                   reason: `You're not allowed to access this route because '${field}' does not match the expression.` }
            }
        }

        return { grant: true, reason: undefined }
    }

    public checkPolicyIfPolicyAppliesTo(input: { policy: Policy, policyRequest: PolicyRequest }): boolean {
        const { role } = input.policyRequest.props.subjects
        const appliesTo = input.policy.props.appliesTo ?? []
        if (appliesTo.includes(role) || appliesTo.includes("*")) return true
        else return false;
    }
    
    public checkPolicyEffect(input: { effect: string }): { grant: boolean, reason: string[] } {
        if (input.effect === 'allow') return { grant: true, reason: undefined };
        else return { grant: false, reason: ['The policy effect is deny'] };
    }

    public checkPolicyFields(input: { policy: Policy, policyRequest: PolicyRequest }): { grant: boolean, reason: string[] } {
        const { subjects, resource, context, actions, effect } = input.policy.props;

        const { grant: actionsGrant, reason: actionsReason } = this.checkField({ fieldKey: 'actions', field: actions, policyRequest: input.policyRequest });
        const { grant: subjectGrant, reason: subjectReason } = this.checkField({ fieldKey: 'subjects', field: subjects, policyRequest: input.policyRequest });
        const { grant: resourceGrant, reason: resourceReason } = this.checkField({ fieldKey: 'resource', field: resource, policyRequest: input.policyRequest });
        const { grant: contextGrant, reason: contextReason } = this.checkField({ fieldKey: 'context', field: context, policyRequest: input.policyRequest });

        const fieldChecks = actionsGrant && subjectGrant && resourceGrant && contextGrant;

        // if the checks returns true, we have to check the policy effect
        // if the policy effect is deny, we return false
        // if the policy effect is allow, we return true
        if(fieldChecks) return this.checkPolicyEffect({ effect: effect })
        else return { grant: fieldChecks, reason: [actionsReason, subjectReason, resourceReason, contextReason] }
    }

    
    public async evaluate(input: { policiesName?: string[], roles?: string[], policyRequest: PolicyRequest }): Promise<{ decision: Decision }> {
        
        let policies: Policy[] = []

        if(input.policiesName && input.policiesName.length > 0) {
            const policiesList = await this.policyInformationPoint.retrievePoliciesFromDatabase({ policiesNames: input.policiesName })
            policies = policiesList.policies.filter(policy => this.checkPolicyIfPolicyAppliesTo({ policy: policy, policyRequest: input.policyRequest }))
        } else if(input.roles && input.roles.length > 0) {
            const { roles } = await this.policyInformationPoint.retrieveRolesFromDatabase({ roles: input.roles })
            const policiesThatApplies = roles.map(role =>
                role.props.policies.map(policy => {
                    const policyInstance = Policy.create(policy)
                    if(this.checkPolicyIfPolicyAppliesTo({ policy: policyInstance, policyRequest: input.policyRequest })) return policyInstance
                })
            ).flat()
            policies = policiesThatApplies
        } else {
            return { decision: Decision.create({ grant: Grant.Deny, context: input.policyRequest.props, reason: ['You\'re not allowed to access this route.'] }) }
        }

        if(policies.length === 0) return { decision: Decision.create({ grant: Grant.Deny, context: input.policyRequest.props, reason: ['You\'re not allowed to access this route.'] })}

        const policiesEvaluation = policies.map(policy => this.checkPolicyFields({ policy, policyRequest: input.policyRequest }));
        const reasons = policiesEvaluation.map(policy => policy.reason);
        const grants = policiesEvaluation.map(policy => policy.grant);

        const filteredReasons = reasons.flat().filter(reason => reason)

        if(grants.includes(false)) return { decision: Decision.create({ grant: Grant.Deny, context: input.policyRequest.props, reason: filteredReasons }) }
        else return { decision: Decision.create({ grant: Grant.Allow, context: input.policyRequest.props, reason: undefined }) }
    }
}