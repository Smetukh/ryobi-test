import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FoundIssueModal({open, setOpen, messagePayload }) {
    // const [open, setOpen] = React.useState(false);
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
            {/*<Button variant="outlined" onClick={handleClickOpen} className='issue_dialog'>
                Found an Issue Dialog
            </Button>*/}

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
                    
                </DialogContent>

                

            </Dialog>
        </>
    );
}