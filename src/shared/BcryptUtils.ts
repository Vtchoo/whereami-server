import bcrypt from 'bcrypt'

class BcryptUtils {

    static async getHashedString(string: string) {
        
        const minimalCost = Number(process.env.BCRYPT_MIN_SALT_ROUNDS) || 10
        const cost = await BcryptUtils.CalculateIdealCost(minimalCost)
        const salt = await bcrypt.genSalt(cost)
        const hashedString = await bcrypt.hash(string, salt)

        return hashedString
    }

    static async CalculateIdealCost(minimalCost: number) {
        
        let cost = minimalCost

        const startDecryption = new Date().getTime()
        const hash = await bcrypt.hash("userpassword", cost)
        const endDecryption = new Date().getTime()

        // console.log(endDecryption - startDecryption)
        
        let durationMS = (endDecryption - startDecryption)
        
        while (durationMS < 250)
        {
            cost += 1
            durationMS *= 2
        }

        return cost
    }
}

export default BcryptUtils