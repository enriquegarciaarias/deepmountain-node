import React, { useState } from 'react';
import DeepMountain from './deepMountain';
import CorpusView from './corpusView';
import Example from './corpusManager';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ViewSwitcher = () => {
  const [activeView, setActiveView] = useState('Corpus');

  const handleSwitchView = (view: string) => {
    setActiveView(view);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box>
          <Button
            variant="contained"
            onClick={() => handleSwitchView('Corpus')}
            sx={{ marginRight: 1 }}
          >
            Corpus
          </Button>          
          <Button
            variant="contained"
            onClick={() => handleSwitchView('DeepMountain')}
            sx={{ marginRight: 1 }}
          >
            DeepMountain
          </Button>

          <Button
            variant="contained"
            onClick={() => handleSwitchView('Downloader')}
          >
            Downloader
          </Button>
        </Box>
        <Typography variant="h6">
          {activeView === 'DeepMountain'
            ? 'DeepMountain'
            : activeView === 'Corpus'
            ? 'Corpus'
            : 'Corpus Downloader'}
        </Typography>
      </Box>
      <Box sx={{ padding: 2 }}>
        {activeView === 'DeepMountain' && <DeepMountain />}
        {activeView === 'Corpus' && <CorpusView />}
        {activeView === 'Downloader' && <Example />}
      </Box>
    </div>
  );
};

export default ViewSwitcher;
