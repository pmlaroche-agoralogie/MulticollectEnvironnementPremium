function getTemplate(selector,qkey)
{
	var template = "";
	if (typeof questions[qkey] != 'undefined') 
	{
		question = questions[qkey];
		switch (question.type) 
		{ 
		case "N": 
			//slider = 1;
			configSlide = getQuestionConfig(question);
			currentHour = new Date().getHours();
			if ((configSlide.frq == "a") && (currentHour > 14))
			{
				getTemplate(selector,(qkey + 1));
				return false;
				exit();
			}
			if ((configSlide.frq == "b") && (currentHour <= 14))
			{
				getTemplate(selector,(qkey + 1));
				return false;
				exit();
			}
			bulles = "";
			if (configSlide.tpl=="sl1")
				bulles = form_slider_bulle_g +form_slider_bulle_d;
			if (configSlide.tpl=="sl2")
				bulles = form_slider_emo_g +form_slider_emo_d;
			if (configSlide.tpl=="sl3")
				bulles = form_slider_bulle2_g +form_slider_bulle2_d;
			if (configSlide.tpl=="sl5")
				bulles = form_slider_bulle3_g +form_slider_bulle3_d;
			if (configSlide.tpl=="sl6")
				bulles = form_slider_emo2_g +form_slider_emo2_d;
			if (configSlide.tpl=="sl7")
				bulles = form_slider_emo3_g +form_slider_emo3_d;
			
			if (configSlide.tpl=="sl10")
				bulles = form_slider_emo4_g +form_slider_emo4_d;
			if (configSlide.tpl=="sl11")
				bulles = form_slider_bulle4_g +form_slider_bulle4_d;
			if (configSlide.tpl=="sl12")
				bulles = form_slider_bulle5_g +form_slider_bulle5_d;
			if (configSlide.tpl=="sl13")
				bulles = form_slider_bulle6_g +form_slider_bulle6_d;
			
			template = form_slider.replace('##bulles##',bulles)
				.replace('##question##',question.question)
				.replace('##next##',"'"+selector+"'," +(qkey + 1))
				.replace('##next##',"'"+selector+"'," +(qkey + 1));
			
			if (configSlide.tpl=="sl4")
			//heure,demi-heure
			template = form_slider2.replace('##question##',question.question)
			.replace('##next##',"'"+selector+"'," +(qkey + 1))
			.replace('##next##',"'"+selector+"'," +(qkey + 1));;
		break; 
		case "S": 
		case "T": 
			//template = "string";
			configString = getQuestionConfig(question);
			if (configString.tpl=="uid")
			{
				deviceqid = question.qid;
				devicegid = question.gid;
				if (isMobile)
					var deviceID = md5(device.uuid);
				else
					var deviceID = "monDeviceUid";
				app.db.transaction(function(tx) {
					var timestamp = Math.round(new Date().getTime() / 1000); 
					tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+session_encours+',"'+question.sid+'","'+devicegid+'","'+deviceqid+'","'+deviceID+'", '+(timestamp-360)+',0);');
				});
				getTemplate(selector,(qkey + 1));
				return false;
				exit();
			}
			if (configString.tpl=="gps")
			{
				gpsqid = question.qid;
				gpsgid = question.gid;
				/*if (isMobile)
				{
					//debug=1;
					if(debug)alert("gps");
					var onSuccess = function(position) {
						if(debug)alert("gpsok");
						if(debug)alert('Latitude: '          + position.coords.latitude          + '\n' +
					          'Longitude: '         + position.coords.longitude         + '\n' +
					          'Altitude: '          + position.coords.altitude          + '\n' +
					          'Accuracy: '          + position.coords.accuracy          + '\n' +
					          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
					          'Heading: '           + position.coords.heading           + '\n' +
					          'Speed: '             + position.coords.speed             + '\n' +
					          'Timestamp: '         + position.timestamp                + '\n');
						
						var gps = "latitude:"+position.coords.latitude +"longitude:"+position.coords.longitude +",altitude:"+position.coords.altitude+",accuracy:"+position.coords.accuracy+",altitudeAccuracy:"+position.coords.altitudeAccuracy+",heading:"+position.coords.heading+",speed:"+position.coords.speed+",timestamp:"+position.timestamp;
						if(debug)alert(gps);
						//debug=0;
						app.db.transaction(function(tx) {
							var timestamp = Math.round(new Date().getTime() / 1000); 
							tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+session_encours+',"'+question.sid+'","'+gpsgid+'","'+gpsqid+'","'+gps+'", '+(timestamp-360)+',0);');
						},onDBError,onDBSuccess);
					};
					function onError(error) {
						if(debug)alert("gpsko");
						app.db.transaction(function(tx) {
							var timestamp = Math.round(new Date().getTime() / 1000); 
							tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+session_encours+',"'+question.sid+'","'+gpsgid+'","'+gpsqid+'","Erreur", '+(timestamp-360)+',0);');
						},onDBError,onDBSuccess);
					}
					navigator.geolocation.getCurrentPosition(onSuccess, onError);
					}
				else
				{	
					var gps = "maPositionGPS";
					var timestamp = Math.round(new Date().getTime() / 1000); 
					var gps = "latitude:48.9999999,longitude:2.9999999,altitude:null,accuracy:21.9999999999999999999999,altitudeAccuracy:null,heading:null,speed:null,timestamp:"+(timestamp-360);
					app.db.transaction(function(tx) {
						var timestamp = Math.round(new Date().getTime() / 1000); 
						tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+session_encours+',"'+question.sid+'","'+gpsgid+'","'+gpsqid+'","'+gps+'", '+(timestamp-360)+',0);');
					});
				}*/
				app.db.transaction(function(tx) {
					var timestamp = Math.round(new Date().getTime() / 1000); 
					tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+session_encours+',"'+question.sid+'","'+gpsgid+'","'+gpsqid+'","'+gps+'", '+(timestamp-360)+',0);');
				});
				getTemplate(selector,(qkey + 1));
				return false;
				exit();
			}
		break; 
		default: 
			configRadio = getQuestionConfig(question);
			if (configRadio.tpl=="radio2")
			{
				template = form_radio2.replace('##question##',question.question)
				.replace('##next##',"'"+selector+"'," +(qkey + 1));
			}
			else if (configRadio.tpl=="radio21")
			{
				template = form_radio21.replace('##question##',question.question)
				.replace('##next##',"'"+selector+"'," +(qkey + 2));
			}
			else if (configRadio.tpl=="radio22")
			{
				template = form_radio22.replace('##question##',question.question)
				.replace('##next##',"'"+selector+"'," +(qkey + 1));
			}
			else if (configRadio.tpl=="radio3")
			{
				template = form_radio3.replace('##question##',question.question)
				.replace('##next##',"'"+selector+"'," +(qkey + 1))
				.replace('##next2##',"'"+selector+"'," +(qkey + 2));
			}
			else
			{
				var radio_reponses = "";
				for (var akey in answers)
				{
					
					if (answers[akey].qid == question.qid)
						radio_reponses += form_radio_item.replace("##reponse##",answers[akey].answer)
														.replace("##code##",answers[akey].code)
														.replace("##label##",answers[akey].code);
				}
				template = form_radio.replace('##radio_items##',radio_reponses)
									.replace('##question##',question.question)
									.replace('##next##',"'"+selector+"'," +(qkey + 1));
			}
		break; 
		}
		
		template = template.replace('##qid##',question.qid)
							.replace('##sid##',question.sid)
							.replace('##gid##',question.gid)
							.replace('##idhoraire##',session_encours);
	}
	else
	{
		//page remerciement.
		template=merci;
		app.db.transaction(function(tx) {
			tx.executeSql('UPDATE "horaires" SET fait = 1 WHERE id ='+session_encours+';');
			if (isMobile)
    			window.plugin.notification.local.cancel(session_encours+"00", function () {
    			    // The notification has been canceled
    				console.log('one cancel');
    			});
		});
	}
	
	$('body').removeClass();
	$(selector).html(template);
	return false;
}

function saveFormData(type)
{
	var myreturn = true;
	form_qid = $("#multi_form #qid").attr("value");
	form_sid = $("#multi_form #sid").attr("value");
	form_gid = $("#multi_form #gid").attr("value");
	form_idhoraire = $("#multi_form #idhoraire").attr("value");
	switch (type)
	{
		case "radio": 
			form_reponse = $("#multi_form input[type='radio']:checked").attr("id");
		break; 
		case "slider": 
			form_reponse = $("#slidervalue").attr("value");
		break; 
		default: 
			if (isMobile)
			{
			navigator.notification.alert(
		            'pas de type',  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("pas de type");}
		 	myreturn = false;
		break; 
	}
	 app.db.transaction(function(tx) {
		var timestamp = Math.round(new Date().getTime() / 1000); 
		tx.executeSql('INSERT INTO "reponses" (idhoraire,sid,gid,qid, code, tsreponse, envoi) VALUES('+form_idhoraire+',"'+form_sid+'","'+form_gid+'","'+form_qid+'","'+form_reponse+'", '+(timestamp-360)+',0);');
	});
	return  myreturn;
}

var form_radio = 
'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' +   
'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getTemplate(##next##);}return false;">'  + 
'       <div id="radio_style">'  + 
'			##radio_items##' +
'		</div>'  + 
'      <div class="suite">'  + 
'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
'      </div>'  + 
'    </form>';

var form_radio_item = '<p><input type="radio" name="reponse" id="##code##" onClick="valide_un_radio();"/><label for="##label##">##reponse##</label></p>'  ;

var form_radio2_script =
'<script>$("#emotion input:radio").addClass("input_hidden");' + 
'$("#emotion label").click(function(){' + 
'    $(this).addClass("selected").siblings().removeClass("selected");' + 
'});</script>';

var form_radio2 = 
	'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' +  
	'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getTemplate(##next##);}return false;">'  + 
	'       <div id="emotion">'  + 
	'			<input type="radio" name="reponse" id="A1" onClick="valide_un_radio();" /><label for="A1"><img src="img/moins.png"/><br />Moins bien</label>' +
	'			<input type="radio" name="reponse" id="A2" onClick="valide_un_radio();" /><label for="A2"><img src="img/egale.png"/><br />Pareil</label>' +
	'			<input type="radio" name="reponse" id="A3" onClick="valide_un_radio();" /><label for="A3"><img src="img/plus.png"/><br />Mieux</label>' +
	'		</div>'  + 
	'      <div class="suite">'  + 
	'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
	'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
	'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
	'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
	'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
	'      </div>'  + 
	'    </form>' + form_radio2_script;
var form_radio21 = 
	'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' + 
	'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getTemplate(##next##);}return false;">'  + 
	'       <div id="emotion">'  + 
	'			<input type="radio" name="reponse" id="A1" onClick="valide_un_radio();" /><label for="A1"><img src="img/moins.png"/><br />s\'aggrave</label>' +
	'			<input type="radio" name="reponse" id="A2" onClick="valide_un_radio();" /><label for="A2"><img src="img/egale.png"/><br />est identique</label>' +
	'			<input type="radio" name="reponse" id="A3" onClick="valide_un_radio();" /><label for="A3"><img src="img/plus.png"/><br />s\'améliore</label>' +
	'		</div>'  + 
	'      <div class="suite">'  + 
	'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
	'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
	'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
	'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
	'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
	'      </div>'  + 
	'    </form>' + form_radio2_script;
var form_radio22 = 
	'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' + 
	'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getTemplate(##next##);}return false;">'  + 
	'       <div id="emotion">'  + 
	'			<input type="radio" name="reponse" id="A1" onClick="valide_un_radio();" /><label for="A1"><img src="img/moins.png"/><br />s\'aggraverait</label>' +
	'			<input type="radio" name="reponse" id="A2" onClick="valide_un_radio();" /><label for="A2"><img src="img/egale.png"/><br />serait<br/>identique</label>' +
	'			<input type="radio" name="reponse" id="A3" onClick="valide_un_radio();" /><label for="A3"><img src="img/plus.png"/><br />s\'améliorerait</label>' +
	'		</div>'  + 
	'      <div class="suite">'  + 
	'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
	'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
	'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
	'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
	'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
	'      </div>'  + 
	'    </form>' + form_radio2_script;

var form_radio3_script =
'<script>' +
'	function getNext(){' +
'		if($(\'#multi_form input[type="radio"]:checked\').attr("id") == "oui")' +
'			{getTemplate(##next##);}' +
'		else' +
'			{getTemplate(##next2##);}' +
'	}' +
'	</script>' ;

var form_radio3 = 
	'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' + 
	'    <form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(saveFormData(\'radio\')){getNext();}return false;">'  + 
	'       <div id="emotion">'  + 
	'			<input type="radio" name="reponse" id="oui" onClick="valide_un_radio();" /><label for="oui"><img src="img/ok.png" alt="oui" /><br />Oui</label>' +
	'			<input type="radio" name="reponse" id="non" onClick="valide_un_radio();" /><label for="non"><img src="img/ko.png" alt="non" /><br />Non</label>' +
	'		</div>'  + 
	'      <div class="suite">'  + 
	'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
	'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
	'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
	'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
	'        <input type="submit" value="Suite &gt;&gt;" disabled="disabled" id="btn_submit" name="btn_submit">'  + 
	'      </div>'  + 
	'    </form>' + form_radio2_script + form_radio3_script;

var form_slider_script = '<script>$( "#slider-range" ).slider({' + 
'	 min: 0,' + 
'	 max: 100,' + 
'	 values: [ 50 ],' + 
'	change: function(event, ui)' +  
'	{' + 
'		$("input#slidervalue").val(ui.value);' + 
'	}' + 
'});' + 
' $("input#slidervalue").val(50);' + 
' ' + 
' $( "#slider-range" ).draggable();</script>' ;

var form_slider =  
'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' +  
'<form method="post" action="" id="multi_form" name="multi_form" onSubmit="if(valide_slider()&&saveFormData(\'slider\')){getTemplate(##next##);}return false;" next="##next##">' +   
//'<form method="post" action="" id="multi_form" name="multi_form" onSubmit="return getTemplate(##next##)">' +   
'  ##bulles##' +   
'  <div class="clear"></div>' +   
'  <input type="hidden" id="slidervalue" name="slidervalue"/>' +   
'  <div id="slider-range"></div>' +   
'  <div class="suite">' +   
'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
'    <input type="submit" value="Suite &gt;&gt;">' +   
'  </div>' +   
'</form>' + form_slider_script;

//emoticones ...
var form_slider_emo_g = '<div class="left"><img src="img/humeur_2.png" alt="mal" /><br />Extrêmement<br />triste</div>';
var form_slider_emo_d = '<div class="right"><img src="img/humeur_4.png" alt="bien" /><br />Extrêmement<br />gaie</div>';

var form_slider_emo2_g = '<div class="left"><img src="img/nuage.png" alt="mal" /><br />Très mal</div>';
var form_slider_emo2_d = '<div class="right"><img src="img/soleil.png" alt="bien" /><br />Très bien</div>';

var form_slider_emo3_g = '<div class="left"><img src="img/nuage.png" alt="mal" /><br />Moins bien</div>';
var form_slider_emo3_d = '<div class="right"><img src="img/soleil.png" alt="bien" /><br />Mieux</div>';

var form_slider_emo4_g = '<div class="left"><img src="img/nuage.png" alt="mal" /><br />Très mauvaise</div>';
var form_slider_emo4_d = '<div class="right"><img src="img/soleil.png" alt="bien" /><br />Très bonne</div>';

//bulles
var form_slider_bulle_g = '<div class="left bulle">Pas bien<br />du tout</div>';
var form_slider_bulle_d = '<div class="right bulle">Parfaitement<br />bien</div>';

var form_slider_bulle2_g = '<div class="left bulle">Extrêmement<br />angoissé</div>';
var form_slider_bulle2_d = '<div class="right bulle">Tout à fait<br />calme</div>';

var form_slider_bulle3_g = '<div class="left bulle">Pas du<br />tout</div>';
var form_slider_bulle3_d = '<div class="right bulle">Enormément<br /></div>';

var form_slider_bulle4_g = '<div class="left bulle">Pas du<br />tout</div>';
var form_slider_bulle4_d = '<div class="right bulle">Totalement<br /></div>';

var form_slider_bulle5_g = '<div class="left bulle">Pas bien du<br />tout</div>';
var form_slider_bulle5_d = '<div class="right bulle">Très<br />bien</div>';

var form_slider_bulle6_g = '<div class="left bulle">Pas du<br />tout</div>';
var form_slider_bulle6_d = '<div class="right bulle">Beaucoup<br /></div>';

var form_slider2_script = '<script>$( "#slider-range" ).slider({' + 
'	 min: 0,' + 
'	 max: 20,' + 
'	 values: [ 0 ],' + 
'	change: function(event, ui)' +  
'	{' + 
'		$("input#slidervalue").val(ui.value);' + 
'		var h = Math.floor(ui.value/2) + "h";' + 
'		var m = (ui.value%2==1?"30min":"00");' + 
//'		$("input#slidervalue2").val(h+m);' + 
'		$("div#slidervalue2").html(h+m);' + 
'	}' + 
'});' + 
' $("input#slidervalue").val(0);' + 
//' $("input#slidervalue2").val("0h00min");' + 
' $("div#slidervalue2").html("0h00");' + 
' ' + 
' $( "#slider-range" ).draggable();</script>' ;

var form_slider2 =  
'<div class="spirale"><div class="fille"></div><div class="postit"><div class="question">##question##</div></div></div>' + 
'<form class="time" id="multi_form" name="multi_form" action="" onSubmit="if(valide_slider2()&&saveFormData(\'slider\')){getTemplate(##next##);}return false;" next="##next##">'  +
'  <div class="clear"></div>'  +
'  <input type="hidden" id="slidervalue" name="slidervalue"/> '  +
'  <div id="slider-range" class="heure"></div>'  +
'  <br/>'  +
//'  <input type="text" id="slidervalue2" name="slidervalue2"/>'  +
'  <div id="slidervalue2"></div>'  +
'  <div class="suite">'  +
'        <input type="hidden" value="##gid##" id="gid" name="gid">'  +
'        <input type="hidden" value="##sid##" id="sid" name="sid">'  +
'        <input type="hidden" value="##qid##" id="qid" name="qid">'  +
'        <input type="hidden" value="##idhoraire##" id="idhoraire" name="idhoraire">'  +
'    <input type="submit" value="Suite &gt;&gt;">'  +
'  </div>'  +
'</form>' + form_slider2_script;


var merci =  
'<div class="merci">'  +
'<div class="bulle_seule">Vous avez terminé !</div>'  +
'<div class="fille"></div>'  +
'</div>' +
'<form action="index.html" onSubmit="">'  +
'  <div class="suite retour_accueil">'  +
'    <input type="submit" value="Retour Accueil">'  +
'  </div>'  +
'</form>' ;
