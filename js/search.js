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
    processFilters();
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
  $("#bulletin-container").children().remove();
  processFilters(filters);



}

function processFilters(filters){
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
        processXML($all,filters);
      }
    }
    parse(0);

  });

}
function clear(){
   $("input:checked").each().attr('checked', false); // Checks itremoveAttr('checked');
}
