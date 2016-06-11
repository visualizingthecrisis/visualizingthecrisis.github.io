(function ($) {

    function Rectangle(x, y, width, height, margin) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.margin = margin;
    }

    Rectangle.prototype.style = function () {
        return {
            top: this.y + 'px',
            left: this.x + 'px',
            width: (this.width - this.margin) + "px",
            height: (this.height - this.margin) + "px"
        };
    };

    Rectangle.prototype.isWide = function () {
        return this.width > 250 ;//this.height;
    };

    function TreeMap($div, options) {
        options = options || {};
        this.$div = $div;
        this.isValid=true;
        $div.css('position', 'relative');
        this.rectangle = new Rectangle(0, 0, $div.width(), $div.height(), 0);

        this.nodeClass = function () {
            return '';
        };
        this.click = function () {
        };
        this.mouseenter = function () {
        };
        this.mouseleave = function () {
        };
        this.mousemove = function () {
        };
        this.paintCallback = function () {
        };
        this.ready = function () {
        };
        this.itemMargin = 0;
        this.smallestFontSize = 12;
        this.startingFontSize = 18;
        this.centerLabelVertically = true;

        $.extend(this, options);

        this.setNodeColors = function ($box, node) {
            if (this.backgroundColor)
                $box.css('background-color', this.backgroundColor($box, node));
            if (this.color)
                $box.css('color', this.color($box, node));
        };
    }

    TreeMap.SIDE_MARGIN = 20;
    TreeMap.TOP_MARGIN = 20;

    TreeMap.prototype.paint = function (nodeList) {
        nodeList = this.squarify(nodeList, this.rectangle);

        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            var nodeBounds = node.bounds;

            var boxId = node.id || 'treemap-node-' + i;
            var $box = $('<div id=' + boxId + '></div>');
        //    console.log(node);
            $box.append("<svg style='position:absolute;top:0px;left=0px' width='100%' height='100%'><rect width='100%' height='100%' fill='"+node.fill+"'></rect></svg>");
            $box.css($.extend(nodeBounds.style(), {
                'position': 'absolute'
            }));

            this.setNodeColors($box, node);

            $box.addClass('treemap-node');

            var self = this;
            $box.bind('click', node, function (e) {
                self.click(e.data, e);
            });
            $box.bind('mouseenter', node, function (e) {
                self.mouseenter(e.data, e);
            });
            $box.bind('mouseleave', node, function (e) {
                self.mouseleave(e.data, e);
            });
            $box.bind('mousemove', node, function (e) {
                self.mousemove(e.data, e);
            });

            $box.appendTo(this.$div);
            $box.addClass(this.nodeClass(node, $box));

            var $content = $("<div>" + node.label + "</div>");
            $content.addClass('treemap-label');
            $content.css({
              'margin-top':'0px',
              'margin-left':'0px',
              'position': 'absolute',
                'text-align': 'left',
                'font-size': this.startingFontSize + 'px'
            });
            $box.append($content);

            this.fitLabelFontSize($content, node);

            if (this.centerLabelVertically) {
            //    $content.css('margin-top', (parseInt($box.height()) / 2) - (parseInt($content.height()) / 2) + 'px');
            }
        }
        this.ready();
    };

    TreeMap.prototype.fitLabelFontSize = function ($content, node) {
        var nodeBounds = node.bounds;
    //    console.log($content);
        $content.css('max-width',nodeBounds.width- TreeMap.TOP_MARGIN);
      //  $content.css('word-wrap','break-word');
        while ($content.height() + 4 > nodeBounds.height){// || $content.innerWidth() + 10 > nodeBounds.width){
            var fontSize = parseFloat($content.css('font-size')) - 1;
            if (fontSize <= this.smallestFontSize) {
              //  $content.remove();
              /*  var str=$content.text();
                var lastIndex = str.lastIndexOf(" ");
                str = str.substring(0, lastIndex)+"...";
                if($content.text().length>5){
                  $content.text(str);
                }
                else {

              */
              this.isValid=false;
                  $content.css('background-color','red');
                  break;
            //    }
            }
            else
              $content.css('font-size', fontSize + 'px');
        }
      //  console.log($content.innerWidth()+" * "+$content.width());
        if($content.innerWidth() >nodeBounds.width- 10)
          $content.css('background-color','green');
        $content.css('display', 'block');
        this.paintCallback($content, node);
    };

    TreeMap.HORIZONTAL = 1;
    TreeMap.VERTICAL = 2;

    TreeMap.prototype.squarify = function (nodeList, rectangle) {
        nodeList.sort(function (a, b) {
            return b.value - a.value;
        });
        this.divideDisplayArea(nodeList, rectangle);

        return nodeList;
    };
    function itFit(s,width){

      var $content = $("<div>" + s + "</div>");
      $('body').append($content);
      $content.addClass('treemap-label');
      $content.css({
          'display': 'relative',
          'position': 'relative',
          'text-align': 'left',
          'font-size': this.smallestFontSize + 'px',
          'max-width': width-10,
          'visibility':'hidden'
      });
      var t= $content.innerWidth() <width- TreeMap.TOP_MARGIN;
      $content.remove();
    //  console.log('++++');
    //  console.log(s+" , "+width+"  ",$content.innerWidth());

  //    console.log($content.innerWidth() +" < "+(width-10));
      //$content.remove();;
      return t;
    }
    TreeMap.prototype.divideDisplayArea = function (nodeList, destRectangle) {
        // Check for boundary conditions
        if (nodeList.length === 0)
            return;

        if (nodeList.length == 1) {
            nodeList[0].bounds = destRectangle;
            return;
        }

        var halves = this.splitFairly(nodeList);

        var leftSum = this.sumValues(halves.left),
            rightSum = this.sumValues(halves.right),
            totalSum = leftSum + rightSum;
          //  console.log("***");
          //  console.log(nodeList[0]);


        var l_rect = Math.round((leftSum * destRectangle.width) / totalSum);
        var r_rect =  Math.round((rightSum * destRectangle.width) / totalSum);
        var ok=true;
        for(var i=0;i<halves.left.length;i++){
          if(!itFit(halves.left[i].label,l_rect)){
            ok=false;
          }
        }
        for(var i=0;i<halves.right.length;i++){
          if(!itFit(halves.right[i].label,r_rect)){
            ok=false;
          }
        }
        if (ok) {
            var midPoint = Math.round((leftSum * destRectangle.width) / totalSum);
            this.divideDisplayArea(halves.left, new Rectangle(destRectangle.x, destRectangle.y, midPoint, destRectangle.height, this.itemMargin));
            this.divideDisplayArea(halves.right, new Rectangle(destRectangle.x + midPoint, destRectangle.y, destRectangle.width - midPoint, destRectangle.height, this.itemMargin));
        }
        else {
            var midPoint = Math.round((leftSum * destRectangle.height) / totalSum);
            this.divideDisplayArea(halves.left, new Rectangle(destRectangle.x, destRectangle.y, destRectangle.width, midPoint, this.itemMargin));
            this.divideDisplayArea(halves.right, new Rectangle(destRectangle.x, destRectangle.y + midPoint, destRectangle.width, destRectangle.height - midPoint, this.itemMargin));
        }
    };

    TreeMap.prototype.splitFairly = function (nodeList) {
        var halfValue = this.sumValues(nodeList) / 2;
        var accValue = 0;
        var length = nodeList.length;

        for (var midPoint = 0; midPoint < length; midPoint++) {
            if (midPoint > 0 && (accValue + nodeList[midPoint].value > halfValue))
                break;
            accValue += nodeList[midPoint].value;
        }

        return {
            left: nodeList.slice(0, midPoint),
            right: nodeList.slice(midPoint)
        };
    };

    TreeMap.prototype.sumValues = function (nodeList) {
        var result = 0;
        var length = nodeList.length;
        for (var i = 0; i < length; i++)
            result += nodeList[i].value;
        return result;
    };

    $.fn.treemap = function (json, options) {
        var self = this;
        var tm= new TreeMap(self, options)
        tm.paint(json);
        return tm;
        /*this.fadeOut('fast', function () {
            self.empty().fadeIn('fast', function () {

            });
        });*/
    };

})(jQuery);
