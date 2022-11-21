import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export const AccordionsWrapper = styled.div`
  overflow: auto;
  max-height: 402px;
  padding: 0px 13px 13px;
  min-height: 400px;
  overflow-y: auto;
  position: relative;
  &::-webkit-slider: {
    width: 6px;
  };
  &::-webkit-slider-track: {
    background: #dedede;
    border-radius: 50px;
  };
  &::-webkit-slider-thumb {
	  background: #000000;
	  border-radius: 50px;
	};
  scrollbar-width: thin;
  scrollbar-color: #000000 #dedede;
`;

export const Input = styled.input`
  height: 70px;
  width: 100%;
  padding: 10px 50px !important;
  color: #2d2926;
  font-family: "FuturaPT-Medium";
  font-size: 15px;
  /* text-transform: uppercase; */
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-right: none;
  z-index: 1;
  background: transparent;
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const SearchIcon = styled(SearchOutlinedIcon)`
  position: absolute;
  left: 10px;
`;