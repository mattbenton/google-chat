$(function() {
  var widgetCount = 0;
  var $widgets = $('.chat-widgets');

  var widgets = {};

  // Creates a new widget and assigns it a unique ID so that
  // events sent from it can be matched to the assocated element.
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

  // Listen for events fired from widgets via `postMessage()`.
  $(window).on('message', function ( event ) {
    var msg = event.originalEvent.data;
    var $widget = widgets[msg.widgetId];

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

  // Creating globals is usually bad pratice, but for this demo it's fine.
  window.createWidget = createWidget;
});