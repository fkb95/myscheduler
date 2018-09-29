var appointments = new Array();
var currentData = new Array();
var scheduler = $("#scheduler");
var view = "";

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   view = "dayView";
}else{
   view = "weekView";
}

function save(data){
   if(!data){
      currentData = scheduler.jqxScheduler('getAppointments');
      appointments = [];
      $.each(currentData, function(i, currentAppointment){
         appointments.push(currentAppointment.originalData);
      });
      data = appointments;
   }
   $.ajax({
      url: 'src/php/salvacarica.php',
      data: JSON.stringify(data, null, 2),
      type: "POST",
      success: function (response) {
         console.log("Salvato");
      },
      error: function (response) {
         console.log("Non salvato, errore: \r\n" + response);
      }
   });
}

scheduler.on('appointmentAdd', function (event) {
   appointments.push(event.args.appointment.originalData);
   save(appointments);
});

scheduler.on('appointmentChange', function (event) {
   save();
});

scheduler.on('appointmentDelete', function (event) {
   appointments.splice($.inArray(event.args.appointment, appointments),1);
   save(appointments);
});

$(document).ready(function () {
   $.ajax({
      url: 'src/php/salvacarica.php',
      type: "POST",
      success: function (response) {
         appointments = JSON.parse(response);
         $.each(appointments, function (i, value){
            appointments[i].start = new Date(appointments[i].start);
            appointments[i].end = new Date(appointments[i].end);
         })
         var source = {
            dataType: "json",
            dataFields: [
               { name: 'allDay', type: 'boolean' },
               { name: 'background', type: 'string' },
               { name: 'borderColor', type: 'string' },
               { name: 'color', type: 'string' },
               { name: 'description', type: 'string' },
               { name: 'draggable', type: 'boolean' },
               { name: 'id', type: 'string' },
               { name: 'location', type: 'string' },
               { name: 'subject', type: 'string' },
               { name: 'status', type: 'string' },
               { name: 'tooltip', type: 'string' },
               { name: 'start', type: 'date' },
               { name: 'end', type: 'date' }
            ],
            id: 'id',
            localData: appointments
            //url: 'src/php/results.json'
         };
         var adapter = new $.jqx.dataAdapter(source);
         scheduler.jqxScheduler({
            date: new $.jqx.date('todayDate'),
            source: adapter,
            width: '100%',
            height: 600,
            theme: "metro",
            view: view,
            showLegend: true,
            timeZone:"'W. Europe Standard Time' - (offsetMinutes: 60, offsetHours: 1, text: '(UTC+01:00) Amsterdam, Berlin, Rome'",
            localization: {
               firstDay: 1,
               days: {
                  names: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
                  namesAbbr: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
                  namesShort: ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"]
               },
               months: {
                  names: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
                  namesAbbr: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
               }
            },
            ready: function () {
               scheduler.jqxScheduler('ensureAppointmentVisible', 'id1');
            },
            resources:
            {
               colorScheme: "scheme05",
               dataField: "calendar",
               source: new $.jqx.dataAdapter(source)
            },
            appointmentDataFields:
            {
               allDay: "allDay",
               background: "background",
               borderColor: "borderColor",
               color: "color",
               description: "description",
               draggable: "draggable",
               from: "start",
               id: "id",
               location: "location",
               subject: "subject",
               style: "style",
               status: "status",
               to: "end",
               tooltip: "tooltip",
            },
            views:
            [
               'dayView',
               'weekView',
               'monthView'
            ]
         });
      },
      error: function (response) {
         console.log(response);
      }
   });
});
