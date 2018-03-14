import contract, {CONTRACT_NAMES} from "./contractsRepository";

export default class ProxyRegistry {

  constructor(network, registryContract) {
    this.network = network;
    this.registryContract = registryContract;
  }

  fetchProxyFor = (account, at) => {
    return this.registryContract.methods.proxies(account, at).call()
      .then(proxy => proxy)
      .catch((error) => Promise.reject({message: "Cannot fetch proxy ", raw: error}));
  };

  fetchLatestProxyFor = async (account) => {
    const count = await this.fetchProxyCountFor(account);

    for (let index = count - 1; index >= 0; index--) {
      const proxy = await this.fetchProxyFor(account, index);
      const owner = await this.fetchProxyOwnerOf(proxy);
      
      console.log(owner,account);

      if (owner === account) {
        return proxy;
      }
    }

    return Promise.reject({message: `Cannot find proxy for ${account}`, raw: null});
  };

  fetchProxyCountFor = (account) => {
    return this.registryContract.methods.proxiesCount(account).call()
      .then(count => count)
      .catch((error) => Promise.reject({message: `Cannot fetch proxy count for ${account}`, raw: error}));
  };

  fetchProxyOwnerOf = (address) => {
    return contract(this.network, CONTRACT_NAMES.DS_PROXY, address).methods.owner().call()
      .then(owner => owner)
      .catch((error) => Promise.reject({message: `Cannot get owner for proxy ${address}`, raw: error}));
  }
}




