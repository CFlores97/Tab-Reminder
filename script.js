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

        if (i == day && month == currentMonth) {
            diaSpan.className = "week_days_item item_day today";
            diaSpan.id = "item_day";
            diaSpan.textContent = i;
            container.appendChild(diaSpan);
        } else {
            diaSpan.className = "week_days_item item_day";
            diaSpan.id = "item_day";
            diaSpan.textContent = i;
            container.appendChild(diaSpan);
        }


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

function getSelectedDate(){
    var selYear = document.getElementById("text_year");
    var selMonth = document.getElementById("text_month_02");
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
function validateForm() {
    var input_area = document.getElementById("title-input");

    if (input_area.value === "") {
        return false;
    }
    return true;
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

document.getElementById("save-btn").addEventListener('click', function () {
    try {

        if (validateForm()) {
            alert("Hay algo escrito en el titulo!");
            //TODO: Logica para agregar el recordatorio
        }
        else {
            alert("Acuerdate de no dejar vacio el campo del titulo!");
        }
    } catch (error) {
        alert("Ocurrio un error!");
        console.log("Error: ", error.message);
    }
});


