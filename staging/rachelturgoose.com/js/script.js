/********************************************************/
/*                                                      */
/* document.onload                                      */
/*                                                      */
/********************************************************/
$(document).ready(function(){
	//-----------------------------------------------------------------------------------------------
	// AJAX for calendar on home page
	//-----------------------------------------------------------------------------------------------
	retrieveCalendarEntries()

	//-----------------------------------------------------------------------------------------------
	// Fade in the intro portrait
	//-----------------------------------------------------------------------------------------------
	fadeInPortrait();

	//-----------------------------------------------------------------------------------------------
	// Collapsible nav menu
	//-----------------------------------------------------------------------------------------------
	navMenuInit();

	//-----------------------------------------------------------------------------------------------
	// Set up contact form email button events
	//-----------------------------------------------------------------------------------------------
	attachEmailButtonListener();

	//-----------------------------------------------------------------------------------------------
	// Shim for closing paragraph splash, to emulate background-size: cover
	//-----------------------------------------------------------------------------------------------
	window.addEventListener('resize', resizeHandler);
	resizeHandler();
});

/********************************************************/
/*                                                      */
/* Prototypes                                           */
/*                                                      */
/********************************************************/

function CalendarEntry(startDateObj, endDateObj, location, description) {
	//-----------------------------------------------------------------------------------------------
	// Creates a calendar entry for use on the site home page
	//-----------------------------------------------------------------------------------------------
	this.startDate = parseDateObject(startDateObj);
	this.endDate = parseDateObject(endDateObj);
	this.location = formatAddressString(location);
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
	//-----------------------------------------------------------------------------------------------
	// Sets up all necessary DOM components of a Calendar entry
	//-----------------------------------------------------------------------------------------------
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
	this.elements.location.innerHTML = createMapsAnchorTag(this.location);
	this.elements.description.textContent = this.description;

	// build DOM element
	// date block
	this.elements.date.appendChild(this.elements.ddd);
	this.elements.date.appendChild(this.elements.mm);
	this.elements.date.appendChild(this.elements.dd);

	// time block
	this.elements.start.appendChild(this.elements.startHr);
	this.elements.start.appendChild(this.elements.startMin);
	this.elements.start.appendChild(this.elements.startPeriod);

	this.elements.end.appendChild(this.elements.endHr)
	this.elements.end.appendChild(this.elements.endMin);
	this.elements.end.appendChild(this.elements.endPeriod);
	this.elements.time.appendChild(this.elements.start);
	this.elements.time.appendChild(this.elements.end);

	// when block
	this.elements.when.appendChild(this.elements.date);
	this.elements.when.appendChild(this.elements.time);

	// details block
	this.elements.where.appendChild(this.elements.location);
	this.elements.what.appendChild(this.elements.description);
	this.elements.details.appendChild(this.elements.what);
	this.elements.details.appendChild(this.elements.where);

	// appendChild all to calendar row
	this.elements.row.appendChild(this.elements.when);
	this.elements.row.appendChild(this.elements.details);

	// appendChild to dom
	$('#upcoming_events').append(this.elements.row);
};

/********************************************************/
/*                                                      */
/* Functions                                            */
/*                                                      */
/********************************************************/

//***********************************************************************************************
// Home Page Functions
//***********************************************************************************************
function resizeHandler() {
	//-----------------------------------------------------------------------------------------------
	// Shim for closing paragraph background splash to emulate background-size: cover
	//-----------------------------------------------------------------------------------------------
	// only applies before the 639 breakpoint
	if (window.innerWidth > 639) {
		return;
	}

	// get references to applicable elements
	var closingPort = $('.closing-portrait');
	var properHeight = closingPort.parent().css('height');

	// build the proper CSS string, filling the full height of the element and auto-setting width
	var bgCssString = 'auto ' + properHeight;

	// if the page dimensions are > 2/3, the image should fill the width and auto-set the height instead
	if (window.innerWidth / window.innerHeight > 0.66667 ) {
		bgCssString = window.innerWidth + 'px auto';
	}

	// set element CSS property
	closingPort.css('background-size', bgCssString);
}

function fadeInPortrait() {
	//--------------------------------------------------------------------------------------------------------------
	// Fade in the intro portrait image
	//--------------------------------------------------------------------------------------------------------------
	$('.intro-portrait').animate({
		'opacity': 1,
	}, 1000);
}

function navMenuInit() {
	//-----------------------------------------------------------------------------------------------
	// Sizes the navigation menu and attaches click event listeners, as necessary
	//-----------------------------------------------------------------------------------------------
	var navItemHeight = $('#nav-toggle').css('height').replace('px', '');
	$('#nav-toggle').click(function(){
		// if the user is not in mobile mode, return immediately
		if ($(this).children(0).css('display') == 'none') {
			return;
		}

		// dynamically set the expanded nav height based on the number of nav elements
		var navItemCount = $(this).children().length;
		if ($(this).hasClass('collapsed')) {
			$(this).addClass('expanded');
			$(this).removeClass('collapsed');
			$(this).animate({
				height: navItemHeight * navItemCount + 'px',
				overflow: 'unset'
			}, 200)
		}
		else {
			$(this).addClass('collapsed');
			$(this).removeClass('expanded');
			$(this).animate({
				height: navItemHeight + 'px',
				overflow: 'hidden'
			}, 200)
		}
	});

	// collapse nav menu on click anywhere else on page
	window.addEventListener('click', function(e){
		if (e.target.id != 'nav-toggle' && e.target.parentNode.id != 'nav-toggle' && e.target.parentNode.parentNode.id != 'nav-toggle' && e.target.tagName != 'LI') {
			$('#nav-toggle').addClass('collapsed');
			$('#nav-toggle').removeClass('expanded');
			$('#nav-toggle').animate({
				height: navItemHeight + 'px',
				overflow: 'hidden'
			}, 200)
		}
	})
}

function retrieveCalendarEntries() {
	//-----------------------------------------------------------------------------------------------
	// Retrieves calendar entries, if the #upcoming_events element exists
	//-----------------------------------------------------------------------------------------------
	var upcoming = $('#upcoming_events');

	if (!upcoming[0]) {			// return immediately if no upcoming events element exists
		return;
	}

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
	  }
	});	
}


//***********************************************************************************************
// Contact Page Functions
//***********************************************************************************************

function attachEmailButtonListener() {
	//-----------------------------------------------------------------------------------------------
	// Attaches a click listener on the email button, if it exists
	//-----------------------------------------------------------------------------------------------
	var emailButton = $('#compose_message');

	if (!emailButton[0]) {		// not on contact page; return
		return;
	}

	emailButton[0].addEventListener('click', tryEmail);
}

function tryEmail() {
	//------------------------------------------------------------------------------------------------------------------------
	// Gets references to the email fields. Validates the fields, drafting email on success or alerting any errors to the user
	//------------------------------------------------------------------------------------------------------------------------
	var emailName = $('#email_name');
	var emailAddress = $('#email_address');
	var emailSubject = $('#email_subject');
	var emailMessage = $('#email_message');

	try {
		removeErrorMessages();				// always clear error messages first
		restoreFieldBackgrounds();		// reset all field background colors

		// validate all fields
		validateField(emailName, 'text');
		validateField(emailAddress, 'email');
		validateField(emailSubject, 'text');
		validateField(emailMessage, 'text');

		// create email if no exceptions thrown
		createEmail(emailName[0].value, emailAddress[0].value, emailSubject[0].value, emailMessage[0].value);
	} catch (ex) {
		// handle invalid fields
		$(ex.field).css('background-color', 'pink');
		$('<p class="error-message" style="display:block;color:red;text-align:center;">' + ex.message + '</p>').insertAfter($(ex.field)[0].parentNode);
	}
}

function removeErrorMessages() {
	$('.error-message').remove();
}

function restoreFieldBackgrounds() {
	$('input, textarea').css('background-color', 'white');
}

function validateField(field, type) {
	//-------------------------------------------------------------------------------------------------------
	// Checks a field of a given type, throwing an error on an invalid entry. All blank entries throw errors
	//-------------------------------------------------------------------------------------------------------
	function BadFieldException(message) {
		this.message = message;
		this.field = field;
	}

	if (field[0].value == '') {
		// throw error on blank fields
		throw new BadFieldException('This field cannot be blank.');
	}
	if (type == 'email' && !field[0].value.match(/[\w\.\d]*@[\w\.]*[com,org,gov,edu,net]/gi)) {
		throw new BadFieldException('Please enter a valid email address.')
	}

	return true;
}

function createEmail(emailName, emailAddress, emailSubject, emailMessage) {
	//-----------------------------------------------------------------------------------------------
	// Drafts an email from the supplied text values by navigating to a mailto: link
	//-----------------------------------------------------------------------------------------------
	var messageString = 'From: ' + emailName + '\n' +
											'Email: ' + emailAddress + '\n\n' +
											emailMessage;

	var mailtoString = 'mailto:rachelturgoose@outlook.com?subject=' + emailSubject + 
										 '&body=' + encodeURIComponent(messageString);

	window.location = mailtoString;
}

//***********************************************************************************************
// Calendar-Specific Functions
//***********************************************************************************************

function formatAddressString(addrString) {
	//-----------------------------------------------------------------------------------------------
	// Removes ZIP code and country from a location string, returned by a Google Calendar Entry.
	// If no location is string is found, returns 'Private' instead of a formatted location string
	//-----------------------------------------------------------------------------------------------
	if (addrString) {
		var splitAddr = addrString.match(/(.*\w{2}) (\d{5}, USA)/);
		return splitAddr[1];
	} else {
		return 'Private';
	}
}

function createMapsAnchorTag(addr) {
	//-----------------------------------------------------------------------------------------------
	// Formats a location string into a URL to search in Google Maps
	//-----------------------------------------------------------------------------------------------
	if (addr == 'Private') {
		return '<span class="location-private">' + addr + '</span>';
	} else {
		return '<a href="https://www.google.com/maps/search/' + addr + '" target="_blank">' + addr + '</a>';
	}
}

function parseDateObject(dateTimeObj) {
	//-----------------------------------------------------------------------------------------------
	// Returns an object containing broken-down date/time values extracted from a JS Date object
	//-----------------------------------------------------------------------------------------------
	return {	
		mm: dateTimeObj.getMonth() + 1,
		mmm: getMonthString(dateTimeObj).short,
		mmmm: getMonthString(dateTimeObj).long,
		dd: dateTimeObj.getDate(),
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
	//-----------------------------------------------------------------------------------------------
	// Returns an object containing zero-padded, 12 hr time values from a JS Date object
	//-----------------------------------------------------------------------------------------------
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
	//-----------------------------------------------------------------------------------------------
	// Returns an object containing short and long day of the week strings from a JS Date object
	//-----------------------------------------------------------------------------------------------
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
	//-----------------------------------------------------------------------------------------------
	// Returns an object containing short and long month name strings from a JS Date object
	//-----------------------------------------------------------------------------------------------
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