# Google Chat Demo

---

### Live Demo

A temporary live demo can be viewed at <http://matt.gs/google-chat>.

### Dependencies

- NPM ([Node Package Manager](https://npmjs.org/))


### Instructions

1. Run `npm install` inside the **server** directory.
2. Then run `node server.js` inside the same directory to start the Socket.io server.


### Features

- Popout mode (click the arrow in the widget titlebar).
- Completely resizable widget.
- Message input area grows automatically and adjusts the chat area height accordingly.
- Newlines can be inserted into messages by pressing `Ctrl` + `Enter`.
- Uses gravatars for profile pictures if one has been assigned to the email address.


### Future Improvements

- Structure the code using a more modular pattern, perhaps AMD, using something like RequireJs. Right now the code is so small that this is would be overkill.
- Implement minimize feature.
- Have a live list of users currently viewing the demo and all them to chat with each other using the widget. Prompt their name and email address when they first view the page and get their gravatar using their email if possible.
- Use media queries to detect a small widget window height and style the widget in a 'minimized' state. This would mostly involve switching the minimize icon to the maximize one.
- Use CSS transitions to slide the messages in from the sides when they are added.
- Use CSS transitions to slide the photo upload icon to the right when the user starts typing in the input area.
- Update the time messages were sent instead of the fixed 'Now' text.
- Fade the blue border surrounding the message input area when the widget loses focus.