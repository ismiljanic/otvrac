import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-azim8sfu2yz6kzyp.us.auth0.com"
      clientId="tbiuvh3oHFteAOsPy0XaHLMzTkuYASSu"
      authorizationParams={{
        redirect_uri: "http://localhost:3000"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
