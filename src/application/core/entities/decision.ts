import { z } from "zod";
import { Entity, PropsWithDefaultFields } from "./entity";
import { policyRequestSchema } from "./policy-request";

export class Grant {
    static readonly ALLOW = true
    static readonly DENY = false
}

export const decisionSchema = z.object({
    grant: z.boolean(),
    context: policyRequestSchema, 
    reason: z.array(z.any().transform(val => String(val)))
})

const DecisionSchemaInput = decisionSchema._input;
const DecisionSchemaOutput = decisionSchema._output;

export class Decision extends Entity<typeof DecisionSchemaInput, typeof DecisionSchemaOutput> {
    constructor(props: typeof DecisionSchemaInput, id?: string, createdAt?: Date, updatedAt?: Date) {
        super(props, decisionSchema, id, createdAt, updatedAt);
    }

    static create(data: PropsWithDefaultFields<typeof DecisionSchemaInput>): Decision {
        const { id, createdAt, updatedAt, ...props } = data;

        return new Decision(props, id, createdAt, updatedAt);
    }
}