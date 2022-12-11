import { Entity } from "./entity";
import { PolicyRequestProps } from "./policyRequest";

export interface DecisionProps {
    grant: boolean
    context: PolicyRequestProps
    reason: string[]
}

export class Grant {
    static Deny = false
    static Allow = true
}

export class Decision extends Entity<DecisionProps> {
    constructor(props: DecisionProps) {
        super(props);
    }

    static create(props: DecisionProps): Decision {
        return new Decision(props);
    }
}