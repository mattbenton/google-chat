$(function() {
  var widgetCount = 0;
  var $widgets = $('.chat-widgets');

  var widgets = {};

  function createWidget ( user, email ) {
    var id = widgetCount++;

    var url = 'widget.html';
    url += '?id=' + id;
    url += '&user=' + encodeURIComponent(user);
    url += '&email=' + encodeURIComponent(email);

    var html = '<iframe class="chat-widget" src="' + url + '" frameBorder="0"></iframe>';
    var $widget = $(html).prependTo($widgets);

    widgets[id] = $widget;
  }

  $(window).on('message', function ( event ) {
    var msg = event.originalEvent.data;
    var $widget = widgets[msg.id];

    if ( !$widget ) {
      return;
    }

    switch ( msg.type ) {
      case 'close':
        $widget.remove();
        break;
      case 'minimize':
        $widget.addClass('s-minimized');
        break;
      case 'restore':
        $widget.removeClass('s-minimized');
        break;
    }
  });

  window.createWidget = createWidget;
});