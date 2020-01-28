function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  var API_KEY = 'AIzaSyCfNoq2No-owx_i42mG4kiEdkGx65QZfZw';
  var CLIENT_ID = '343526104780-hrkiqtdfbmgk611d4b5i37l353q32mi8.apps.googleusercontent.com';
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function updateSignInStatus(isSignedIn) {
  if(isSignedIn) {
    window.location = "main.html";
  } else {
    console.error('initClient 완료');
  }
}

handleClientLoad();

var googleLoginBtn   = document.getElementById('googleLoginBtn');

googleLoginBtn.addEventListener('click', function() {
  handleSignInClick();
});

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
