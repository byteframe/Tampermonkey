// ==UserScript==
// @name         SteamCommunity/* (activity_rater)
// @namespace    http://tampermonkey.net/
// @version      0.0026
// @description  rate up activity feed items in the background
// @author       byteframe
// @match        *://steamcommunity.com/*
// @grant        unsafeWindow
// @grant        GM_notification
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

const VOTE_DELAY = 6000;
const SCROLL_DELAY = 90000;
const CYCLES = 20;

// override vote functions with corrected/condensed code
var shared_files = [];
unsafeWindow.VoteUp = function(item_id) {
  jQuery.post('//steamcommunity.com/sharedfiles/voteup', {
    id: item_id,
    sessionid: g_sessionID
  }).done(function(response) {
    unsafeWindow.console_log('voted up item: ' + item_id);
  }).fail(function(response) {
    unsafeWindow.console_log('ERROR vote item error: ' + item_id);
  });
  LogUpvote();
  shared_files.push(item_id);
  return false;
};
var new_game_commenting = 0;
unsafeWindow.VoteUpCommentThread = function(thread) {
  thread = thread.split('_');
  jQuery.post('//steamcommunity.com/comment/' + thread[0] + '/voteup/' + thread[1] +
    '/' + thread[2] + "/", {
    vote: 1,
    count: thread[0] == 'UserReceivedNewGame' ? 3 : 6,
    sessionid: g_sessionID,
    newestfirstpagination: true
  }).fail(function(response) {
    unsafeWindow.console_log('ERROR vote thread error: ' + thread);
  }).done(function(response) {
    unsafeWindow.console_log('voted up thread: ' + thread);
  });
  LogUpvote();

  // post a comment for new games (inactive)
  if (thread[0] == 'UserReceivedNewGameInactive') {
    var url = 'http:' + "//steamcommunity.com/profiles/" + thread[1] +
      "/friendactivitydetail/3/" + thread[2];
    jQuery.get(url).done(function(response) {
       if (!check_comments(response, thread[1], 6)) {
        comment_message(function(msg) {
          unsafeWindow.console_log(url + "\n" + msg);
          setTimeout(function() {
            post_comment(thread[1], msg, 2, thread[2] , function(response) {
              new_game_commenting--;
            });
          }, 30000*new_game_commenting);
          new_game_commenting++;
        }, 16);
      }
    });
  }
};
var g_bRecordedUpvote = false;
unsafeWindow.LogUpvote = function() {
  if (!g_bRecordedUpvote) {
    g_bRecordedUpvote = true;
    jQuery.post('//steamcommunity.com/actions/LogFriendActivityUpvote', {
      sessionID: g_sessionID
    });
  }
};
unsafeWindow.RateAnnouncement = function (url, gid, voteup) {
  jQuery.post(url + gid, {
    voteup: true,
    sessionid: g_sessionID
  }).fail(function(response) {
    unsafeWindow.console_log('ERROR rate_announcement error: ' + gid);
  }).done(function(response) {
    unsafeWindow.console_log('voted announcement: ' + gid);
  });
};

// (re)start at url with no offset
var cycle = 0;
unsafeWindow.start_activity_rater = function() {
  cycle = 0;
  jQuery.get('//steamcommunity.com/my/home/'
  ).done(function(response) {
    var url = response.indexOf('ajaxgetusernews');
    url = get_url() + response.slice(url, response.indexOf('?', url));

    // request url for older content using latest offset
    (function request_older_activity(url, delay = 0) {
      setTimeout(function() {
        cycle++;
        if (cycle == CYCLES+1) {
          setTimeout(function() {
            if (shared_files.length) {
              var s = Math.floor(Math.random()*shared_files.length);
              file(shared_files[s], 'favorite');
              shared_files.splice(s, 1);
            }
            start_activity_rater();
          }, SCROLL_DELAY*8);
          return true;
        }
        jQuery.get(url, function(response) {
          if (!response || response.success !== true || !response.blotter_html) {
            unsafeWindow.console_log("ERROR, request_older_activity: " + cycle);
            setTimeout(start_activity_rater, SCROLL_DELAY);
          } else {
            var html = jQuery(response.blotter_html);
            url = response.next_request;

            // find and vote on new feed items
            var total = html.find('[id^="vote_up_"]').add(
              html.find('[id^="VoteUpBtn_"]'));
            var votes = total.not(".active").not(".btn_active");
            unsafeWindow.console_log('t: ' + total.length + ', u: ' + votes.length +
              ', c: ' + cycle + ', d: ' + delay + " | " +
              url.replace(/.*\?start=/, ''));
            vote = function(i = 0) {
              votes[i].click();
              if (i < votes.length-1) {
                setTimeout(vote,
                  Math.random()*(VOTE_DELAY-VOTE_DELAY/2)+VOTE_DELAY/2, i+1);
              } else {
                request_older_activity(url, SCROLL_DELAY);
              }
            };
            if (!total.length) {
              if (cycle == 1) {
                GM_notification({
                  text: 'error: empty activity feed!',
                  timeout: 600000
                });
                setTimeout(function() {
                  start_activity_rater();
                }, SCROLL_DELAY);
              } else {
                unsafeWindow.console_log('ERROR empty activity feed: ' + cycle);
              }
            } else {
              if (votes.length) {
                vote();
              } else {
                request_older_activity(url, SCROLL_DELAY);
              }
            }
          }
        });
      }, delay);
    })(url);
  });
};
