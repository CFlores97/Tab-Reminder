/*Variables globales */
// array que contendra todos los meses del año
var monthNames = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

var now = new Date();
var day = now.getDate();
var month = now.getMonth();
var year = now.getFullYear();

var currentMonth = month;
var currentDay = day;


initCalendar();

/* Metodos */

// metodos del calendario

// inicializacion del calendario
function initCalendar() {
    document.getElementById("text_month_02").innerHTML = monthNames[month];
    document.getElementById("text_year").innerHTML = year;

    var container = document.querySelector(".container_days");

    container.innerHTML = '';

    // mostrar los dias del mes anterior en el calendario, los que salen en gris
    for (let i = getStartDay(); i > 0; i--) {
        var prevMonthDay = document.createElement('span');
        prevMonthDay.className = "week_days_item item_day prev_days";
        let prevMonth = month - 1 < 0 ? 11 : month - 1;
        let prevMonthYear = month - 1 < 0 ? year - 1 : year;
        prevMonthDay.textContent = getTotalDays(prevMonth, prevMonthYear) - (i - 1);

        container.appendChild(prevMonthDay);
    }

    // mostrar los dias actuales del mes en el calendario, asi mismo marcar el dia actual
    for (let i = 1; i <= getTotalDays(month); i++) {
        var diaSpan = document.createElement('span');
        if (i === day && month === currentMonth) {
            diaSpan.className = "week_days_item item_day today";
        } else {
            diaSpan.className = "week_days_item item_day";
        }
        diaSpan.textContent = i;
        container.appendChild(diaSpan);
    }
}

// retorna los meses siguientes
function getNextMonth() {
    if (month != 11) {
        month++;
    } else {
        year++;
        month = 0;
    }

    initCalendar();
}

// retorna los meses anteriores
function getPrevMonth() {
    if (month != 0) {
        month--;
    } else {
        year--;
        month = 11;
    }

    initCalendar();
}

// determina si el ano es bisiesto
function isBisiesto(year) {

    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// retorna el total de dias de cada mes
function getTotalDays(month, year) {
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 1) { // February
        return isBisiesto(year) ? 29 : 28;
    } else {
        return monthDays[month];
    }
}

// consigue el primer dia de cada mes 
function getStartDay() {
    var start = new Date(year, month, 1);
    return start.getDay();
}

// retorna la fecha seleccionada, en un objeto "Date"
function getSelectedDate(day) {
    var yearElement = document.getElementById("text_year").textContent;
    var monthElement = document.getElementById("text_month_02").textContent;

    var selMonth = monthNames.indexOf(monthElement);

    var selYear = parseInt(yearElement);
    //var selMonth = parseInt(monthElement);

    console.log("Año: " + selYear + ", Mes: " + monthElement + ", Día: " + day);

    var selDate = new Date(selYear, selMonth, day);
    return selDate;
}

// Se encarga de mostrar el formulario, con una transicion
function setFormVisible() {
    var form = document.getElementById("formularioRecordatorio")
    form.style.opacity = 1;
}

// Se encagra de esconder el formulario, tambien con una transicion
function setFormInvisible() {
    var form = document.getElementById("formularioRecordatorio");
    form.style.display = 'none';
    var temp_img = document.getElementById("bg-image");
    temp_img.style.display = 'none'
    var temReminder = document.querySelectorAll("#reminderElement");

    for (let i = 0; i < temReminder.length; i++) {
        temReminder[i].style.display = 'block';
    }
}

// Se encarga de verificar si el formulario esta oculto
function addReminderLogic(form, bg_img, reminderEls) {
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        setTimeout(setFormVisible, 10);
        bg_img.style.display = 'none';

        for (let i = 0; i < reminderEls.length; i++) {
            reminderEls[i].style.display = 'none';
        }

    } else {
        form.style.opacity = 0;
        setTimeout(setFormInvisible, 500);
    }
}

// Metodo para validar que haya escrito el titulo del reminder
function validateForm(reminderTit) {
    return reminderTit === "" ? false : true;
}

//metodo para crear el elemento div que sera el "reminder" como tal 
function createReminderElement(reminderObj) {
    var reminder = document.createElement("div");
    reminder.id = "reminderElement";
    reminder.className = "reminderElement";
    reminder.setAttribute('data-reminder-id', reminderObj.id);

    // Crea un elemento input (checkbox)
    var reminderTitleEl = document.createElement('input');
    reminderTitleEl.id = "checkbox-id";
    reminderTitleEl.type = 'checkbox';
    reminderTitleEl.name = 'name';
    reminderTitleEl.value = 'value';
    reminderTitleEl.checked = reminderObj.completed || false;

    // Evento al hacer clic en el checkbox
    reminderTitleEl.addEventListener('change', function () {
        // Actualizar el estado en chrome.storage.local
        chrome.storage.local.get({ reminders: [] }, function (data) {
            const reminders = data.reminders.map(r => {
                if (r.id === reminderObj.id) {
                    r.completed = reminderTitleEl.checked;
                }
                return r;
            });
            chrome.storage.local.set({ reminders: reminders }, function () {
                console.log('Estado del recordatorio actualizado:', reminderObj.id);
            });
        });

        // Actualizar la interfaz de usuario
        if (reminderTitleEl.checked) {
            label.style.textDecoration = 'line-through';
        } else {
            label.style.textDecoration = 'none';
        }
    });

    // Establecer el estilo inicial
    if (reminderTitleEl.checked) {
        label.style.textDecoration = 'line-through';
    }

    // Crea un label para el recordatorio
    var label = document.createElement('label');
    label.htmlFor = "checkbox-id";
    label.id = "reminderTitle";

    // Obtiene el nombre del recordatorio
    var labelValue = document.createTextNode(reminderObj.title);
    label.appendChild(labelValue);

    reminder.appendChild(reminderTitleEl);
    reminder.appendChild(label);

    // Lógica para la descripción
    if (reminderObj.description !== "") {
        var remDesc = document.createElement('p');
        remDesc.id = "reminderDesc";
        remDesc.innerHTML = reminderObj.description;
        reminder.appendChild(remDesc);
    }

    // Lógica para la fecha y hora
    if (reminderObj.date != null && reminderObj.time != null) {
        var remDate = document.createElement('p');
        remDate.id = "reminderDate";
        remDate.innerHTML = `${reminderObj.date} at ${reminderObj.time}`;
        reminder.appendChild(remDate);
    }

    // Crear botón de eliminar
    var deleteButton = document.createElement('button');
    deleteButton.id = "reminderDeleteBtn";

    // Icono
    var delIcon = document.createElement('i');
    delIcon.className = "fa-regular fa-trash-can";
    delIcon.style.color = '#f82525';
    deleteButton.appendChild(delIcon);

    // Texto
    var deleteText = document.createTextNode(" Delete");
    deleteButton.appendChild(deleteText);

    deleteButton.onclick = function () {
        // Eliminar del DOM
        reminder.remove();

        // Eliminar del almacenamiento
        chrome.storage.local.get({ reminders: [] }, function (data) {
            const filteredReminders = data.reminders.filter(r => r.id !== reminderObj.id);
            chrome.storage.local.set({ reminders: filteredReminders }, function () {
                console.log('Recordatorio eliminado del almacenamiento:', reminderObj.id);
            });
        });
    };
    reminder.appendChild(deleteButton);

    return reminder;
}

function getNormalizedDomain(tabUrl) {
    try {
        if (tabUrl.startsWith('http://') || tabUrl.startsWith('https://')) {
            var domain = (new URL(tabUrl)).hostname;
            domain = domain.replace(/^www\./, '').toLowerCase();
            return domain;
        } else {
            // Manejar URLs especiales
            return tabUrl; // O 'unknown', según prefieras
        }
    } catch (error) {
        console.error('Error al analizar la URL:', error);
        return 'unknown';
    }
}

//metodo para agregar recordatorios existentes 
function loadReminders(tabDomain) {
    const remContainer = document.getElementById("items");

    // Eliminar los recordatorios existentes en el DOM
    const reminders = remContainer.querySelectorAll(".reminderElement");
    reminders.forEach(reminder => reminder.remove());

    // Cargar recordatorios desde el almacenamiento
    chrome.storage.local.get({ reminders: [] }, function (data) {
        if (data.reminders && data.reminders.length > 0) {
            // Filtrar los recordatorios que coincidan con el dominio actual
            const filteredReminders = data.reminders.filter(reminderObj => {
                return reminderObj.domain === tabDomain;
            });

            // Agregar los recordatorios filtrados al DOM
            filteredReminders.forEach(reminderObj => {
                const reminderElement = createReminderElement(reminderObj);
                remContainer.appendChild(reminderElement);
            });
        } else {
            console.log("No hay recordatorios para cargar.");
        }
    });
}


// metodo para esconder calendario 
function hideCalendar(calendar) {
    calendar.style.opacity = 0;
    setTimeout(() => {
        calendar.style.display = 'none';
    }, 500);
}

// metodo para mostrar calendario
function displayCalendar(calendar) {
    calendar.style.display = 'flex';
    setTimeout(() => {
        calendar.style.opacity = 1;
    }, 10);
}


/* Eventos de los botones */

document.getElementById("next_month").addEventListener('click', getNextMonth);

document.getElementById("last_month").addEventListener('click', getPrevMonth);

document.getElementById("addBtn").addEventListener('click', function (event) {
    event.preventDefault(); //previene que el elemento "a" recargue la pagina

    // form
    var form = document.getElementById("formularioRecordatorio");

    // background image
    var bg_img = document.getElementById("bg-image");

    // reminder element
    var reminderEls = document.querySelectorAll("#reminderElement");

    // Se encarga de verificar si el formulario esta oculto
    addReminderLogic(form, bg_img, reminderEls);
});

document.getElementById("priority-menu-btn").addEventListener('click', function () {
    var priorityMenu = document.getElementById("priority-menu");
    var calendar = document.querySelector(".calendar-container");

    if (calendar.style.display !== 'none') {
        calendar.style.opacity = 0;
        setTimeout(() => {
            calendar.style.display = 'none';
        }, 500);
    }

    if (priorityMenu.style.display === 'none' || priorityMenu.style.display === '') {
        priorityMenu.style.display = 'block';
        setTimeout(() => {
            priorityMenu.style.opacity = 1;
        }, 10);
    } else {
        priorityMenu.style.opacity = 0;
        setTimeout(() => {
            priorityMenu.style.display = 'none'
        }, 500);
    }
});

document.getElementById("date-btn").addEventListener('click', function () {
    var calendar = document.querySelector(".calendar-container");
    var priorityMenu = document.getElementById("priority-menu");

    if (priorityMenu.style.display !== 'none') {
        priorityMenu.style.opacity = 0;
        setTimeout(() => {
            priorityMenu.style.display = 'none';
        }, 500);
    }

    if (calendar.style.display === 'none' || calendar.style.display === '') {
        displayCalendar(calendar);
    }
    else {
        hideCalendar(calendar);
    }
});

document.getElementById("cancel-btn").addEventListener('click', function () {
    var form = document.getElementById("formularioRecordatorio");

    form.style.opacity = 0;
    setTimeout(setFormInvisible, 500);
});


document.addEventListener('DOMContentLoaded', function () {
    // se utiliza delegacion de eventos
    var container = document.querySelector(".container_days");
    var calendar = document.querySelector(".calendar-container");
    var selectedDate = null;

    //tab actual
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var tabUrl = activeTab.url;
        var tabDomain = getNormalizedDomain(tabUrl);

        console.log('Tab URL:', tabUrl);
        console.log('Tab Domain:', tabDomain);

        loadReminders(tabDomain);
    });

    // se le agrega un solo listener al contenedor de los dias, en lugar de todos los dias por individual
    container.addEventListener('click', function (event) {
        try {
            // logica para seleccionar dias previos 
            if (event.target.classList.contains('prev_days')) {
                var day = parseInt(event.target.textContent);
                var currentMonth = month;
                var currentYear = year;

                // Calcular el mes y año correctos para los días del mes anterior
                var prevMonth = currentMonth - 1;
                var prevMonthYear = currentYear;
                if (prevMonth < 0) {
                    prevMonth = 11;
                    prevMonthYear--;
                }

                selectedDate = new Date(prevMonthYear, prevMonth, day);
                hideCalendar(calendar);
            }
            // logica para seleccionar dias del mes que se esta presentando en la vista
            else if (event.target.classList.contains('item_day')) {
                var day = parseInt(event.target.textContent);
                selectedDate = getSelectedDate(day);
                hideCalendar(calendar)
            }


        } catch (error) {
            alert("Ocurrio un error al seleccionar una fecha!");
            console.log("Error: ", error.message);
        }
    });

    // evento para guardar el recordatorio
    document.getElementById("save-btn").addEventListener('click', function () {
        try {
            var input_area = document.getElementById("title-input");
            var reminderTit = input_area.value;
            var timePicker = document.getElementById('time-picker');
            var selectedTime = timePicker.value;
            var descriptionEl = document.getElementById("rem-description");
            var description = descriptionEl.value;

            //validacion de fecha
            var currentDateTime = new Date();

            if (validateForm(reminderTit)) {
                if (selectedTime) {
                    var [hours, minutes] = selectedTime.split(':');
                    selectedDate.setHours(hours, minutes, 0, 0);
                    var formattedTime = `${hours}:${minutes}`;

                    if (selectedDate < currentDateTime) {
                        alert("No puedes seleccionar fechas y horas pasadas!");
                        return;
                    }

                    //al crear un recordatorio, almacena el dominio de la tab actual
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        var activeTab = tabs[0];
                        var tabUrl = activeTab.url;
                        var tabDomain = getNormalizedDomain(tabUrl);

                        console.log('Tab URL:', tabUrl);
                        console.log('Tab Domain:', tabDomain);

                        var reminderObj = {
                            title: reminderTit,
                            description: description,
                            date: selectedDate.toDateString(),
                            time: formattedTime,
                            id: selectedDate.getTime(),
                            domain: tabDomain
                        };

                        // Guardar en el almacenamiento
                        chrome.storage.local.get({ reminders: [] }, (data) => {
                            const reminders = data.reminders;
                            reminders.push(reminderObj);
                            chrome.storage.local.set({ reminders: reminders }, () => {
                                console.log("Recordatorio guardado en el almacenamiento");

                                // Creando una alarma
                                chrome.runtime.sendMessage({
                                    action: 'createAlarm',
                                    reminder: reminderObj
                                });
                            });
                        });

                        // Crear elemento de recordatorio y agregar al DOM
                        const reminderElement = createReminderElement(reminderObj);
                        document.getElementById("items").appendChild(reminderElement);

                        setFormInvisible();
                    });


                } else {
                    alert("¡Asegúrese de seleccionar la hora a la que se notificará su recordatorio!");
                }
            } else {
                alert("¡Acuérdate de no dejar vacío el campo del título!");
            }

        } catch (error) {
            alert("Ocurrio un error!");
            console.log("Error: ", error.message);
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var priorities = document.querySelectorAll('.priority-btn');
    priorities.forEach(function (priorityElement) {
        priorityElement.addEventListener('click', function () {
            var selPriority = this.textContent;
            selPriority.trim();
            alert("La prioridad seleccionada es: " + selPriority);
        });
    });
});

