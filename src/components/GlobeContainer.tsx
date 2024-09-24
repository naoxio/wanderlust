'use client';

import React, { useState } from 'react';
import Globe from './Globe';
import Toolbar from './Toolbar';

const GlobeContainer: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('World');
  const [view, setView] = useState<'2D' | '3D'>('3D');

  return (
    <div className="content-container">
      <Toolbar 
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        view={view}
        setView={setView}
      />
      <div className="full-height">
        <Globe />
      </div>
    </div>
  );
};

export default GlobeContainer;
