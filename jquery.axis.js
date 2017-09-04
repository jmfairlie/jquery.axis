/*
 * https://github.com/jmfairlie/jquery.axis
 * A jQuery plugin to add graph axis like tickmarks to any container.
 * by jmfairlie@gmail.com
 */
;(function($, window){
  var pluginName = 'axis';
  var defaults = {
    numdecimals: 2
  };

  var template = '<div class="axis hAxis"></div>'


  var Axis = function(element, options) {
    var settings = $.extend({}, defaults, options);
    this.$element = $(element);
    this.elementId = element.id;
    this.init(settings);

    return {
      update: this.update.bind(this),
      recreate: this.recreate.bind(this)
    };
  };

  Axis.prototype.recreate = function() {
    if(typeof this.start !== 'undefined' && typeof this.length !== 'undefined') {
      var $axis = this.$axis;

      $axis.empty();
      var npixels = $axis.width();
      var ref = Math.pow(10, Math.round(Math.log10(this.length)));
      var majf = 5;
      var labf = 10;

      // Horizontal axis ticks
      var tickStep = ref/100;

      var minor= tickStep*npixels/this.length;

      var factor = Math.pow(2, Math.ceil(Math.log2(5/minor)));

      tickStep*=factor;

      minor = tickStep*npixels/this.length;

      var major=minor*majf;

      var label=minor*labf;

      var tickLabelPos = 0;
      var tickCount = this.start;

      var newTickLabel = "";
      var val;
      var minorcount = 0;

      while ( tickLabelPos <= npixels ) {
        if ( minorcount%labf == 0 ) {
          val = tickCount.toFixed(this.numdecimals);
          val = val%1?val:Math.floor(val);
          newTickLabel = `<div class='tickLabel'>${val}</div>`;
          $(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($axis);
        } else if ( minorcount%majf == 0) {
          newTickLabel = "<div class='tickMajor'></div>";
          $(newTickLabel).css("left",tickLabelPos+"px").appendTo($axis);
        } else {
          newTickLabel = "<div class='tickMinor'></div>";
          $(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($axis);
        }
        minorcount++;
        tickLabelPos += minor;
        tickCount += tickStep;
      }
    }
  }

  Axis.prototype.update = function(start, length) {
    this.start = start;
    this.length = length;
    this.recreate();
  }

  Axis.prototype.init = function(settings) {
    var self = this;
    this.start = settings.start;
    this.length = settings.length;
    this.numdecimals = settings.numdecimals;
    this.$axis = $(template);
    this.$element.append(this.$axis);
    this.$element.on('update.axis', function(e, start, length) {
      self.update(start, length);
    });
    this.recreate();
  }

  var logError = function (message) {
    if (window.console) {
      window.console.error(message);
    }
  };

  //resize
  $(window).resize(function(e) {
    $('.hAxis').parent().axis('recreate');
  });//resize

  $.fn[pluginName] = function(options, args) {
    var result;

    this.each(function() {
      //get Axis object if already exists
      var _this = $.data(this, pluginName);
      if(typeof options === 'string') {
        if (!_this) {
          logError('Not initialized, can not call method : ' + options);
        }
        else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
          logError('No such method : ' + options);
        }
        else {
          if (!(args instanceof Array)) {
            args = [ args ];
          }
          result = _this[options].apply(_this, args);
        }
      } else if(typeof options === 'boolean') {
        result = _this;
      } else {
        $.data(this, pluginName, new Axis(this, $.extend(true, {}, options)));
      }
    });
    return result || this;
  };
})(jQuery, window);
