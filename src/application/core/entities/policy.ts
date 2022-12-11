import { Entity } from "./entity";

export interface PolicyProps {
    id: string
    updatedAt: string,
    createdAt: string,
    name: string
    description: string
    effect: string
    appliesTo: string[]
    actions: { 
        [key: string]: {
            expression: string,
            value: any
        }
    },
    subjects: { 
        [key: string]: {
            expression: string,
            value: any
        }
    },
    resource: {
        [key: string]: {
            expression: string,
            value: any
        }
    },
    context: {
        [key: string]: {
            expression: string,
            value: any
        }
    }
}

export class Policy extends Entity<PolicyProps> {
    private constructor(props: PolicyProps, id: string, interactionTime: Date) {
        super(props, id, interactionTime)
    }

    public static create(props: PolicyProps): Policy {
        return new Policy(props, props.id, new Date(props.updatedAt))
    }
}