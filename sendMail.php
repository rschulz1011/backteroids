<?php
	require("Mail-1.3.0/Mail.php");

	echo $_POST['body'];

	 $from = "Backteroids";
 	 $to = "ryandschulz@gmail.com";
  	 $subject = $_POST['subject'];
     $body = $_POST['body'];


     $host = "smtpout.secureserver.net";
     $port = "80";
     $username = "info@matrimosaic.com";
     $password = "Penroad24.";
	
	 $headers = array ('From' => $from,
   						'To' => $to,
   						'Subject' => $subject);
 	  $smtp = Mail::factory('smtp',
   		array ('host' => $host,
     		'port' => $port,
     'auth' => true,
     'username' => $username,
     'password' => $password));
 

 	$mail = $smtp->send($to, $headers, $body);

 	  if (PEAR::isError($mail)) {
   			echo("<p>" . $mail->getMessage() . "</p>");
  } else {
   	echo "An e-mail has been sent";
  }
 
?>