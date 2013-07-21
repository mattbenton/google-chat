$(function(){
  var $window = $(window);

  var widgetId = -1;

  var email = null;

  var $head            = $('head');
  var $userName        = $('.user-name');
  var $messages        = $('.messages');
  var $messageTemplate = $('.message:first').remove();
  var $inputWrapper    = $('.message-input-wrapper');
  var $input           = $('.message-input');

  var $closeBtn = $('.icon-close');

  var resize = _.debounce(function() {
    var clientHeight = $window.height();
    var inputHeight  = $inputWrapper.height();
    $messages.css('height', clientHeight - inputHeight - 115);
  }, 300);

  $window.on('resize', resize);

  $closeBtn.on('click', function() {
    post('close');
    // try {
    //   var top = window.top;
    //   if ( top && top.closeWidget ) {
    //     top.closeWidget(widgetId);
    //   }
    // } catch ( ex ) {
    // }
  });

  function init () {
    var url = location.href;
    var params = {};
    url.replace(/([a-z0-9]+)=([^&]+)/gi, function ( line, key, value ) {
      value = decodeURIComponent(value);
      params[key] = value;
    });

    widgetId = parseInt(params.id, 10);

    if ( params.user ) {
      $userName.text(params.user);
    }

    if ( params.email ) {
      email = params.email;
    }
  }

  function getGravatar ( email ) {
    return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=32';
  }

  function triggerParentEvent ( type ) {
    var parentJQuery = window.parent.jQuery;
    if ( parentJQuery ) {
      parentJQuery(window.parent.document).trigger(type);
    }
  }

  var $titleBar       = $('.title-bar');
  var $minimizeToggle = $('.icon-minimize');
  var $maximizeBtn    = $('.icon-maximize');

  var toggleMinimize = function ( doMinimize ) {
    var doMinimize;
    if ( doMinimize === undefined ) {
      doMinimize = !$minimizeToggle.hasClass('icon-restore');
    } else {
      doMinimize = !!doMinimize;
    }

    $minimizeToggle.toggleClass('icon-restore', doMinimize);
    post(doMinimize ? 'minimize' : 'restore');
  };

  $minimizeToggle.click(function ( event ) {
    event.stopPropagation();
    toggleMinimize();
  });

  $maximizeBtn.click(function ( event ) {
    event.stopPropagation();
    var options = 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no,dependent=yes,width=262,height=380';
    var ref = window.open(location.href, 'widget', options);
    toggleMinimize(true);
  });

  
  $titleBar.click(function() {
    toggleMinimize();
  });

  var post = function ( data ) {
    var parent = window.opener || window.parent;
    if ( parent && parent.postMessage ) {
      parent.postMessage({ id: widgetId, type: data }, '*');
    }
  };

  init();

  var knownEmails = {};

  var $style = $('<style>').appendTo('head');

  var addMessage = function ( msg ) {
    var $msg = $messageTemplate.clone();

    $msg.removeClass('message-template');
    if ( msg.email !== email ) {
      $msg.addClass('message-other');
    }

    $msg.find('.avatar').css({
      backgroundImage: 'url(' + getGravatar(msg.email) + ')'
    });

    var html = msg.message.replace(/\n/g, '<br/>');
    html += '<div class="message-date">Now</div>';
    $msg.find('.message-content').html(html);

    $msg.appendTo($messages);

    $messages.scrollTop($messages[0].scrollHeight);
  };

  var socket = io.connect('http://' + location.hostname + ':8080');
  socket.on('msg', function ( msg ) {
    addMessage(msg);
  });

  var sanitizeInput = function ( html ) {
    // Converts <br>'s and opening <div>'s to new lines.
    var text = html.replace(/<br>/gi, '\n');
    text = text.replace(/<div\b/gi, '\n<div');
    // Strips all remaining HTML tags.
    return text.replace(/(<([^>]+)>)/ig, '');
  };

  $input.on('keydown', function ( event ) {
    if ( event.keyCode === 13 && !event.ctrlKey ) {
      event.preventDefault();
      var html = $input.html();
      if ( html ) {
        var html = $input.html();
        var text = sanitizeInput(html);
        $input.html('');

        addMessage({
          email:   email,
          message: text
        });

        socket.emit('msg', {
          email: email,
          message: text
        });
      }
    }
    resize();
  });

  $input.focus();

  resize();
});