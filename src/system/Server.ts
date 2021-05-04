class Server {

    static logAction(user: string, action: string) {

        const date = new Date()

        const day = date.getDay().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().padStart(2, '0')

        const hour = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        console.log(`[${day}/${month}/${year} ${hour}:${minutes}] ${user} - ${action}`)
    } 
}

class AppError extends Error {

    status: number

    constructor(status: number, message: string) {
        super(message)

        this.status = status
    }
}

export default Server
export { AppError }