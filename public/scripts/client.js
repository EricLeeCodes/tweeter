/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(() => {

  const $tweetsContainer = $('#tweets-container');
  const $newTweetForm = $('#new-tweet-form');
  const $tweetTextarea = $('#tweet-textarea');
  const $charLimitMessage = $('#char-limit-message');
  const $emptyMessage = $('#empty-message');



  //Rendering tweet and appending them to our front end.
  const renderTweets = (tweetData) => {
    $tweetsContainer.empty(); //Empty before adding anything to display

    //Loop over the data and create tweet with the informations
    for (const tweet of tweetData) {
      const $tweet = createTweet(tweet); //Assign to jQ variable 
      $tweetsContainer.prepend($tweet); //Append to display page
    }

  };

  //Building out the tweet structure
  const createTweet = (tweet) => {
    const tweetUser = tweet.user;
    const tweetContent = tweet.content;

    const $tweet = $(`
      <article class="tweet">
        <header>
          <div>
            <div>
              <img src=${tweetUser.avatars}/>
              <p>${escape(tweetUser.name)}</p>
            </div>
            <div>
              <p>${escape(tweetUser.handle)}</p>
            </div>
          </div>
          <div class="text-display">
            <p>${escape(tweetContent.text)}</p>
          </div>
        </header>
        <footer>
          <div>
            <p>${timeago.format(tweet["created_at"])}</p>
          </div>
          <div class="icons">
            <div class="icon"><i class="fa-solid fa-flag"></i></div>
            <div class="icon"><i class="fa-solid fa-retweet"></i></div>
            <div class="icon"><i class="fa-solid fa-heart"></i></div>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  const loadTweets = (() => {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      //Takes in an array of tweets
      success: (tweets) => {
        $charLimitMessage.hide();
        $emptyMessage.hide();
        renderTweets(tweets);
      },
      error: (err) => {
        console.log("Error loading tweets:", err);
      }
    });
  });

  const validateTweet = function(tweetContent) {
    tweetContent = tweetContent.trim();

    if (!tweetContent) {
      $charLimitMessage.hide();
      $charLimitMessage.css("visibility", "hidden");
      $emptyMessage.css("visibility", "visible");
      $emptyMessage.slideDown("slow");
      return false;
    }

    if (tweetContent.length > 140) {
      $emptyMessage.hide();
      $emptyMessage.css("visibility", "hidden");
      $charLimitMessage.css("visibility", "visible");
      $charLimitMessage.slideDown("slow");
      return false;
    }

    return true;
  };

  $newTweetForm.on("submit", (event) => {
    event.preventDefault(); //Prevents default activity
    const tweetContent = ($tweetTextarea).val().trim();

    if (!validateTweet(tweetContent)) {
      return;
    }

    const serializedData = $newTweetForm.serialize(); //Creating text string in URL-encoded standard
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: serializedData,
      success: () => {
        $newTweetForm.trigger("reset");
        loadTweets();
      },
      error: (err) => {
        console.log("Error posting tweets:", err);
      },
    });
  });

  //Escape character to prevent malicious users from interacting with our code
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  loadTweets();
});
