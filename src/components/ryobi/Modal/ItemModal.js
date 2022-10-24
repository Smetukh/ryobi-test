import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Carousel } from "../../../vendor/react-carousel-minimal/dist";
import AddIcon from "@mui/icons-material/Add";
import { ConfiguratorContext } from '../../../configurator/store/'
import InfoIcon from '@mui/icons-material/Info';

const captionStyle = {
  fontSize: "2em",
  fontWeight: "bold",
};
const slideNumberStyle = {
  fontSize: "20px",
  fontWeight: "bold",
};

export default function ItemModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { description, className, isMobile } = props;

  const {
    dataStore
  } = React.useContext(ConfiguratorContext)
  
  const {onLearnMoreClicked, onBuyNowClicked} = dataStore.hostContext
  
  return (
    <>
      {isMobile ?
        <span variant="outlined" style={{ minHeight: '32px' }} className={className} onClick={handleClickOpen}>
          <InfoIcon />
          <span style={{ fontWeight: 'bold' }}>INFO</span>
        </span>
        :
        <h6 variant="outlined" className={className} onClick={handleClickOpen}>
          <InfoIcon />
          <span>INFO</span>
        </h6>
        
      }
      

      <Dialog className="custom-modal" open={open} onClose={handleClose} container={document.getElementById('tk--link-builder-root-styles')}>
        <DialogTitle>
          <div className="modal-headers">
            <div className="modal-title">{props.subitemName}</div>
            <div className="close-modal modal-title">
              <span onClick={handleClose}>X</span>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <div className="carousel_area left_side">
            <Carousel
              data={props.subItems}
              time={2000}
              width="100%"
              height="200px"
              captionStyle={captionStyle}
              slideNumber={false}
              slideNumberStyle={slideNumberStyle}
              captionPosition="bottom"
              automatic={false}
              dots={false}
              pauseIconColor="white"
              pauseIconSize="40px"
              slideBackgroundColor="white"
              slideImageFit="contain"
              thumbnails={true}
              thumbnailWidth="40px"
              style={{
                textAlign: "center",
                maxWidth: "850px",
                maxHeight: "500px",
                margin: "10px auto",
              }}
            />
          </div>

          <div className="right_side">
            <div className="column-two inner-modal-item">
              <div className="prdouct-title">{props.subitemName}</div>
              <h4>
                Model #{props.itemName} | Store Sku #{props.storeSku} | Internet
                #{props.internetNumber}
              </h4>
              <ul>
                {description &&
                  description.map((data, index) => <li key={index}>{data}</li>)}
              </ul>
            </div>

            <div className="Item-full-buttons Item-inner-buttons">
              <button role="button" className="button-style" target="_blank" onClick={async () => {
                await props.addAction()
                setOpen(false)
              }}>
                <AddIcon className="fa-plus" />
                ADD To Build
              </button>
            </div>

            <div className="d-flex flex-buttons Item-inner-buttons">
              <a href={props.learn} className="button-style" target="_blank" rel="noreferrer">
                <span onClick={() => onLearnMoreClicked(props.storeSku, props.internetNumber)}>Learn More</span>
              </a>
              <a href={props.buy} className="button-style" target="_blank" rel="noreferrer">
                <span onClick={() => onBuyNowClicked(props.storeSku, props.internetNumber)}>{props.itemName === 'STM819' ? 'Buy Now' : 'Buy Now'}</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
