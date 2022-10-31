import React from 'react';
import MaterialAccordion from '../accordion/Accordion';
import ProductsAreaItems from './ProductsAreaItems';
import ProductsAreaItemsMobile from './ProductsAreaItemsMobile';

import { AccordionsWrapper, Input, InputWrapper, SearchIcon } from './ProductsArea.styled';
import { Summarize } from '@mui/icons-material';

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
  const [expanded, setExpanded] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  
  const reg = new RegExp(inputValue.toLowerCase());
  // group products by categoryName
  const accordions = wallBuild.reduce(function(sum, current) {
    const isMatch = reg.test(current.subitemName.toLowerCase());
    if (isMatch) {
      const hasKey = current.categoryName in sum;
      if (!hasKey) return { ...sum, [current.categoryName]: [current] };
      return { ...sum, [current.categoryName]: [ ...sum[current.categoryName], current] }
    }
    return sum;
  }, {});
  
  const handleChangeAccordion = (panel) => (event, newExpanded) => {    
    setExpanded(newExpanded ? panel : false);
  };
  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
    // if (!!e.target.value.length) handleChangeAccordion(Object.keys(accordions)[0]); // open first accordion on search
  }

  return (
    <div className="wall_products">
      <InputWrapper>
        <Input type='text' value={inputValue} placeholder='Search products' onChange={handleChangeInput}></Input>
        <SearchIcon fontSize='large' />
      </InputWrapper>
      <AccordionsWrapper>
        {Object.keys(accordions).map((key) => {
          return (
            <MaterialAccordion key={key} name={key} title={key} expanded={expanded} handleChange={handleChangeAccordion}>
              <div className="products_area">
                <div className="row  margin_removed" style={{ position: 'relative' }}>
                  {accordions[key].map((wall, i) => {
                    const productsAreaItemsProps = {
                      key: i,
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
                    return <ProductsAreaItems { ...productsAreaItemsProps } />;
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
      </AccordionsWrapper>
    </div>
  )
}

export default ProductsArea;