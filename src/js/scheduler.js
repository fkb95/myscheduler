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
   console.log(data);
   $.ajax({
      url: 'src/php/salvacarica.php',
      data: {
         "user": currentUser,
         "data": JSON.stringify(data, null, 2)
      },
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

function loadSchedulerData(){
   var mydata = {
      "user": currentUser,
      "data" : {}
   }
   $.ajax({
      url: 'src/php/salvacarica.php',
      data: JSON.stringify(mydata),
      type: "POST",
      success: function (response) {
         appointments = JSON.parse(response);
         if(appointments){
            $.each(appointments, function (i, value){
               appointments[i].start = new Date(appointments[i].start);
               appointments[i].end = new Date(appointments[i].end);
               /*console.log(appointments[i].recurrencePattern.freq);
               appointments[i].recurrencePattern.freq = appointments[i].recurrencePattern.freq.toUpperCase();
               console.log(appointments[i].recurrencePattern.freq);
               delete appointments[i].recurrencePattern.from;
               delete appointments[i].recurrencePattern.to;
               delete appointments[i].recurrencePattern.exceptions;
               delete appointments[i].recurrencePattern.newExceptions;
               delete appointments[i].recurrencePattern.month;
               delete appointments[i].recurrencePattern.day;
               delete appointments[i].recurrencePattern.current;
               delete appointments[i].recurrencePattern.currentYearDay;
               delete appointments[i].recurrencePattern.step;
               delete appointments[i].recurrencePattern.days;
               delete appointments[i].recurrencePattern.bynweekday;
               delete appointments[i].recurrencePattern.isEveryWeekDay;
               delete appointments[i].recurrencePattern.timeZone;
               delete appointments[i].recurrencePattern.weekDays;*/
            });
         }
         //console.log(appointments);
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
               //{ name: 'recurrencePattern', type: 'object'},
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
            date: new $.jqx.date(new Date()),
            source: adapter,
            width: '100%',
            height: 620,
            theme: "metro",
            view: view,
            showToolbar: true,
            columnsHeight: 25,
            showLegend: true,
            rowsHeight: 25,
            //timeZone:"'W. Europe Standard Time' - (offsetMinutes: 60, offsetHours: 1, text: '(UTC+01:00) Amsterdam, Berlin, Rome'",
            localization: {
               firstDay: 1,
               days: {
                  names: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
                  namesAbbr: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
                  namesShort: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"]
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
               //recurrencePattern: "recurrencePattern",
               subject: "subject",
               style: "style",
               status: "status",
               to: "end",
               tooltip: "tooltip",
               resourceId: "calendar"
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
}
