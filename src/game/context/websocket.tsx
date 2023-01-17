
import { GameContext } from '.'

export class NetConnect {

    socket: any
    setNetOk: any
    healthInterval: any

    roomCtx: GameContext

    constructor(roomCtx: GameContext, setNetOk: any) {
        this.roomCtx = roomCtx
        this.setNetOk = setNetOk
    }

    start(roomId: number): boolean {
        // 创建连接
        try {
            this.socket = new WebSocket("ws://localhost:7070/ws/" + roomId)
        } catch (e) {
            console.error('websocket err', e)
            return false
        }

        this.socket.onopen = this.onopen
        this.socket.onmessage = this.onmessage
        this.socket.oncolse = this.oncolse

        // 心跳
        this.healthInterval = setInterval(() => {
            if (this.socket && this.socket.readyState !== 1) {
                this.socket.close();
            }
            this.setNetOk(false)
            clearInterval(this.healthInterval);
        }, 500)

        return true
    }

    private onopen() {

    }

    private onmessage(data: any) {
        //事件路由

    }

    private oncolse(event: any) {

    }

    destory() {
        if (this.healthInterval) {
            clearInterval(this.healthInterval)
        }

        if (this.socket) {
            this.socket.close()
        }
    }
}
