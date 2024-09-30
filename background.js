//metodo para recrear las alarmas
function recreateAlarms(){
    chrome.storage.local.get({reminders: []}, function (data){
        data.reminders.array.forEach(reminder => {
            const alarmName = `reminder_${reminder.id}`;
            const alarmTime = new Date(`${reminder.date} ${reminder.time}`).getTime();
            const timeUntilReminder = alarmTime - Date.now();

            if (timeUntilReminder > 0) {
                chrome.alarms.create(alarmName, { when: alarmTime });
                console.log('Alarma recreada:', alarmName, 'para', new Date(alarmTime));
            }
        });
    });
}

//al inciar la extension 
chrome.runtime.onStartup.addListener(function (){
    recreateAlarms();
});

//al instalar o cargar extension
chrome.runtime.onInstalled.addListener(function (){
    recreateAlarms();
});

// Evento de la alarma
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.action === 'createAlarm'){
        const reminder = message.reminder;
        const alarmName = `reminder_${reminder.id}`;
        const alarmTime = new Date(reminder.date + ' ' + reminder.time).getTime();

        // tiempo de recordatorio

        const timeUntilReminder = alarmTime - Date.now();

        // creacion de la alarma como tal
        if(timeUntilReminder > 0){
            chrome.alarms.create(alarmName, {when: alarmTime});
            console.log('Alarma creada:', alarmName, 'para', new Date(alarmTime));
        }else{
            console.log('fecha y hora seleccionadas ya han pasado!');
        }
    }
});

// Evento de escuchar alarma 
chrome.alarms.onAlarm.addListener(function (alarm){
    if(alarm.name.startsWith('reminder_')){
        const reminderId = alarm.name.split('_')[1];

        //obtener el recordatorio
        chrome.storage.local.get({reminders: []}, function(data){
            const reminder = data.reminders.find(r => r.id.toString() === reminderId);
            if(reminder){
                chrome.notifications.create(alarm.name, {
                    type: 'basic',
                    iconUrl: 'https://www.shutterstock.com/image-vector/dog-graphic-icon-riesenschnauzer-sign-260nw-1675270249.jpg',
                    title: 'Reminder',
                    message: reminder.title,
                    priority: 2
                });
            }
        });
    }
});