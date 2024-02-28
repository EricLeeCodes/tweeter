$(document).ready(function() {
  const $charCount = $("#char-count");
  const $charCounter = $("#char-counter");

  $charCount.on('input', function() {
    let charLength = $(this).val().length;
    $charCounter.text(140 - charLength);
    if (charLength >= 130) {
      $charCounter.css("color", "red");
    } else if (charLength <= 130) {
      $charCounter.css("color", "");
    };
  });
});
