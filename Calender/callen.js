let currentDate = new Date();
let events =[];

function rendercalender(view)
{
    const calender = document.getElementById('calender');
    calender.innerHTML = '';
    if(view === 'month')
    {
        rendermonthview();
    }
    else if(view === 'week')
    {
        renderweekview();
    }
    else
    {
        renderdailyview();
    }
    setupdraganddrop();
}

function rendermonthview()
{
    const calender = document.getElementById('calender');
    calender.className = 'month-view';

    const firstday = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastday = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startday = firstday.getDate();

    const days = ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri' , 'Sat'];
    days.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        div.style.fontWeight= 'bold';
        calender.appendChild(div);
    });

    for(let i = 0; i < startday; i++)
    {
        const div = document.createElement('div');
        calender.appendChild(div);
    }

    for(let i = 1; i <= lastday.getDate(); i++)
    {
        const div = document.createElement('div');
        div.className = 'day';
        div.innerHTML = `<strong>${i}</strong>`;
        div.dataset.date = `${currentDate.getFullYear()}-${currentDate.getMonth()+1} - ${i}`;

        const dayevents = events.filter(event => {
            const eventdate = new Date(event.date);
            return eventdate.getDate() === i &&
            eventdate.getMonth() === currentDate.getMonth() &&
            eventdate.getFullYear() === currentDate.getFullYear();
        });

        dayevents.forEach((event, index) => {
            const eventdiv = createEventElement(event, index);
            div.appendChild(eventdiv);
        });

        calender.appendChild(div);
    }
}

function renderweekview()
{
    const calender = document.getElementById('calender');
    calender.className = 'week-view';

    const weekstart =  new Date(currentDate);
    weekstart.setDate(weekstart.getDate() - weekstart.getDay());

    for(let i = 0; i < 7 ; i++)
    {
        const day = new Date(weekstart);
        day.setDate(day.getDate() + i);
        
        const div = document.createElement('div');
        div.className = 'day';
        div.innerHTML = `<strong>${day.getDate()}</strong>`;
        div.dataset.date = `${day.getFullYear()} - ${day.getMonth() + 1} - ${day.getDate()}`;

        const dayevents = events.filter(event => {
            const eventdate = new Date(event.date);
            return eventdate.toDateString() === day.toDateString();    
        });

        dayevents.forEach((event, index) => {
            const eventdiv = createEventElement(event, index);
            div.appendChild(eventdiv);
        });

        calender.appendChild(div);
    }
}

function renderdailyview()
{
    const calender = document.getElementById('calender');
    calender.className = 'daily-view';

    calender.innerHTML = `<h3>${currentDate.toDateString()}</h3>`;

    const dayevents = events.filter(event => {
        const eventdate = new Date(event.date);
        return eventdate.toDateString() === currentDate.toDateString();
    });

    dayevents.forEach((event, index) => {
        const eventdiv = createEventElement(event, index);
        div.appendChild(eventdiv);
    });
}

function createEventElement(event, index)
{
    const eventdiv = document.createElement('div');
    eventdiv.className = 'event';
    eventdiv.draggable = true;
    eventdiv.dataset.index = index;
    eventdiv.style.backgroundColor = event.color;
    eventdiv.innerHTML = `
    ${event.time} - ${event.title}
    <div class= "event-buttons">
    <button onclick="editevent(${index})">Edit</button>
    <button onclick="deleteEvent(${index})">Delete</button>
    </div>
    `;
    return  eventdiv;
}

function addevent()
{
    const title = document.getElementById('eventtitle').value;
    const date = document.getElementById('eventdate').value;
    const time = document.getElementById('eventtime').value;
    const color = document.getElementById('eventcolor').value;

    if(title && date && time)
    {
        events.push({title, date, time, color});
        clearform();
        rendercalender('month');
    }
}

function editevent(index)
{
    const event = events[index];
    document.getElementById('eventtitle').value = event.title;
    document.getElementById('eventdate').value = event.date;
    document.getElementById('eventtime').value = event.time;
    document.getElementById('eventcolor').value = event.color;

    deleteEvent(index);
}

function deleteEvent(index)
{
    events.splice(index,1);
    rendercalender('month');
}

function clearform()
{
    document.getElementById('eventtitle').value ='';
    document.getElementById('eventdate').value = '';
    document.getElementById('eventtime').value = '';
    document.getElementById('eventcolor').value = '#e3f2fd';
}

function setupdraganddrop()
{
    const days = document.querySelectorAll('.day');
    const eventselements = document.querySelectorAll('.event');

    eventselements.forEach(event => {
        event.addEventListener('dragstart', (e) => {
            event.classList.add('dragging');
            e.dataTransfer.setData('text/plain', event.dataset.index);
        });

        event.addEventListener('dragend', () => {
            event.classList.remove('dragging');
        });
    });

    days.forEach(day => {
        day.addEventListener('dragover', (e) => {
            e.preventDefault();
        });   
   

    day.addEventListener('drop', (e) => {
        e.preventDefault();
        const index = e.dataTransfer.getData('text/plain');
        const newdate = day.dataset.date.split('-').map(Number);
        events[index].date = `${newdate[0]}-${String(newdate[1]).padStart(2, '0')} - ${String(newdate[2]).padStart(2, '0')}`;
        rendercalender('month');
    });
});

}

function showmonthview() {rendercalender('month')};
function showweekview() {rendercalender('week')};
function showdailyview() {rendercalender('day')};


rendercalender('month');

