(function()
{
  'use strict';

  var _DEFAULTS = {
    max: 100,
    min: 0,
    onChange: null,
    step: 5,
    value: 50
  };

  function Range(element, options) {
    var $element = $(element);
    this.$input = $element.find('input');
    this.input = this.$input[0];
    this.options = {
      max: options.max || parseFloat(this.$input.attr('max')) || _DEFAULTS.max,
      min: options.min || parseFloat(this.$input.attr('min')) || _DEFAULTS.min,
      onChange: options.onChange || _DEFAULTS.onChange,
      step: options.step || parseFloat(this.$input.attr('step')) || _DEFAULTS.step,
      value: options.value || parseFloat(this.$input.attr('value')) || _DEFAULTS.value
    };

    this.$input.attr('min', this.options.min);
    this.$input.attr('max', this.options.max);
    this.$input.attr('step', this.options.step);
    
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this.$input.mousedown(this._onMouseDown);
    this.$input.mouseup(this._onMouseUp);

    var $plus = $('<button class="jquery-range-plus"><span class="jquery-range-span">+</span></button>')
    $element.prepend($plus);
    $plus.click(this._onClick.bind(this, this.options.step));
    
    var $minus = $('<button class="jquery-range-minus"><span class="jquery-range-span">-</span></button>')
    $element.prepend($minus);
    $minus.click(this._onClick.bind(this, -this.options.step));

    var $track = $('<div class="jquery-range-track"><div class="jquery-range-thumb"><div class="jquery-range-flag"></div><div class="jquery-range-label"></div></div></div>');
    this.$thumb = $track.find('.jquery-range-thumb');
    $element.append($track);
    this.$label = this.$thumb.find('.jquery-range-label');
    this.$flag = this.$thumb.find('.jquery-range-flag');

    this._onInput = this._onInput.bind(this);
    this.input.addEventListener('input', this._onInput);
    this._update();
  }

  Range.prototype._onInput = function(evt) {
    this.options.value = parseFloat(evt.target.value);
    this._update();
  }

  Range.prototype._onClick = function(amount, evt) {
    evt.preventDefault();
    this.options.value += amount;
    this.options.value = Math.max(this.options.min, Math.min(this.options.max, this.options.value));
    this._update();
  }

  Range.prototype._onMouseDown = function() {
    this.$thumb.addClass('hover');
  }

  Range.prototype._onMouseUp = function() {
    this.$thumb.removeClass('hover');
  }

  Range.prototype._update = function() {
    this.$input.attr('value', this.options.value);
    this.input.value = this.options.value;
    var perc = (this.options.value - this.options.min) / (this.options.max - this.options.min);
    this.$thumb.css('left', perc * 100 + '%');
    this.$flag.text(this.options.value);
    this.$label.text(this.options.value);
    if(this.options.onChange)
      this.options.onChange(this.options.value);
  }

  $.fn.range = function(options) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
        var $this = $(this),
            data  = $this.data('plugin_range');
        if (!data) {
            $this.data('plugin_range', (data = new Range(this, options)));
        }
        if (typeof options === 'string') {
            data[options].apply(data, args);
        }
    });
  }
})();
