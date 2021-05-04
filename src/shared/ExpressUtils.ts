import { NextFunction, Request, Response } from "express"

declare global {
    namespace Express{
        interface Response {
            error: (status: number, message: string, payload?: any) => Response
        }
    }
}

class ExpressUtils {

    static httpErrorHandler(req: Request, res: Response, next: NextFunction) {
        res.error = (status: number, message?: string, payload?: any) => {
            
            if (!message && !payload) return res.sendStatus(status)

            const json: any = { message }

            if (payload) json.data = payload
            
            return res.status(status).json(json)
        }

        next()
    }

    static cookieParser(req: Request, res: Response, next: NextFunction) {

        const rawCookies = req.headers.cookie
        
        // Initialize cookies object
        req.cookies = {}
    
        const cookieList = rawCookies?.split(';')
    
        cookieList?.forEach(cookie => {
            const [key, value] = cookie.trim().split('=')
            req.cookies[key] = value
        })
    
        next()
    }
}

export default ExpressUtils