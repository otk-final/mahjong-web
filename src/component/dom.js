export function setReadyCss(dom){
    dom.style.position = 'relative'
    dom.style.top = '-20px'
}

export function removeReadyCss(dom) {
    dom.style.position = 'unset'
    dom.style.top = '0px'
}
