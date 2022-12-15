import { Entity, PropsWithDefaultFields } from "./entity";
import { z } from "zod";

const policySchema = z.object({
    name: z.string().transform(val => String(val)),
    description: z.string().nullable(),
    effect: z.enum(['allow', 'deny']),
    appliesTo: z.array(z.string()).transform(array => array.map(val => String(val))),
    actions: z.record(z.object({
        expression: z.string(),
        value: z.any()
    })),
    subjects: z.record(z.object({
        expression: z.string(),
        value: z.any()
    })),
    resource: z.record(z.object({
        expression: z.string(),
        value: z.any()
    })),
    context: z.record(z.object({
        expression: z.string(),
        value: z.any()
    }))
});

const PolicySchemaInput = policySchema._input;
const PolicySchemaOutput = policySchema._output;

export class Policy extends Entity<typeof PolicySchemaInput, typeof PolicySchemaOutput> {
    private constructor(props: typeof PolicySchemaInput, id?: string, createdAt?: Date, updatedAt?: Date) {
        super(props, policySchema, id, createdAt, updatedAt);
    }

    public static create(data: PropsWithDefaultFields<typeof PolicySchemaInput>): Policy {
        const { id, createdAt, updatedAt, ...props } = data;

        return new Policy(props, id, createdAt, updatedAt);
    }
}