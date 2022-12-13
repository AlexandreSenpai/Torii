import { IDatabaseRepository } from "../../../infra/core/interfaces/repositories/database-repository.base";
import { Policy } from "../../core/entities/policy";

export class PIP {
    /**
     * The PIP or Policy Information Point bridges the PDP to external sources of attributes e.g. LDAP or databases.
     */
    constructor(
        private policyRepository: IDatabaseRepository<Policy>
    ) {}
    
    public async retrievePoliciesFromDatabase(input: { policiesNames: string[] }): Promise<{ policies: Policy[] }> {
        const policies = await this.policyRepository.findByQuery({ conditions: { policiesNames: input.policiesNames } });
        return { policies }
    }

}