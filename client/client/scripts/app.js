var app = {

  roomname : 'lobby',
  messages: [],
  lastMessageID: 0,
  friends : {},
  server : 'http://127.0.0.1:3000/classes/messages',
  username: 'anonymous',


  init: function(){

    //Grab the username
    app.username = window.location.search.substr(10);

    //Saving jquery selectors
    app.$message = $('.messenger-input');
    app.$chats = $('#chats');
    app.$roomSelect = $('.roomSelect');
    app.$send = $('.messenger-submit');

    //Event Listeners
    app.$chats.on('click', '.username', app.handleUsernameClick)
    app.$send.on('click', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);
   
    app.fetch()

    setInterval(function(){
      app.fetch()
    }, 2000)

  },

  send: function(message){

    $.ajax({

      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        // Clear message input
        app.$message.val('');

        app.fetch()

      },

      error: function(error){
        console.error('chatterbox: failed to send messages', error)
      }

    });

  },

  fetch: function(){
    // Spinner
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {/*order: '-createdAt'*/},
      success: function(data){

        data = JSON.parse(data);

        if(!data.results || !data.results.length) { return; }

        app.messages = data.results;

        var mostRecentMessage = data.results[0];

        if(mostRecentMessage.objectId !== app.lastMessageID){

          
          //need to render rooms
          app.renderMessages(data.results)

          app.lastMessageID = mostRecentMessage.objectId;

        };

      },

      error: function(error){
        console.error('Chatterbox: failed to fetch messages', error)
      }

    })
  },

  clearMessages: function(){
    app.$chats.html('')
  },

  renderMessages: function(messages){
    
    
    app.clearMessages();  

    if(Array.isArray(messages)){

      messages.forEach(function(message){
       
        app.renderMessage(message)
      });
    }
  },


  renderRoomList: function(messages){

    app.$roomSelect.html('<option value="__newRoom">New room...</option>')

    if(messages){
      var rooms = {};
      messages.forEach(function(message){
        var roomname = message.roomname;
        if(roomname && !rooms[roomname]){

            app.renderRoom(roomname)

            rooms[roomname] = true;
        }
      });
    }
  },

  renderRoom: function(roomname){

    var $option = $('<option/>').val(roomname).text(roomname)

    // Add to select
    app.$roomSelect.append($option);

  },


  renderMessage: function(message){
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    var $chat = $('<div class="chat"/>');

    var $username = $('<span class="username"/>');

    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    // add friend class at one point

    var $message = $('<span class="message"/>');
    $message.text(message.text).appendTo($chat);

    app.$chats.append($chat)

  },

  handleUsernameClick: function(event){

    var username = $(event.target).data('username');

    app.friends[username] = username;

    $(event.target).parent().toggleClass('friend');

  },

  handleSubmit: function(event){

    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message)

    event.preventDefault();
  }


};

// app.init =  function(){

// $(document).ready(function(){
  

//     // Caching DOM items 
//     var $chats = $('#chats');

//     // Setting input requirements
//     $(".messenger-input").prop('required',true);
//     $("#add-room-input").prop('required',true);


// // EVENT HANDLERS AND FUNCTION CALLS

// $("#add-room").submit(function(e){

//   var newRoom = $('#add-room-input').val();

//   app.renderRoom(newRoom);
 
//   $('#add-room-input').val('');

//   e.preventDefault();
// })

// // Submitting a new message
// $("#messenger-form").submit(function(e){

//   e.preventDefault()

//   // Re-assigning keys to the message object

//   message.text = $('.messenger-input').val();

//   message.roomname = $('#room-selector').val();
  
//   app.send(message);

//   $('.messenger-input').val('');

// });




// // Get Friends from Local Storage && and adding them to the DOM
// let savedFriends;

// if(localStorage.getItem('friends') === null){
//   savedFriends = [];
// } else {
//   savedFriends = JSON.parse(localStorage.getItem('friends'));
// }
// console.log('friends: ', savedFriends)

// savedFriends.forEach(function(savedFriend){
// console.log('savedFriend: ', savedFriend)
//   $('#friend-list').append('<div class="friend">' + savedFriend + '</div>');

// });
// localStorage.setItem('savedFriends', JSON.stringify(savedFriends));



// //Getting new friend from the DOM and sending him/her to the local storage

// $('body').on('click', function(event){
    
//   if(event.target.classList.contains('username')){

//     var newFriend = event.target.innerHTML.slice(0, -1);

//     app.handleUsernameClick(newFriend);
//   }
  
//   // Change classes of messages 

//   app.friendMessage()

// });




// // SEND FUNCTION
// app.send = function(message){
//         console.log(message)
//         // POST message to server

//         $.ajax({
//           url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
//           type: 'POST',
//           data: JSON.stringify(message),
//           contentType: 'application/json',
//           success: function (chats) {
//             console.log('chatterbox: Message sent');

//           },
//           error: function (data) {
//             // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//             console.error('chatterbox: Failed to send message', data);
//           }
//         });
//         console.log('chatterbox: Message received');


//     }

//   // GET messages from server


//   app.fetch = function(){
    
//     $.ajax({
//       // This is the url you should use to communicate with the parse API server.
//       url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
//       type: 'GET',
//       contentType: 'application/json',
//       dataType: 'json',
//       data: {order: '-createdAt'},
//       success: function (data) {

//           if (!data.results || !data.results.length) { return; }


//           app.messages = data.results;

//           var mostRecentMessage = data.results[data.results.length - 1]
          
//           if(mostRecentMessage.objectId !== app.lastMessageID ){

//             app.renderMessages(data.results);

//             app.lastMessageID = mostRecentMessage.objectId;

//           }

//         console.log('chatterbox: Message received');
//       },

//       error: function (data) {
//         // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to receive message', data);
//       }

//     });
  

//   }  


//   // Add messages to DOM
//   app.renderMessage = function(message){

//     let HTML = '';
  
//     var cleanUsername = app.escape(message.username);

//     var cleanMessage = app.escape(message.text)
    
//     HTML += `<div id="${message.objectId}"class="message-body "><span class="username"> ${cleanUsername} :</span><br> ${cleanMessage}</div>`
   
//     $chats.append(HTML)
//   }


//   // Add rooms to DOM
//   app.renderRoom = function(newRoom){

//     $('#roomSelect').append('<option>' + newRoom + '</option>');
    
//   }

//   // Add Friend to local Storage
//   app.handleUsernameClick = function(newFriend){

//     let friends;

//     if(localStorage.getItem('friends') === null){
//       friends = [];
//     } else {
//       friends = JSON.parse(localStorage.getItem('friends'));
//     }

//     if(friends.indexOf(newFriend) === -1){
//       friends.push(newFriend);
//       $('#friend-list').append('<div class="friend">' + newFriend + '</div>');
//     } 
    
//     localStorage.setItem('friends', JSON.stringify(friends));

//   }

//   app.friendMessage = function(){

//     let friends;

//     if(localStorage.getItem('friends') === null){
//       friends = [];
//     } else {
//       friends = JSON.parse(localStorage.getItem('friends'));
//     }

//     // Loop over all HTML elements that contain these strings and change their classes

//     friends.forEach(function(friend){
//       match = JSON.stringify(friend);

//       $('div').each(function(item){

//         let messenger = $(this).text().substr(0, $(this).text().indexOf(':'))

//         if(friend == messenger){
//           $(this).addClass('message-body-friend')
//         }
//       })

//     })

   
//     localStorage.setItem('friends', JSON.stringify(friends));

//     }
//   });
//  }

// setInterval(function(){
//   //app.clearMessages();
//   app.fetch();
// }, 2000);


// app.escape = function(str) {

//   var entityMap = {
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;',
//     '/': '&#x2F;',
//     '`': '&#x60;',
//     '=': '&#x3D;'
//   };

//   return String(str).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
//     return entityMap[s];
//   });
// };

// app.init();
