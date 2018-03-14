import Web3 from 'web3';

const initializeWeb3 = () => {
  const instance = typeof window.web3 !== 'undefined'
    ? new Web3(window.web3.currentProvider)
    : new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  window.web3 = instance;

  return instance;
};

export default initializeWeb3();