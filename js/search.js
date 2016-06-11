$(document).ready(function(){
  $(".loader-container").show();

  $.get('keywords.xml', function(d){

    var areas=$(d).children().first().children();
    for(var a=0;a<areas.length;a++){
      var $ar=$("<div class='area'></div>");
      $('#bulletin-search').prepend($ar);
      var $area=$(areas[a]);
      var keywords=$area.children();
      $ar.append("<h3>"+$area.attr('name')+"</h3>");

      for(var k=0;k<keywords.length;k++){
        var $area_element=$("<div class='area-element'></div>");
        $ar.append($area_element);

        var $keyword=$(keywords[k]);
        $area_element.append("<input type='radio' name='"+$keyword.text()+"' value='"+$keyword.text()+"'>"+$keyword.text()+"<br>");
      }
    }
    $.get(path, function(d){
        processXML(d);
        $(".loader-container").fadeOut("fastest");
    });
  });

});
function filter(){
  var filters=[];
  var n = $( "input:checked" ).length;
  var checked=$( "input:checked" );
  for(var i=0; i<checked.length; i++){
    filters.push($(checked[i]).attr('name'));
  }
  console.log(filters);

  //$(".loader-container").css("opacity",1);
  //$("#bulletin-container").hide();

  $(".loader-container").fadeIn("fastest",function(){
    processFilters(filters);

  });

/*
  $(".loader-container").fadeOut(function(){
    $("#bulletin-container").fadeIn();
  });
*/

}

function processFilters(filters){
  var $all=$('<sections></sections>');
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

        $("#bulletin-container").children().remove();
        processXML($all,filters);
        $(".loader-container").fadeOut();
      }
    }
    parse(0);
}
function clear(){
   $("input:checked").each().attr('checked', false); // Checks itremoveAttr('checked');
}
