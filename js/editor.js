var editor;
$(document).ready(function(){
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
        editor.setValue(xml);
          update();
      }
  });

}
function update(){
  xmlDoc = $.parseXML( editor.getValue() );
  processXML(xmlDoc);
}
