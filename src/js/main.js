var alerts = new Array();
var noticecontainer = document.getElementById("noticecontainer");
var snd_alert = new Audio("src/snd/alert.ogg");
var snd_login = new Audio("src/snd/start.ogg");
var newalert = 0;

$('#rownewalert').hide();

function setbackground(){
   var bg = ["src/img/1.jpg","src/img/2.jpg","src/img/3.jpg","src/img/4.jpg"];
   var n = Math.floor(Math.random() * bg.length);
   document.body.style.backgroundImage = "url('"+bg[n]+"')";
};

function todayis(){
   var data = new Date();
   var weekday = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
   var giorno = weekday[data.getDay()-1];
   $.each(document.getElementsByClassName("todayis"), function(i, elem){
      elem.innerHTML = giorno;
   })
}

function setNote(data){
   var str =
   '<div class="clearfix alert alert-warning animated shake" role="alert">'+
      '<span id="alerttext" class="float-left">'+ data +'</span>'+
      '<button id="nextAlert" class="float-right btn btn-sm btn-warning" onClick="changeAlert()"><i class="fas fa-step-forward fa-xs"></i></button>' +
   '</div>';
   noticecontainer.innerHTML = str;
}

function changeAlert(){
   if($('#rowalerts').css('display')!="none"){
      var n = Math.floor(Math.random() * alerts.length);
      while(alerts[n] == $("#alerttext").html()){
         n = Math.floor(Math.random() * alerts.length);
      }
      setNote(alerts[n]);
      snd_alert.play();
   }
};

function loadAlerts() {
   var counter = 0;
   var inst;
   $.ajax({
      url: 'src/php/alerts.php',
      type: "POST",
      success: function (response) {
         alerts = JSON.parse(response);
         if(alerts.length>0){
            changeAlert();
            inst = setInterval(changeAlert, 180000);
         }else{
            setNote("Non hai aggiunto ancora nessuna nota!");
         }
      },
      error: function (response) {
         setNote("Non hai aggiunto ancora nessuna nota!");
         console.log(response);
      }
   });
};

function changeNotesRow(){
   if(newalert==0){
      $('#rowalerts').hide();
      $('#rownewalert').show();
   }else{
      $('#rownewalert').hide();
      $('#rowalerts').show();
   }
   newalert = !newalert;
}

function saveNote(){
   var newalertstring = $("#newalertinput").val();
   if(newalertstring != ""){
      alerts.push(newalertstring);
      $.ajax({
         url: 'src/php/alerts.php',
         data: JSON.stringify(alerts),
         type: "POST",
         success: function (response) {
            console.log(response);
         },
         error: function (response) {
            console.log(response);
         }
      });
   }
   setNote(newalertstring);
   changeNotesRow();
}

function deleteNote(){
   var oldalertstring = $("#alerttext").html();
   alerts.splice($.inArray(oldalertstring, alerts),1);
   $.ajax({
      url: 'src/php/alerts.php',
      data: JSON.stringify(alerts),
      type: "POST",
      success: function (response) {
         console.log(response);
      },
      error: function (response) {
         console.log(response);
      }
   });
   changeAlert();
}

$(document).ready(function () {
   setbackground();
   todayis();
   loadAlerts();

   snd_login.play();
});
