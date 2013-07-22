$(function(){
  var $window = $(window);

  var widgetId = -1;

  var email = null;

  // Cache elements for speed. In most cases I'm using classes instead of IDs
  // to prevent specificity wars.
  var $head               = $('head');
  var $recipientName      = $('.recipient-name');
  var $messages           = $('.messages');
  var $messageTemplate    = $('.message-template').remove().removeClass('message-template');
  var $inputWrapper       = $('.message-input-wrapper');
  var $input              = $('.message-input');
  var $titleBar           = $('.title-bar');
  var $minimizeRestoreBtn = $('.icon-minimize');
  var $maximizeBtn        = $('.icon-maximize');
  var $closeBtn           = $('.icon-close');
  var $uploadBtn          = $('.icon-upload');

  // ## Controller

  // Setup the widget. Gets invoked at end of file.
  function init () {
    var url = location.href;
    var params = {};
    url.replace(/([a-z0-9]+)=([^&]+)/gi, function ( line, key, value ) {
      value = decodeURIComponent(value);
      params[key] = value;
    });

    widgetId = parseInt(params.id, 10);

    if ( params.user ) {
      $recipientName.text(params.user);
    }

    if ( params.email ) {
      email = params.email;
    }

    $input.focus();
  }

  // Sends an event to the widget manager in the parent window using
  // `postMessage()` for communication.
  var emitOnParent = function ( eventType, data ) {
    var parent = window.opener || window.parent;
    if ( parent && parent.postMessage ) {
      parent.postMessage({
        widgetId: widgetId,
        type:     eventType,
        data:     data
      }, '*');
    }
  };

  // Adjusts the height of the message area to fit within the widget,
  // defering actual resizing until at least 300ms after the last time
  // the function is invoked. 
  var resizeMessageArea = _.debounce(function() {
    var clientHeight = $window.height();
    var inputHeight  = $inputWrapper.height();
    $messages.css('height', clientHeight - inputHeight - 115);
  }, 300);

  // Adds a new message to the message area.
  var addMessage = function ( msg ) {
    var $msg = $messageTemplate.clone();

    if ( msg.email !== email ) {
      $msg.addClass('message-recipient');
    }

    // Remove init class after the DOM has updated for the sliding transition.
    setTimeout(function() {
      $msg.removeClass('message-init');
    }, 0);

    /*
    $msg.find('.avatar').css({
      backgroundImage: 'url(' + getGravatar(msg.email) + ')'
    });
    */

    $msg.find('.message-content').html(htmlify(msg.message));

    $msg.appendTo($messages);

    // Force the message area to scroll to the bottom.
    $messages.scrollTop($messages[0].scrollHeight);
  };

  var toggleMinimize = function ( doMinimize ) {
    if ( doMinimize === undefined ) {
      doMinimize = !$minimizeRestoreBtn.hasClass('icon-restore');
    } else {
      doMinimize = !!doMinimize;
    }

    $minimizeRestoreBtn.toggleClass('icon-restore', doMinimize);
    emitOnParent(doMinimize ? 'minimize' : 'restore');
  };

  var checkInput = _.throttle(function() {
    var hasInput = !!stripHtml($input.html());
    $inputWrapper.toggleClass('s-has-input', hasInput);
  }, 300);

  // ## Event Handlers

  // Handles keyboard input, submitting a message when the user presses
  // the `ENTER` key. Holding the `CONTROL` key while pressing `ENTER`
  // allows newlines to be added.
  $input.keydown(function ( event ) {
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

    resizeMessageArea();
  });

  $input.keyup(checkInput);

  $minimizeRestoreBtn.click(function ( event ) {
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

  $closeBtn.click(function ( event ) {
    event.stopPropagation();
    emitOnParent('close');
  });

  $window.on('resize', resizeMessageArea);

  // ## Client

  var socket = io.connect('http://' + location.hostname + ':8080');
  socket.on('msg', function ( msg ) {
    addMessage(msg);
  });

  // ## Helpers

  // Transforms HTML input from the contenteditable element into text to
  // be sent over the wire.
  // Converts `<br>` and opening `<div>` tags to new lines, then strips all
  // remaining HTML tags.
  var sanitizeInput = function ( html ) {
    var text = html.replace(/<br>/gi, '\n');
    text = text.replace(/<div\b/gi, '\n<div');
    return stripHtml(text);
  };

  var stripHtml = function ( html ) {
    return html.replace(/(<([^>]+)>)/ig, '');
  };

  // Transforms sanitized input back into HTML for rendering.
  var htmlify = function ( text ) {
    return text.replace(/\n/g, '<br/>');
  };

  /*
  function getGravatar ( email ) {
    return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=32';
  }
  */

  init();
});