/*$.get(path, function(xmlDoc){
  var sections=$(xmlDoc).find('section');
  for(var s=0;s<sections.length;s++){
    var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
    $(sections[s]).append(authors);
  }
  $("#bulletin-container").children().remove();
  $("#bulletin-header").children().remove();
  $("#bulletin-footer").children().remove();
    processXML(xmlDoc);
    //$('.section').simplemasonry();
});
*/




$(document).ready(function(){
  $.getJSON( "data.json", function( data ) {
    console.log(data.keywords);
    console.log(data.keywords.length);
    var number=parseInt(data.count);
    processFilters(data.keywords,number);
  });
});

function processFilters(filters,count){

  var $all=$('<sections></sections>');
    function parse(i){
      if(i<paths.length){
        jQuery.ajax({
          url:paths[i],
          type:'GET',
          error: function(){
            parse(i+1);
          },
          success: function(xml){
          //  $("#bulletin-container").append('<div style="display:block;width:100%;background-color:black;color:white;">'+paths[i]+'</div>');
            console.log('processing: '+paths[i]);
          //  processXML(xml);
            var sections=$(xml).find('section');
            for(var s=0;s<sections.length;s++){
              var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
              $(sections[s]).append(authors);
              $all.append(sections[s]);
            }

          }
          ,async: false
        });
        parse(i+1);
      }
      else{
        //  console.log($all.html());

        $("#bulletin-container").children().remove();
        $("#bulletin-header").children().remove();
        $("#bulletin-footer").children().remove();

        processXML($all,filters,10,false,count);
        $(".loader-container").fadeOut();
      }
    }
    parse(0);
}


/*

  $.get(path, function(xmlDoc){
    var sections=$(xmlDoc).find('section');
    for(var s=0;s<sections.length;s++){
      var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
      $(sections[s]).append(authors);
    }
    $("#bulletin-container").children().remove();
    $("#bulletin-header").children().remove();
    $("#bulletin-footer").children().remove();
      processXML(xmlDoc);
      //$('.section').simplemasonry();
  });
});*/
