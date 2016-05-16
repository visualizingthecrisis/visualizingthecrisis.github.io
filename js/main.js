var graph_number=0;
$(document).ready(function(){
  $.get('/bullettins.xml', function(d){
    //  $('body').append('<h1> Recommended Web Development Books </h1>');
    //  $('body').append('<dl />');
    processXML(d);
  });
});

function processXML(d){
  $("#container").children().remove();
  $("#container").append("<div class='main-title'>VISUALISING THE CRISIS</div>");

  var sections=$(d).find('section');
  for (var s = 0; s < sections.length; ++s) {
    var $section_div=$("<div class='section'></div>");
    $("#container").append($section_div);
    var $section= $(sections[s]);
    var elements=$section.children();
    for (var i = 0; i < elements.length; ++i) {
      var $element= $(elements[i]);
      if($element.is('title'))$section_div.append("<span class='section-title'>"+$section.find('title').first().text()+"</span>");
      if($element.is('subtitle'))$section_div.append("<span class='section-subtitle'>"+$section.find('subtitle').first().text()+"</span>");
      if($element.is('body'))$section_div.append("<div class='section-body'>"+$section.find('body').first().text()+"</div>");
      if($element.is('graph'))graphToHTML($element,$section_div);
      if($element.is('keywords'))keywordsToHTML($element,$section_div);
    }
  }
}

function keywordsToHTML($element, $parent){
  var keywords=$element.find('keyword');
  var html="<div class='section-keywords'>";
  for (var i = 0; i < keywords.length; ++i) {
    html+="#"+$(keywords[i]).attr('name')+" ";
  }
  html+="</div>";
  $parent.append(html);
}

function graphToHTML($element, $parent){
  var titles=$element.find('title');
  if(titles.length>0)$parent.append("<span class='section-graph-title'>"+$element.find('title').first().text()+"</span>");
  var subtitles=$element.find('subtitle');
  if(subtitles.length>0)$parent.append("<span class='section-graph-subtitle'>"+$element.find('subtitle').first().text()+"</span>");
  var abstracts=$element.find('abstract');
  if(abstracts.length>0)$parent.append("<span class='section-graph-abstract'>"+$element.find('abstract').first().text()+"</span>");
  var datasets=$element.find('dataset');
  var xData=[],yData=[];
  for (var i = 0; i < datasets.length; ++i) {
    var $dataset=$(datasets[i]);
    var arrayX=['x'];
    var arrayY=[$dataset.attr('label')];
    var datas=$dataset.find('data');
    for (var j = 0; j < datas.length; ++j) {
      $data=$(datas[j]);
      arrayX.push($data.attr('x'));
      arrayY.push($data.attr('y'));
    }
    xData.push(arrayX);
    yData.push(arrayY);
  }

  if ($element.attr('y')=='number') {
    if ($element.attr('x')=='date') {
      dateToNumberGraph($element, $parent, xData, yData);
    }
    else{
      if($element.attr('x')=='continent' || $element.attr('x')=='subcontinent' || $element.attr('x')=='country')
      locationToNumberGraph($element, $parent, xData, yData);
      else
      stringToNumberGraph($element, $parent, xData, yData);
    }
  }
  else if ($element.attr('y')=='percentage') {
    stringToPercentageGraph($element, $parent, xData, yData);
  }
  else if ($element.attr('y')=='string') {
    stringToStringGraph($element, $parent, xData, yData);
  }
}

function dateToNumberGraph($element, $parent, xData, yData){
  if(xData.length>0 && xData.length>0){
    var dateFormat=getDateFormat(xData[0][1]);
    var equal=xArrayCheck(xData);
    if(xData.length>1 && equal){
      graph_number++;
      $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
      yData.unshift(xData[0]);
      var settings=getDefaultGraphSettings();
      settings.bindto='#graph'+graph_number;
      settings.data.columns=yData;
      settings.data.xFormat=dateFormat[0];
      settings.axis.x.type= 'timeseries';
      settings.data.type='bar';
      settings.axis.x.tick.format= dateFormat[1];
      settings.axis.x.tick.culling={'max':4};
    //  settings.axis.rotated= true;

      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        var settings=getDefaultGraphSettings();
        settings.bindto='#graph'+graph_number;
        settings.data.columns=[xData[i],yData[i]];
        settings.data.xFormat=dateFormat[0];
        settings.data.type='line';
        settings.axis.x.type= 'timeseries';
        settings.axis.x.tick.format= dateFormat[1];
        settings.axis.x.tick.culling={'max':4};
        var chart = c3.generate(settings);
      }
    }
  }
}



function locationToNumberGraph($element, $parent, xData, yData){
  if(xData.length>0 && xData.length>0){
    var dateFormat=getDateFormat(xData[0][1]);
    var equal=xArrayCheck(xData);
    if(xData.length>1 && equal){
      graph_number++;
      $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
      yData.unshift(xData[0]);
      var settings=getDefaultGraphSettings();
      settings.bindto='#graph'+graph_number;
      settings.data.columns=yData;
      settings.axis.x.type= 'category';
      settings.data.type='bar';
      //settings.axis.rotated= true;

      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        var settings=getDefaultGraphSettings();
        settings.bindto='#graph'+graph_number;
        settings.data.columns=[xData[i],yData[i]];
        settings.data.type='bar';
        settings.axis.x.type= 'category';
        //  settings.axis.x.tick.culling={'max':4};
        var chart = c3.generate(settings);
      }
    }
  }
}
function stringToNumberGraph($element, $parent, xData, yData){
  if(xData.length>0 && xData.length>0){
    var dateFormat=getDateFormat(xData[0][1]);
    var equal=xArrayCheck(xData);
    if(xData.length>1 && equal){
      graph_number++;
      $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
      yData.unshift(xData[0]);
      var settings=getDefaultGraphSettings();
      settings.bindto='#graph'+graph_number;
      settings.data.columns=yData;
      settings.axis.x.type= 'category';
      settings.data.type='bar';
      //settings.axis.rotated= true;

      var chart = c3.generate(settings);
    }
    else{
      for(var i=0;i<xData.length;i++){
        graph_number++;
        $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
        var settings=getDefaultGraphSettings();
        settings.bindto='#graph'+graph_number;
        settings.data.columns=[xData[i],yData[i]];
        settings.data.type='bar';
        settings.axis.x.type= 'category';
        //  settings.axis.x.tick.culling={'max':4};
        var chart = c3.generate(settings);
      }
    }
  }
}
function stringToPercentageGraph($element, $parent, xData, yData){
  for(var i=0;i<xData.length;i++){
    graph_number++;
    $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
    var settings=getDefaultGraphSettings();
    settings.bindto='#graph'+graph_number;
    var data=[];
    for(var j=1;j<xData[i].length;j++){
      data.push([xData[i][j],yData[i][j]]);
    }
    console.log(data);
    settings.data.columns=data;
    settings.data.type='pie';
    //settings.axis.x.type= 'category';
    delete settings.axis;
    delete settings.data.x;
    console.log(settings);
    //  settings.axis.x.tick.culling={'max':4};
    var chart = c3.generate(settings);
  }


}
function stringToStringGraph($element, $parent, xData, yData){}

function getDefaultGraphSettings(){
  var settings={
    //bindto: '#graph'+graph_number,
    //  size: {height: 180},
    //  color: {pattern: ['#ff0000', '#0000ff']},
    data: {
      x: 'x',
      type: 'line',//bar line spline step area area-spline area-step bar scatter pie donut gauge
      //  xFormat: '%Y' // 'xFormat' can be used as custom format of 'x'
      //  labels: true,
      //  columns: cols,

    },
    legend: {
      show:true,
      position: 'bottom'//inset
      /*,
      inset: {
      anchor: 'bottom-left',
      x: 0,
      y: -40
    }*/
  },
  axis: {
    //  rotated: true,
    x: {
      //     type: 'timeseries',//timeseries category indexed
      tick: {
        //      format: '%Y-%m-%d:%H:%M:%S',//  format: function(d) { return "EUR " + d3.format(",s.2f")(d); } ,
        //      rotate: 90,
        //      outer: false,
        //      culling: {
        //        max: 5
        //      }
      }
    },
    y: {
      tick: {
        //  format: '%Y',
        //  rotate: 90,
        //    outer: false,
        //    format: d3.format(".2f")
        //,count:3
      }
    }
  }
};
return settings;
}

function xArrayCheck(xData){
  var xEqual=true;
  for(var x=0;x<xData.length-1;x++){
    if(xData[x].length==xData[x+1].length){
      for(var i=0;i<xData[x].length;i++)
      if(xData[x][i]!=xData[x+1][i])
      xEqual=false;
    }
    else{
      xEqual=false;
      break;
    }
  }
  return xEqual;
}

function getDateFormat(s){
  var format=['%Y','%Y'];
  if (s.length>4) {
    if (s.length<7) {
      return ['%Y%m','%Y/%m'];
    }
    if (s.length<9) {
      return ['%Y%m%d','%Y/%m/%d'];
    }
    if (s.length==15) {
      return ['%Y%m%d:%H%M%S','%Y/%m/%d %H:%M:%S'];
    }
  }
  return format;
}
