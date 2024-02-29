$(document).ready(function() {
  const $tweetTextarea = $("#tweet-textarea");
  const $charCounter = $("#char-counter");

  $tweetTextarea.on('input', function() {
    let charLength = $(this).val().length;
    $charCounter.text(140 - charLength);
    if (charLength >= 130) {
      $charCounter.css("color", "red");
    } else if (charLength <= 130) {
      $charCounter.css("color", "");
    };
  });
});
