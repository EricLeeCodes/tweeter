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
      $tweetsContainer.prepend($tweet); //Prepend to display page
    }

  };

  //Building out the tweet structure
  const createTweet = (tweet) => {
    const tweetUser = tweet.user;
    const tweetContent = tweet.content;

    //HTML layout of the tweet
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

  //Loading/GETting current tweets
  const loadTweets = (() => {

    $.ajax({
      url: '/tweets',
      method: 'GET',
      //Takes in an array of tweets
      success: (tweets) => {
        $charLimitMessage.hide(); //If charLimitMessage is displayed, hide it
        $emptyMessage.hide(); // If emptyMessage is displayed, hide it
        renderTweets(tweets); //Using renderTweets function on success
      },
      error: (err) => {
        console.log("Error loading tweets:", err);
      }
    });
  });

  //Validating tweets with tweet content as parameters
  const validateTweet = function(tweetContent) {
    tweetContent = tweetContent.trim(); //trim content to not include spaces before or after the intended message

    //If tweetContent is not there
    if (!tweetContent) {
      //Hides error message and css if displayed
      $charLimitMessage.hide();
      $charLimitMessage.css("visibility", "hidden");

      //Shows error message of no tweet content
      $emptyMessage.css("visibility", "visible");
      $emptyMessage.slideDown("slow");
      return false; //return to break validation
    }

    //If tweetContent is above character limit
    if (tweetContent.length > 140) {
      //Hides error message and css if displayed
      $emptyMessage.hide();
      $emptyMessage.css("visibility", "hidden");

      //Shows error message of character limit reached
      $charLimitMessage.css("visibility", "visible");
      $charLimitMessage.slideDown("slow");
      return false;
    }

    return true;
  };

  //Submtting the tweet form
  $newTweetForm.on("submit", (event) => {
    event.preventDefault(); //Prevents default activity

    //Put trimmed content in variable
    const tweetContent = ($tweetTextarea).val().trim();

    if (!validateTweet(tweetContent)) { //If the tweet is not valid,
      return; //Break the call
    }

    //Creating text string in URL-encoded standard
    const serializedData = $newTweetForm.serialize();

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: serializedData,
      success: () => {
        //Resets the form with content
        $newTweetForm.trigger("reset");
        loadTweets(); //Displays tweets after a successful post
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
