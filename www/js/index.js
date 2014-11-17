/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//debug global
debug=0;
gps="noGPS";

//test si chrome
var isMobile = true;
if (window.chrome)
	isMobile = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      /*  var el = document.getElementById("chargement"); 
        el.addEventListener('clic', this.getlssfile, false);*/
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
onDeviceReady: function() {
	//photo
	if(isMobile){
	pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;}
    //fin photo
    app.receivedEvent('deviceready');
    hide_div('blocinit');
    getPositionGps();
    

 /*   if(isMobile)
    {
    	// onSuccess Callback
	// This method accepts a Position object, which contains the
	// current GPS coordinates
	//
	var onSuccess = function(position) {
	    alert('Latitude: '          + position.coords.latitude          + '\n' +
		  'Longitude: '         + position.coords.longitude         + '\n' +
		  'Altitude: '          + position.coords.altitude          + '\n' +
		  'Accuracy: '          + position.coords.accuracy          + '\n' +
		  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		  'Heading: '           + position.coords.heading           + '\n' +
		  'Speed: '             + position.coords.speed             + '\n' +
		  'Timestamp: '         + position.timestamp                + '\n');
	};
	
	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
	}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }*/
    /*
    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    
    if(isMobile)
    {
	    window.plugin.notification.local.add({
	                                         id:      99999,
	                                         title:   'Application de Suivi',
	                                         message: 'test android Merci de répondre au questionnaire de l application de suivi.',
	                                         date:    _60_seconds_from_now
	                                         });
    }
    */

    // https://github.com/brodysoft/Cordova-SQLitePlugin
    if(isMobile)
    	app.db = window.sqlitePlugin.openDatabase("MCENVDatabase", "1.0", "MCENVDemo", -1);
    else
    	app.db = openDatabase("MCENVDatabase", "1.0", "MCENVDemo", -1);
    
    app.db.transaction(function(tx) {                       
                        //table questionnaire
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "questionnaires" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "uidquestionnaire" VARCHAR, "titre" VARCHAR);'); 
                        //tx.executeSql('DROP TABLE IF EXISTS "questionnaires"');
                        tx.executeSql('SELECT * FROM "questionnaires"', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            		for(var i=0;i<dataset;i++)
                                    {
                                		$('body').removeClass('none');
                                		//$('body.home .question').html("Vous avez un questionnaire à remplir");
                                		$('body.home #home').html('<div class="question" qid="'+res.rows.item(i).uidquestionnaire+'">'+res.rows.item(i).titre+'</div>');                			
                                		
                                    }
                            		$('body.home .question').click(function(){
                            			getPositionGps();
                            			isHomeActive = false;
                          			  //TODO switch ismobile pour test locaux seulement sinon fonctionnement normal
                            			$('body.home #opensurvey #idsurvey').attr('value',$(this).attr('qid'));
                            			if(!isMobile)
                          			  		openFakeStudy(xmlquotidien, onLssLoaded);
                            			else
	                          			  	$('body.home #opensurvey #buttonopensurvey').click();
                            			session_encours =  Math.round(new Date().getTime() / 1000);
                            			getTemplate('.contenu',0);
                            		});
                            }
                            else
                            {
                            	$('body').addClass('none');
                            	$('body.home #home').html(' <div class="question">Vous n\'avez pas de questionnaire à remplir</div>');
                            	if (debug)
                            		alert("aucun questionnaire en cours\n");
                            }
                        }); 
                        //creation table réponses
                        //tx.executeSql('DROP TABLE IF EXISTS "reponses"');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "reponses" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "idhoraire" INTEGER DEFAULT (0), "sid" VARCHAR, "gid" VARCHAR, "qid" VARCHAR, "code" TEXT, "tsreponse" INTEGER, "envoi" BOOLEAN not null default 0);');

                      
    	},onDBError,onDBSuccess);
    sendReponses();
    setTimeout(function() {if(isHomeActive){app.reload();}}, 60000);
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    getlssfile: function() {
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
    console.log('x');
        var xhReq = new XMLHttpRequest();
      
       // var urldata = "http://openrad.agoralogie.fr/post.php?mesure=123"+123.innerHTML+"&lat="+lastlat+"&long="+lastlong;
        var urldata = "http://mcp.ocd-dbs-france.org/lss/lss_934317";
        
        xhReq.open("GET", urldata, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText; 
        console.log(serverResponse);
    },
    
    reload: function(){
	console.log('app.reload');
	$('body').addClass('home');
	app.db.transaction(function(tx) {                   
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        console.log(timestamp);
			//Session en cours?
                        tx.executeSql('SELECT * FROM "questionnaires"', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            		for(var i=0;i<dataset;i++)
                                    {
                                		$('body').removeClass('none');
                                		//$('body.home .question').html("Vous avez un questionnaire à remplir");
                                		$('body.home #home').html('<div class="question" qid="'+res.rows.item(i).uidquestionnaire+'">'+res.rows.item(i).titre+'</div>');                			
                                		
                                    }
                            		$('body.home .question').click(function(){
                            			isHomeActive = false;
                          			  //TODO switch ismobile pour test locaux seulement sinon fonctionnement normal
                            			$('body.home #opensurvey #idsurvey').attr('value',$(this).attr('qid'));
                            			if(!isMobile)
                          			  		openFakeStudy(xmlquotidien, onLssLoaded);
                            			else
	                          			  	$('body.home #opensurvey #buttonopensurvey').click();
                            			session_encours =  Math.round(new Date().getTime() / 1000);
                            			getTemplate('.contenu',0);
                            		});
                            }
                            else
                            {
                            	$('body').addClass('none');
                            	$('body.home #home').html(' <div class="question">Vous n\'avez pas de questionnaire à remplir</div>');
                            	if (debug)
                            		alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                            }
                        }); 
                        
			
			//Envoi réponses si existent
			sendReponses();
			setTimeout(function() {if(isHomeActive){app.reload();}}, 60000);
    	},onDBError,onDBSuccess); 	
    },
    
    takephoto:function(){
    	 navigator.camera.getPicture(onPhotoDataSuccess, onPhotoFail, { quality: 50,
    	        destinationType: destinationType.DATA_URL });
    },
    
    choosephoto:function(){
    	navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, { quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: pictureSource.PHOTOLIBRARY });
    }
    
};

function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
  }

function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
  }

function onPhotoFail(message) {
    alert('Failed because: ' + message);
  }

function getSurveyConfig()
{
	var config = {};
	var strSurveyConfig = surveys_languagesettings[0].surveyls_description;
	//alert(surveys_languagesettings[0].surveyls_description);
	var line = strSurveyConfig.split("#");
	for (var linekey in line)
	{
		line2 = line[linekey].split(":");
		if (line2[0]!= "")
		{
			line20=line2[0];
			line21=line2[1];
			config[line20] = line21;
		}
	}
	return config;
}

function getQuestionConfig(question)
{
	var config = {};
	var strSurveyConfig = question.help;
	//alert(surveys_languagesettings[0].surveyls_description);
	if (strSurveyConfig)
	{
		var line = strSurveyConfig.split("#");
		for (var linekey in line)
		{
			line2 = line[linekey].split(":");
			if (line2[0]!= "")
			{
				line20=line2[0];
				line21=line2[1];
				config[line20] = line21;
			}
		}
	}
	return config;
}


function RazQuestionnaire()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "questionnaires";');
	});
}

function RazReponse()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "reponses";');
	});
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function sendReponsesOld()
{
	var aReponses ={};
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "horaires" WHERE fait = 1;', [], function(tx, resHoraires) {
			var dataset = resHoraires.rows.length;
			console.log(resHoraires);
            if(dataset>0)
            {     	
            	if (debug)
            		alert("session à  envoi");
            	for(var i=0;i<dataset;i++)
                {        
            		tx.executeSql('SELECT * FROM "reponses" WHERE envoi = 0  AND idhoraire = '+resHoraires.rows.item(i).id+';', [], function(tx, res2) {
            			var dataset2 = res2.rows.length;
                        if(dataset2>0)
                        {
                        	saveResHorairesID = res2.rows.item(0).idhoraire;
                        	aReponses["sid"] = res2.rows.item(0).sid;
                        	aReponses["timestamp"] = res2.rows.item(0).tsreponse;
                        	if (debug)
                        		alert("reponse à  envoi");
                        	for(var j=0;j<dataset2;j++)
                            {
                        		/*if (debug) 
                        			alert(res2.rows.item(j).sid);*/
                                var jsonkey = res2.rows.item(j).sid +"X"+res2.rows.item(j).gid+"X"+res2.rows.item(j).qid;
                        		aReponses[jsonkey]=res2.rows.item(j).code;
                            }
                        	if (debug)
                        		alert("essai envoi"+JSON.stringify(aReponses));
                        	xhr_object = new XMLHttpRequest(); 
                        	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/mobilerpc.php?answer="+JSON.stringify(aReponses), false); 
                        	xhr_object.send(null); 
                        	console.log("send rep");
                        	console.log(xhr_object);
                        	console.log(JSON.stringify(aReponses));
                        	if(xhr_object.readyState == 4) 
                        	{
                        		/*if(!isMobile) 
                        			alert("Requête effectuée !"); */
                        		if(xhr_object.response == "1") 
                        			{
                        			tx.executeSql('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			console.log('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			if (debug)
                        				alert('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			}
                        	}
                        	
                        }
            			
            		});
            		
                }
            }
		});
	});
}


function saveQuestionnaire(firstTime) {
	if (debug)
		alert('saveQuest1');
	app.db.transaction(function(tx) {
		if (debug)
			alert('saveQuest2');
		var sid = surveys[0].sid;
		var qtitre = surveys_languagesettings[0].surveyls_title;
		if (debug)
			{
			alert(sid);alert(qtitre);
			alert('saveQuest22');
			}
		tx.executeSql('select count("id") as cnt from "questionnaires" WHERE uidquestionnaire = "'+sid+'";', [], function(tx, res) {
			if (debug)
				alert('saveQuest3');
			if (res.rows.item(0).cnt < 1)
			{
				if (debug)
					alert('saveQuest4');
				tx.executeSql('INSERT INTO "questionnaires" (uidquestionnaire,titre) VALUES("'+sid+'","'+qtitre+'");',[],function(tx, res) {
					if (debug)
						alert('saveQuest5');
					if (isMobile)
					{
					navigator.notification.alert(
				            'Questionnaire enregistré',  // message
				            alertDismissed,         // callback
				            'Multicollect',            // title
				            'Ok'                  // buttonName
				        );
					}
					else
						{alert("Questionnaire enregistré 3");alert(debug)}
				}); 
			}
		});//fin selct
	},onDBError,onDBSuccess);//fin app
}

function onDBError(error)
{
	if (debug)
		alert("Database Error"+error.message);
}

function onDBSuccess(tx,results)
{
	if (debug)
		alert("successfull");
}

function saveUser(){
	if ($('#userform #userid').val() != "")
	{	
		try 
		{
			if (isMobile)
				var deviceID = md5(device.uuid);
			else
				var deviceID = "monDeviceUid";
			xhr_object = new XMLHttpRequest(); 
	    	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/save_user.php?duid="+deviceID+"&id="+encodeURI($('#userform #userid').val()), false); 
	    	xhr_object.send(); 
	    	console.log("send user");
	    	console.log(xhr_object);
	    	console.log($('#userform #userid').val());
	    	if(xhr_object.readyState == 4) 
	    	{
	    		if(xhr_object.response == "1") 
	    		{
	    			if (isMobile)
	    			{
	    			navigator.notification.alert(
	    		            'Votre identifiant a été enregistré.',  // message
	    		            alertDismissed,         // callback
	    		            'Multicollect',            // title
	    		            'Ok'                  // buttonName
	    		        );
	    			}
	    			else
	    				{alert("Votre identifiant a été enregistré.");}
	    		}
	    		else
	    		{
	    			if (isMobile)
						{
						navigator.notification.alert(
					            'Veuillez réessayer ultérieurement.',  // message
					            alertDismissed,         // callback
					            'Multicollect',            // title
					            'Ok'                  // buttonName
					        );
						}
						else
							{alert("Veuillez réessayer ultérieurement.");}
	    		}
	    	}
	    	else
	    	{
	    		if (isMobile)
				{
				navigator.notification.alert(
			            'Veuillez réessayer ultérieurement.',  // message
			            alertDismissed,         // callback
			            'Multicollect',            // title
			            'Ok'                  // buttonName
			        );
				}
				else
					{alert("Veuillez réessayer ultérieurement.");}
	    	}
        } catch(e) {
        	if (isMobile)
			{
			navigator.notification.alert(
		            'Veuillez réessayer ultérieurement.',  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("Veuillez réessayer ultérieurement.");}
        }
	}

}

function sendReponses()
{
	if (debug)alert("sendReponses");
	var aReponses ={};
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT DISTINCT "idhoraire" FROM "reponses" WHERE envoi = 0 ;', [], function(tx, resHoraires) {
			var dataset = resHoraires.rows.length;
			/*console.log('horaire');
			console.log(resHoraires);
			console.log(resHoraires.rows.item(0));*/
            if(dataset>0)
            {     	
            	if (debug)alert("session à  envoi");
            	for(var i=0;i<dataset;i++)
                {        
            		tx.executeSql('SELECT * FROM "reponses" WHERE envoi = 0  AND idhoraire = '+resHoraires.rows.item(i).idhoraire+';', [], function(tx, res2) {
            			var dataset2 = res2.rows.length;
            			//console.log('ici');
                        if(dataset2>0)
                        {
                        	saveResHorairesID = res2.rows.item(0).idhoraire;
                        	aReponses["sid"] = res2.rows.item(0).sid;
                        	aReponses["timestamp"] = res2.rows.item(0).tsreponse;
                        	if (debug)
                        		alert("reponse à  envoi");
                        	for(var j=0;j<dataset2;j++)
                            {
                        		/*if (debug) 
                        			alert(res2.rows.item(j).sid);*/
                                var jsonkey = res2.rows.item(j).sid +"X"+res2.rows.item(j).gid+"X"+res2.rows.item(j).qid;
                        		aReponses[jsonkey]=res2.rows.item(j).code;
                            }
                        	if (debug)
                        		alert("essai envoi"+JSON.stringify(aReponses));
                        	xhr_object = new XMLHttpRequest(); 
                        	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/mobilerpc.php?answer="+JSON.stringify(aReponses), false); 
                        	xhr_object.send(null); 
                        	console.log("send rep");
                        	console.log(xhr_object);
                        	console.log(JSON.stringify(aReponses));
                        	if(xhr_object.readyState == 4) 
                        	{
                        		/*if(!isMobile) 
                        			alert("Requête effectuée !"); */
                        		if(xhr_object.response == "1") 
                        			{
                        			tx.executeSql('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			console.log('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			if (debug)
                        				alert('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			}
                        	}
                        	
                        }
            			
            		});
            		
                }
            }
		});
	});
}

function alertDismissed() {
    // do something
}

function getPositionGps()
{
	if (isMobile)
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
			
			gps = "latitude:"+position.coords.latitude +"longitude:"+position.coords.longitude +",altitude:"+position.coords.altitude+",accuracy:"+position.coords.accuracy+",altitudeAccuracy:"+position.coords.altitudeAccuracy+",heading:"+position.coords.heading+",speed:"+position.coords.speed+",timestamp:"+position.timestamp;
			if(debug)alert(gps);
		};
		function onError(error) {
			if(debug)alert("gpsko");
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	else
	{	
		gps = "maPositionGPS";
		var timestamp = Math.round(new Date().getTime() / 1000); 
		gps = "latitude:48.9999999,longitude:2.9999999,altitude:null,accuracy:21.9999999999999999999999,altitudeAccuracy:null,heading:null,speed:null,timestamp:"+(timestamp-360);

	}
}