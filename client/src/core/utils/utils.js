export const registerToVote = function ({
  idNumber,
  email,
  permreq,
  Registrar,
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
        window.alert("Invalid e-mail address!");
        //$("#msg2").html("Invalid e-mail address!")
        throw new Error();
      }

      contract.checkReg.call(email, idNumber).then(function (v) {
        var emailValid = v.toString();

        if (emailValid == "false") {
          window.alert("E-mail/ID Number already registered to vote!");
          //$("#msg2").html("E-mail already registered to vote!")
          throw new Error();
        }

        contract
          .registerVoter(email, idNumber, domain, permreq, {
            gas: 2500000,
            from: web3.eth.accounts[0],
          })
          .then(function () {
            //$("#msg2").html("Account ready to vote!")
            window.alert("Account ready to vote!");
            /*var t1 = performance.now()
                    window.alert('It took' + (t1 - t0) + 'ms to finish')*/
          });
      });
    });
  });
};
