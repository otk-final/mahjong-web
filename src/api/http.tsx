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

        const vs = getVisitor()
        let headers = {}
        if (vs) {
            headers = {userId: vs.uid,token: vs.token}
        }

        //get or ?
        var req: any = {
            url: path,
            method: method,
            headers: headers
        }
        method === 'get' ? req.params = params : req.data = params
        defaultAxios(req).then(res => {
            if (res.data.code !== '200') {
                reject(res.data.message)
            } else {
                resolve(res.data)
            }
        }).catch(err => {
            reject(err.message)
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
    },
    visitor: (data: any) => {
        return http('post', '/room/visitor', data)
    },
    compute: (data: any) => {
        return http('post', '/room/compute', data)
    }
}

export const getVisitor = function (): any | undefined {
    const jsonText =  localStorage.getItem('visitor')
    return JSON.parse(jsonText!)
}

export const storeVisitor = function (visitor: any) {
    localStorage.setItem('visitor', JSON.stringify(visitor))
}

function GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
}



let gameApi = {
    start: (data: any) => {
        return http('post', '/game/start', data)
    },
    load: (data: any) => {
        return http('post', '/game/load', data)
    },
    robot: (data: any) => {
        return http('post', '/game/robot', data)
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
    },
    ignore: (data: any) => {
        return http('post', '/play/ignore', data)
    }
}



export { roomApi, gameApi, playApi } 
