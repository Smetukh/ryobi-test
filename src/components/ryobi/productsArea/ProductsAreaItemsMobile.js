import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ItemModal from '../Modal/ItemModal';

const ProductsAreaItemsMobile = ({
  handleMobileClick,
  item,
  withWallItemAddRejection,
  addFromMobileToWall,
  isMobile
}) => {
  return (
    <div className="col-sm-4 col-6">
      <div className="product_info" onClick={handleMobileClick}>
        <img
          src={item.imageName}
          alt="img"
          className="w-100"
          onClick={() => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
        />
        <div className="cardButtons">
          <div className="addButton"><AddCircleIcon />add</div>
          <ItemModal
            className="addButton infoButton"
            itemName={item.itemName}
            storeSku={item.storeSku}
            internetNumber={item.internetNumber}
            subitemName={item.subitemName}
            subItems={item.subItems}
            description={item.description}
            learn={item.learn}
            buy={item.buy}
            addAction={() => withWallItemAddRejection(async () => addFromMobileToWall(item.id))}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsAreaItemsMobile;