import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import CreateResource from './components/CreateResource';
import ResourceList from './components/ResourceList';

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Resources'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <>
      <h1>NEAR Resources</h1>
      { currentUser
          ? <div>
              <h2>
                Account ID: {currentUser.accountId}
                {" "}
                <button onClick={signOut} className="shadow bg-gray-800 hover:bg-gray-900 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 rounded">Log out</button>
              </h2>
              
              {/* <CreateResource contract={contract}  onSubmit={onSubmit} currentUser={currentUser}  /> */}
              <CreateResource contract={contract} currentUser={currentUser}/>

              <ResourceList contract={contract} currentUser={currentUser}/>
            </div>
          : 
          <div>
            Sign In To Use The App: 
            {" "}
            <button onClick={signIn} className="shadow bg-blue-600 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 rounded">Log in</button>
          </div>
        }
    </>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addResource: PropTypes.func.isRequired,
    getResources: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
