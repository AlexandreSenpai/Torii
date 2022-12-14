# Torii - ABAC Authorization

<center>
  <img src="./docs/image/logo.jpg" width="300" />
  
[![CodeFactor](https://www.codefactor.io/repository/github/alexandresenpai/nhentai-api/badge)](https://www.codefactor.io/repository/github/alexandresenpai/torii)
[![PyPI download month](https://img.shields.io/npm/dm/@torii-auth/authorization?style=flat-square)](https://www.npmjs.com/package/@torii-auth/authorization)
[![codecov](https://codecov.io/gh/AlexandreSenpai/Torii/branch/dev/graph/badge.svg?token=F3LP15DYMR)](https://codecov.io/gh/AlexandreSenpai/Torii)
![NPM Version](https://img.shields.io/npm/v/@torii-auth/authorization?style=flat-square)
![NPM license](https://img.shields.io/npm/l/@torii-auth/authorization?style=flat-square)
</center>

## Authorization Granularity
One of the key benefits of implement ABAC authorization is the possibility of implement granularity without having to create a thousand of roles that will try to filter the permission as possible to achieve what you can do, sometimes with only one security policy.

Using ABAC you can perform boolean expressions, so, validating whether a requester can or not make some action its pretty easy because you can just configure a policy that validates if the current requester has some required attributes, for example, validating whether a partner can read records of others by validating his email domain to see it matches with the current query filter.

Other key benefit is that you cannot need to re-configure someone’s access when change they employee role, for example, because they attributes will change and it will become valid/invalid for the security policy automatically.

## Usage
### Adding Torii Authorization to a project.
This authorization module was built to be able to be configured by route, so, you can go for a gradual implementation.

### Installing Torii Authorization
In this section we’re going to install this module on our application and set this ready to on for one route of our application.

#### Downloading
```bash
yarn add @torii-auth/authorization
```

### Implementing
First of all, you need to create a database repository that will grant permissions for the module to look for policies that it will need to validate the access conditions. You can store the policies in memory and create a in memory repository as well.

#### Database repository implementation

```ts
import { Policy, IDatabaseRepository } from "@torii-auth/authorization";

export class PolicyRepository implements IDatabaseRepository<Policy> {

    constructor(private readonly databaseClient: any) {}

    async findByQuery(input: { conditions: { [key: string]: any; }; }): Promise<Policy[]> {
        return this.databaseClient.find({
          ...input.conditions
        }).map(policy => Policy.create(policy))
    }
}
```

#### Creating policies

To create a security policy the creator has to provide some informations such as context, subject, resource and action.

**Subject**: Information about who’s making the request

**Resource**: Information about what the requester are trying to reach

**Context**: Information about the request context. e.g: ip address, datetime, location

**Action**: Information about the action that the requester are trying to perform. eg: get, post, delete, etc…

```json
{
  effect: "allow", // Policy validation result.
  appliesTo: {
    role: {
      "value": ["editor", "admin"],
      "expression": "includes" 
    },
    user_id: {
      "value": "1234",
      "expression": "equalTo"
    }
  }, // To whom this policy applies. Object keys points to JWT keys.
  actions: {
    query: {
      "value": "GET",
      "expression": "equalTo"
    }
  }, // Action that the requester is allowed to perform: Querys or Mutations
  subjects: {
      role: {
          expression: "equalTo",
          value: "partner"
      },
      partner: {
          expression: "matchesToEmailDomain",
          value: "$.subjects.email"
      }
  }, // Checking requester properties. This field is filled with JWT decode information
  resource: {
      path: {
          expression: "equalTo",
          value: "/orders/rest"
      } // Checking the resource that requester is trying to interact with.
  },
  context: {
      ip: {
          expression: "equalTo",
          value: "::1"
      } // Checking the current context of the requester such as: request date time, ip and more
  }
}
```
At the moment of the request Torii will create a request policy.
```json
{
  "action": "GET",
  "context": {
    "ip": "::1",
    "requestTime": "2022-01-01T00:00:00Z"
  },
  "resource": {
    "path": "/api/notes"
  },
  "subjects": {
      "role": "partner",
      "name": "Alexandre",
      "email": "teste@example.com",
      "organization": "example"
  }
}
```
#### ABAC Instantiation

To apply this implementation as an express middleware, the code should be like the one shown below:
```ts
import { Request, Response, Router, NextFunction } from 'express'
import { ABAC, can } from "@torii-auth/authorization";

const router = Router()

router.get(
  '/api/notes', 
  [
    can({
      ABACInstance: new ABAC({
        policyRepository: new PolicyRepository()
      }),
      policiesNames: ['can-read-notes']
    })
  ],
  (request: Request, response: Response, next: NextFunction) => {
    return ListNoteFactory.create().handle(request, response, next);
  }
)

export { router }
```

After that you can run your application and test passing a jwt token or validating other things that you configured previously on your policy.

The expected response for a blocked request should be something like this:
```json
{
  "message": "Access Denied.",
  "status": 403,
  "reason": [
    "You're not allowed to access this route."
  ]
}
```
or even if the user has the correct permissions but the request doesnt match any condition.
```json
{
  "message": "Access Denied.",
  "status": 403,
  "reason": [
    "You're not allowed to access this route because 'organization' does not match the expression"
  ]
}
```