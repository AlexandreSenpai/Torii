import { Request, Response, NextFunction } from 'express'
import { ABAC } from '../../../application' 
import { decode, JwtPayload } from 'jsonwebtoken'

function middleware(input: { ABACInstance: ABAC, policiesNames: string[] }) {
    function decodeJWT({ jwt }: { jwt?: string }): JwtPayload | string | null {
        if(!jwt) return null

        try {
            const [, token] = jwt.split('Bearer ');
            return decode(token)
        }catch(err){
            return null
        }

    }
    
    const enforcement = input.ABACInstance.getAuthLogic()

    return (request: Request, response: Response, next: NextFunction) => {

        const subject = decodeJWT({ jwt: request?.headers?.authorization })
        const context = { ...request.params, ...request.query, ip: request.ip }
        const resource = { path: request.url }
        const action = { method: request.method }

        if(subject === null) return response.status(401).json({
            message: "Access denied.",
            status: 401,
            reason: [
                'You must include an JWT Bearer Authorization token.'
            ]
        })

        enforcement.enforce({ 
            request: { 
                context,
                subject: subject as Object,
                resource,
                action
            }, 
            policiesName: input.policiesNames 
        }).then(decision => {
            const { grant, reason } = decision.decision.data()
            if(grant) return next();
            else return response.status(403).json({ 
                message: "Access denied.",
                status: 403,
                reason
            })
        })
    }
}

export const can = middleware
export const cannot = middleware