import { PEP } from './layers/PEP'
import { PDP } from './layers/PDP'
import { PIP } from './layers/PIP'
import { IDatabaseRepository } from '../infra/adapters/database/repositories/IDatabaseRepository'

export class ABAC{
    private logic: PEP

    constructor(input: { 
        policyRepository: IDatabaseRepository
    }){
        this.logic = new PEP(
            new PDP(
                new PIP(
                    input.policyRepository,
                    input.roleRepository
                )
            )
        )
    }

    public getAuthLogic(): PEP {
        return this.logic
    }

}