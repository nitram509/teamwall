teamwall.instrument.listBox = function(configuration) {
  function ListBoxInstrument(configuration) {

    var instrumentConfiguration = configuration;

    this.setValue = function(data) {
      drawInstrument(data);
    };

    this.getConfiguration = function() {
      return instrumentConfiguration;
    };

    this.getInstrumentDrawType = function() {
      return "canvas";
    };

    var getTextHeight = function(font) {

      var text = $('<span>Hg</span>').css({fontFamily: font});
      var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

      var div = $('<div></div>');
      div.append(text, block);

      var body = $('body');
      body.append(div);

      try {

        var result = {};

        block.css({verticalAlign: 'baseline'});
        result.ascent = block.offset().top - text.offset().top;

        block.css({verticalAlign: 'bottom'});
        result.height = block.offset().top - text.offset().top;

        result.descent = result.height - result.ascent;

      } finally {
        div.remove();
      }

      return result;
    };

    function drawInstrument(data) {
      var canvas = document.getElementById(instrumentConfiguration.id);
      var context = canvas.getContext("2d");
      context.font = teamwall.render.fontForHeader(canvas);
      context.textBaseline = "middle";
      context.textAlign = "center";

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = teamwall.configuration.instrumentBackground;
      context.fillRect(0, 0, canvas.width, canvas.height);

      var headingOffSet = canvas.height,
        buildChainStartOffSet = 0;

      if (instrumentConfiguration.title) {
        teamwall.render.writeText(context, instrumentConfiguration.title, canvas.width / 2, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
        headingOffSet = canvas.height * 0.9;
        buildChainStartOffSet = canvas.height * 0.1;
      }

      var lengthOfBuildChain = data.length;
      if (lengthOfBuildChain > 0) {

        context.font = Math.round(teamwall.render.fontSizeForHeader(canvas) / 2) + "pt " + teamwall.configuration.font;
        var heightOfOneBlock = headingOffSet / lengthOfBuildChain;
        var heightOfOneBlock = getTextHeight(context.font).height * 1.8;
        var part = 0;
        jQuery.each(data, function() {
          var text = typeof this === 'string' || this instanceof String ? this + '' : this.text;
          if (typeof this !== 'string' && typeof this.color !== 'undefined') {
              context.fillStyle = this.color;
          } else {
            context.fillStyle = teamwall.configuration.colorBackground;
          }
          context.fillRect(0, (part * heightOfOneBlock) + buildChainStartOffSet, canvas.width, heightOfOneBlock);
          if (part !== data.length - 1) {
            context.beginPath();
            context.moveTo(0, (part * heightOfOneBlock) + buildChainStartOffSet + heightOfOneBlock);
            context.lineTo(canvas.width, (part * heightOfOneBlock) + buildChainStartOffSet + heightOfOneBlock);
            context.lineWidth = 2;
            context.strokeStyle = teamwall.configuration.colorText;
            context.stroke();
          }
          context.textAlign = 'left';
          context.fillStyle = teamwall.configuration.colorText;

          var metrics = context.measureText(text);
          var width = metrics.width + 10;
          if (width > canvas.width) {
            while (width > canvas.width) {
              text = text.substr(0, text.length - 1);
              var metrics = context.measureText(text);
              var width = metrics.width + 10;
            }
            text += '…';
          }
          context.fillText(text, 5, part * heightOfOneBlock + (heightOfOneBlock / 2) + buildChainStartOffSet, canvas.width);
          part++;
        });

      }
      else {
        console.log("Can not display list <=0 ");
      }
    }
  }
  return new ListBoxInstrument(configuration)
};
