
import React, { Ref, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export const LoadingArea: React.FC<{ open: boolean }> = ({ open }) => {
    let loadingyRef = useRef()
    return (
        <LoadingBackdrop ref={loadingyRef} open={open} />
    )
}



export const LoadingBackdrop = forwardRef((props: { open: boolean }, ref: Ref<any>) => {
    const loadingCtx = useContext<LoadingBus>(LoadingContext)
    const [stateOpen, setOpen] = useState<boolean>(props.open)

    useImperativeHandle(ref, () => ({
        setOpen: (flag: boolean) => {
            setOpen(flag)
        },
    }))

    loadingCtx.bindRef(ref)
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
    show() {
        this.dropRef.current.setOpen(true)
    }
    hide() {
        this.dropRef.current.setOpen(false)
    }
}

export const LoadingContext = React.createContext<LoadingBus>(new LoadingBus())
