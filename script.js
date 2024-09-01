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

    for (let i = getStartDay(); i > 0; i--) {
        var prevMonthDay = document.createElement('span');
        prevMonthDay.className = "week_days_item item_day prev_days";
        prevMonthDay.textContent = getTotalDays(month - 1) - (i - 1);

        container.appendChild(prevMonthDay);
    }

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
function isBisiesto() {

    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// retorna el total de dias de cada mes
function getTotalDays() {
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
    temp_img.style.display = 'block'
}

// Se encarga de verificar si el formulario esta oculto
function addReminderLogic(form, bg_img) {
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        setTimeout(setFormVisible, 10);
        bg_img.style.display = 'none';

    } else {
        form.style.opacity = 0;
        setTimeout(setFormInvisible, 500);
    }
}

// Metodo para validar que haya escrito el titulo del reminder
function validateForm(reminderTit) {
    return reminderTit === "" ? false : true;
}

function onSaveClick(date) {

}

//metodo para crear el elemento div que sera el "reminder" como tal 
function createReminderElement(reminderTit, sDate, sPriority) {
    var reminder = document.createElement("div");
    reminder.id = "reminderElement";

    // crea un elemento input
    var reminderTitleEl = document.createElement('input');
    reminderTitleEl.id = "checkbox-id";

    reminderTitleEl.type = 'checkbox';
    reminderTitleEl.name = 'name';
    reminderTitleEl.value = 'value';

    // crea un label para el recordatorio
    var label = document.createElement('label');
    label.htmlFor = "checkbox-id";
    label.id = "reminderTitle";

    // obtiene el nombre del recordatorio
    var labelValue = document.createTextNode(reminderTit);
    labelValue.id = "reminderTitle"
    label.appendChild(labelValue);

    reminder.appendChild(reminderTitleEl);
    reminder.appendChild(label);

    // logica para la descripcion
    var descriptionEl = document.getElementById("rem-description");

    if (descriptionEl.value !== "") {
        var remDesc = document.createElement('p');
        remDesc.id = "reminderDesc";
        remDesc.innerHTML = descriptionEl.value;
        reminder.appendChild(remDesc);
    }

    //logica para la fecha 
    if (sDate != null) {
        var remDate = document.createElement('p');
        remDate.id = "reminderDate";
        remDate.innerHTML  = sDate;
        reminder.appendChild(remDate);
    }

    //logica para el nivel de prioridad


    document.getElementById("items").appendChild(reminder);
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

    // Se encarga de verificar si el formulario esta oculto
    addReminderLogic(form, bg_img);
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
        calendar.style.display = 'flex';
        setTimeout(() => {
            calendar.style.opacity = 1;
        }, 10);
    }
    else {
        calendar.style.opacity = 0;
        setTimeout(() => {
            calendar.style.display = 'none';
        }, 500);
    }
});

document.getElementById("cancel-btn").addEventListener('click', function () {
    var form = document.getElementById("formularioRecordatorio");

    form.style.opacity = 0;
    setTimeout(setFormInvisible, 500);
});

document.addEventListener('DOMContentLoaded', function () {
    var dayElements = document.querySelectorAll('.item_day');
    var priorities = document.querySelectorAll('.priority-btn');

    var selPriority = null;
    var selectedDate = null;

    // logica para seleccionar la fecha 
    dayElements.forEach(function (dayElement) {
        dayElement.addEventListener('click', function () {
            var day = parseInt(this.textContent);
            console.log("El day es de tipo: " + typeof (day));
            selectedDate = getSelectedDate(day);

            // TODO: Logica para utilizar la fecha seleccionada
            //alert("La fecha seleccionada: " + selectedDate.toDateString());
        });
    });

    // logica para seleccionar el nivel de prioridad del recordatorio
    priorities.forEach(function (priorityElement) {
        priorityElement.addEventListener('click', function () {
            selPriority = this.textContent;
            selPriority.trim();
            //alert("La prioridad seleccionada es: " + selPriority);
        });
    });

    // logica para guardar el recordatorio
    document.getElementById("save-btn").addEventListener('click', function () {
        try {

            var input_area = document.getElementById("title-input");
            var reminderTit = input_area.value;

            if (validateForm(reminderTit)) {
                //TODO: Logica para agregar el recordatorio
                alert("La fecha seleccionada: " + selectedDate.toDateString());
                createReminderElement(reminderTit, selectedDate, selPriority);
            }
            else {
                alert("Acuerdate de no dejar vacio el campo del titulo!");
            }
        } catch (error) {
            alert("Ocurrio un error!");
            console.log("Error: ", error.message);
        }
    });
});




