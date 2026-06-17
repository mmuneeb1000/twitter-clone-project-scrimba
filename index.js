import { tweetsData as initialTweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document
  .querySelector(".keyword-search")
  .addEventListener("input", handleSearch);

let searchQuery = "";

function handleSearch(e) {
  searchQuery = e.target.value.toLowerCase();
  render();
}

function saveToLocalStorage() {
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
}
let tweetsData =
  JSON.parse(localStorage.getItem("tweetsData")) || initialTweetsData;

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.dataset.replyBtn) {
    handleReplyBtnClick(e.target.dataset.replyBtn);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.options) {
    handleOptionsClick(e.target.dataset.options);
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  saveToLocalStorage();
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  saveToLocalStorage();
  render();
}
function handleOptionsClick(tweetId) {
  document.getElementById(`options-${tweetId}`).classList.toggle("hidden");
}

function handleReplyClick(tweetId) {
  //   document.getElementById(`replies-${tweetId}`).classList.toggle("hidden");
  //   document.getElementById(`reply-input-${tweetId}`).classList.toggle("hidden");
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);

  targetTweetObj.isRepliesOpen = !targetTweetObj.isRepliesOpen;

  saveToLocalStorage();
  render();
}
function handleReplyBtnClick(tweetId) {
  const replyInput = document.getElementById(`reply-text-${tweetId}`);

  if (!replyInput.value) {
    return;
  }

  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  targetTweetObj.replies.unshift({
    handle: "@Scrimba",
    profilePic: "images/scrimbalogo.png",
    tweetText: replyInput.value,
    isMine: true,
    uuid: uuidv4(),
  });
  targetTweetObj.isRepliesOpen = true;
  saveToLocalStorage();
  render();
}
function handleDeleteClick(tweetId) {
  const tweetToDelete = tweetsData.find((tweet) => tweet.uuid === tweetId);

  if (!tweetToDelete?.isMine) {
    return;
  }

  tweetsData = tweetsData.filter((tweet) => tweet.uuid !== tweetId);

  saveToLocalStorage();
  render();
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      isMine: true,
      isRepliesOpen: false,
      uuid: uuidv4(),
    });
    saveToLocalStorage();
    render();
    tweetInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;
  const filteredTweets = tweetsData.filter((tweet) => {
    const text = tweet.tweetText.toLowerCase();
    const handle = tweet.handle.toLowerCase();

    return text.includes(searchQuery) || handle.includes(searchQuery);
  });

  filteredTweets.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }
    const repliesClass = tweet.isRepliesOpen ? "" : "hidden";
    let repliesHtml = "";
    let optionsHtml = "";
    if (tweet.isMine) {
      optionsHtml = `
        <div class="tweet-options">
           
            <i
                class="fa-solid fa-ellipsis"
                data-options="${tweet.uuid}"
            ></i>

            <div
                class="options-menu hidden"
                id="options-${tweet.uuid}"
            >
                <dropdown
                    data-delete="${tweet.uuid}"
                >
                    Delete
                </dropdown>
            </div>
        </div>
    `;
    }

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
            
             <div class="tweet-inner">
       
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
          </div>
           `;
      });
    }

    feedHtml += `
    <div class="tweet">
        ${optionsHtml}
        <div class="tweet-inner">
         
         <img src="${tweet.profilePic}" class="profile-pic">
        
         <div>
            <p class="handle">${tweet.handle}</p>
            
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">

                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                
            </div>  
           </div> 
        </div>
      <div class="reply-input-container ${repliesClass}" id="reply-input-${tweet.uuid}">
         <textarea
         id="reply-text-${tweet.uuid}"
         placeholder="Write a reply..."
         ></textarea>

          <button
           data-reply-btn="${tweet.uuid}"
          >
          Reply
           </button>
       </div>
        <div class="${repliesClass}" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    
    </div>
    `;
  });

  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
