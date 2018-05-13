function sendMess(url) {
  chrome.extension.sendMessage({ action: "browserReddit", url });
}

const redditURL = window.prompt(
  "Enter one reddit subreddit url to upvote",
  "https://www.reddit.com/r/random"
);

if (redditURL && redditURL.length) {
  sendMess(redditURL)
}
