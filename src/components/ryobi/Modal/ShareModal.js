import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ShareIcon from '@mui/icons-material/Share';
import { jsPDF } from 'jspdf';
import { FuturaPTMediumFontBase64, FuturaPTBoldFontBase64 } from '../../../assets/FuturaFontBase64';

export default function ShareModal({ shareGlobalState, buyNow, intro }) {
    const [open, setOpen] = React.useState(false);
    
    const [shareUrl, setShareUrl] = React.useState();
    
    const handleClickOpen = async () => {
        const { resumableUrl } = await shareGlobalState()
        setShareUrl(resumableUrl)
        setOpen(true);
        intro.exit();
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const createPdf = (buyNow) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth(); // 210
        const pageHeight = doc.internal.pageSize.getHeight(); // 297
        const pagePaddingX = 20;
        const pagePaddingY = 20;
        const imageWidth = 50;
        const imageHeight = 30;
        const imageMarginRight = 10;
        const rowHeight = 10;
        let xPos = pagePaddingX;
        let yPos = pagePaddingY;
        
        doc.addFileToVFS('FuturaPT-Bold-normal.ttf', FuturaPTBoldFontBase64);
        doc.addFileToVFS('FuturaPT-Medium-normal.ttf', FuturaPTMediumFontBase64);
        doc.addFont('FuturaPT-Bold-normal.ttf', 'FuturaPT-Bold', 'normal');
        doc.addFont('FuturaPT-Medium-normal.ttf', 'FuturaPT-Medium', 'normal');        
        
        buyNow.forEach(({ imageName, itemName, subitemName, storeSku, description, qty, subItems }, i) => {            
            xPos = pagePaddingX;
            if (!!i) { // add a row and line at the start of product 
                yPos += rowHeight;
                doc.setDrawColor(155, 152, 152);
                doc.line(pagePaddingX, yPos, pageWidth - pagePaddingX, yPos);
                yPos += rowHeight * 2;
            }
            
            if (yPos > pageHeight - pagePaddingY - imageHeight) { // Auto-paging
                doc.addPage();
                yPos = pagePaddingY;
            }
            // add product image
            const imageToFit = subItems[0].image
            doc.addImage(imageToFit, 'PNG', xPos, yPos, imageWidth, imageHeight);

            // add product name
            doc.setTextColor('#888');
            doc.setFont('FuturaPT-Bold');
            doc.setFontSize(17);
            xPos += imageMarginRight + imageWidth; // add alignement after image
            doc.text(subitemName, xPos, yPos);

            // add store Sku
            doc.setTextColor('#9b9898');
            doc.setFont('FuturaPT-Medium');
            doc.setFontSize(13);
            const nameSkuQuantity = `${!!itemName && !!storeSku ? itemName + ' | ' : ''}${storeSku}${!!qty ? ' | QUANTITY: ' + qty : ''}`;
            yPos += rowHeight;
            doc.text(nameSkuQuantity, xPos, yPos);

            // add product description
            const descriptionWidth = pageWidth - pagePaddingX - xPos;
            yPos += rowHeight
            description.forEach(textRow => {
                const splittedDescription = doc.splitTextToSize(textRow, descriptionWidth) // in case of long string break into rows                

                splittedDescription.forEach(lineText => { // iterate andeach row
                    if (yPos > pageHeight - pagePaddingY) { // Auto-paging for description
                        doc.addPage();
                        yPos = pagePaddingY;
                    }
                    doc.text(xPos, yPos, lineText);
                    yPos += rowHeight / 2;
                })
            })
            
        })
        doc.save('ryobi_products.pdf');
    }
    return (
        <>
            <div className="hover d-flex align-item-center share-button" onClick={handleClickOpen}><ShareIcon /> Share</div>
            <Dialog open={open} onClose={handleClose} container={document.getElementById('tk--link-builder-root-styles')}>
                <DialogTitle>
                    <div className="modal-headers">
                        <div className="modal-title">
                            Share
                        </div>
                        <div className="close-modal modal-title">
                            <span onClick={handleClose}>X</span>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="dialog_content">
                        <h5>Share Link</h5>
                        <div className="form-inline">
                            <input type="text" id="copy-link" placeholder="Copy Your Link" name="copy-link" value={shareUrl} disabled />
                            <button className="button-style" onClick={async () => {
                                await navigator.clipboard.writeText(shareUrl)
                                alert('Link Copied!')
                            }}>Copy Link</button>
                        </div>

                        <div className="download_area"> 
                            <h5>Download PDF</h5>
                            <button type="submit" className="button-style" onClick={() => { createPdf(buyNow) }}>Download PDF</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}