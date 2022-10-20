import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  padding: '10px 0',
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0
}));

const MaterialAccordion = ({ name, handleChange, expanded, title, children }) => {
  return (
    <div>
      <Accordion expanded={expanded === name} onChange={handleChange(name)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default MaterialAccordion;