var Voting = artifacts.require("./Voting.sol");
var Registrar = artifacts.require("./Registrar.sol");
var Creator = artifacts.require("./Creator.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(
    Voting,
    1499573503,
    1,
    5,
    1234567890,
    "Testing Phase Ballot",
    0,
    accounts[2],
    {
      gas: 2000000,
    }
  );
  deployer.deploy(
    Registrar,
    [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "itbhu.ac.in",
      "iitbhu.ac.in",
    ].map((x) => web3.utils.asciiToHex(x)),
    {
      gas: 800000,
    }
  );
  deployer.deploy(Creator, {
    gas: 2000000,
  });
};
