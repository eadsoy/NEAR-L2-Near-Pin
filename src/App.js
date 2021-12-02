import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import CreateResource from './components/CreateResource';
import ResourceList from './components/ResourceList';
import logo from './near_logo.png'

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Pin'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <>
      { currentUser
          ? <div>
              <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-white mb-3 shadow-sm">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                  <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                    <a
                      className="text-3xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-black"
                      href="#pablo"
                    >
                      <img src={logo} alt="Logo" className="object-scale-down h-12 w-full mt-2"/>
                    </a>
                    
                    <button
                      className="text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                      type="button"
                      onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                      <i className="fas fa-bars"></i>
                    </button>
                  </div>
                  <p className="text-2xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-gray-800 ">Pin</p>
                  <div
                    className={
                      "lg:flex flex-grow items-center" +
                      (navbarOpen ? "flex" : "hidden")
                    }
                    id="example-navbar-danger"
                  >
                    <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                      <li className="nav-item font-bold">
                        Account ID: {currentUser.accountId}{" "}
                        <button onClick={signOut} className="shadow bg-gray-800 hover:bg-gray-900 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4 ml-4 rounded">Log out</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              
              <CreateResource contract={contract} currentUser={currentUser}/>
              <ResourceList contract={contract} currentUser={currentUser}/>
            </div>
          : 
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="text-5xl text-center font-bold leading-relaxed inline-block  whitespace-nowrap uppercase text-black "
            >
              <img src={logo} alt="Logo" className="object-scale-down h-20 w-full pb-1"/>
              Pin
            </div>
            <div className="text-center text-lg pt-6">
              Sign In To Use The App 
              {" "}
            </div>
            <div className="text-center">
              <button onClick={signIn} className="shadow bg-gray-800 hover:bg-gray-900 focus:shadow-outline focus:outline-none text-white font-bold mt-3 py-2 px-4  rounded w-36">
                Log in
              </button>
            </div>
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
