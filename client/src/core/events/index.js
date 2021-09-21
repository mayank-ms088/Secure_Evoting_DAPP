export const INITIAL_LOAD = "getweb3";
export function loadWeb3(web3, accounts, contracts) {
  return {
    type: INITIAL_LOAD,
    payload: {
      web3,
      accounts,
      contracts,
    },
  };
}
