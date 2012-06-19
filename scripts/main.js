// >>> JQuery UI default functions

// function to generate tabs
$(function() {
		$("#tabs").tabs().find( ".ui-tabs-nav" ).sortable({ axis: "x" });
		$( "#div-about" ).draggable({zIndex: 2, cursor:"move" });
		$( "#div-preview" ).draggable({zIndex: 2, cursor:"move", iframeFix: true });
		$( "#div-download" ).draggable({zIndex: 2, cursor:"move" });
});

// >>> Main functions and variables

var htmlPageStructureBegin = '<!DOCTYPE HTML><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"><head><script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>';

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
}

var changeTextareaSize = function(id_name) {
// function that increases or decreases the textarea according with content size
// Input:
// id_name -> the name of the textarea id

	var text_buffer = getTextareaBufferData(id_name);
	var textarea_rows = $('#'+id_name).prop('rows');

	if (text_buffer['size'] > textarea_rows) {
		$('#'+id_name).prop('rows', function(index, value) { return value + 1; });
		$('div.code_lines').height(function() { return $('#'+id_name).height() + 3; });
		$('#tabs-html').scrollTop(function(index, value) { return value + 15; });
	}
	if (text_buffer['size'] > 38 && text_buffer['size'] < textarea_rows) {
		$('#'+id_name).prop('rows', function(index, value) { return value - 1; });
		$('div.code_lines').height(function() { return $('#'+id_name).height() + 3; });
		$('#tabs-html').scrollTop(function(index, value) { return value + 15; });
	}
	if (text_buffer['size'] <= 38)
		$('#tabs-html').scrollTop(0);
}

var getTextareaBufferData = function(id_name) {
// function that reads the textarea text and returns a dictionary with 
// number of lines and an array with every line content
// Input:
// id_name -> the name of the textarea id

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

	var patt = /[^\s]/; // pattern for non_empty line
	return !patt.test( text_lines[line-1] );
}

var updateCodeLineNumber = function() {
// function that updates the code line number values

	var text_buffer = getTextareaBufferData('html-window');
	var nl_number = text_buffer['size'];
	
	$('div.code_lines').empty(); // empty div.code_lines
	for (i = 1; i <= nl_number; i++)
		$('<span>'+i+'</span>').appendTo('div.code_lines');
}

var codeLineNumberManagement = function() {
// function that assigns the proper events and sub-functions to deal with code line number management

	$("#html-window").keydown(function() {
		updateCodeLineNumber();
		changeTextareaSize('html-window');
	});
	$("#html-window").keyup(function() {
		updateCodeLineNumber();
		changeTextareaSize('html-window');
	});
}

var onClickFunctions = function() {
// function that compiles all the click event functions

// Tab clicking
	$("#a-tabs-run").click(function() {
		loadData('run-window', 'html-window', 'css-window', 'js-window'); //loads html document for preview on clicking tab run
		$("#toolbar").css("display","none"); //hides toolbar
	});

	$("#a-tabs-js").click(function() {
		$("li > #a-preview").css("display","none"); //hides preview button			
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

// Preview window
	$("#a-preview").click(function() { 
		// opens preview window on preview button click
		$("#div-preview").css("display", "block");
		loadData('iframe-preview', 'html-window', 'css-window', '');
	});

	$("#div-preview div img").click(function() { 
		// closes preview window on close button click
		$("#div-preview").css("display", "none");
	});

// About window
	$("#a-about").click(function() { 
		// opens about window on about button click
		$("#div-about").css("display", "block");
	});

	$("#div-about div img").click(function() { 
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

	$("#div-download div img").click(function() { 
		// closes preview window on close button click
		$("#div-download").css("display", "none");
	});
}

$(document).ready(function() {
	onClickFunctions();
	codeLineNumberManagement();
});