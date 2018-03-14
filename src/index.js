import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './OasisDirectWidget.jsx';
import web3 from './web3';
import contract, { CONTRACT_NAMES } from './contractsRepository';
import ProxyRegistry from './proxyRegistry';
/**
 * Return an array of two elements - [$1, $2]
 *
 * $1 - Error on failure. IF request successful this is null
 * $2 - Result on success. IF request failed this is null
 *
 * @returns {Promise.<Array>}
 */
const checkIfClientIsConnected = () => {
  return web3.eth.net.isListening()
    .then(status => status)
    .catch((error) => Promise.reject({message: "Not Connected!", raw: error}));
};

const checkNetworkType = () => {
  return web3.eth.net.getNetworkType()
    .then(type => type)
    .catch((error) => Promise.reject({message: "Cannot recognize network!", raw: error}));
};

const checkIfClientIsSynced = () => {
  return web3.eth.isSyncing()
    .then(status => status)
    .catch((error) => Promise.reject({message: "Cannot synchronize!", raw: error}));
};

const checkIfHasAccounts = () => {
  return web3.eth.getAccounts()
    .then(accounts => {
      if(accounts.length) {
        return Promise.resolve(accounts);
      }

      return Promise.reject({message: "Locked Account!", raw: null}); // this is caught in the catch so probably I have to figure out something else
    })
    .catch((error) => Promise.reject({message: "Cannot get accounts!", raw: error}));
};

const markAccountAsDefault = (account) => {
  web3.eth.defaultAccount = account;
};

const initializeContracts = (account) => {
    // web3.eth.clearSubscriptions();

  const registryContract = contract("kovan", CONTRACT_NAMES.PROXY_REGISTRY);

  const proxyRegistry = new ProxyRegistry("kovan", registryContract);

  proxyRegistry.fetchLatestProxyFor(account).then(console.log).catch((error) => console.log(error.message));
};

const init = async () => {

  let state = {
    network: {},
    user: {}
  };
  
  await checkIfClientIsConnected()
    .then(status => {
      state.network.isConnected = status;
      return checkNetworkType();
    })
    .then(name => {
      state.network.name = name;
      return checkIfClientIsSynced();
    })
    .then(status => {
      state.network.isSyncing = status;
      return checkIfHasAccounts();
    })
    .then(accounts => {
      const firstAccount = accounts[0];

      state.user.accounts = accounts;
      state.user.defaultAccount = firstAccount;

      markAccountAsDefault(firstAccount);
    })

    .catch(console.log);

  return state;
}

init().then(( state ) => {
  initializeContracts(state.user.defaultAccount);
}).catch(console.log);

ReactDOM.render(<Widget/>, document.getElementById('root'));