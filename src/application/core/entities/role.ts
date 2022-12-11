import { Entity } from "./entity";
import { PolicyProps } from "./policy";

export interface RoleProps {
    id: string
    updatedAt: string,
    createdAt: string,
    name: string
    description: string
    policies: PolicyProps[]
}

export class Role extends Entity<RoleProps> {
    private constructor(props: RoleProps, id: string) {
        super(props, id)
    }

    public static create(props: RoleProps): Role {
        return new Role(props, props.id)
    }
}