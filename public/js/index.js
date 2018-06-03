var socket = io();

socket.on("connect", function() {
  console.log("Connected to the server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("newMessage", message);
  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function(e) {
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name=message]").val()
    },
    function(data) {
      console.log("Send correctly");
    }
  );
  jQuery("[name=message]").value = "";
  e.preventDefault();
});
