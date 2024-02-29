/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(() => {

  const $tweetsContainer = $('#tweets-container');
  const $newTweetForm = $('#new-tweet-form');


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
              <p>${tweetUser.name}</p>
            </div>
            <div>
              <p>${tweetUser.handle}</p>
            </div>
          </div>
          <div class="text-display">
            <p>${tweetContent.text}</p>
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
        renderTweets(tweets);
      },
      error: (err) => {
        console.log("Error loading tweets:", err);
      }
    });
  });

  loadTweets();

  $newTweetForm.on("submit", (event) => {
    event.preventDefault(); //Prevents default activity
    const $charCount = $("#char-count");
    const tweetContent = ($charCount).val();

    const validateTweet = function(tweetContent) {
      if (!tweetContent || tweetContent.length > 140) {
        return false;
      }

      return true;
    };

    const serializedData = $(this).serialize(); //Creating text string in URL-encoded standard
    console.log(serializedData);
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: serializedData,
      success: () => {
        if (validateTweet(tweetContent)) {
          loadTweets();
        };
      },
      error: (err) => {
        console.log("Error posting tweets:", err);
      }
    });
  });

});
