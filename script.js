var currentDayEl = $('#currentDay');
var containerEl = $('.container');
var currentHour = moment().hour();

var workDayHours = [
    moment().hour(9).format('hA'),
    moment().hour(10).format('hA'),
    moment().hour(11).format('hA'),
    moment().hour(12).format('hA'),
    moment().hour(13).format('hA'),
    moment().hour(14).format('hA'),
    moment().hour(15).format('hA'),
    moment().hour(16).format('hA'),
    moment().hour(17).format('hA')
];

var currentDay = moment().format('dddd, MMMM Do');
currentDayEl.text(currentDay);

function auditTimeBlock(timeBlockEventSpace) {
    var currentTimeBlockHour = moment($(timeBlockEventSpace).siblings('.hour').text().trim(), 'hA').hour();
    
    if (currentTimeBlockHour > currentHour) {
        $(timeBlockEventSpace).removeClass('past present').addClass('future');
    }
    else if (currentTimeBlockHour === currentHour) {
        $(timeBlockEventSpace).removeClass('past future').addClass('present');
    }
    else {
        $(timeBlockEventSpace).removeClass('present future').addClass('past');
    }
}

function loadTask() {
    for (var i = 0; i < workDayHours.length; i++) {
        try {
            let task = localStorage.getItem(workDayHours[i]);
            if (task) {
                $('#' + (i + 9)).siblings().first().children().text(task);
            }
        } catch (error) {
            console.error("Error accessing local storage: ", error);
        }
    }
}

function saveTask(hour, task) {
    try {
        localStorage.setItem(hour, task);
    } catch (error) {
        console.error("Error saving to local storage: ", error);
    }
}

function showSavedFeedback(button) {
    var feedback = $('<span>').text('Saved!').addClass('save-feedback');
    $(button).append(feedback);
    setTimeout(() => {
        feedback.remove();
    }, 1000);  // Remove feedback after 1 second
}

$(containerEl).on('click', '.saveBtn', function() {
    var hour = $(this).siblings('.hour').text();
    var task = $(this).siblings('.col-10').find('p, textarea').text() || $(this).siblings('.col-10').find('p, textarea').val(); // cater for both p and textarea
    saveTask(hour, task);
    showSavedFeedback(this); 
});


function createTimeBlockRow(index, hour) {
    var timeBlockRow = $('<div>').addClass('row time-block').attr({ id: 'row-' + (index + 9) });
    var timeBlockHour = $('<div>').addClass('col-1 hour').text(hour).attr({ id: index + 9 });
    var timeBlockEventSpace = $('<div>').addClass('col-10').attr({ id: 'time-block-' + (index + 9) });
    var userInput = $('<p>').addClass('description').text(' ').attr({ id: 'Hour-' + (index + 9) });
    auditTimeBlock(timeBlockEventSpace);
    
    var saveBtn = $('<button>').addClass('col-1 saveBtn').attr({ id: 'save-button-' + (index + 9), type: 'button' }).on('click', function () {
        var hour = $(this).siblings().first().text();
        var task = $(this).siblings().last().text();
        saveTask(hour, task);
    });
    var saveIcon = $('<i>').addClass('fas fa-save');
    
    $(containerEl).append(timeBlockRow);
    $(timeBlockRow).append(timeBlockHour, timeBlockEventSpace, saveBtn);
    $(timeBlockEventSpace).append(userInput);
    $(saveBtn).append(saveIcon);
}

for (var i = 0; i < workDayHours.length; i++) {
    createTimeBlockRow(i, workDayHours[i]);
}

$('.col-10').on('click', 'p', function () {
    var text = $(this).text().trim();
    var textInput = $('<textarea>').addClass('form-control').val(text);
    $(this).replaceWith(textInput);
    textInput.trigger('focus');
});

$('.col-10').on('blur', 'textarea', function () {
    var text = $(this).val().trim();
    var userTextP = $("<p>").addClass("description").text(text);
    $(this).replaceWith(userTextP);
});

loadTask();
