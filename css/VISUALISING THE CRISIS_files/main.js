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
  if ($element.attr('y')=='percentage') {
    stringToPercentageGraph($element, $parent, xData, yData);
  }
  if ($element.attr('y')=='string') {
    stringToStringGraph($element, $parent, xData, yData);
  }
}

function dateToNumberGraph($element, $parent, xData, yData){
  for(var i=0;i<xData.length;i++){
    graph_number++;
    $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
    var settings=getDefaultGraphSettings();
    settings.bindto='#graph'+graph_number;
    settings.data.columns=[xData[i],yData[i]];
    var chart = c3.generate(settings);
}


}
function locationToNumberGraph($element, $parent, xData, yData){}
function stringToNumberGraph($element, $parent, xData, yData){}
function stringToPercentageGraph($element, $parent, xData, yData){}
function stringToStringGraph($element, $parent, xData, yData){}







function createGraph(graph_number,xData,yData,type){
  graph_number++;
  $parent.append("<div class='section-graph' id='graph"+graph_number+"'></div>");
  var settings=createGraphSettings(graph_number,arrayX,[arrayY]);
  var chart = c3.generate(settings);
  var settings=getDefaultGraphSettings();
}
function getDefaultGraphSettings(){
  var settings={
    //bindto: '#graph'+graph_number,
    size: {height: 180},
    color: {pattern: ['#ff0000', '#ff0000']},
    data: {
      x: 'x',
      type: 'line',//bar line spline step area area-spline area-step bar scatter pie donut gauge
      //  xFormat: '%Y', // 'xFormat' can be used as custom format of 'x'
      //  labels: true,
      //  columns: cols
    },
    axis: {
      //  rotated: true,
      x: {
        //     type: 'timeseries',//timeseries category indexed
        tick: {
          //      format: '%Y',//  format: function(d) { return "EUR " + d3.format(",s.2f")(d); } ,
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
function getDateFormat(s){
  var format='%Y';
  if (s.length>4) {
    if (s.length<7) {
      format='%Y%m';
    }
    if (s.length<9) {
      format='%Y%m%d';
    }
    if (s.length==15) {
      format='%Y%m%d:%H%M%S';
    }
  }
  return format;
}
