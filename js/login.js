function authApiCall() {
  var params = {
    spreadsheetId: '1zDGhYQ5KdqnN-tBlTZEoPytwfgCflBrbxAVb2vT_1SM',
    range: '팀원!A1'
    // valueInputOption: 'RAW',
  };

  // var valueRangeBody = {
  //   "range": "union!A1",
  //   "majorDimension": "ROWS",
  //   "values": [
  //     [ 'update test' ]
  //   ],
  // };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    console.log(response.result);

    console.error("gapi.auth.getToken().access_token : " + gapi.auth.getToken().access_token);
    console.error("encodeURIComponent(gapi.auth.getToken().access_token) : " + encodeURIComponent(gapi.auth.getToken().access_token));

    // location.replace("viewer.html");
  }, function(reason) {
    console.error("퍼미션 페일");
    console.error('error: ' + reason.result.error.message);
  });
}

// function authApiCall() {
//   var params = {
//     spreadsheetId: '1uKS3Jixwt2Crp6UcmcJpeWx8t-cCj4XJZ1wvWgxcN_s',
//     range: 'union!A1',
//     valueInputOption: 'RAW',
//   };
//
//   var valueRangeBody = {
//     "range": "union!A1",
//     "majorDimension": "ROWS",
//     "values": [
//       [ 'update test' ]
//     ],
//   };
//
//   var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
//   request.then(function(response) {
//   }, function(reason) {
//     console.error('error: ' + reason.result.error.message);
//   });
// }

function initClient() {
  var API_KEY = 'AIzaSyCfNoq2No-owx_i42mG4kiEdkGx65QZfZw';
  var CLIENT_ID = '343526104780-hrkiqtdfbmgk611d4b5i37l353q32mi8.apps.googleusercontent.com';
  //    TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/spreadsheets'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    console.error("Auth Result >>", gapi.auth2.getAuthInstance().isSignedIn.get());

    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {

  console.error("=======updateSignInStatus=======");
  console.error("isSignedIn", isSignedIn);

  if (isSignedIn) {
    authApiCall();
    // location.replace("viewer.html");
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
