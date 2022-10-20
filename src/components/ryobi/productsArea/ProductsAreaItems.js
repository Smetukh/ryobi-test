import React from 'react';
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ItemModal from '../Modal/ItemModal';

const ProductsAreaItems = ({
  i,
  handleMobileClick,
  withWallItemAddRejection,
  addWallItemById,
  wall,
  setId,
  enabled,
  setIntoNextStep,
  onDragStart,
  isMobile
}) => {
  return (
    <div className="col-sm-4 col-6">
      <div className="product_info" onClick={handleMobileClick}>
        <div className="plus-add">
          <AddIcon className="fa-plus" />
        </div>
        <div
          onClick={() => {
            withWallItemAddRejection(async () => addWallItemById(wall.id))
            setId(wall.itemName)
            if (enabled) {
              setIntoNextStep();
            }
          }}>
          <img
            src={wall.imageName}
            alt="img"
            className="w-100"
            draggable='true' id={wall.id} onDragStart={onDragStart}
          />
        </div>
        <div className="cardButtons">
          <div className="addButton" onClick={
            () => {
              withWallItemAddRejection(async () => addWallItemById(wall.id))
              setId(wall.itemName)
              if (enabled) {
                setIntoNextStep();
              }
            }
          }><AddCircleIcon />add</div>
          <ItemModal
            className="addButton infoButton"
            itemName={wall.itemName}
            storeSku={wall.storeSku}
            internetNumber={wall.internetNumber}
            subitemName={wall.subitemName}
            subItems={wall.subItems}
            description={wall.description}
            learn={wall.learn}
            buy={wall.buy}
            addAction={async () => {
              withWallItemAddRejection(async () => addWallItemById(wall.id))
            }}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsAreaItems;