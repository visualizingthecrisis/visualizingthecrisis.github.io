$(document).ready(function(){

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
});
