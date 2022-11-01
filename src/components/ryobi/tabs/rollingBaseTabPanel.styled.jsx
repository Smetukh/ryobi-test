import styled from 'styled-components';

export const MobileItemContainer = styled.div`
  ${({ isAllowed }) => isAllowed === false && `
    cursor: not-allowed;
    background: white;
    opacity: 0.5;
    z-index: 1;
  `}
`;

export const ProductInfo = styled.div`
  pointer-events: ${({ isAllowed }) => isAllowed ? 'auto' : 'none' };
`;