


var $all=$('<sections></sections>');
$(document).ready(function(){
  function parse(i){
    if(i<paths.length){
      $.ajax({
        url:paths[i],
        type:'GET',
        error: function(){
          parse(i+1);
        },
        success: function(xml){
        //  $("#bulletin-container").append('<div style="display:block;width:100%;background-color:black;color:white;">'+paths[i]+'</div>');
          console.log('processing: '+paths[i]);
        //  processXML(xml);
          var section_array=$(xml).find('section');
          for(var s=0;s<section_array.length;s++){
            $all.append(section_array[s]);
          }
          parse(i+1);
        }
      });
    }
    else{
    //  console.log($all.html());
    var filters=["Millennials (1981–2000)","Generation X (1965–1980)","Middle class","Working class"];
      processXML($all,filters);
    }
  }
  parse(0);

});
