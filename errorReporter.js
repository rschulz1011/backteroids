function errorReporter(message,source,lineno,colno,error){

	var subject = "Backteroids Error: " + source + " " + lineno + ":" + colno;
	var body = "Bacteroids error \n" + source + " " + lineno + ":" + colno + "\n" + message +
		error.stack + "\nUser Agent: "+ navigator.userAgent +"\nBrowser Name: " + navigator.appName + "\nCode Name: " + 
		navigator.appCodeName + "\nPlatform: " + navigator.platform + "\nVendor: " + navigator.vendor + "\nApp Version: " +
		navigator.appVersion + "\n\nTime: " + Date();

	console.log('Javascript Error');
	console.log(subject);
	console.log(body);

	$.ajax({
		url: 'sendMail.php',
		data: {subject: subject,
				body: body},
		method: 'POST',

	})

}