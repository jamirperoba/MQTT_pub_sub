var topico = "#";
$("#topic_pub,#topic_sub,#message,#publicar,#subscrever").attr('disabled', true);
function MQTTConnect(){
	if (typeof path == "undefined") {
		path = '/mqtt';
	}
	client_id = Math.floor((Math.random() * 100) + 1).toString();
	$("#client_id").html(client_id);
	client = new Paho.MQTT.Client(host, port, path, 'client_id');
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});

	function onConnect() {
		$("#topic_pub,#topic_sub,#message,#publicar,#subscrever").attr('disabled', false);
		$('#status').html('Conectado em ' + host + ':' + port + path);
		console.log("onConnect");
		client.subscribe(topico);
		$('#topico_assinado').html(topico);
	}

	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			$("#topic_pub,#topic_sub,#message,#publicar,#subscrever").attr('disabled', true);
			$('#status').html("Conexão perdida:"+responseObject.errorMessage);
			console.log("Conexão perdida:"+responseObject.errorMessage);
		}
	}
			//chamado quando recebe uma menssagem
			function onMessageArrived(message) {
				$("#monitor").append("> "+message.destinationName +":"+ message.payloadString+"<br>");
				console.log("mensagem que chegou:"+message.payloadString);
			}
		}
		function publicar(destino,mensagem){
			message = new Paho.MQTT.Message(mensagem);
			message.destinationName = destino;
			client.send(message);
		}
		$("#publicar").click(function(){
			if($('#topic_pub').val() != '' || $('#message').val() != ''){
				publicar($('#topic_pub').val(),$('#message').val());	
			}else{
				alert("Você deve preencher os campos de tópico e menssagem antes de publicar!!!");
				$("#topic_pub").focus();
			}
		});
		$("#subscrever,#connect").click(function(){
			topico = $("#topic_sub").val();
			MQTTConnect();
		});
		$("#delete").click(function(){
			$("#monitor").html(" ");
		});