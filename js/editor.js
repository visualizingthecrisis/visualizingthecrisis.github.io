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
  for(var t=0;t<paths.length;t++){
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
        editor.setValue(xml);
          update();
      }
  });

}
function update(){
  xmlDoc = $.parseXML( editor.getValue() );

  $("#bulletin-container").children().remove();
  processXML(xmlDoc);
}
