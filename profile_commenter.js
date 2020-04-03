// ==UserScript==
// @name         SteamCommunity/* (profile_commenter)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  post comments/replys to other users
// @author       byteframe
// @match        *://steamcommunity.com/*
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

const POST_MAX = 190;

// proceed or change url of last video in browser console
unsafeWindow.getLastFriend = function(value) {
  return GM_getValue('last_steamid', '');
};
unsafeWindow.setLastFriend = function(value) {
  GM_setValue('last_steamid', value);
};

// allow changing of free post amount and/or skip delay
var timer = -1;
unsafeWindow.setPostFree = function(value = -1) {
  if (value > -1) {
    GM_setValue('post_free', value);
  }
  if (timer) {
    clearTimeout(timer);
    timer = 0;
    proceed();
  }
};

// gather last 50 comments on a profile
function request_comments(steamid, callback) {
  jQuery.get('//steamcommunity.com/profiles/' + steamid + "/allcomments"
  ).fail(function() {
    setTimeout(request_comments, 5000, steamid, callback);
  }).done(function(response) {
    callback(response);
  });
}

// check if a comment was recently posted or if its our profile
function check_comments(response, steamid, count) {
  if (steamid_blacklist.indexOf(steamid) > -1 || steamid == g_steamID) {
    return true;
  } else {
    var comments = jQuery(response).find(
      'a.hoverunderline.commentthread_author_link');
    for (var i = 0; i < comments.length && i < count; i++) {
      if (comments[i].href == 'http://steamcommunity.com/id/byteframe') {
        return true;
      }
    }
  }
  return false;
}

// deduce post availability/delay
function ms_until_tomorrow(hour = 0) {
  var now = new Date();
  return Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()+1, hour)-now;
}
function calculate_delay() {
  return Math.max(10000, Math.floor((ms_until_tomorrow()-3600000)/GM_getValue(
    'post_free')-Math.random()*(20000-5000)+5000)+cooldown_count*120000);
}
var p, update_requests;
unsafeWindow.start_profile_commenter = function(_update_requests = false) {
  update_requests = _update_requests;
  p = Math.max(-1, friends.findIndex(function(friend) {
    return friend == GM_getValue('last_steamid', '0');
  })-1);
  proceed();
};
function proceed(delay = 0, next = true) {
  var date = new Date();
  if (GM_getValue('day') != date.getUTCDay()) {
    unsafeWindow.console_log(date.toUTCString());
    GM_setValue('day', date.getUTCDay());
    GM_setValue('post_free', POST_MAX);
  }
  if (GM_getValue('post_free') < 1 || cooldown_count == 8) {
    unsafeWindow.console_log("cooldown: " + cooldown_count +
      ", free: " + GM_getValue('post_free'));
    timer = setTimeout(proceed, ms_until_tomorrow(), next);
  } else {

    // return a recent reply, or select next friend
    if (p < friends.length-1) {
      request_comments(g_steamID, function(response) {
        var last_replyer = -1, replies = jQuery(response).find(
          'div.commentthread_comment_author').toArray().reverse();
        (function check_replies(r) {
          if (r == replies.length) {
            if (next) {
              p++;
            }
            GM_setValue('last_steamid', friends[p]);
            timer = setTimeout(post_comments, delay, friends[p], p);
          } else {
            GM_setValue('reply', jQuery(replies[r]).find(
              'a.actionlink')[0].href.substr(73, 19));
            var replyer = translate_id(jQuery(replies[r]).find(
              'a.commentthread_author_link')[0].attributes['data-miniprofile'].value);
            if (replyer != last_replyer) {
              last_replyer = replyer;
              request_comments(replyer, function(response) {
                if (!check_comments(response, replyer, 12)) {
                  timer = setTimeout(post_comments, delay, replyer, "*" + r);
                } else {
                  check_replies(r+1);
                }
              });
            } else {
              check_replies(r+1);
            }
          }
        })(replies.findIndex(function(reply) {
          return jQuery(reply).find(
            'a.actionlink')[0].href.substr(73, 19) == GM_getValue('reply', -1);
        })+1);
      });
    } else {
      GM_setValue('last_steamid', 0);
      p = -1;
      proceed();
    }
  }
}

// gather user stats
var cooldown_count = 0, cooldown = false;
function post_comments(steamid, index, type = -1) {
  jQuery.get('//steamcommunity.com/profiles/' + steamid
  ).fail(function() {
    setTimeout(post_comments, 5000, steamid, index);
  }).done(function(response) {
    var persona = '?', tp = '?????', cf = '???', tf = '????', cg = '??';
    if (jQuery(response).find('span.actual_persona_name').length) {
      persona = jQuery(response).find('span.actual_persona_name')[0].innerText;
    }
    if (jQuery(response).find('a.commentthread_allcommentslink').length) {
      tp = jQuery(response).find(
        'a.commentthread_allcommentslink')[0].innerText.slice(9, -9).replace(',', '');
    }
    if (jQuery(response).find('a[href^=javascript\\:ShowFriendsInCommon]').length) {
      cf = jQuery(response).find(
        'a[href^=javascript\\:ShowFriendsInCommon]')[0].innerText.slice(0, -8);
    }
    if (jQuery(response).find('a[href$=friends\\/]').last().children().length > 1) {
      tf = jQuery(response).find(
        'a[href$=friends\\/]').last().children()[1].innerHTML.trim().replace(',', '');
    }
    if (jQuery(response).find('a[href$=groupscommon\\/]').length) {
      cg = jQuery(response).find(
        'a[href$=groupscommon\\/]')[0].text.split(' ')[0];
    }

    // generate status line
    function print_status_line(status, error = '') {
      var line = status + ': http://steamcommunity.com/profiles/' +
        steamid + " (" + pad(index, 3, '_') + "/" +
        pad(friends.length, 4, '_') + ")+" +
        Math.floor(calculate_delay()/1000) + "\n          {p:" +
        pad(tp, 5, '_') + "|c:" + pad(cf, 3, '_') + "|t:" + pad(tf, 4, '_') +
        "|g:" + pad(cg, 2, '_') + "} " + '[' + GM_getValue('day') + '=' +
        pad(GM_getValue('post_free'), 3, '_') + '|' + cooldown_count + '] "' +
        persona.trim() + '"';
      if (error) {
        line = line + "\n          " + error;
      }
      return line;
    }

    // skip if private, blacklisted, or too soon
    if (!jQuery(response).find('textarea.commentthread_textarea').length) {
      if (jQuery(response).find('span#account_pulldown').length) {
        unsafeWindow.console_log(print_status_line("_Private"));
        proceed();
      } else {
        var status_line = print_status_line("___ERROR");
        unsafeWindow.console_log(status_line);
        GM_notification({
          text: status_line,
          timeout: 600000
        });
        setTimeout(post_comments, 60000, steamid, index);
      }
      return;
    }
    request_comments(steamid, function(response) {
      if (check_comments(response, steamid, 12)) {
        proceed();
        return;
      }

      // request custom data then attempt to post a comment
      (function try_friend_comment() {
        comment_message(function(msg, type) {
          if (msg.length > 975 || msg.indexOf('request_data_error') > -1) {
            try_friend_comment();
          } else {
            post_comment(steamid, msg, 0, -1, function(response, err) {
              if (err) {
                unsafeWindow.console_log(print_status_line("_INVALID"));
              } else {
                if (response.success === true) {
                  GM_setValue('post_free', GM_getValue('post_free')-1);
                  if (cooldown) {
                    cooldown = false;
                  } else if (cooldown_count) {
                    cooldown_count--;
                  }
                  unsafeWindow.console_log(print_status_line("Complete") + "\n" + msg.substr(0,750));
                } else {
                  var status_line = print_status_line("_FAILURE", response.error);
                  if (response.error.indexOf('too frequent') > -1) {
                    cooldown = true;
                    cooldown_count++;
                  } else {
                    status_line += 'type: ' + type + ", length: " + msg.length;
                  }
                  GM_notification({
                    text: status_line.replace(/\s+/g, ' '),
                    timeout: 300000
                  });
                  unsafeWindow.console_log(status_line);
                }
                proceed(calculate_delay(), response.success);
              }
            });
          }
        }, type, persona);
      })();
    });
  });
}
