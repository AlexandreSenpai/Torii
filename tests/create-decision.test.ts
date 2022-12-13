import { describe, it, assert, expect } from 'vitest';
import { ZodError } from 'zod';
import { Decision } from '../src/application/core/entities/decision'

describe("Decision", () => {
    it("should create an instance with the correct properties", () => {
        const decision = Decision.create({
            context: {
                actions: {
                    read: {
                        value: 'get',
                        expression: 'equalTo'
                    }
                },
                subjects: {},
                context: {},
                resource: {}
            },
            grant: true,
            reason: ["user is authorized"]
        }).data();

        assert.equal(decision.grant, true);
        assert.deepEqual(decision.context, {
            resource: {},
            context: {},
            subjects: {},
            actions: {
                read: {
                    value: 'get',
                    expression: 'equalTo'
                }
            }
        });
        assert.deepEqual(decision.reason, ["user is authorized"]);
    });

    it("should create an instance with default fields", () => {
        const decision = Decision.create({
            context: {
                actions: {
                    read: {
                        value: 'get',
                        expression: 'equalTo'
                    }
                },
                subjects: {},
                context: {},
                resource: {}
            },
            grant: true,
            reason: ["user is authorized"]
        }).data();


        assert.isDefined(decision.id);
        assert.isDefined(decision.createdAt);
        assert.isDefined(decision.updatedAt);
    });

    it("should throw error when creating an instance with incorrect grant type", () => {
        try {
            console.log(Decision.create({
                context: {
                    actions: {
                        read: {
                            value: 'get',
                            expression: 'equalTo'
                        }
                    },
                    subjects: {},
                    context: {},
                    resource: {}
                },
                grant: "parsa kjasdaiwj",
                reason: []
            }))           

            throw new Error('Should not reach this line.');
        } catch (err) {
            expect(err).toBeInstanceOf(ZodError)
        }
    });
});
