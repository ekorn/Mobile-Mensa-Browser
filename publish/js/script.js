 
var weekdayNumber = (new Date).getDay()-1;
var jsonDone=0;
var errorString = "Keine Daten abrufbar.";
$(document).ready(function() {

  $('#welcomePage').live('pagebeforeshow',function(){
    $('#downloadSliderBox').find('input[type="number"]').hide();
  });

//GET and put MENSA
  $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.studentenwerk-pb.de%2Ffileadmin%2Fxml%2Fmensa.xml'%20&format=json&callback=?",
    function(data) {
      try{
        setPlan(data, $('#weekMensa'));
        updateSlider();
      } catch(e){
        /*console.log("error",e)*/;
        $('#weekPalmengarten').append('<center><h3>'+errorString+'</h3></center>');
        updateSlider();
      }
    });

  
//GET and put Palmengarten
  $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.studentenwerk-pb.de%2Ffileadmin%2Fxml%2Fpalmengarten.xml'%20&format=json&callback=?",
    function(data) {
      try{
        setPlan(data, $('#weekPalmengarten'));
        updateSlider();
      } catch(e){
        /*console.log("error",e)*/;
        $('#weekPalmengarten').append('<center><h3>'+errorString+'</h3></center>');
        updateSlider();
      }
    });

//GET and put Gownsmenspub
  $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.studentenwerk-pb.de%2Ffileadmin%2Fxml%2Fgownsmenspub.xml'%20&format=json&callback=?",
    function(data) {
      try{
        setPlan(data, $('#weekGownsmenspub'));
        updateSlider();
      } catch(e){
        /*console.log("error",e)*/;
        $('#weekGownsmenspub').append('<center><h3>'+errorString+'</h3></center>');
        updateSlider();
      }
    });
    
//GET and put Mensula
  $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.studentenwerk-pb.de%2Ffileadmin%2Fxml%2Fmensula.xml'%20&format=json&callback=?",
    function(data) {
      try{
        data = data.query.results.plan;
        ///*console.log(data)*/;
        var menueList='<center><h3>'+data.tag[0].wochentag+' ('+data.tag[0].datum+')</h3></center><ul data-role="listview" data-inset="true">';
        
        //Vorspeise
        menueList+='<li data-role="list-divider" >'+data.tag[0].menue.menu+'</li>';
        menueList+=createMensulaEntry(data.tag[0].menue);
        //Hauptspeise
        menueList+='<li data-role="list-divider" >'+data.tag[1].menue[0].menu+'</li>';
        for(var i=0; i<data.tag[1].menue.length; i++){
          menueList+=createMensulaEntry(data.tag[1].menue[i]); 
        }
        //Dessert
        menueList+='<li data-role="list-divider" >'+data.tag[2].menue.menu+'</li>';
        menueList+=createMensulaEntry(data.tag[2].menue);
        
        menueList+="</ul>";
        $('#weekMensula').append(menueList);
        updateSlider();
      } catch(e){
        /*console.log("error",e)*/;
        $('#weekMensula').append('<center><h3>'+errorString+'</h3></center>');
        updateSlider();
      }
    });

//===============END OF DOC READY===============
});

function setPlan(data, parent){
data = data.query.results.plan;
    

    for(var i=0; i< data.tag.length; i++){
      var menueList='<ul data-role="listview" data-inset="true">';
      if(data.tag[i].menue.length == null){
        menueList += createListEntry(data.tag[i].menue)
      }else{
        for(var j=0; j< data.tag[i].menue.length; j++){
          menueList += createListEntry(data.tag[i].menue[j]);
        }
      }
      menueList+="</ul>";
      var weekdayString = '<div data-role="collapsible"';
      if(i != weekdayNumber){
        weekdayString+='data-collapsed="true"';
      }
      weekdayString+='><h3>'+data.tag[i].wochentag+' ('+data.tag[i].datum+')</h3>'+menueList+'</div>';
      parent.append(weekdayString);
    }
    if(typeof data.tag.length == 'undefined'){
      parent.append('<center><h3>'+errorString+'</h3></center>');
    }
    
}

function createListEntry(menue){
  var menueListEntry = "<li><p>"+menue.menu;
        if(menue.preis != null){
          menueListEntry+=" ("+menue.preis+")";
        }        
        menueListEntry+="</p><h6>"+menue.text+"</h6>";
        if(menue.beilage != null){
          menueListEntry+='<p>';
          for(var i=0; i<menue.beilage.length; i++){
            menueListEntry+=menue.beilage[i]+" ";
          }
          menueListEntry+="</p>";
        }
        if(menue.ausgabe != null){
          menueListEntry+="<p><strong>Ausgabe:</strong> "+menue.ausgabe+"</p>";
        }        
        if(menue.speisentyp != null){
          menueListEntry+="<p> ("+menue.speisentyp+")</p>";
        }
        menueListEntry+="</li>";
        
        return menueListEntry;
}

function createMensulaEntry(menue){
  var menueListEntry = "<li><h3>"+menue.text;        
        if(menue.preis != null){
          menueListEntry+=" ("+menue.preis+")";
        }
        menueListEntry+="</h3>";
        if(menue.beilage != null){
          menueListEntry+="<p><strong>Beilage:</strong> "+menue.beilage.toString()+"</p>";
        }
        if(menue.ausgabe != null){
          menueListEntry+="<p><strong>Ausgabe:</strong> "+menue.ausgabe+"</p>";
        }        
        if(menue.speisentyp != null){
          menueListEntry+="<p> ("+menue.speisentyp+")</p>";
        }
        menueListEntry+="</li>";
        
        return menueListEntry;
}

function updateSlider(){
  jsonDone++;
  $('#downloadSlider').val(jsonDone).slider("refresh");
  if(jsonDone == 4){
    $('#downloadSliderBox').fadeOut(800);
    $.mobile.changePage("#mensa");
  }
}
