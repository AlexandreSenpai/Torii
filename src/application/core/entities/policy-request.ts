import { z } from "zod";
import { Entity, PropsWithDefaultFields } from "./entity";

export const policyRequestSchema = z.object({
    actions: z.record(z.any()),
    context: z.record(z.any()),
    resource: z.record(z.any()),
    subjects: z.record(z.any())
})

const PolicyRequestSchemaInput = policyRequestSchema._input;
const PolicyRequestSchemaOutput = policyRequestSchema._output;

export type AllowedFieldKeys = "actions" | "context" | "resource" | "subjects";

export class PolicyRequest extends Entity<typeof PolicyRequestSchemaInput, typeof PolicyRequestSchemaOutput> {
    private constructor(props: typeof PolicyRequestSchemaInput, id?: string, createdAt?: Date, updatedAt?: Date) {
        super(props, policyRequestSchema, id, createdAt, updatedAt)
    }

    public static create(data: PropsWithDefaultFields<typeof PolicyRequestSchemaInput>): PolicyRequest {

        const { id, createdAt, updatedAt, ...props } = data;

        return new PolicyRequest(props, id, createdAt, updatedAt);
    }
}