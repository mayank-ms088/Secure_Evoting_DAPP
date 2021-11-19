import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import Routes from "./Routes";
import getWeb3 from "core/getWeb3";
import voting_artifacts from "./contracts/Voting.json";
import creator_artifacts from "./contracts/Creator.json";
import registrar_artifacts from "./contracts/Registrar.json";
import { default as contract } from "truffle-contract";
import { SnackbarProvider } from "notistack";
import { useDispatch } from "react-redux";
import { loadWeb3 } from "core/events";
var hist = createBrowserHistory();

export function App() {
  const dispatch = useDispatch();
  useEffect(async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // const getInstance = (artifact) => {
      //   const deployedNetwork = artifact.networks[networkId];
      //   const instance = new web3.eth.Contract(
      //     artifact.abi,
      //     deployedNetwork && deployedNetwork.address
      //   );
      //   return instance;
      // };
      const contracts = {
        Voting: contract(voting_artifacts),
        Registrar: contract(registrar_artifacts),
        Creator: contract(creator_artifacts),
      };
      contracts.Registrar.setProvider(web3.currentProvider);
      contracts.Voting.setProvider(web3.currentProvider);
      contracts.Creator.setProvider(web3.currentProvider);
      await dispatch(loadWeb3(web3, accounts, contracts));
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);
  return (
    <SnackbarProvider>
      <Router history={hist}>
        <Routes />
      </Router>
    </SnackbarProvider>
  );
}
