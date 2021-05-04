import crypto from 'crypto'

class CryptoUtils {

    static SHA256 = (string: string) => crypto.createHash('SHA256').update(string).digest('hex')
}

const SHA256 = CryptoUtils.SHA256

export default CryptoUtils
export { SHA256 }
