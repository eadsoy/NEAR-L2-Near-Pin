import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import Form from './components/Form';
import ResourceList from './components/ResourceList';

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const { fieldset, message, donation } = e.target.elements;

  //   fieldset.disabled = true;

  //   // TODO: optimistically update page with new message,
  //   // update blockchain data in background
  //   // add uuid to each message, so we know which one is already known
  //   contract.addMessage(
  //     { text: message.value },
  //     BOATLOAD_OF_GAS,
  //     Big(donation.value || '0').times(10 ** 24).toFixed()
  //   ).then(() => {
  //     contract.getMessages().then(messages => {
  //       setMessages(messages);
  //       message.value = '';
  //       donation.value = SUGGESTED_DONATION;
  //       fieldset.disabled = false;
  //       message.focus();
  //     });
  //   });
  // };

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
                <button onClick={signOut}>Log out</button>
              </h2>
              
              {/* <Form contract={contract}  onSubmit={onSubmit} currentUser={currentUser}  /> */}
              <Form contract={contract}  currentUser={currentUser}  />

              <ResourceList contract={contract} />
            </div>
          : 
          <div>
            Sign In To Use The App: 
            {" "}
            <button onClick={signIn}>Log in</button>
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
