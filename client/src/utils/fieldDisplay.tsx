import React from 'react';
import { Box, Typography } from '@mui/material';

interface FieldDisplayProps {
  label: string;
  value: string | number | null | undefined;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({ label, value }) => {
  return (
    <Box display="flex" justifyContent="space-between" padding={1} className="fielddisplay">
      <Typography variant="subtitle1" fontWeight="bold">
        {label}:
      </Typography>
      <Typography variant="body1">{value !== null && value !== undefined ? value : 'N/A'}</Typography>
    </Box>
  );
};

export default FieldDisplay;
