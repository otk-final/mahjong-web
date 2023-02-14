

const wsAddr = "ws://localhost:7070/ws/"

export class NetConnect {

    visitor!: any
    socket: any
    roomId:string

    constructor(roomId:string, visitor: any) {
        this.roomId = roomId
        this.visitor = visitor
    }


    conn() {
        const subp = [this.visitor.uid, this.visitor.token]

        //建立连接
        let socket = new WebSocket(wsAddr + this.roomId, subp)
        socket.onmessage = (event: any) => {
            const serverEvent = JSON.parse(event.data)
            console.info(serverEvent.eventName, serverEvent.payload)
            this.consumers[serverEvent.event](serverEvent.payload)
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

        this.socket = socket
    }


    consumers: any = {}
    subscribe(key: number, call: any) {
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

        console.info('retry', this.retryCount)

        if (this.retryTimer) clearInterval(this.retryTimer)
        const that = this
        this.retryTimer = setTimeout(() => {
            that.conn()
        }, 3000)
    }

    close() {
        this.socket.close()
    }
}
