$(document).ready(function(){
  $.get('keywords.xml', function(d){

    var areas=$(d).children().first().children();
    for(var a=0;a<areas.length;a++){
      var $ar=$("<div class='area'></div>");
      $('#bulletin-search').append($ar);
      var $area=$(areas[a]);
      var keywords=$area.children();
      $ar.append("<h3>"+$area.attr('name')+"</h3>");

      for(var k=0;k<keywords.length;k++){
        var $keyword=$(keywords[k]);
        $ar.append("<input type='checkbox' name='"+$keyword.text()+"' value='"+$keyword.text()+"'>"+$keyword.text()+"<br>");
      }
    }
    $.get(path, function(d){
      processXML(d);
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
  $.get(path, function(d){
    processXML(d,filters);
  });
}
function clear(){
   $("input:checked").each().attr('checked', false); // Checks itremoveAttr('checked');
}
