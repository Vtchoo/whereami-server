

interface LoginAttempts {
    [ip: string]: {
        count: number,
        lastAttempt: Date
        forget: NodeJS.Timeout
    }
}

interface IpStatus {
    isAllowed: boolean
    wait?: number
}

class BruteForceProtection {


    static loginAttempts: LoginAttempts = {}

    static readonly baseTime = 15 // seconds
    static readonly factor = 2 // multiplication of wait time after each unsuccessful attempt
    static readonly tolerance = 5 // # of attempts before blocking
    static readonly forgetTimeInMinutes = 60 // minutes


    /**
     * Get current IP access status
     * @param ip User's IP address
     * @returns IP's status
     */
    static getIpStatus(ip: string): IpStatus {

        if (!this.loginAttempts[ip] || this.loginAttempts[ip].count < this.tolerance) return { isAllowed: true }
            
        const { lastAttempt, count } = this.loginAttempts[ip]

        const waitTime = this.getWaitTime(count)

        const limit = new Date(lastAttempt)
        limit.setSeconds(limit.getSeconds() + waitTime)

        const status: IpStatus = { isAllowed: new Date() > limit }

        if (new Date() < limit)
            status.wait = Math.floor((limit.getTime() - new Date().getTime()) / 1000) + 1
        
        return status
    }

    /**
     * Add new failed attempt to register
     * @param ip User's IP address
     */
    static registerFailedAttempt(ip: string) {
        
        if (!this.loginAttempts[ip]) {
            
            this.loginAttempts[ip] = {
                count: 0,
                lastAttempt: new Date(),
                forget: setTimeout(() => this.resetIpStatus(ip), this.forgetTimeInMinutes * 60 * 1000)
            }

        } else {

            const attempt = this.loginAttempts[ip]

            attempt.count++
            attempt.lastAttempt = new Date()
            clearTimeout(attempt.forget)
            attempt.forget = setTimeout(
                () => this.resetIpStatus(ip),
                (this.getWaitTime(attempt.count) + this.forgetTimeInMinutes * 60) * 1000
            )
        }
    }

    static resetIpStatus(ip: string) { delete this.loginAttempts[ip] }

    private static getWaitTime(attempts: number) {
        
        if(attempts < this.tolerance) return 0

        return this.baseTime * Math.pow(this.factor, attempts - this.tolerance)
    }
}

export default BruteForceProtection
