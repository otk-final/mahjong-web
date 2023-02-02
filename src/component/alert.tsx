
import React, { Ref, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

export const NotifyAlert = forwardRef(function Alert(props: any, ref: Ref<any>) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const NotifyArea: React.FC = () => {
    let notifyRef = useRef()
    return (
        <NotifyBar ref={notifyRef} />
    )
}

export const NotifyBar = forwardRef((props: {}, ref: Ref<any>) => {
    const notifyCtx = useContext<NotifyBus>(NotifyContext)

    const defaultOpen = {
        open: false,
        severity: 'success',
        message: ''
    }

    const [stateOpen, setOpen] = useState<{ open: boolean, severity: string, message: string }>(defaultOpen);
    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen({ ...stateOpen, open: false });
    };

    useImperativeHandle(ref, () => ({
        show: (severity: string, msg: string) => {
            setOpen({ open: true, severity: severity, message: msg })
        }
    }))

    notifyCtx.bindRef(ref)
    const alertRef = useRef()
    return (
        <Snackbar open={stateOpen.open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleClose}>
            <NotifyAlert severity={stateOpen.severity} sx={{ width: '100%' }} ref={alertRef} onClose={handleClose}>
                {stateOpen.message}
            </NotifyAlert>
        </Snackbar>
    )
})

export class NotifyBus {

    snackbarRef: any
    bindRef(ref: any) {
        this.snackbarRef = ref
    }

    info(msg: string) {
        this.snackbarRef.current.show('info', msg)
    }
    error(msg: string) {
        this.snackbarRef.current.show('error', msg)
    }
    warn(msg: string) {
        this.snackbarRef.current.show('warning', msg)
    }
    success(msg: string) {
        this.snackbarRef.current.show('success', msg)
    }
}

export const NotifyContext = React.createContext<NotifyBus>(new NotifyBus())
