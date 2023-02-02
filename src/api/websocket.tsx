export interface NetAuthor {
    userId: string,
    userName: string,
    token: string
}

export class NetConnect {

    socketAddress!: string
    author: NetAuthor
    socket: any

    constructor(author: NetAuthor) {
        this.author = author
    }


    conn(address: string) {
        const subp = [
            "userId=" + this.author.userId,
            "userName=" + this.author.userName,
            "token=" + this.author.token]

        //建立连接
        let socket = new WebSocket(address)
        socket.onmessage = (data: any) => {
            this.consumers[''](data)
        }
        socket.onopen = (event: any) => {
            this.retryCount = 0
            this.retryLock = false
            if (this.callOpen) this.callOpen(event)
        }
        socket.onerror = (err: any) => {
            this.retryLock = false
            if (this.callError) this.callError(err)
        }
        socket.onclose = (event: any) => {
            if (this.callClose) this.callClose(event)
        }

        this.socketAddress = address
        this.socket = socket
    }


    consumers: any = {}
    subscribe(key: string, call: any) {
        this.consumers[key] = call
    }

    callOpen: any
    onopen(call: any) {
        this.callOpen = call
    }

    callClose: any
    onclose(call: any) {
        this.callClose = call
    }

    callError: any
    onerror(call: any) {
        this.callError = call
    }


    // 重试
    retryLock: boolean = false
    retryTimer: any
    retryCount: number = 0
    retry(max: number) {
        if (this.retryLock || this.retryCount >= max) {
            return
        }
        let state = this.socket.readyState
        if (state === WebSocket.CONNECTING || state === WebSocket.OPEN) {
            return
        }
        this.retryLock = true
        this.retryCount++
        if (this.retryTimer) clearInterval(this.retryTimer)

        console.info('retry', this.retryCount)
        const that = this
        this.retryTimer = setTimeout(() => {
            that.conn(that.socketAddress)
        }, 3000)
    }
}
