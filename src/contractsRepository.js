import dsEthToken from "./abi/dsEthToken.json";
import dsToken from "./abi/dsToken.json";
import dsProxy from "./abi/dsProxy.json";
import dsProxyFactory from "./abi/dsProxyFactory.json";
import matchingMarket from "./abi/matchingMarket.json";
import proxyCreateAndExecute from "./abi/proxyCreateAndExecute.json";
import proxyRegistry from "./abi/proxyRegistry.json";
import config from "./config.json";
import web3 from "./web3";

export const CONTRACT_NAMES = {
  DS_ETH_TOKEN: "dsEthToken",
  DS_TOKEN: "dsToken",
  DS_PROXY: "dsProxy",
  DS_PROXY_FACTORY: "dsProxyFactory",
  MATCHING_MARKET: "matchingMarket",
  PROXY_CREATE_AND_EXECTURE: "proxyCreateAndExecute",
  PROXY_REGISTRY: "proxyRegistry"
};

Object.freeze(CONTRACT_NAMES);

const CONTRACTS = {
  [CONTRACT_NAMES.DS_ETH_TOKEN]: dsEthToken,
  [CONTRACT_NAMES.DS_TOKEN]: dsToken,
  [CONTRACT_NAMES.DS_PROXY]: dsProxy,
  [CONTRACT_NAMES.DS_PROXY_FACTORY]: dsProxyFactory,
  [CONTRACT_NAMES.MATCHING_MARKET]: matchingMarket,
  [CONTRACT_NAMES.PROXY_CREATE_AND_EXECTURE]: proxyCreateAndExecute,
  [CONTRACT_NAMES.PROXY_REGISTRY]: proxyRegistry,
}

const contract = (network, contractName, address = '') => {
  if (!address) {
    address = config.chain[network][contractName];
  }

  return new web3.eth.Contract(CONTRACTS[contractName].abi, address)
};

export default contract;
