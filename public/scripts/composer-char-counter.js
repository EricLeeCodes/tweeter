$(document).ready(function() {
  const $tweetTextarea = $("#tweet-textarea");
  const $charCounter = $("#char-counter");

  //On the input of <textarea>
  $tweetTextarea.on('input', function() {
    let charLength = $(this).val().length; //Checking the length of contents
    $charCounter.text(140 - charLength); //Subtract content length by 140
    if (charLength >= 140) { //Checking if length is over 140
      $charCounter.css("color", "red"); //Changes color if over 140 characters
    } else if (charLength <= 140) { //If less than 140 limit
      $charCounter.css("color", ""); //css color turns to none
    };
  });
});
