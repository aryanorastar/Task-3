import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from 'declarations/backend';
import { canisterId } from 'declarations/backend/index.js';


const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

// Reusable button component
const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;

const App = () => {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Login with Internet Identity" to receive NFT'
  });

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setState((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated
    }));
  };

  const login = async () => {
    await state.authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  };

  const logout = async () => {
    await state.authClient.logout();
    updateActor();
  };

  const whoami = async () => {
    setState((prev) => ({
      ...prev,
      principal: 'Loading...'
    }));

    const result = await state.actor.whoami();
    const principal = result.toString();
    setState((prev) => ({
      ...prev,
      principal
    }));
  };

  return (
    <div>
     <span class="right-button">
      {!state.isAuthenticated ? (
        <Button onClick={login}>Login with Internet Identity</Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}
      </span>
      <br />
      <br />
      <br />
      <h1>Whatt ? You pulled something mythical while smoking cigarettes?</h1>


      {state.principal && (                   
        <div>
          <h3>Your principal ID is:</h3>
          
          <h4>{state.principal} <br /> <br /> 
          <Button onClick={whoami}>Show Address</Button>
          <br />
          The NFT will be transferred to this Address!</h4>
          
        </div>
      )}

       
       

      <div id="info-box" className="info-box">
      <h4> <input
      type="text"
      placeholder="Type here..."
      
    /> </h4>
      </div>
      


    </div>
  );
};

export default App;
