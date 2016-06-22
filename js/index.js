var masonry;
$(document).ready(function(){

});

function preDownload(){
  function download(i){
    if(i<paths.length){
      $.ajax({
        url:paths[i],
        type:'GET',
        error: function(){
          download(i+1);
        },
        success: function(xml){
          download(i+1);
        }
      });
    }
    else{
    }
  }
  download(0);
}

$(window).load(function(){
  startingFontSize=14;
  smallestFontSize = 10;
  $.get(path, function(xmlDoc){
    var sections=$(xmlDoc).find('section');
    for(var s=0;s<sections.length;s++){
      var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
      $(sections[s]).append(authors);
    }
    $("#sidebar").empty();
    processXML(xmlDoc);
    $("#sidebar").append($(".main-info"));
    $("#sidebar").append($("<button onclick='showSearchPanel()'>CHANGE</button>"));
    $("#sidebar").append($("#sources"));
    $("#sidebar").append($("#authors"));
    window.scrollTo(0,0);
    preDownload();

    $.get('keywords.xml', function(d){
      var areas=$(d).children().first().children();
      for(var a=0;a<areas.length;a++){
        var $ar=$("<div class='area'></div>");
        $('#bulletin-search').prepend($ar);
        var $area=$(areas[a]);
        var keywords=$area.children();
        $ar.append("<h3>"+$area.attr('name')+"</h3>");
        console.log(keywords.length);
        for(var k=0;k<keywords.length;k++){
          var $area_element=$("<div class='area-element'></div>");
          $ar.append($area_element);
          var $keyword=$(keywords[k]);
          var txt=$keyword.text();
          if(txt.indexOf("(")>0){
            txt=txt.substr(0,txt.indexOf("("));
          }
          $area_element.append("<input type='checkbox' name='"+$keyword.text()+"' value='"+$keyword.text()+"'>"+txt+"<br>");
        }
      }
      /*var container = document.querySelector('#bulletin-container');
      masonry = new Masonry(container, {
        itemSelector: '.section'});*/
    });
  });
 });

 function showSearchPanel(){
   $('.search-container').fadeIn();
 }

 function filter(){

   var filters=[];
   sources=[];
   filters=[];
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
     $('.search-container').fadeOut();
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
              console.log('processing: '+paths[i]);
              var sections=$(xml).find('section');
              for(var s=0;s<sections.length;s++){
                var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
                $(sections[s]).append(authors);
                $all.append(sections[s]);
              }
              parse(i+1);
           }
         });
       }
       else{
         $("#bulletin-container").empty();
         $("#bulletin-header").empty();
         $("#bulletin-footer").empty();
         $("#sidebar").empty();
         processXML($all,filters,15);
         $("#sidebar").append($(".main-info"));
         $("#sidebar").append($("<button onclick='showSearchPanel()'>CHANGE</button>"));
         $("#sidebar").append($("#sources"));
         $("#sidebar").append($("#authors"));
         window.scrollTo(0,0);
         $(".loader-container").fadeOut("slow",function(){});
      }
     }
     parse(0);
 }
