import axios from 'axios'

let serverUrl = "http://localhost:7070"


let defaultAxios = axios.create({
    baseURL: serverUrl,
    timeout: 60000,
    headers: { //即将被发送的自定义请求头
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"
    },
    withCredentials: false //表示跨域请求时是否需要使用凭证
})


let http = function (method: string, path: string, params: any) {
    return new Promise((resolve, reject) => {
        //get or ?
        var req: any = {
            url: path,
            method: method,
            // headers:header
        }
        method === 'get' ? req.params = params : req.data = params
        defaultAxios(req).then((res) => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}


let roomApi = {
    create: (data: any) => {
        return http('post', '/room/create', data)
    },
    join: (data: any) => {
        return http('post', '/room/join', data)
    },
    exit: (data: any) => {
        return http('post', '/room/exit', data)
    }
}


let gameApi = {
    start: (data: any) => {
        return http('post', '/game/start', data)
    },
    load: (data: any) => {
        return http('post', '/game/load', data)
    }
}


let playApi = {
    take: (data: any) => {
        return http('post', '/play/take', data)
    },
    put: (data: any) => {
        return http('post', '/play/put', data)
    },
    race: (data: any) => {
        return http('post', '/play/race', data)
    },
    racePre: (data: any) => {
        return http('post', '/play/race-pre', data)
    },
    win: (data: any) => {
        return http('post', '/play/win', data)
    },
    skip: (data: any) => {
        return http('post', '/play/skip', data)
    }
}



export { roomApi, gameApi, playApi } 
