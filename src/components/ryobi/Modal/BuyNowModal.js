import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// import { BuyNow } from "../constant";

export default function BuyNowModal({buyNow, intro}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    intro.exit();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button className="button" variant="outlined" onClick={handleClickOpen} disabled={!buyNow.length}>
        Buy Now
      </button>
      <Dialog open={open} onClose={handleClose} container={document.getElementById('tk--link-builder-root-styles')}>
        <DialogTitle>
          <div className="modal-headers">
            <div className="modal-title">Buy Now</div>
            <div className="close-modal modal-title">
              <span onClick={handleClose}>X</span>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          {buyNow.map((Buy, i) => (
            <div className="rows" key={i.toString()}>
              <div className="columns column-one">
                <img src={Buy.imageName} alt="img" className="w-100" />
              </div>
              <div className="columns column-two">
                <strong>{Buy.subitemName}</strong>
                <h4>
                  {Buy.itemName} | {Buy.storeSku} | Quantity: {Buy.qty}
                </h4>
                <p>
                  {Buy.description.join(' ')}
                </p>
              </div>
              <div className="columns column-three ">
                <div className="full-buttons">
                  <a
                    href={Buy.learn}
                    role="button"
                    className="button-style"
                    target="_blank" rel="noreferrer"
                  >
                    Learn More
                  </a>
                  <a href={Buy.buy} className="button-style" target="_blank" rel="noreferrer">
                    {" "}
                    {/*Buy.itemName === 'STM819' ? 'Coming soon' : 'Buy Now'*/}
                    {'Buy Now'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
