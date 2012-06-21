// >>> JQuery UI default functions

// function to generate tabs
$(function() {
		$("#tabs").tabs().find( ".ui-tabs-nav" ).sortable({ axis: "x" });
});

// >>> Main Variables

var htmlPageStructureBegin = '<!DOCTYPE HTML><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"><head><script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>';
var wleft; // preview window current left position
var wtop; // preview window current top position

// >>> Main functions

var loadData = function(frame, html, css, jscript) {
// function that creates html document to be uploaded on iframe
	
	$("#"+frame).prop("contentDocument").open();
	$("#"+frame).prop("contentDocument").write(htmlPageStructureBegin);

	if (jscript != "") {
		$("#"+frame).prop("contentDocument").write('<script>');
		$("#"+frame).prop("contentDocument").write($("#"+jscript).val());
		$("#"+frame).prop("contentDocument").write('</script>');
	}

	$("#"+frame).prop("contentDocument").write('<style>');
	$("#"+frame).prop("contentDocument").write($("#"+css).val());
	$("#"+frame).prop("contentDocument").write('</style></head>');
	$("#"+frame).prop("contentDocument").write($("#"+html).val());
	$("#"+frame).prop("contentDocument").write('</html>');
	$("#"+frame).prop("contentDocument").close();
}

var newProject = function() {
// function to create a new project
// It receives the name of the project and inserts it on the project name bar
// Initializes the html, css and jscript editing panels 

	// hide all windows
	$("#div-download").css("display", "none");
	$("#div-about").css("display", "none");
	$("#div-preview").css("display", "none");

	projectName = prompt("What's the name of the project?")

	if (projectName === "" || projectName == null)
		projectName = "Untitled";

	$("#project-name > p").html("Project - " + projectName);
	$("#html-window").val("<body></body>");
	$("#css-window").val("body {}");
	$("#js-window").val("$(document).ready(function() {});");
}

var downloadProject = function() {
// function that uploads the HTML, CSS and Javascript code from the project to a window for download with copy/paste
	
	var htmlCode = htmlPageStructureBegin + '<script>' + $("#js-window").val() + '</script><style>' + $("#css-window").val() + '</style></head>' + $("#html-window").val() + '</html>';

	$("#div-download").css("display", "block");
	$("#div-download-content > p").text(htmlCode);
}

var resetPanel = function() {
// function that resets the active panel, updating it with the default values
	
	var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
	activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel

	if (activePanel == "html")
		$("#html-window").val("<body></body>");
	else if (activePanel == "css")
		$("#css-window").val("body {}");
	else if (activePanel == "js")
		$("#js-window").val("$(document).ready(function() {});");

	$('div.code-lines.'+activePanel+'-code').empty(); // empty div.code-lines
	$('<span>1</span>').appendTo('div.code-lines.'+activePanel+'-code'); // put first line number
	loadData('iframe-preview', 'html-window', 'css-window', 'js-window'); // updates the preview result
}

var toggleBackground = function() {
// function that toggles the background of the active panel, black/white

	var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
	activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel

	if ( $('#'+activePanel+'-window').hasClass('black') ) {
		$('#'+activePanel+'-window').removeClass('black');
		$('#'+activePanel+'-window').addClass('white');
	} else {
		$('#'+activePanel+'-window').removeClass('white');
		$('#'+activePanel+'-window').addClass('black');
	}
}

var changeTextareaSize = function(tab_name) {
// function that increases or decreases the textarea according with content size
// Input:
// tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'

	var text_buffer = getTextareaBufferData(tab_name+'-window');
	var textarea_rows = $('#'+tab_name+'-window').prop('rows');

	//checks if the number of code lines is greater than the size of textarea, 
	// if so, increases that textarea and the line number div
	if (text_buffer['size'] > textarea_rows) {
		$('#'+tab_name+'-window').prop('rows', function(index, value) { 
			return value + 1; 
		});
		$('div.code-lines.'+tab_name+'-code').height(function() { 
			return $('#'+tab_name+'-window').height() + 3; 
		});
		$('#tabs-'+tab_name).scrollTop(function(index, value) { 
			return value + 15; 
		});
	}
	//checks if the number of code lines is greater than the default size of textarea
	// but smaller than the actual textarea size, if so, decreases that textarea and the line number div
	if (text_buffer['size'] > 38 && text_buffer['size'] < textarea_rows) { 
		$('#'+tab_name+'-window').prop('rows', function(index, value) { 
			return value - 1; 
		});
		$('div.code-lines.'+tab_name+'-code').height(function() { 
			return $('#'+tab_name+'-window').height() + 3; 
		});
		$('#tabs-'+tab_name).scrollTop(function(index, value) { 
			return value + 15; 
		});
	}
	if (text_buffer['size'] <= 38) // sets scroll bar to top
		$('#tabs-'+tab_name).scrollTop(0);
}

var getTextareaBufferData = function(id_name) {
// function that reads the textarea text and returns a dictionary with 
// number of lines and an array with every line content
// Input:
// id_name -> the name of the textarea id
// Output:
// buffer -> dictionary with the number of lines of code, and a list of the lines content

	var buffer = {};
	var text_str = '';
	var text_lines = [];
	var size = 0;

	text_str = $('#'+id_name).val(); // takes the textarea content given id
	text_lines = text_str.split('\n'); // create list of text lines
	size = text_lines.length;

	// update buffer
	buffer['size'] = size;
	buffer['content'] = text_lines;

	return buffer;
}

var checkForEmptyLine = function(text_lines, line) {
// function that checks for an empty text line
// Input:
// text_lines -> list of text lines content
// line -> line chosen to check if it's empty
// Output:
// ...(Boolean) -> returns a true for empty line and false otherwise


	var patt = /[^\s]/; // pattern for non_empty line
	return !patt.test( text_lines[line-1] );
}

var updateCodeLineNumber = function(tab_name) {
// function that updates the code line number values
// Input:
// tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'

	var text_buffer = getTextareaBufferData(tab_name+'-window');
	var nl_number = text_buffer['size'];
	
	$('div.code-lines.'+tab_name+'-code').empty(); // empty div.code-lines
	for (i = 1; i <= nl_number; i++)
		$('<span>'+i+'</span>').appendTo('div.code-lines.'+tab_name+'-code');
}

var codeLineNumberManagement = function() {
// function that assigns the proper events and sub-functions to deal with code line number management

	$("#html-window").keydown(function() {
		updateCodeLineNumber('html');
		changeTextareaSize('html');
	});
	$("#html-window").keyup(function() {
		updateCodeLineNumber('html');
		changeTextareaSize('html');
	});
	$("#css-window").keydown(function() {
		updateCodeLineNumber('css');
		changeTextareaSize('css');
	});
	$("#css-window").keyup(function() {
		updateCodeLineNumber('css');
		changeTextareaSize('css');
	});
	$("#js-window").keydown(function() {
		updateCodeLineNumber('js');
		changeTextareaSize('js');
	});
	$("#js-window").keyup(function() {
		updateCodeLineNumber('js');
		changeTextareaSize('js');
	});
}

var updatePreviewWindow = function() {
// function to allows the preview window to be updated while the user is typing

	$('#html-window').keyup(function() {
		loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
	});
	$('#css-window').keyup(function() {
		loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
	});
}

var dockWindow = function() {
// function that docks the preview window to the panel

	$('#div-preview').draggable('destroy');
	$('#div-preview').removeClass().addClass('docked');
	$('#div-preview').css('top', '123px');
	$('#div-preview').css('left', '656px');
	$('#div-preview div img.dock').attr('src', './images/reducedsize.png');

	$('#html-window').css('width', '48.2%');
	$('#html-window').css('float', 'left');
	$('#html-window').css('left', '2px');
	$('#css-window').css('width', '48.2%');
	$('#css-window').css('float', 'left');
	$('#css-window').css('left', '2px');
	$('#js-window').css('width', '48.2%');
	$('#js-window').css('float', 'left');
	$('#js-window').css('left', '2px');
}

var undockWindow = function(top, left) {
// function that undocks the preview window
// Input:

	$("#div-preview").draggable({ zIndex: 2, cursor:"move", iframeFix: true, containment: "#tabs", scroll:false, stack:"#ul-toolbar" });
	$('#div-preview').removeClass().addClass('undocked');
	$('#div-preview').css({'top':top, 'left':left});
	$('#div-preview div img.dock').attr('src', './images/fullsize.png');
	
	$('#html-window').css('width', '96.8%');
	$('#css-window').css('width', '96.8%');
	$('#js-window').css('width', '96.8%');
}

var onClickFunctions = function() {
// function that compiles all the click event functions

// Tab clicking
	$("#a-tabs-run").click(function() {
		loadData('run-window', 'html-window', 'css-window', 'js-window'); //loads html document for preview on clicking tab run
		$("#toolbar").css("display","none"); //hides toolbar
		$("#div-preview").css("display","none"); //hides preview window
		undockWindow(wtop, wleft); // undocks preview window
	});

	$("#tabs > ul > li > a").not("#a-tabs-js").click(function() {
		$("li > #a-preview").css("display","inline"); //shows preview button	
	});

	$("#tabs > ul > li > a").not("#a-tabs-run").click(function() {
		//when clicking html, css or jscript tabs show toolbar
		$("#toolbar").css("display","block"); 
	});

// Reset button - toolbar
	$("#a-reset").click(function() {
		resetPanel();
	});

// Background button - toolbar
	$("#a-bg").click(function() {
		toggleBackground();
	});

// Preview window
	$("#a-preview").click(function() { 
		// opens preview window on preview button click
		$("#div-preview").css("display", "block");
		$("#div-preview").draggable({ zIndex: 2, cursor:"move", iframeFix: true, containment: "#tabs", scroll:false, stack:"#ul-toolbar", 
			create: function(event, ui) { // gets current preview window position on creation
				wleft = $("#div-preview").offset().left;
				wtop = $("#div-preview").offset().top;
			}
		});
		$('#div-preview').bind("dragstop", function(event, ui) { // gets current preview window position on dragstop
			wleft = $("#div-preview").offset().left;
			wtop = $("#div-preview").offset().top;
		});
		loadData('iframe-preview', 'html-window', 'css-window', 'js-window'); // loads the preview result
	});

	$("#div-preview div img.close").click(function() { 
		// closes preview window on close button click
		$("#div-preview").css("display", "none");
	});

	$("#div-preview div img.dock").click(function() { 
		// docks the window and divides the panel in two, code|preview
		
		if ( $("#div-preview").hasClass('undocked') )
			dockWindow();
		else
			undockWindow(wtop, wleft);
	});

// About window
	$("#a-about").click(function() { 
		// opens about window on about button click
		$("#div-about").css("display", "block");
		$( "#div-about" ).draggable({ zIndex: 2, cursor:"move", containment: "#tabs", scroll:false, stack:"#ul-toolbar" });
	});

	$("#div-about div img.close").click(function() { 
		// closes about window on close button click
		$("#div-about").css("display", "none");
	});

// New Project
	$("#a-new-project").click(function() {
		// prompts the user for a project name and starts new project
		newProject();
	});

// Download window
	$("#a-download-project").click(function() {
		downloadProject();	
	});

	$("#div-download div img.close").click(function() { 
		// closes preview window on close button click
		$("#div-download").css("display", "none");
	});
}

$(document).ready(function() {
	onClickFunctions();
	codeLineNumberManagement();
	updatePreviewWindow();
});
