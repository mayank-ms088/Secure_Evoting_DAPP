import { Mail } from "@material-ui/icons";
import { useSelector } from "react-redux";
const axios = require("axios");

export const registerToVote = function ({
  idNum,
  email,
  permreq,
  Registrar,
  onRegister,
  accounts,
  web3,
}) {
  //var t0 = performance.now()

  if (permreq != 1) {
    permreq = 0;
  }

  var domain = email.replace(/.*@/, "");

  Registrar.deployed().then(function (contract) {
    contract.domainCheck.call(web3.utils.asciiToHex(domain)).then(function (v) {
      var domainValid = v.toString();
      console.log(web3.utils.asciiToHex(domain));
      if (domainValid == "false") {
        onRegister("invalid email");
        return;
      }

      contract.checkReg
        .call(web3.utils.asciiToHex(email), web3.utils.asciiToHex(idNum))
        .then(function (v) {
          var emailValid = v.toString();

          if (emailValid == "false") {
            onRegister("already Registered");
            return;
          }

          contract
            .registerVoter(
              web3.utils.asciiToHex(email),
              web3.utils.asciiToHex(idNum),
              web3.utils.asciiToHex(domain),
              web3.utils.asciiToHex(permreq),
              {
                gas: 2500000,
                from: accounts[0],
              }
            )
            .then(function () {
              onRegister("registered");
              return;
            });
        });
    });
  });
};
export const loadBallot = function ({ ballotID, onLoad }) {
  const obj = useSelector((o) => o);
  const {
    web3,
    accounts,
    contracts: { Registrar },
  } = obj;
  candidates = {};

  Registrar.deployed().then(function (contract) {
    contract.getAddress
      .call(web3.utils.asciiToHex(ballotID))
      .then(function (v) {
        var votingAddress = v.toString();
        if (votingAddress == 0) {
          onLoad("Invalid BallotID!");
        } else {
          getCandidates(votingAddress, ballotID);
        }
      });
  });
};
export const voteForCandidate = function ({
  candidate,
  email,
  Registrar,
  Voting,
}) {
  var domain = email.replace(/.*@/, "");
  var cHash = sha3withsize(candidate, 32);

  var votesArray = [];

  Registrar.deployed().then(function (contract) {
    contract
      .checkVoter(email, {
        gas: 2500000,
        from: web3.eth.accounts[0],
      })
      .then(function (v) {
        var voterCheck = v.toString();

        if (voterCheck == 1) {
          window.alert("E-mail address not registered!");
          //$("#msg").html("E-mail address not registered!")
          throw new Error();
        } else if (voterCheck == 2) {
          window.alert("E-mail address and Ethereum address mismatch!");
          //$("#msg").html("E-mail address and Ethereum address mismatch!")
          throw new Error();
        }

        contract.getAddress.call(ballotID).then(function (v) {
          var votingAddress = v.toString();

          Voting.at(votingAddress).then(function (contract) {
            contract.checkWhitelist.call().then(function (v) {
              let wc1 = v.toString();
              contract.checkifWhitelisted.call(email).then(function (v) {
                let wc2 = v.toString();
                if (wc1 == "true" && wc2 == "false") {
                  window.alert(
                    "You're are not authorized to vote on this ballot!"
                  );
                  //$("#msg").html("You're are not authorized to vote on this ballot!")
                  throw new Error();
                } else {
                  contract.validCandidate.call(cHash).then(function (v) {
                    var candValid = v.toString();

                    if (candValid == "false") {
                      window.alert("Invalid Candidate!");
                      //$("#msg").html("Invalid Candidate!")
                      throw new Error();
                    }
                    contract.checkVoteattempts.call().then(function (v) {
                      var attempCheck = v.toString();

                      if (attempCheck == "false") {
                        window.alert(
                          "You have reached your voting limit for this ballot/poll!"
                        );
                        //$("#msg").html("You have reached your voting limit for this ballot/poll!")
                        throw new Error();
                      }
                      $("#msg").html(
                        "Your vote attempt has been submitted. Please wait for verification."
                      );
                      $("#candidate").val("");
                      $("#e-mail").val("");

                      contract.candidateList
                        .call(ballotID)
                        .then(function (candidateArray) {
                          for (let i = 0; i < candidateArray.length; i++) {
                            let hcand = web3.toUtf8(candidateArray[i]);
                            let hcHash = sha3withsize(hcand, 32);

                            if (hcHash == cHash) {
                              encrypt(
                                hcHash,
                                input1,
                                i,
                                candidateArray,
                                email,
                                votingAddress,
                                votesArray
                              );
                            } else {
                              encrypt(
                                hcHash,
                                input2,
                                i,
                                candidateArray,
                                email,
                                votingAddress,
                                votesArray
                              );
                            }
                          }
                        });
                    });
                  });
                }
              });
            });
          });
        });
      });
  });
};

function encrypt(
  hcHash,
  vnum,
  i,
  candidateArray,
  email,
  votingAddress,
  votesArray
) {
  var einput1;
  const url = "http://localhost:8080/encrypt/" + vnum;
  axios
    .get(url)
    .then(function (response) {
      Voting.at(votingAddress).then(function (contract) {
        contract.votesFor.call(hcHash).then(function (v) {
          einput1 = v.toString();
          einput1 = scientificToDecimal(einput1);

          if (einput1 != 0) {
            add(
              response,
              einput1,
              i,
              candidateArray,
              email,
              votingAddress,
              votesArray
            );
          }
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  // $.ajax({
  //     type: "GET",
  //     url: "http://localhost:3000/encrypt/" + vnum,
  //     success: function(eoutput1) {
  //         Voting.at(votingAddress).then(function(contract) {
  //             contract.votesFor.call(hcHash).then(function(v) {
  //                 einput1 = v.toString()
  //                 einput1 = scientificToDecimal(einput1)

  //                 if (einput1 != 0) {
  //                     add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray)
  //                 }
  //             })
  //         })
  //     }
  // })
}

function add(
  eoutput1,
  einput1,
  i,
  candidateArray,
  email,
  votingAddress,
  votesArray
) {
  const url = "http://localhost:3000/add/" + eoutput1 + "/" + einput1;
  axios
    .get(url)
    .then(function (response) {
      verifyTimestamp(
        response,
        i,
        candidateArray,
        email,
        votingAddress,
        votesArray
      );
    })
    .catch(function (error) {
      console.log(error);
    });
  // $.ajax({
  //     type: "GET",
  //     url: "http://localhost:3000/add/" + eoutput1 + "/" + einput1,
  //     success: function(eadd1) {
  //         verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray)
  //     }
  // })
}

function verifyTimestamp(
  eadd1,
  i,
  candidateArray,
  email,
  votingAddress,
  votesArray
) {
  Voting.at(votingAddress).then(function (contract) {
    contract.checkTimelimit.call().then(function (v) {
      var timecheck = v.toString();
      if (timecheck == "false") {
        contract.getTimelimit.call().then(function (v) {
          var endtime = v.toString();
          //Testnet is plus 7 hours, uncomment this line if testing on testnet
          //endtime = endtime - 21600
          endtime = new Date(endtime * 1000);
          getVotes(votingAddress);
          //window.alert("Voting period for this ballot has ended on " +endtime)
          $("#msg").html(
            "Voting period for this ballot has ended on " + endtime
          );
          throw new Error();
        });
      } else {
        votesArray[i] = eadd1;
        if (i == candidateArray.length - 1) {
          vote(i, candidateArray, email, votingAddress, votesArray);
        }
      }
    });
  });
}

function vote(i, candidateArray, email, votingAddress, votesArray) {
  Voting.at(votingAddress).then(function (contract) {
    contract
      .voteForCandidate(votesArray, email, candidateArray, {
        gas: 2500000,
        from: web3.eth.accounts[0],
      })
      .then(function () {
        getVotes(votingAddress);
        $("#msg").html("");
        window.alert("Your vote has been verified!");
      });
  });
}

export const ballotSetup = function ({
  email,
  date,
  time,
  ballottype,
  title,
  choices,
  votelimit,
  whitelist,
  whitelisted,
  Registrar,
  Creator,
  web3,
  onCreation,
}) {
  Registrar.deployed().then(function (contract) {
    contract.checkVoter.call(web3.utils.asciiToHex(email)).then(function (v) {
      var voterCheck = v.toString();

      if (voterCheck == 1) {
        onCreation("E-mail address not registered!");
        return;
      } else if (voterCheck == 2) {
        onCreation("E-mail address and Ethereum address mismatch!");
        return;
      } else {
        contract.getPermission
          .call(web3.utils.asciiToHex(email))
          .then(function (v) {
            let emailCheck = v.toString();
            if (emailCheck == 0) {
              //$("#msg3").html("You are not authorized to create ballots! Please contact admin to request authorization.")
              onCreation(
                "You are not authorized to create ballots! Please contact admin to request authorization."
              );
              return;
            } else {
              var enddate = Date.parse(date).getTime() / 1000;
              //Testnet is plus 7 hours
              //-21600 to get original end date and time on testnet
              var timeArray = time.split(":");
              //Testnet is plus 7 hours, uncomment this line if testing on testnet
              //var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60) + 21600
              var seconds = timeArray[0] * 60 * 60 + timeArray[1] * 60;
              enddate += seconds;
              var choicesArray = choices.split(/\s*,\s*/);
              var whitelistedArray = whitelisted.split(/\s*,\s*/);
              let ballotid = Math.floor(Math.random() * 4294967295);

              Creator.deployed().then(function (contract) {
                contract
                  .createBallot(
                    enddate,
                    ballottype,
                    votelimit,
                    ballotid,
                    title,
                    whitelist,
                    {
                      gas: 2500000,
                      from: web3.eth.accounts[0],
                    }
                  )
                  .then(function () {
                    contract.getAddress.call(ballotid).then(function (v) {
                      var votingAddress = v.toString();
                      //window.alert(votingAddress)
                      fillSetup(
                        votingAddress,
                        choicesArray,
                        whitelistedArray,
                        whitelist,
                        ballotid
                      );
                      registerBallot(votingAddress, ballotid);
                    });
                  });
              });
            }
          });
      }
    });
  });
};

function registerBallot(votingaddress, ballotid) {
  Registrar.deployed().then(function (contract) {
    contract
      .setAddress(votingaddress, ballotid, {
        gas: 2500000,
        from: web3.eth.accounts[0],
      })
      .then(function () {
        window.alert(
          "Ballot creation successful! Ballot ID: " +
            ballotid +
            "\nPlease write the down the Ballot ID because it will be used to load your ballot allowing users to vote"
        );
      });
  });
}

function fillSetup(
  votingAddress,
  choicesArray,
  whitelistedArray,
  whitelist,
  ballotid
) {
  fillCandidates(votingAddress, choicesArray);
  if (whitelist == 1) {
    fillWhitelisted(votingAddress, whitelistedArray);
  }
}

function fillCandidates(votingAddress, choicesArray) {
  Voting.at(votingAddress).then(function (contract) {
    contract
      .setCandidates(choicesArray, {
        gas: 2500000,
        from: web3.eth.accounts[0],
      })
      .then(function () {
        contract
          .hashCandidates({
            gas: 2500000,
            from: web3.eth.accounts[0],
          })
          .then(function () {
            //
          });
      });
  });
}

function fillWhitelisted(votingAddress, whitelistedArray) {
  Voting.at(votingAddress).then(function (contract) {
    contract
      .setWhitelisted(whitelistedArray, {
        gas: 2500000,
        from: web3.eth.accounts[0],
      })
      .then(function () {
        //
      });
  });
}

//End ballot creation process

function getCandidates(votingAddress, ballotID) {
  Voting.at(votingAddress).then(function (contract) {
    contract.getTitle.call().then(function (title) {
      $("#btitle").html(title);

      contract.candidateList.call(ballotID).then(function (candidateArray) {
        for (let i = 0; i < candidateArray.length; i++) {
          candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i;
        }

        setupTable();
        getVotes(votingAddress);
      });
    });
  });
}

function setupTable() {
  Object.keys(candidates).forEach(function (candidate) {
    $("#candidate-rows").append(
      "<tr><td>" +
        candidate +
        "</td><td id='" +
        candidates[candidate] +
        "'></td></tr>"
    );
  });
}

function getVotes(votingAddress) {
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let cvHash = sha3withsize(name, 32);

    Voting.at(votingAddress).then(function (contract) {
      contract.totalVotesFor.call(cvHash).then(function (v) {
        var convVote = v.toString();
        if (convVote == 0) {
          contract.getTimelimit.call().then(function (v) {
            var endtime = v.toString();
            //Testnet is plus 7 hours, uncomment this line if testing on testnet
            //endtime = endtime - 21600
            endtime = new Date(endtime * 1000);
            $("#msg").html(
              "Results will be displayed once the voting period has ended (" +
                endtime +
                ")"
            );
            //window.alert("Results will be displayed once the voting period has ended (" + endtime + ")")
          });
        } else {
          convVote = scientificToDecimal(convVote);
          decrypt(convVote, name);
        }
      });
    });
  }
}

function decrypt(convVote, name) {
  const url = "http://localhost:3000/decrypt/" + convVote;
  axios
    .get(url)
    .then(function (response) {
      var voteNum = response;
      $("#" + candidates[name]).html(voteNum.toString());
    })
    .catch(function (error) {
      console.log(error);
    });

  // $.ajax({
  //     type: "GET",
  //     url: "http://localhost:3000/decrypt/" + convVote,
  //     success: function(eoutput) {
  //         var voteNum = eoutput
  //         $("#" + candidates[name]).html(voteNum.toString())
  //     }
  // })
}
