$(function() {
  var widgetCount = 0;

  var $userName  = $('#user-name');
  var $userEmail = $('#user-email');
  var $openBtn   = $('#open-chat-btn');
  var $widgets   = $('.chat-widgets');

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

  $openBtn.on('click', function() {
    createWidget($userName.val(), $userEmail.val());
  });

  // $openBtn.click();

  if ( location.hostname.indexOf('matt') === -1 ) {
    createWidget('Matt', 'matt@mattbenton.net');
    createWidget('Tarwin', 'tarwin@gmail.com');
  }

  window.createWidget = createWidget;

  window.closeWidget = function ( id ) {
    var $widget = widgets[id];
    if ( $widget ) {
      $widget.remove();
    }
  };
});