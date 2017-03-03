$(document).ready(function() {

  $.ajaxSetup({ cache: false });

  var selected = -1;

  function refreshImages() {

    var selectedDate = $.datepicker.formatDate('yy-mm-dd', $('#datepicker').datepicker('getDate'));
    var data = {
      selectedDate: selectedDate,
      selectedClientId: ''
    };

    $.ajax({
      dataType: "json",
      type: 'GET',
      url: 'home/getImages',
      cache: false,
      data: data,
      success: function(response) {

        $('.motion-detection').remove();

        $(response.imagesEncoded).each(function(index, element) {

          var img = $('<img>',
              {
                id: '#image_' + index,
                src: 'data:image/jpeg;base64,' + element,
                'data-index': index,
                class: 'motion-detection'
              });

          $('.image-view-container').append(img);
        });

        if (selected === -1 && response.imagesEncoded.length > 1) {
          $('#selected_image').attr('src', 'data:image/jpeg;base64,' + response.imagesEncoded[0]);
        }

        $('.motion-detection').click(function(event) {
          selected = $(event.target).data('index');
          var selectedImgSrc = $(event.target).attr('src');
          $('#selected_image').attr('src', selectedImgSrc);
        });
      }
    });

  }

  // setInterval(function(){ refreshImages(); }, 1000);

  $('#datepicker').datepicker({ maxDate: new Date()});

  $.widget('ui.labeledslider', $.ui.slider, {

    version: '@VERSION',

    options: {
      tickInterval: 0,
      tweenLabels: true,
      tickLabels: null,
      tickArray: []
    },

    uiSlider: null,
    tickInterval: 0,
    tweenLabels: true,

    _create: function() {

      this._detectOrientation();

      this.uiSlider =
          this.element
              .wrap('<div class="ui-slider-wrapper ui-widget"></div>')
              .before('<div class="ui-slider-labels"></div>')
              .parent()
              .addClass(this.orientation)
              .css('font-size', this.element.css('font-size'));

      this._super();

      this.element.removeClass('ui-widget');

      this._alignWithStep();

      if (this.orientation == 'horizontal') {
        this.uiSlider
            .width(this.element.css('width'));
      } else {
        this.uiSlider
            .height(this.element.css('height'));
      }

      this._drawLabels();
    },

    _drawLabels: function() {

      var labels = this.options.tickLabels || {},
          $lbl = this.uiSlider.children('.ui-slider-labels'),
          dir = this.orientation == 'horizontal' ? 'left' : 'bottom',
          min = this.options.min,
          max = this.options.max,
          inr = this.tickInterval,
          cnt = ( max - min ),
          tickArray = this.options.tickArray,
          ta = tickArray.length > 0,
          label,
          i = 0;

      $lbl.html('');

      for (; i <= cnt; i++) {

        if (( !ta && i % inr == 0 ) || ( ta && tickArray.indexOf(i + min) > -1 )) {

          label = labels[i + min] ? labels[i + min] : (this.options.tweenLabels ? i + min : '');

          $('<div>').addClass('ui-slider-label-ticks')
              .css(dir, (Math.round(( i / cnt ) * 10000) / 100) + '%')
              .html('<span>' + ( label ) + '</span>')
              .appendTo($lbl);

        }
      }

    },

    _setOption: function(key, value) {

      this._super(key, value);

      switch (key) {

        case 'tickInterval':
        case 'tickLabels':
        case 'tickArray':
        case 'min':
        case 'max':
        case 'step':

          this._alignWithStep();
          this._drawLabels();
          break;

        case 'orientation':

          this.element
              .removeClass('horizontal vertical')
              .addClass(this.orientation);

          this._drawLabels();
          break;
      }
    },

    _alignWithStep: function() {
      if (this.options.tickInterval < this.options.step)
        this.tickInterval = this.options.step;
      else
        this.tickInterval = this.options.tickInterval;
    },

    _destroy: function() {
      this._super();
      this.uiSlider.replaceWith(this.element);
    },

    widget: function() {
      return this.uiSlider;
    }

  });

  $('#slider-range').labeledslider({
    range: true,
    min: 0,
    max: 24,
    values: [0, 24],
    slide: function(event, ui) {
      if (ui.values[0] === ui.values[1]) {
        return false;
      }
    }
  });

  refreshImages();
});