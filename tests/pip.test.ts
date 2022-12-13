// import { Policy } from "../src/application/core/entities/policy";
// import { PIP } from "../src/application/layers/PIP"
// import { InMemoryPolicyRepository } from "../src/infra/adapters/database/repositories/inMemoryPolicyRepository";
// import { InMemoryRoleRepository } from "../src/infra/adapters/database/repositories/inMemoryRoleRepository";

// it('need to find policy on database successfully', async () => {
//     const sut = new PIP(
//         new InMemoryPolicyRepository(),
//         new InMemoryRoleRepository()
//     );
//     const policiesNames = ['policy1', 'policy2'];
//     const { policies } = await sut.retrievePoliciesFromDatabase({ policiesNames });
//     expect(policies.length).toBe(2);
//     expect(policies[0]).toBeInstanceOf(Policy);
// })