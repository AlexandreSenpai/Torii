import { IDatabaseRepository } from "../../../infra/adapters/database/repositories/IDatabaseRepository";
import { Policy } from "../../core/entities/policy";
import { Role } from "../../core/entities/role";

export class PIP {
    /**
     * The PIP or Policy Information Point bridges the PDP to external sources of attributes e.g. LDAP or databases.
     */
    constructor(
        private policyRepository: IDatabaseRepository,
        private roleRepository: IDatabaseRepository    
    ) {}
    
    public async retrievePoliciesFromDatabase(input: { policiesNames: string[] }): Promise<{ policies: Policy[] }> {
        const policies = await this.policyRepository.findByQuery<Policy>({ conditions: { policiesNames: input.policiesNames } });
        return { policies }
    }

    public async retrieveRolesFromDatabase(input: { roles: string[] }): Promise<{ roles: Role[] }> {
        const roles = await this.roleRepository.findByQuery<Role>({ conditions: { roles: input.roles } });
        return { roles }
    }

}