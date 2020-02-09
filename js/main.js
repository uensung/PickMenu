var typeSelectBar       = document.getElementById('typeSelectBar');
var restaurantSelectBar = document.getElementById('restaurantSelectBar');
var pupSelectBar        = document.getElementById('pubSelectBar');
var viewFrame           = document.getElementById('viewFrame');
var userAreaList        = document.getElementsByClassName('userArea');

var userID;
var userName;

var inputUserName            = document.getElementById('inputUserName');
var inputRestaurantSelectBar = document.getElementById('inputRestaurantSelectBar');
var inputPubSelectBar        = document.getElementById('inputPubSelectBar');
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

    setStyleSelectBox('typeSelectBar');
    getLocationSheet('1869778460', restaurantSelectBar);
    getLocationSheet('1585030241', pubSelectBar);
    getUserSheet('1887373853');
  });
}

handleClientLoad();

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
        if(target.id == "restaurantSelectBar") {
          inputRestaurantSelectBar.appendChild(optionEl.cloneNode(true));
        } else {
          inputPubSelectBar.appendChild(optionEl.cloneNode(true));
        }
      }

      setStyleSelectBox(target.id);
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
        tempEl.querySelector('#resultRestaurantSelectBar').innerHTML = contentData[i].D;
        tempEl.querySelector('#resultPubSelectBar').innerHTML = contentData[i].E;
        resultArea.appendChild(tempEl);
      }
    }
  });
};

inputSubmit.addEventListener('click', function() {
  insertSheet(userName, inputFirstDate.value, inputSecondDate.value, inputRestaurantSelectBar.value, inputPubSelectBar.value);
})

function insertSheet(name, firstDate, secondDate, place1, place2) {
  var rangeNum = 0;
  gsheet.query({
    gid: 1887373853,
    sql : "SELECT A",
    callback : function(contentData){
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

function setStyleSelectBox(id) {
  $('#' + id).each(function(){
    var $this = $(this), numberOfOptions = $(this).children('option').length;
    $this.addClass('select-hidden');
    $this.wrap('<div id="' + id + 'Wrapper" class="select"></div>');
    $this.after('<div class="select-styled" tabIndex="0"></div>');

    var mouseEnterState = false;

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
      'class': 'select-options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val(),
        title : $this.children('option').eq(i).attr('title'),
        selectId : id
      }).appendTo($list);
    }

    var $listItems = $list.children('li');

    $styledSelect.on('click', function(e) {
      e.stopPropagation();
      $('div.select-styled.active').not(this).each(function(){
        $(this).removeClass('active').next('ul.select-options').hide();
      });
      $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    $listItems.on('mouseover', function() {
      mouseEnterState = true;
    });

    $listItems.on('mouseleave', function() {
      mouseEnterState = false;
    });

    $styledSelect.on('blur', function(e) {
      if(mouseEnterState) {
        return;
      }
      $styledSelect.removeClass('active');
      $list.hide();
    });

    $listItems.click(function(e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();

      if($(this).attr('selectId') == "typeSelectBar") {
        changeTypeSelectBar($(this).attr('rel'));
      } else if($(this).attr('selectId') == "restaurantSelectBar" || $(this).attr('selectId') == "pubSelectBar") {
        viewFrame.src = $(this).attr('title');
      }
    });
  });
}

function changeTypeSelectBar(value) {
  if(value == 'restaurant') {
    restaurantSelectBar.parentElement.style.display = "inline-block";
    pubSelectBar.parentElement.style.display        = "none";
    restaurantSelectBar.value = restaurantSelectBar.children[0].value
    viewFrame.src = restaurantSelectBar.children[0].title;
  } else {
    restaurantSelectBar.parentElement.style.display = "none";
    pubSelectBar.parentElement.style.display        = "inline-block";
    pupSelectBar.value = pubSelectBar.children[0].value;
    viewFrame.src = pubSelectBar.children[0].title;
  }
}
