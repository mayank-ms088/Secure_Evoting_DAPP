import { INITIAL_LOAD } from "core/events";
import produce from "immer";
const initialState = {
  web3: null,
  accounts: null,
  contracts: {
    Voting: null,
    Registrar: null,
    Creator: null,
  },
};

const rootReducer = (state = initialState, action) => {
  if (action.type == INITIAL_LOAD) {
    const { web3, accounts, contracts } = action.payload;
    return produce(state, (draft) => {
      draft.web3 = web3;
      draft.accounts = accounts;
      draft.contracts = contracts;
    });
  }
};
export default rootReducer;
