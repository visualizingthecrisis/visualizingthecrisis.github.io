var editor;
$(document).ready(function(){
/*  function addSelect(i){
    if(i<paths.length){
      $.ajax({
        url:paths[i],
        type:'HEAD',
        error: function(){
          addSelect(i+1);
        },
        success: function(){
          $('#xml-select').append("<option value="+paths[i]+">"+paths[i]+"</option>");
          addSelect(i+1);
        }
      });
    }
  }
  addSelect(0);
*/
  $(".loader-container").show();

  for(var i=0;i<paths.length;i++){
    $('#xml-select').append("<option value="+paths[i]+">"+paths[i]+"</option>");
  }
  editor= ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/xml");
  editor.$blockScrolling=Infinity;
  updateEditor();

});
function onSelect(){
  path=$("#xml-select").val();
  updateEditor();
}
function updateEditor(){
  $.ajax({
      url: path,
      type: 'GET',
      dataType: 'text',
      timeout: 1000,
      error: function(){
          alert('Error loading XML document');
      },
      success: function(xml){
        console.log(path);
        editor.setValue(xml);
        update();

      }
  });

}
function update(){

  xmlDoc = $.parseXML( editor.getValue() );
  var sections=$(xmlDoc).find('section');
  for(var s=0;s<sections.length;s++){
    var authors=$(sections[s]).parent().parent().parent().find('authors').first().clone();
    $(sections[s]).append(authors);
  }
  $("#bulletin-container").children().remove();
  $("#bulletin-header").children().remove();
  $("#bulletin-footer").children().remove();
  processXML(xmlDoc);
  $(".loader-container").fadeOut("fastest");
}
