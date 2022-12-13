import { IDatabaseRepository } from '../infra/core/interfaces/repositories/database-repository.base'
import { Policy } from './core/entities/policy'
import { PDP } from './layers/PDP'
import { PEP } from './layers/PEP'
import { PIP } from './layers/PIP'

export class ABAC{
    private logic: PEP

    constructor(input: { 
        policyRepository: IDatabaseRepository<Policy>
    }){
        this.logic = new PEP(
            new PDP(
                new PIP(
                    input.policyRepository
                )
            )
        )
    }

    public getAuthLogic(): PEP {
        return this.logic
    }

}