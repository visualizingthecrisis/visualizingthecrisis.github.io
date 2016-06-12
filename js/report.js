$(document).ready(function(){

  $.get(path, function(d){
      processXML(d);
      $('.section').simplemasonry();
  });
});
