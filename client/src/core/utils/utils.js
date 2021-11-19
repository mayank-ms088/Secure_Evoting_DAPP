import { Mail } from "@material-ui/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { sha3withsize } from "solidity-sha3";

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
              parseInt(idNum),
              web3.utils.asciiToHex(domain),
              Number(permreq),
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
export const getData = async function ({ ballotID, onLoad, obj }) {
  const {
    web3,
    accounts,
    contracts: { Registrar },
  } = obj;
  const candidates = {};
  // console.log(typeof ballotID);
  Registrar.deployed().then(function (contract) {
    contract.getAddress.call(Number(ballotID)).then(async function (v) {
      var votingAddress = v.toString();
      if (votingAddress == 0) {
        onLoad("Invalid BallotID!");
      } else {
        const data = await getCandidates(votingAddress, ballotID, onLoad, obj);
        onLoad("success", data);
      }
    });
  });
};
export const voteForCandidate = async function ({
  candidate,
  email,
  obj,
  onVote,
  ballotID,
}) {
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  var domain = email.replace(/.*@/, "");
  var cHash = sha3withsize(web3.utils.asciiToHex(candidate), 32);

  var votesArray = [];

  const registrar = await Registrar.deployed();
  var voterCheck = await registrar.checkVoter(web3.utils.asciiToHex(email), {
    gas: 2500000,
    from: accounts[0],
  });
  voterCheck = voterCheck.toString();

  if (voterCheck == 1) {
    onVote("E-mail address not registered!");
  } else if (voterCheck == 2) {
    onVote("E-mail address and Ethereum address mismatch!");
  }

  var votingAddress = await registrar.getAddress.call(ballotID);
  votingAddress = votingAddress.toString();

  const voting = await Voting.at(votingAddress);
  const wc1 = await voting.checkWhitelist.call();
  let wc2 = await voting.checkifWhitelisted
    .call(web3.utils.asciiToHex(email))
    .toString();

  if (wc1 == "true" && wc2 == "false") {
    onVote("You're are not authorized to vote on this ballot!");
    return;
  } else {
    var candValid = await voting.validCandidate.call(cHash).toString();

    if (candValid == "false") {
      onVote("Invalid Candidate!");
      return;
    }
    var attempCheck = await voting.checkVoteattempts.call().toString();

    if (attempCheck == "false") {
      onVote("You have reached your voting limit for this ballot/poll!");
      return;
    }
    onVote(
      "Your vote attempt has been submitted. Please wait for verification."
    );

    const candidateArray = await voting.candidateList.call(ballotID);

    for (let i = 0; i < candidateArray.length; i++) {
      let hcand = web3.utils.toUtf8(candidateArray[i]);
      let hcHash = sha3withsize(web3.utils.asciiToHex(hcand), 32);
      var input1 = 1;
      var input2 = 0;

      if (hcHash == cHash) {
        encrypt(
          hcHash,
          input1,
          i,
          candidateArray,
          email,
          votingAddress,
          votesArray,
          onVote,
          obj
        );
      } else {
        encrypt(
          hcHash,
          input2,
          i,
          candidateArray,
          email,
          votingAddress,
          votesArray,
          onVote,
          obj
        );
      }
    }
  }
};

function encrypt(
  hcHash,
  vnum,
  i,
  candidateArray,
  email,
  votingAddress,
  votesArray,
  onVote,
  obj
) {
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  var einput1;
  const url = "http://localhost:8080/encrypt/" + vnum;
  axios
    .get(url)
    .then(function (response) {
      Voting.at(votingAddress).then(function (contract) {
        contract.votesFor.call(hcHash).then(function (v) {
          einput1 = v.toString();

          // einput1 = Number(einput1);
          // console.log(response.data.toString(), einput1);
          if (einput1 != 0) {
            add(
              response.data.toString(),
              einput1,
              i,
              candidateArray,
              email,
              votingAddress,
              votesArray,
              onVote,
              obj
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
  //                 einput1 = Number(einput1)

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
  votesArray,
  onVote,
  obj
) {
  const url = "http://localhost:8080/add/" + eoutput1 + "/" + einput1;
  axios
    .get(url)
    .then(function (response) {
      verifyTimestamp(
        response.data.toString(),

        i,
        candidateArray,
        email,
        votingAddress,
        votesArray,
        onVote,
        obj
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
  votesArray,
  onVote,
  obj
) {
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  Voting.at(votingAddress).then(function (contract) {
    contract.checkTimelimit.call().then(function (v) {
      var timecheck = v.toString();
      if (timecheck == "false") {
        contract.getTimelimit.call().then(function (v) {
          var endtime = v.toString();
          //Testnet is plus 7 hours, uncomment this line if testing on testnet
          //endtime = endtime - 21600
          endtime = new Date(endtime * 1000);
          //window.alert("Voting period for this ballot has ended on " +endtime)
          onVote("Voting period for this ballot has ended on " + endtime);
        });
      } else {
        votesArray[i] = eadd1;
        if (i == candidateArray.length - 1) {
          vote(
            i,
            candidateArray,
            email,
            votingAddress,
            votesArray,
            onVote,
            obj
          );
        }
      }
    });
  });
}

function vote(
  i,
  candidateArray,
  email,
  votingAddress,
  votesArray,
  onVote,
  obj
) {
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  Voting.at(votingAddress).then(function (contract) {
    contract
      .voteForCandidate(
        votesArray,
        web3.utils.asciiToHex(email),
        candidateArray,
        {
          gas: 2500000,
          from: accounts[0],
        }
      )
      .then(function () {
        onVote("success");
      });
  });
}

export const ballotSetup = function ({
  email,
  endDate,
  ballottype,
  title,
  choices,
  votelimit,
  whitelist,
  whitelisted,
  Registrar,
  Creator,
  Voting,
  web3,
  onCreation,
  accounts,
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
              // var enddate = Date.parse(date).getTime() / 1000;
              //Testnet is plus 7 hours
              //-21600 to get original end date and time on testnet
              // var timeArray = time.split(":");
              //Testnet is plus 7 hours, uncomment this line if testing on testnet
              //var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60) + 21600
              // var seconds = timeArray[0] * 60 * 60 + timeArray[1] * 60;
              // enddate += seconds;
              var choicesArray = choices.split(/\s*,\s*/);
              var whitelistedArray = whitelisted.split(/\s*,\s*/);
              let ballotid = Math.floor(Math.random() * 4294967295);

              Creator.deployed().then(function (contract) {
                contract
                  .createBallot(
                    endDate,
                    Number(ballottype),
                    votelimit,
                    ballotid,
                    title,
                    Number(whitelist),
                    {
                      gas: 2500000,
                      from: accounts[0],
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
                        Number(whitelist),
                        ballotid,
                        accounts,
                        Voting,
                        web3
                      );
                      registerBallot(
                        votingAddress,
                        ballotid,
                        accounts,
                        Registrar,
                        onCreation
                      );
                    });
                  });
              });
            }
          });
      }
    });
  });
};

function registerBallot(
  votingaddress,
  ballotid,
  accounts,
  Registrar,
  onCreation
) {
  Registrar.deployed().then(function (contract) {
    contract
      .setAddress(votingaddress, ballotid, {
        gas: 2500000,
        from: accounts[0],
      })
      .then(function () {
        onCreation("success", ballotid);
      });
  });
}

function fillSetup(
  votingAddress,
  choicesArray,
  whitelistedArray,
  whitelist,
  ballotid,
  accounts,
  Voting,
  web3
) {
  fillCandidates(votingAddress, choicesArray, accounts, Voting, web3);
  if (whitelist == 1) {
    fillWhitelisted(votingAddress, whitelistedArray, accounts, Voting, web3);
  }
}

function fillCandidates(votingAddress, choicesArray, accounts, Voting, web3) {
  let choices = [];
  choicesArray.map((v) => {
    choices.push(web3.utils.asciiToHex(v));
  });
  Voting.at(votingAddress).then(function (contract) {
    contract
      .setCandidates(choices, {
        gas: 2500000,
        from: accounts[0],
      })
      .then(function () {
        contract
          .hashCandidates({
            gas: 2500000,
            from: accounts[0],
          })
          .then(function () {
            //
          });
      });
  });
}

function fillWhitelisted(votingAddress, whitelistedArray, accounts, Voting) {
  Voting.at(votingAddress).then(function (contract) {
    contract
      .setWhitelisted(whitelistedArray, {
        gas: 2500000,
        from: accounts[0],
      })
      .then(function () {
        //
      });
  });
}

//End ballot creation process

async function getCandidates(votingAddress, ballotID, onLoad, obj) {
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  const candidates = {};
  const voting = await Voting.at(votingAddress);
  const title = await voting.getTitle.call();

  const candidateArray = await voting.candidateList.call(ballotID);
  for (let i = 0; i < candidateArray.length; i++) {
    candidates[web3.utils.toUtf8(candidateArray[i])] = "candidate-" + i;
  }
  const data = await getVotes(votingAddress, candidates, obj);
  return { data: data, title: title };
}

// function setupTable() {
//   Object.keys(candidates).forEach(function (candidate) {
//     $("#candidate-rows").append(
//       "<tr><td>" +
//         candidate +
//         "</td><td id='" +
//         candidates[candidate] +
//         "'></td></tr>"
//     );
//   });
// }

async function getVotes(votingAddress, candidates, obj) {
  let candidateNames = Object.keys(candidates);
  const {
    web3,
    accounts,
    contracts: { Registrar, Voting },
  } = obj;
  const data = [];
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let cvHash = sha3withsize(web3.utils.asciiToHex(name), 32);
    let votes = 0;
    const voting = await Voting.at(votingAddress);
    var convVote = await voting.totalVotesFor.call(cvHash);
    convVote = convVote.toString();

    // if (convVote == 0) {
    //   var endtime = await voting.getTimelimit.call();
    //   endtime = endtime.toString();
    //   //Testnet is plus 7 hours, uncomment this line if testing on testnet
    //   //endtime = endtime - 21600
    //   endtime = new Date(endtime * 1000);
    //   // $("#msg").html(
    //   //   "Results will be displayed once the voting period has ended (" +
    //   //     endtime +
    //   //     ")"
    //   // );
    //   // window.alert("Results will be displayed once the voting period has ended (" + endtime + ")")
    // } else {

    console.log(convVote);
    votes = await decrypt(convVote, name);
    // }
    data.push({ id: cvHash, name: name, votes: votes });
  }
  return data;
}

async function decrypt(convVote, name) {
  const url = "http://localhost:8080/decrypt/" + convVote;
  const votes = await axios.get(url);
  return await votes.data;

  // $.ajax({
  //     type: "GET",
  //     url: "http://localhost:3000/decrypt/" + convVote,
  //     success: function(eoutput) {
  //         var voteNum = eoutput
  //         $("#" + candidates[name]).html(voteNum.toString())
  //     }
  // })
}
