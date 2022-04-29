import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FoundIssueModal({open, setOpen, messagePayload, isWelcome, setEnabled, fullHeightClick, isMobile, isPlayerReady }) {
    // const [open, setOpen] = React.useState(false);
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const [checked, setChecked] = React.useState(false)
    const handleClose = () => {
        setOpen(false);
        if (!!isWelcome) {
            !!isMobile && fullHeightClick();
            setEnabled(true);
            localStorage.setItem('showTour', !checked);
        }
    };

    const onHandleChange = () => {
        setChecked(!checked)
    }
    
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
                    {!!isWelcome &&
                        <div className="dontShowBlock">
                            <label htmlFor="dontShow">
                                Don`t show again
                            </label>
                            <input id="dontShow" type="checkbox" onChange={onHandleChange} />
                        </div>
                    }
                </DialogContent>
            </Dialog>
        </>
    );
}