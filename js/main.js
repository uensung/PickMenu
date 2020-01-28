var typeSelectBar       = document.getElementById('typeSelectBar');
var restaurantSectctBar = document.getElementById('restaurantSectctBar');
var pupSectctBar        = document.getElementById('pubSectctBar');
var viewFrame           = document.getElementById('viewFrame');
var userAreaList        = document.getElementsByClassName('userArea');

var userID;
var userName;

var inputUserName            = document.getElementById('inputUserName');
var inputRestaurantSectctBar = document.getElementById('inputRestaurantSectctBar');
var inputPubSectctBar        = document.getElementById('inputPubSectctBar');
var inputFirstDate           = document.getElementById('inputFirstDate');
var inputSecondDate          = document.getElementById('inputSecondDate');
var inputSubmit              = document.getElementById('inputSubmit');

var resultArea               = document.getElementById('resultArea');
var resultEl                 = document.getElementById('resultEl');


var gsheet = new GSheet("1zDGhYQ5KdqnN-tBlTZEoPytwfgCflBrbxAVb2vT_1SM");

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
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      window.location = "/PickMenu";
    }  

    userID   = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
    userName = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();

    console.error('userID', userID);
    console.error('userName', userName);

    getLocationSheet('1869778460', restaurantSectctBar);
    getLocationSheet('1585030241', pubSectctBar);
    getUserSheet('1887373853');
  });
}

handleClientLoad();

typeSelectBar.addEventListener('change', function() {
  if(this.value == 'restaurant') {
    restaurantSectctBar.style.display = "block";
    pubSectctBar.style.display        = "none";
    restaurantSectctBar.value = restaurantSectctBar.children[0].value
    viewFrame.src = restaurantSectctBar.children[0].title;
  } else {
    restaurantSectctBar.style.display = "none";
    pubSectctBar.style.display        = "block";
    pupSectctBar.value = pubSectctBar.children[0].value;
    viewFrame.src = pubSectctBar.children[0].title;
  }
});

restaurantSectctBar.addEventListener('change', function() {
  viewFrame.src = document.getElementById(this.value).title;
});

pupSectctBar.addEventListener('change', function() {
  viewFrame.src = document.getElementById(this.value).title;
});

function getLocationSheet(id, target){
  gsheet.query({
    gid: id,
    sql : "SELECT A, B",
    callback : function(contentData){
      inputUserName.innerHTML = userName;

      for(var i=1; i<contentData.length; i++) {
        var optionEl = document.createElement("option");
        optionEl.value     = contentData[i].A;
        optionEl.id        = contentData[i].A;
        optionEl.title     = contentData[i].B;
        optionEl.innerHTML = contentData[i].A;
        // iframe 변경 select bar 설정
        target.appendChild(optionEl.cloneNode(true));

        // input 변경 select bar 설정
        if(target.id == "restaurantSectctBar") {
          inputRestaurantSectctBar.appendChild(optionEl.cloneNode(true));
        } else {
          inputPubSectctBar.appendChild(optionEl.cloneNode(true));
        }
      }
    }
  });
};

function getUserSheet(id){
  gsheet.query({
    gid: id,
    sql : "SELECT A, B, C, D, E",
    callback : function(contentData){
      for(var i=0; i<contentData.length; i++) {
        var tempEl = resultEl.cloneNode(true);
        tempEl.style.display = "block";
        tempEl.querySelector('#resultUserName').innerHTML = contentData[i].A;
        tempEl.querySelector('#resultFirstDate').innerHTML = contentData[i].B;
        tempEl.querySelector('#resultSecondDate').innerHTML = contentData[i].C;
        tempEl.querySelector('#resultRestaurantSectctBar').innerHTML = contentData[i].D;
        tempEl.querySelector('#resultPubSectctBar').innerHTML = contentData[i].E;
        resultArea.appendChild(tempEl);
      }
    }
  });
};

inputSubmit.addEventListener('click', function() {
  insertSheet(userName, inputFirstDate.value, inputSecondDate.value, inputRestaurantSectctBar.value, inputPubSectctBar.value);
})

function insertSheet(name, firstDate, secondDate, place1, place2) {
  var rangeNum = 0;
  gsheet.query({
    gid: 1887373853,
    sql : "SELECT A",
    callback : function(contentData){
      console.error('insert get sheet', contentData);
      for(var i=0; i<contentData.length; i++) {
        if(contentData[i].A == name) {
          rangeNum = i + 1;
        }
      }
      if(rangeNum < 1) {
        rangeNum = contentData.length;
      }

      var range = "팀원!A" + rangeNum + ":E" + rangeNum;
      var params = {
        spreadsheetId: '1zDGhYQ5KdqnN-tBlTZEoPytwfgCflBrbxAVb2vT_1SM',
        range: range,
        valueInputOption: 'RAW',
      };

      var valueRangeBody = {
        "range": range,
        "majorDimension": "ROWS",
        "values": [
          [ name, firstDate, secondDate, place1, place2 ]
        ],
      };

      var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
      request.then(function(response) {
        window.location = "main.html";
      }, function(reason) {
        console.error(reason);
        console.error('error: ' + reason.result.error.message);
      });
    }
  });
}
