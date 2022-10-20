import React from 'react';
import MaterialAccordion from '../accordion/Accordion';
import ProductsAreaItems from './ProductsAreaItems';
import ProductsAreaItemsMobile from './ProductsAreaItemsMobile';

const ProductsArea = ({
  wallBuild,
  handleMobileClick,
  withWallItemAddRejection,
  addWallItemById,
  setId,
  enabled,
  setIntoNextStep,
  onDragStart,
  isMobile,
  mobileInWallItems,
  displayItems,
  addFromMobileToWall
}) => {
  const [expanded, setExpanded] = React.useState('Storage');
  const [inputValue, setInputValue] = React.useState('');

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const accordions = [
    {
      name: 'Storage',
      title: 'STORAGE'
    },
    {
      name: 'Hooks',
      title: 'WALL HOOKS'
    },
    {
      name: 'Shelves',
      title: 'SHELVES'
    }
  ]

  return (
    <div className="wall_products">
      <input type='text' value={inputValue} onChange={handleChangeInput}/>
      {accordions.map((accordion) => {
        const { name, title } = accordion;
        return (
          <MaterialAccordion key={name} name={name} title={title} expanded={expanded} handleChange={handleChangeAccordion}>
            <div className="products_area">
              <div className="row  margin_removed" style={{ position: 'relative' }}>
                {wallBuild.map((wall, i) => {
                  const productsAreaItemsProps = {
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
                  }
                  const reg = new RegExp(inputValue.toLowerCase());
                  const isMatch = reg.test(wall.subitemName.toLowerCase());
                  return (
                    wall.categoryName === name && isMatch && <ProductsAreaItems { ...productsAreaItemsProps } key={i.toString()} />
                  )
                })}
              </div>
              {!!mobileInWallItems.length &&
                <div className="row  margin_removed dashed_border-top pt-3">
                  <h6 className="font-size-small d-block col-sm-12 pb-4">
                    Use for Wall Build
                  </h6>
                  {
                    mobileInWallItems.map(el => ({ ...el, ...displayItems.find(el2 => el2.id === el.itemId) }))
                      .map((item, i) => {
                        const productsAreaItemsMobileProps = {
                          handleMobileClick,
                          item,
                          withWallItemAddRejection,
                          addFromMobileToWall,
                          isMobile
                        }
                        return (
                          item.categoryName === name && <ProductsAreaItemsMobile key={i.toString()} { ...productsAreaItemsMobileProps } />
                        )
                      })}
              </div>}
            </div>
          </MaterialAccordion>
        )
      })}
    </div>
  )
}

export default ProductsArea;