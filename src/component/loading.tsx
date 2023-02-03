
import React, { Ref, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export const LoadingArea: React.FC = () => {
    let loadingyRef = useRef()
    return (
        <LoadingBackdrop ref={loadingyRef} />
    )
}

export const LoadingBackdrop = forwardRef((props: {}, ref: Ref<any>) => {
    const notifyCtx = useContext<LoadingBus>(LoadingContext)
    const [stateOpen, setOpen] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
        loading: (msg: string) => {
            setOpen(true)
        },
        finish: () => {
            setOpen(false)
        }
    }))

    notifyCtx.bindRef(ref)
    return (
        <React.Fragment>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
                open={stateOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    )
})

export class LoadingBus {

    dropRef: any
    bindRef(ref: any) {
        this.dropRef = ref
    }
    loading(msg: string) {
        this.dropRef.current.loading(msg)
    }
    finish() {

    }
}

export const LoadingContext = React.createContext<LoadingBus>(new LoadingBus())
