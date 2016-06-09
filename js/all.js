
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
          $("#bulletin-container").append('<div style="display:block;width:100%;background-color:black;color:white;">'+paths[i]+'</div>');
          console.log('processing: '+paths[i]);
        //  processXML(xml);
          var section_array=xml.find('sections');
          for(var s=0;s<section_array.length;s++){
            $all.append(section_array[s]);
          }
          parse(i+1);
        }
      });
    }
    else{
      processXML($all);
    }
  }
  parse(0);

});
