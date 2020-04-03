// ==UserScript==
// @name         SteamCommunity (home)
// @namespace    http://tampermonkey.net/
// @version      0.0019
// @description  continously upvote items in the activity feed
// @author       byteframe
// @match        *://steamcommunity.com/*/*/home
// @grant        unsafeWindow
// @grant        GM_notification
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==\

const CYCLES = 20;
const SCROLL_DELAY = 90000;
const VOTE_DELAY = 6000;

// skip timer
var timer = -1, cycle = 0;
unsafeWindow.skip_timer = function() {
  if (timer) {
    clearTimeout(timer);
    timer = 0;
    proceed();
  }
};

// reload on completion
jQuery(document).ready(function(){
  proceed();
});
function proceed(delay = 0) {
  cycle++;
  if (cycle == CYCLES) {
    location.reload();

  // call blotter function and wait
  } else {
    console.log('requesting friend activity...');
    StartLoadingBlotter(g_BlotterNextLoadURL);
    timer = setTimeout(function() {

      // find and click on new feed items
      var total = jQuery('[id^="vote_up_"]').add(jQuery('[id^="VoteUpBtn_"]')),
        votes = total.not(".active");
      console.log('t: ' + total.length + ', u: ' + votes.length + ', c: ' + cycle);
      function vote(i = 0) {
        console.log('voting...');
        votes[i].click();
        if (i < votes.length-1) {
          setTimeout(vote,
            Math.random()*(VOTE_DELAY-VOTE_DELAY/2)+VOTE_DELAY/2, i+1);
        } else {
          proceed(SCROLL_DELAY);
        }
      }
      if (!total.length) {
        GM_notification({
          text: 'error: empty activity feed!',
          timeout: 600000
        });
        setTimeout(function() {
          location.reload();
        }, 600000);
      } else {
        if (votes.length) {
          vote();
        } else {
          proceed(10000);
        }
      }
    }, delay);
  }
}