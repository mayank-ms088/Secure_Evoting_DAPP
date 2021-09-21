export const registerToVote = function ({
  idNumber,
  email,
  permreq,
  Registrar,
  onRegister,
}) {
  //var t0 = performance.now()

  if (permreq != 1) {
    permreq = 0;
  }

  var domain = email.replace(/.*@/, "");

  Registrar.deployed().then(function (contract) {
    contract.domainCheck.call(domain).then(function (v) {
      var domainValid = v.toString();

      if (domainValid == "false") {
        return "invalid email";
      }

      contract.checkReg.call(email, idNumber).then(function (v) {
        var emailValid = v.toString();

        if (emailValid == "false") {
          onRegister("already Registered");
          return;
        }

        contract
          .registerVoter(email, idNumber, domain, permreq, {
            gas: 2500000,
            from: web3.eth.accounts[0],
          })
          .then(function () {
            onRegister("registered");
            return;
          });
      });
    });
  });
};
