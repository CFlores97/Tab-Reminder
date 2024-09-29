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
                    iconUrl: 'icono/schnauzer.png',
                    title: 'Reminder',
                    message: reminder.title,
                    priority: 2
                });
            }
        });
    }
});