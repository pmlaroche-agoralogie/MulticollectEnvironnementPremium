window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

function show_settings()
{   sendReponses();
    hide_div('home');
    hide_div('profil');
    hide_div('credits');
    show_div('settings');
}

function show_profil()
{   
    hide_div('settings');
    show_div('profil');
}

function show_credits()
{   
    hide_div('home');
    hide_div('settings');
    show_div('credits');
}

function begin_acquisition()
{
    hide_div('home');
    show_div('acquisition');
}


function go_home()
{
    //add an alert
    hide_div('acquisition');
    hide_div('settings');
    hide_div('credits');
    show_div('home');
    hide_div('profil');
}

var LSSForm = function(xmlString) {
    var domParser = new DOMParser();
    this.xmlDocument = domParser.parseFromString(xmlString, "text/xml");
};

LSSForm.prototype = {
    constructor: LSSForm,
    
    /**
     * Get the LimeSurveyDocType
     **/
    getLSDocType: function() {
        return this.xmlDocument.getElementsByTagName("LimeSurveyDocType")[0].childNodes[0].nodeValue;
    },
    
    /**
     * Get the DBVersion
     **/
    getDBVersion: function() {
        return this.xmlDocument.getElementsByTagName("DBVersion")[0].childNodes[0].nodeValue;
    },
    
    /**
     * Get a javascript list of strings representing the country code for each languages
     **/
    getLanguages: function() {
        var liste = [];
        var nodeList = this.xmlDocument.getElementsByTagName("languages")[0].getElementsByTagName("language");
        for (var i in nodeList) {
            if (nodeList[i].childNodes && nodeList[i].childNodes[0]) {
                liste.push(nodeList[i].childNodes[0].nodeValue);
            }
        }
        return liste;
    },
    
    /**
     * Helper method to get the fieldnames of a limesurvey category
     * 
     * Parameters :
     * - group : the category (answers, groups, questions, surveys, surveys_languagesettings)
     * 
     * Returns a javascript list of strings
     **/
    getFieldnamesOf: function(group) {
        var liste = [];
        var nodeList = this.xmlDocument.getElementsByTagName(group)[0].getElementsByTagName("fields")[0].getElementsByTagName("fieldname");
        for (var i in nodeList) {
            if (nodeList[i].childNodes && nodeList[i].childNodes[0]) {
                liste.push(nodeList[i].childNodes[0].nodeValue);
            }
        }
        return liste;
    },
    
    /**
     * Helper method to get the rows of a limesurvey category
     * 
     * Parameters :
     * - group : the category (answers, groups, questions, surveys, surveys_languagesettings)
     * 
     * Returns a javascript list of javascript objects representing each row
     **/
    getRowsOf: function(group) {
        var fields = this.getFieldnamesOf(group);
        var liste = [];
        var nodeList = this.xmlDocument.getElementsByTagName(group)[0].getElementsByTagName("rows")[0].getElementsByTagName("row");
        for (var i in nodeList) {
            if (nodeList[i].childNodes) {
                var row = {};
                for (var j in fields) {
                    var field = nodeList[i].getElementsByTagName(fields[j])[0];
                    if (field && field.childNodes && field.childNodes[0]) {
                        row[fields[j]] = field.childNodes[0].nodeValue;
                    } else {
                        row[fields[j]] = null;
                    }
                }
                liste.push(row);
            }
        }
        return liste;
    }
};


function downloadNewStudy (form,callback) {
    var studyNumber = form.inputbox.value;
    var urldata = "http://mcp.ocd-dbs-france.org/lss/lss_"+studyNumber;
    
    // http://cordova.apache.org/docs/en/3.0.0/cordova_file_file.md.html
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
        function fileRequestSucess(fileSystem) {
            fileSystem.root.getFile(
                "dummy.html", {create: true, exclusive: false},
                function getFileSuccess(fileEntry) {
                    var sPath = fileEntry.toURL().replace("dummy.html", "");
                    var fileTransfer = new FileTransfer();
                    fileEntry.remove();
                    
                    fileTransfer.download(
                        urldata,
                        sPath + "lss_" + studyNumber,
                        function downloadSuccess(theFile) {
                            /*var callback = function(lss) {
                                alert("Téléchargement terminé : " + theFile.toURL() + "\n\n" +
                                      "Type: " + lss.getLSDocType() + ", Version: " + lss.getDBVersion());
                            };*/
                            openStudy(form, callback,1);
                        },
                        function downloadFailed(error) {
                        	if (isMobile)
                			{
                			navigator.notification.alert(
                					"Impossible de télécharger : "+studyNumber,  // message
                		            alertDismissed,         // callback
                		            'Multicollect',            // title
                		            'Ok'                  // buttonName
                		        );
                			}
                			else
                				{alert("Impossible de télécharger : "+studyNumber);}
                        }
                    );
                },
                function getFileFailed(evt) {
                	if (isMobile)
        			{
        			navigator.notification.alert(
        					"Impossible de récupérer le chemin.",  // message
        		            alertDismissed,         // callback
        		            'Multicollect',            // title
        		            'Ok'                  // buttonName
        		        );
        			}
        			else
        				{alert("Impossible de récupérer le chemin.");}
                }
            );
        },
        function fileRequestFailed(evt) {
        	if (isMobile)
			{
			navigator.notification.alert(
					"Impossible de récupérer le système de fichiers.",  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("Impossible de récupérer le système de fichiers.");}
        }
    );
}

/**
 * DEBUG ONLY
 **/
function openFakeStudy(studyStr, callback, firstTime) {
	firstTime = typeof firstTime !== 'undefined' ? firstTime : 0;
    var lss = new LSSForm(studyStr);
    if (callback) {
        callback(lss,firstTime);
    } else { // Debug only, the user should provide a callback
        alert(JSON.stringify(lss.getRowsOf("questions")[0]));
    }
}

function openStudy (form, callback,firstTime) {
	firstTime = typeof firstTime !== 'undefined' ? firstTime : 0;
    var studyNumber = form.inputbox.value;
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
        function fileRequestSucess(fileSystem) {
            fileSystem.root.getFile(
                "lss_" + studyNumber, null,
                function getFileSuccess(fileEntry) {
                    //alert(fileEntry.toURL());
                    
                    fileEntry.file(
                        function(file) {
                            var fileReader = new FileReader();
                    
                            fileReader.onloadend = function(evt) {
                                //alert(evt.target.result);
                                var lss = new LSSForm(evt.target.result);
                                if (callback) {
                                    callback(lss,firstTime);
                                } else { // Debug only, the user should provide a callback
                                    alert(lss.getFieldnamesOf("answers"));
                                    alert(JSON.stringify(lss.getRowsOf("questions")[2]));
                                }
                            };
                            
                            fileReader.onerror = function(evt) {
                            	if (isMobile)
                    			{
                    			navigator.notification.alert(
                    					"Error"+evt.error.code,  // message
                    		            alertDismissed,         // callback
                    		            'Multicollect',            // title
                    		            'Ok'                  // buttonName
                    		        );
                    			}
                    			else
                    				{alert("Error"+evt.error.code);}
                            };
                            
                            fileReader.readAsText(file);
                        },
                        function(error){
                        	if (isMobile)
                			{
                			navigator.notification.alert(
                					"Impossible d'ouvrir le suivi demandé. ("+studyNumber+")",  // message
                		            alertDismissed,         // callback
                		            'Multicollect',            // title
                		            'Ok'                  // buttonName
                		        );
                			}
                			else
                				{alert("Impossible d'ouvrir le suivi demandé. ("+studyNumber+")");}
                        }
                    );
                    
                },
                function getFileFailed(evt) {
                	if (isMobile)
        			{
        			navigator.notification.alert(
        					"Impossible d'ouvrir le suivi demandé ="+studyNumber+" ",  // message
        		            alertDismissed,         // callback
        		            'Multicollect',            // title
        		            'Ok'                  // buttonName
        		        );
        			}
        			else
        				{alert("Impossible d'ouvrir le suivi demandé ="+studyNumber+" ");}
                }
            );
        },
        function fileRequestFailed(evt) {
        	if (isMobile)
			{
			navigator.notification.alert(
					"Impossible de récupérer le système de fichiers.",  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("Impossible de récupérer le système de fichiers.");}
        }
    );
}

//From http://stackoverflow.com/questions/649614/xml-parsing-of-a-variable-string-in-javascript
function LoadXMLString(xmlString)
{

   var xDoc;
    // The GetBrowserType function returns a 2-letter code representing
    // ...the type of browser.
    
        var dp = new DOMParser();
        xDoc = dp.parseFromString(xmlString, "text/xml");
       
    return xDoc;
  
}


// From http://www.html5rocks.com/en/tutorials/cors/
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest(url) {
  // All HTML5 Rocks properties support CORS.
  //var url = 'http://mcp.ocd-dbs-france.org/lss/lss_934317';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    console.log('Response from CORS request to ' + url + ': ' + title);
    
    var xmlDoc = LoadXMLString(text);
    console.log(xmlDoc.documentElement.nodeName);
    
    var x=xmlDoc.getElementsByTagName("question");
    //var x=g.getElementsByTagName("rows");

    for (i=0;i<x.length;i++)
      {
       if (x[i].nodeType==1)
        {
            // liste les textes des questions
        console.log('nn'+x[i].nodeName);
        console.log('nv'+x[i].childNodes[0].nodeValue);
        }
      }
     question1.innerHTML = x[0].childNodes[0].nodeValue;
      
      var x=xmlDoc.getElementsByTagName("answer");
      //var x=g.getElementsByTagName("rows");
      var reponse = '';
      for (i=0;i<5;i++)
      {
          if (x[i].nodeType==1)
          {
              
              reponse += "<br>" +x[i].childNodes[0].nodeValue ;
          }
      }
      answer1.innerHTML = reponse;

      
        
  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  xhr.send();
}

function hide_div(divID) {
   var item = document.getElementById(divID);
   if (item) {
      document.getElementById(divID).style.display = 'none';
  }
}

function show_div(divID) {
    var item = document.getElementById(divID);
    if (item) {
        document.getElementById(divID).style.display = 'block';
    }
}