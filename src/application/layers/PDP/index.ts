import { PIP } from "../PIP";
import { Decision, Grant } from '../../core/entities/decision'
import { AllowedExpressions, Expressions } from "../../expressions";
import { Policy } from "../../core/entities/policy";
import { AllowedFieldKeys, PolicyRequest } from "../../core/entities/policy-request";

export class PDP {
    /**
     * The PDP or Policy Decision Point is the brain of the architecture. 
     * This is the piece which evaluates incoming requests against policies it has been configured with. 
     * The PDP returns a Permit/ Deny decision. The PDP may also use PIPs to retrieve missing metadata
     */
    constructor(
        private readonly policyInformationPoint: PIP, 
        private readonly expressions: Expressions
    ) {}

    public checkAttributeField(input: { 
        fieldKey: AllowedFieldKeys, 
        policyAttrField: Record<string, { value?: any; expression: string; }>, 
        policyRequest: PolicyRequest }): { grant: boolean, reason: string } {
        
        for(const field in input.policyAttrField ?? []) {
            const expressionIdentifier = input.policyAttrField[field]?.expression;
            const policyRequestField = input.policyRequest.data()[input.fieldKey][field];
            const expressionFunction = this.expressions.getExpression({ expressionName: expressionIdentifier as AllowedExpressions });
            
            if(!expressionFunction) return { grant: Grant.DENY, 
                                             reason: `'${field}' inexistent expression.` }

            const subjectValuePath = input.policyAttrField[field].value

            if(!subjectValuePath?.startsWith?.("$.")) {

                const evaluation = expressionFunction({ value: policyRequestField, compareTo: input.policyAttrField[field].value })

                if(evaluation) {
                    return {
                        grant: Grant.ALLOW,
                        reason: ""
                    }
                }

                return { 
                    grant: Grant.DENY,
                    reason: `You're not allowed to access this route because '${field}' does not match the expression.` 
                }
            }

            const path = [...subjectValuePath.replace('$.', '').split(".")]

            // this expression goes through the policy request fields and returns the value based on the path array
            // e.g: ['subjects', 'email']
            // { subjects: { email: 'teste' } }
            // { email: 'teste' }
            // subjectValue = teste

            const subjectValue = path.reduce((current_object_value, next_object_key) => {
                if(!current_object_value) return null
                return current_object_value[next_object_key]
            }, input.policyRequest.data())

            if(!expressionFunction({ value: policyRequestField, compareTo: subjectValue })) {
                return { 
                    grant: Grant.DENY, 
                    reason: `You're not allowed to access this route because '${field}' does not match the expression.` 
                }
            }
        }

        return { grant: Grant.ALLOW, reason: "" }
    }

    public checkPolicyIfPolicyAppliesTo(input: { policy: Policy, policyRequest: PolicyRequest }): boolean {
        const { role } = input.policyRequest?.data()?.subjects
        const appliesTo = input.policy?.data()?.appliesTo ?? []
        if (appliesTo.includes(role) || appliesTo.includes("*")) return Grant.ALLOW
        else return false;
    }
    
    public checkPolicyEffect(input: { effect: string }): { grant: boolean, reason: string[] } {
        if (input.effect === 'allow') return { grant: Grant.ALLOW, reason: [] };
        else return { grant: Grant.DENY, reason: ['The policy effect is deny'] };
    }

    public checkPolicyFields(input: { policy: Policy, policyRequest: PolicyRequest }): { grant: boolean, reason: string[] } {
        const { subjects, resource, context, actions, effect } = input.policy.data();

        const { grant: actionsGrant, reason: actionsReason } = this.checkAttributeField({ fieldKey: 'actions', policyAttrField: actions, policyRequest: input.policyRequest });
        const { grant: subjectGrant, reason: subjectReason } = this.checkAttributeField({ fieldKey: 'subjects', policyAttrField: subjects, policyRequest: input.policyRequest });
        const { grant: resourceGrant, reason: resourceReason } = this.checkAttributeField({ fieldKey: 'resource', policyAttrField: resource, policyRequest: input.policyRequest });
        const { grant: contextGrant, reason: contextReason } = this.checkAttributeField({ fieldKey: 'context', policyAttrField: context, policyRequest: input.policyRequest });

        const fieldChecks = actionsGrant && subjectGrant && resourceGrant && contextGrant;

        // if the checks returns true, we have to check the policy effect
        // if the policy effect is deny, we return false
        // if the policy effect is allow, we return true
        if(fieldChecks) return this.checkPolicyEffect({ effect: effect })
        else return { grant: fieldChecks, reason: [actionsReason, subjectReason, resourceReason, contextReason] }
    }

    
    public async evaluate(input: { policiesName: string[], policyRequest: PolicyRequest }): Promise<{ decision: Decision }> {

        if(input.policiesName?.length === 0) return { 
            decision: Decision.create({ 
                grant: Grant.DENY, 
                context: input.policyRequest.data(), 
                reason: ['You\'re not allowed to access this route because there\'s no policy attached to it.'] 
            }) 
        }

        const policiesList = await this.policyInformationPoint.retrievePoliciesFromDatabase({ policiesNames: input.policiesName });
        const policies = policiesList.policies.filter(policy => this.checkPolicyIfPolicyAppliesTo({ policy: policy, policyRequest: input.policyRequest }));

        if(policies.length === 0) return { 
            decision: Decision.create({ 
                grant: Grant.DENY, 
                context: input.policyRequest.data(), 
                reason: ['You\'re not allowed to access this route because there\'s no policy attached to it that matches with your role.'] 
            }) 
        }

        const policiesEvaluation = policies.map(policy => this.checkPolicyFields({ policy, policyRequest: input.policyRequest }));
        const reasons = policiesEvaluation.map(policy => policy.reason);
        const grants = policiesEvaluation.map(policy => policy.grant);

        const filteredReasons = reasons.flat().filter(reason => reason)

        if(grants.includes(false)) return { decision: Decision.create({ grant: Grant.DENY, context: input.policyRequest.data(), reason: filteredReasons }) }
        else return { decision: Decision.create({ grant: Grant.ALLOW, context: input.policyRequest.data(), reason: [] }) }
    }
}