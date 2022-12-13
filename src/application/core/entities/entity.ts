import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export type PropsWithDefaultFields<Props> = Props & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

export class Entity<InputProps, OutputProps> {
    
    public id: string
    public createdAt: Date
    public updatedAt: Date
    protected props: OutputProps
    
    constructor(props: InputProps, schema: z.Schema, id?: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id ?? uuidv4();
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
        this.props = schema.parse(props)
    }

    data() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ...this.props
        }
    }
}