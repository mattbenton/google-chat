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

    var html = '<iframe class="chat-widget" src="' + url + '" width="262" height="380" frameBorder="0"></iframe>';
    var $widget = $(html).prependTo($widgets);

    widgets[id] = $widget;
  }

  window.createWidget = createWidget;
});