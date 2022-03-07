import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function ResetModal({open, setOpen, onConfirm, messagePayload }) {

    const handleClose = () => {
        setOpen(false);
    };
    
    const yesHandler = () => {
        onConfirm()
        setOpen(false);
    }
    return (
        <>
            <Dialog open={open} onClose={handleClose} container={document.getElementById('tk--link-builder-root-styles')}>
                <DialogTitle>
                    <div className="modal-headers">
                        <div className="modal-title">
                            {messagePayload.title}
                        </div>
                        <div className="close-modal modal-title">
                            <span onClick={handleClose}>X</span>
                        </div>
                    </div>
                </DialogTitle>
                
                <DialogContent>
                    <div className="dialog_content">
                        <h5>{messagePayload.subTitle}</h5>
                        <p>{messagePayload.body}</p>
                    </div>
                    <br/>
                    <div className="d-flex flex-buttons Item-inner-buttons" style={{ justifyContent: 'space-around' }}>
                        <div className="button-style button-style-inverted" style={{ width: '30%'}} onClick={yesHandler}>
                            Yes
                        </div>
                        <div className="button-style" style={{ width: '30%'}} onClick={() => { setOpen(false) }}>
                            No
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}