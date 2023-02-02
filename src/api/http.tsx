import axios from 'axios'
import { NetAuthor } from './websocket'

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


let http = function (method: string, path: string, params: any, headers?: any) {
    return new Promise((resolve, reject) => {
        //get or ?
        var req: any = {
            url: path,
            method: method,
            headers: headers
        }
        method === 'get' ? req.params = params : req.data = params
        defaultAxios(req).then(res => {
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

const authorHeaders: any = {
    'a': {
        userId: 'a',
        userName: encodeURIComponent('张三'),
        token: GUID()
    },
    'b': {
        userId: 'a',
        userName: encodeURIComponent('李四'),
        token: GUID()
    },
    'c': {
        userId: 'c',
        userName: encodeURIComponent('王五'),
        token: GUID()
    },
    'd': {
        userId: 'd',
        userName: encodeURIComponent('赵六'),
        token: GUID()
    }
}

export const MockAuthor = function (autorKey: string): NetAuthor {
    return authorHeaders[autorKey]
}


function GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
}

export const roomProxy = function (autorKey: string) {
    const header = authorHeaders[autorKey]
    return {
        create: (data: any) => {
            return http('post', '/room/create', data, header)
        },
        join: (data: any) => {
            return http('post', '/room/join', data, header)
        },
        exit: (data: any) => {
            return http('post', '/room/exit', data, header)
        }
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
