import { Entity } from "./entity";

export interface PolicyRequestProps {
    actions: {
        [key: string]: any
    },
    context: {
        [key: string]: any
    },
    resource: {
        [key: string]: any
    },
    subjects: {
        [key: string]: any
    }
  }

export class PolicyRequest extends Entity<PolicyRequestProps> {
    private constructor(props: PolicyRequestProps, id?: string, interactionTime?: Date) {
        super(props, id, interactionTime)
    }

    public static create(props: PolicyRequestProps, id?: string, interactionTime?: Date): PolicyRequest {
        return new PolicyRequest(props, id, interactionTime)
    }
}