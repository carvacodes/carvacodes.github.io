// set the height of the body-splash element on the homepage

function sizeElements() {
	var headerHeight = $('header').css('height').substring(0, $('header').css('height').length-2);
	$('.body-splash').css('height', (window.innerHeight - headerHeight) + 'px');
	$('.body-splash').css('padding-top', $('.main-nav').css('height').substring(0, $('.main-nav').css('height').length-2) + 'px');
}

$(document).ready(function(){
	sizeElements();
	$.ajax({
	  url: 'https://www.googleapis.com/calendar/v3/calendars/rachelturgoosemusic@gmail.com/events?key=AIzaSyB70OG0v_0v5jFyYue7m1cY7VZAlKoEnTQ',
	  success: function(data){
	  	var calItems = [];
			for (var i = 0; i < data.items.length; i++) {
				var dateObj = new Date(data.items[i].start.dateTime);
				if (dateObj.getTime() > Date.now()) {
					calItems.push(data.items[i]);
				}
			}
			calItems.sort(function(a,b){
				var aDate = new Date(a.start.dateTime);
				var bDate = new Date(b.start.dateTime);
				return aDate.getTime() - bDate.getTime();
			})

			for (var i = 0; i < calItems.length; i++) {
				var entry = new CalendarEntry(new Date(calItems[i].start.dateTime),
																			new Date(calItems[i].end.dateTime),
																			calItems[i].location,
																			calItems[i].summary);
			}
			setTimeout(function(){$('#upcoming_events').slideDown('slow');}, 500);
	  }
	});	
});

window.addEventListener('resize', sizeElements);

function CalendarEntry(startDateObj, endDateObj, location, description) {
	this.startDate = parseDateObject(startDateObj);
	this.endDate = parseDateObject(endDateObj);
	this.location = location;
	this.description = description;
	this.elements = {
		row: document.createElement('div'),
		when: document.createElement('div'),
			date: document.createElement('div'),
				ddd: document.createElement('span'),
				mm: document.createElement('span'),
				dd: document.createElement('span'),
			time: document.createElement('div'),
			start: document.createElement('div'),
				startHr: document.createElement('span'),
				startMin: document.createElement('span'),
				startPeriod: document.createElement('span'),
			end: document.createElement('div'),
				endHr: document.createElement('span'),
				endMin: document.createElement('span'),
				endPeriod: document.createElement('span'),
		details: document.createElement('div'),
			where: document.createElement('div'),
				location: document.createElement('span'),
			what: document.createElement('div'),
				description: document.createElement('span')
	}

	this.init();
}

CalendarEntry.prototype.init = function(){
	// set element class names
	this.elements.row.className = 'calendar-row';
	this.elements.details.className = 'details';
	this.elements.when.className = 'when';
	this.elements.date.className = 'date';
	this.elements.ddd.className = 'ddd';
	this.elements.mm.className = 'mm';
	this.elements.dd.className = 'dd';
	this.elements.time.className = 'time';
	this.elements.start.className = 'start';
	this.elements.startHr.className = 'hr';
	this.elements.startMin.className = 'min';
	this.elements.startPeriod.className = 'period';
	this.elements.end.className = 'end';
	this.elements.endHr.className = 'hr';
	this.elements.endMin.className = 'min';
	this.elements.endPeriod.className = 'period';
	this.elements.where.className = 'where';
	this.elements.location.className = 'location';
	this.elements.what.className = 'what';
	this.elements.description.className = 'description';

	// set values
	this.elements.ddd.textContent = this.startDate.ddd;
	this.elements.mm.textContent = this.startDate.mm;
	this.elements.dd.textContent = this.startDate.dd;
	this.elements.startHr.textContent = this.startDate.hr;
	this.elements.startMin.textContent = this.startDate.min;
	this.elements.startPeriod.textContent = this.startDate.p;
	this.elements.endHr.textContent = this.endDate.hr;
	this.elements.endMin.textContent = this.endDate.min;
	this.elements.endPeriod.textContent = this.endDate.p;
	this.elements.location.textContent = this.location;
	this.elements.description.textContent = this.description;

	// build DOM element
	// date block
	this.elements.date.append(this.elements.ddd);
	this.elements.date.append(this.elements.mm);
	this.elements.date.append(this.elements.dd);

	// time block
	this.elements.start.append(this.elements.startHr);
	this.elements.start.append(this.elements.startMin);
	this.elements.start.append(this.elements.startPeriod);

	this.elements.end.append(this.elements.endHr)
	this.elements.end.append(this.elements.endMin);
	this.elements.end.append(this.elements.endPeriod);
	this.elements.time.append(this.elements.start);
	this.elements.time.append(this.elements.end);

	// when block
	this.elements.when.append(this.elements.date);
	this.elements.when.append(this.elements.time);

	// details block
	this.elements.where.append(this.elements.location);
	this.elements.what.append(this.elements.description);
	this.elements.details.append(this.elements.what);
	this.elements.details.append(this.elements.where);

	// append all to calendar row
	this.elements.row.append(this.elements.when);
	this.elements.row.append(this.elements.details);

	// append to dom
	$('#upcoming_events').append(this.elements.row);
};

function parseDateObject(dateTimeObj) {
	return {	
		mm: dateTimeObj.getMonth() + 1,
		mmm: getMonthString(dateTimeObj).short,
		mmmm: getMonthString(dateTimeObj).long,
		dd: dateTimeObj.getDate() + 1,
		ddd: getDayString(dateTimeObj).short,
		dddd: getDayString(dateTimeObj).long,
		yy: dateTimeObj.getFullYear().toString().substring(2,2),
		yyyy: dateTimeObj.getFullYear(),
		hr: get12HrTime(dateTimeObj).hrs,
		min: get12HrTime(dateTimeObj).mins,
		p: get12HrTime(dateTimeObj).period
	};
}

function get12HrTime(dateTimeObj) {
	obj = {
		mins: dateTimeObj.getMinutes() == 0 ? "00" : dateTimeObj.getMinutes(),
		hrs: dateTimeObj.getHours(),
		period: dateTimeObj.getHours() >= 12 ? 'pm' : 'am'
	};
	if (dateTimeObj.getHours() == 0) {
		obj.hrs = 12;
	} else if (dateTimeObj.getHours() > 12) {
		obj.hrs = dateTimeObj.getHours() - 12;
	}

	return obj;
}

function getDayString(dateTimeObj) {
	var dayNum = dateTimeObj.getDay();
	switch (dayNum) {
		case 0:
			return {short: 'Sun', long: 'Sunday'};
			break;
		case 1:
			return {short: 'Mon', long: 'Monday'};
			break;
		case 2:
			return {short: 'Tue', long: 'Tuesday'};
			break;
		case 3:
			return {short: 'Wed', long: 'Wednesday'};
			break;
		case 4:
			return {short: 'Thu', long: 'Thursday'};
			break;
		case 5:
			return {short: 'Fri', long: 'Friday'};
			break;
		case 6:
			return {short: 'Sat', long: 'Saturday'};
			break;
		default:
			return {short: 'N/A', long: 'N/A'}
			break;
	}
}

function getMonthString(dateTimeObj) {
	var monthNum = dateTimeObj.getMonth();
	switch (monthNum) {
		case 0:
			return {short: 'Jan', long: 'January'};
			break;
		case 1:
			return {short: 'Feb', long: 'February'};
			break;
		case 2:
			return {short: 'Mar', long: 'March'};
			break;
		case 3:
			return {short: 'Apr', long: 'April'};
			break;
		case 4:
			return {short: 'May', long: 'May'};
			break;
		case 5:
			return {short: 'Jun', long: 'June'};
			break;
		case 6:
			return {short: 'Jul', long: 'July'};
			break;
		case 7:
			return {short: 'Aug', long: 'August'};
			break;
		case 8:
			return {short: 'Sept', long: 'September'};
			break;
		case 9:
			return {short: 'Oct', long: 'October'};
			break;
		case 10:
			return {short: 'Nov', long: 'November'};
			break;
		case 11:
			return {short: 'Dec', long: 'December'};
			break;
		default:
			return {short: 'N/A', long: 'N/A'}
			break;
	}
}