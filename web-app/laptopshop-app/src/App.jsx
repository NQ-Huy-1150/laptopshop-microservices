import { RouterProvider } from 'react-router-dom'
import router from './services/routers'
import Keycloak from 'keycloak-js'
import { ReactKeycloakProvider } from '@react-keycloak/web';

export const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'laptopshop',
  clientId: 'web-app'
});


function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <RouterProvider router={router} />
    </ReactKeycloakProvider>
  );
}

export default App
