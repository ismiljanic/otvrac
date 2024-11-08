// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';

function App() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    setScriptLoaded(true);
  }, []);

  return (
    <BrowserRouter>
      <div className='app_container'>
        {scriptLoaded && <Router />}
      </div>
    </BrowserRouter>
  );
}

export default App;
