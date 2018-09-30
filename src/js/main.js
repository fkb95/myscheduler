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
   var weekday = ["Domenica", "Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
   var giorno = weekday[data.getDay()];
   $.each(document.getElementsByClassName("todayis"), function(i, elem){
      elem.innerHTML = giorno;
   })
}

function setNote(data){
   var str;
   if(!data.url){
      str =
      '<div class="clearfix alert alert-warning animated shake" role="alert">'+
         '<span id="alerttext" class="float-left">'+ data.text +'</span>'+
         '<button id="nextAlert" class="float-right btn btn-sm btn-warning" onClick="changeAlert()"><i class="fas fa-step-forward fa-xs"></i></button>' +
      '</div>';
   }else{
      str =
      '<div class="clearfix alert alert-warning animated shake" role="alert">'+
         '<span id="alerttext" class="float-left"><a href="' + data.url + '">'+ data.text +'</a></span>'+
         '<button id="nextAlert" class="float-right btn btn-sm btn-warning" onClick="changeAlert()"><i class="fas fa-step-forward fa-xs"></i></button>' +
      '</div>';
   }
   noticecontainer.innerHTML = str;
}

function changeAlert(){
   if($('#rowalerts').css('display')!="none"){
      var n = Math.floor(Math.random() * alerts.length);
      while(alerts[n].text == $("#alerttext").html()){
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

function addNote(){
   var newalertstring = $("#newalertinput").val();
   var newalertstringurl = $("#newalertinputurl").val();
   if(newalertstring != ""){
      if(newalertstringurl && !newalertstringurl.startsWith("http")){
         newalertstringurl = 'http://' + newalertstringurl;
      }
      var temp = {
         "text": newalertstring,
         "url": newalertstringurl
      }
      alerts.push(temp);
      saveNotes();
   }
   setNote(temp);
   changeNotesRow();
}

function deleteNote(){
   var oldalertstring = $("#alerttext").html();
   alerts.splice($.inArray(oldalertstring, alerts.text),1);
   saveNotes();
   changeAlert();
}

function saveNotes(){
   $.ajax({
      url: 'src/php/alerts.php',
      data: JSON.stringify(alerts, null, 2),
      type: "POST",
      success: function (response) {
         console.log(response);
      },
      error: function (response) {
         console.log(response);
      }
   });
}

$(document).ready(function () {
   setbackground();
   todayis();
   loadAlerts();

   snd_login.play();
});
