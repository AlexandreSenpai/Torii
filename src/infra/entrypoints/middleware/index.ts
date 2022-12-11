import { Request, Response, NextFunction } from 'express'
import { ABAC } from '../../../application' 
import { decode, JwtPayload } from 'jsonwebtoken'

function middleware(input: { ABACInstance: ABAC, policiesNames?: string[] }) {
    function decodeJWT({ jwt }: { jwt: string }): JwtPayload | string | null {
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
        
        request['subject'] = decodeJWT({ jwt: request?.headers?.authorization })

        if(request['subject'] === null) return response.status(401).json({
            message: "Access denied.",
            status: 401,
            reason: [
                'You must include an JWT Bearer Authorization token.'
            ]
        })

        request['context'] = { ...request.params, ...request.query }

        enforcement.enforce({ request: request, policiesName: input.policiesNames }).then(decision => {
            const { grant, reason } = decision.decision.props
            if(grant) next()
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