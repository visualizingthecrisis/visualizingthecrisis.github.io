var editor;
$(document).ready(function(){
  editor= ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/xml");
$.ajax({
    url: '/bullettins.xml',
    type: 'GET',
    dataType: 'text',
    timeout: 1000,
    error: function(){
        alert('Error loading XML document');
    },
    success: function(xml){
      editor.setValue(xml);
        // do something with xml
    }
});
});


function update(){
  xmlDoc = $.parseXML( editor.getValue() );
  processXML(xmlDoc);
}
