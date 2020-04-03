// ==UserScript==
// @name         SteamCommunity/broadcast/watch/byteframe (byteframe_main)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  alter profile, send comments, make posts
// @author       byteframe
// @match        *://steamcommunity.com/broadcast/watch/76561197961017729
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// watchdog restart
function profile_debug() {
  return 'index: ' + backgrounds.index + ' | ' + game_collector.selection.join() +
    ' | ' + achievement.selection.join();
}
setTimeout(function() {
  GM_setValue('watchdog', GM_getValue('watchdog', '') + "\n" + new Date().toString());
  post_status(
    'http://steamcommunity.com/id/byteframe/inventory/#' +
    [ '570_2_9963602194','570_2_9963601440','570_2_9963598720','570_2_9963596944',
      '570_2_9963596109','570_2_9963592469','570_2_9963591696','570_2_9963590459',
      '570_2_9963589445',
    ][Math.floor(Math.random()*9)] +
    ' [b]*** ERROR: byteframe.js line: 666, char: 69 ***[/b] \n' +
    '[spoiler]' + new Date().toUTCString() + '[/spoiler]\n' +
    ' [i](a human should tell byteframe the watchdog timer was tripped, and that he restarted)[/i]\n' +
    ' [u]profile_debug:[/u] ' + profile_debug() + '\n' +
    ' http://steamcommunity.com/id/byteframe/inventory/#' +
    [ '730_2_11221969527','730_2_11122318708','730_2_11122318475',
      '730_2_11122317674','730_2_11122317280','730_2_11122316803'
    ][Math.floor(Math.random()*6)], 771450, function() {
    location.reload();
  });
}, 14400000);
unsafeWindow.getWatchdog = function() {
  console_log(GM_getValue('watchdog', 'none'));
  GM_setValue('watchdog', '');
};

// relay console messages to broadcast chat
broadcast_log = function() {
  if (BroadcastWatch.GetChat().m_ulChatID !== 0) {
    var line = '', previous = jQuery('textarea#chatmessage').val();
    for (var i = 0; i < arguments.length; i++) {
      line += arguments[i];
    }
    jQuery('textarea#chatmessage').val(line);
    BroadcastWatch.SubmitChat();
    jQuery('textarea#chatmessage').val(previous);
  }
};
var original_log = console.log;
unsafeWindow.console_log = function () {
  original_log.apply(this, arguments);
  broadcast_log(arguments[0]);
};

// get friend list+diff and append to broadcast frame
jQuery(document).ready(function() {
  request_friends_list(function() {
    check_friends_list(function(diff) {
      jQuery('div.responsive_page_template_content').append(
        '<font face="monospace" size="2">' +
      diff.split('\n').reverse().join('\n').replace(
        /\>http:\/\/steamcommunity\.com\/profiles\//g, '>') + "\n</font>");

      // start other scripts
      setTimeout(function() { start_profile_commenter(); }, 30000);
      start_activity_rater();
      start_notification_hider();
      start_randomized_profile();

      // auto change broadcast title
      request_index = -1;
      setInterval(function() {
        jQuery('#BroadcastAdminTitleInput').val(
          requests[++request_index].data.replace(
            /\n/g, ' | ').replace(/\s+/g, ' ').trim().substr(0,750));
        BroadcastWatch.UpdateBroadcast();
        if (request_index == requests.length-1) {
          request_index = -1;
        }
      }, 30000);

      // post images/videos to activity feed
      setInterval(function() {
        if (Date.now() > GM_getValue('cat_time', 0)) {
          GM_setValue('cat_time', Date.now()+16200000);
          var cat = GM_getValue('cat', 0);
          if (cat >= cats.length) {
            cat = 0;
          }
          post_status("http://steamcommunity.com/sharedfiles/filedetails/?id=" +
            cats[cat] + " http://steamcommunity.com/sharedfiles/filedetails/?id=" + cats[cat+1],
              [500580,451010,330180,253110,384740,329860,418960,474980,742980,
               677290,336380,384120,369400,686180,350610,95700,343780,706980,
               510740,565190,492270,453340,491000,645500,656970,715440,667430,
               496120,236290,328550,637880,748110][Math.floor(Math.random() * 32)]);
          GM_setValue('cat', cat+2);
        } else if (Date.now() > GM_getValue('meme_time', GM_getValue('cat_time')+10800000)) {
          GM_setValue('meme_time', GM_getValue('cat_time')+3600000);
          var meme = GM_getValue('meme', 0);
          if (meme >= memes.length) {
            meme = 0;
          }
          var joke = GM_getValue('joke', 0);
          if (joke >= jokes.length) {
            joke = 0;
          }
          edit_text(memes[meme], '', pool_elements(emojis_singular, 24));
          edit_text(memes[meme+1], '', pool_elements(emojis_singular, 24));
          post_status(
            "[b] * " + jokes[joke] + "[/b]" +
            " http://steamcommunity.com/sharedfiles/filedetails/?id=" + memes[meme] + " " +
            "[b] * " + jokes[joke+1] + "[/b]\n\n" +
            pool_elements(emoticon_static[2], 35) +
            pool_elements(emoticon_static[3], 35) +
            pool_elements(emoticon_static[4], 35) +
            pool_elements(emoticon_static[5], 35) +
            pool_elements(emoticon_static[8], 35) +
            pool_elements(emoticon_static[9], 35) + "\n\n" +
            "[b] * " + jokes[joke+2] + "[/b]" +
            " http://steamcommunity.com/sharedfiles/filedetails/?id=" + memes[meme+1] + " " +
            "[b] * " + jokes[joke+3] + "[/b]",
              [748600][Math.floor(Math.random() * 2)]);
          GM_setValue('meme', meme+2);
          GM_setValue('joke', joke+5);
        } else if (Date.now() > GM_getValue('question_time', GM_getValue('cat_time')+1800000)) {
          GM_setValue('question_time', GM_getValue('cat_time')+7200000);
          post_status(
            "http://steamcommunity.com/id/byteframe/inventory/#753_6_" +
              backgrounds.pool[Math.floor(Math.random()*backgrounds.pool.length)].id +
            "\n" + comment_messages[[22,21,20,19,18,17][Math.floor(Math.random()*6)]]() +
            "\n\nhttp://steamcommunity.com/id/byteframe/inventory/#753_6_" +
              backgrounds.pool[Math.floor(Math.random()*backgrounds.pool.length)].id,
            [716920,771320,628570,701280,99200,549280,727860,648780,664420,
             686550,][Math.floor(Math.random() * 10)]);
        }
      }, 60000);
      var video_day = new Date().getUTCDay();
      if (video_day == GM_getValue('video_day', '')) {
        return;
      }
      GM_setValue('video_day', new Date().getUTCDay());
      console_log('requesting video data...');
      videos = [];
      (function request_video_list(p = 1) {
        jQuery.get('//steamcommunity.com/my/videos/?p=' + p).fail(function() {
          setTimeout(request_video_list, 5000, p);
        }).done(function(response) {
          response = jQuery(response).find('a.profile_media_item');
          if (response.length) {
            response.each(function(i, element) {
              videos.push(element.href);
            });
            request_video_list(p+1);
          } else {

            // select the next video file and request details
            console_log('videos: ' + videos.length);
            f = videos.length-1;
            var last_video = GM_getValue('last_video', 0);
            if (last_video !== 0 && last_video != videos[0]) {
              f = videos.indexOf(last_video)-1;
            }
            request_video_details(f);
          }
          function request_video_details(f) {
            console_log('requesting file data... #' + (f+1) + "/" + videos.length);
            jQuery.get(videos[f]).fail(function() {
              setTimeout(request_video_details, 5000, f);
            }).done(function(response) {
              response = jQuery(response).find('.nonScreenshotDescription'
                )[0].innerText.split('\n')[2].slice(0, -1);

              // generate post
              var review = response;
              if (response.indexOf('steamcommunity.com') == -1) {
                response = "http://store.steampowered.com/app/323910";
              } else {
                response = response.replace('id/byteframe/recommended', 'app'
                  ).replace('steamcommunity.com', 'store.steampowered.com');
              }
              var random_heart = Math.floor(Math.random()*hearts.pool.length), text = '';
              pool_elements(emoticon_static_trade, 35, null).forEach(function(trade_pool) {
                text = text + pool_elements(trade_pool, 1) + '';
              });
              post = [ pool_elements(emoticon_static[0], 35) + "\n" +
                pool_elements(emoticon_static[1], 35) + "\n" +
                generate_greetings('|') + my_greetings[my_greetings.length-1] + " " +
                videos[f] + " " +
                generate_heart(hearts, [
                  hearts.pool[random_heart][6][0],
                  hearts.pool[random_heart][6][1],
                  " ║☻ [spoiler]$DATE[/spoiler]",
                  " ║☼ steam://broadcast/watch/76561197961017729",
                  " ║☎ " + comment_luck(),
                  " ║♫ [b]http://steamcommunity.com/id/byteframe/videos[/b]",
                  " ║♡ [u]" + review + "[/u]",
                  " ║❀ https://youtube.com/c/byteframe",
                ], random_heart) + "\n" +
                response + "\n" +
                pool_elements(emoticon_static[12], 35) + "\n" +
                text ];

              // post status update and comment
              console_log('ready: ' + response);
              console_log(post[0]);
              post_status(post[0].replace('$DATE', new Date().toUTCString()),
                game_favorite.slots[0][Math.floor(Math.random()*game_favorite.slots[0].length)],
              function(post_id) {
                GM_setValue('last_video', videos[f]);
                var hats = screenshot.slots[1].concat(
                  screenshot.slots[2]).concat(screenshot.slots[3]);
                post_comment(g_steamID,
                  "http://steamcommunity.com/sharedfiles/filedetails/?id=" +
                    screenshot.slots[0][Math.floor(Math.random()*screenshot.slots[0].length)] +
                    " http://steamcommunity.com/sharedfiles/filedetails/?id=" +
                    hats[Math.floor(Math.random() * hats.length)],
                  1, post_id);
              });
            });
          }
        });
      })();
    });
  });
});

// get/set url of last video in browser console
unsafeWindow.setLastVideo = function(value = -1) {
  GM_setValue('last_video', value);
};
unsafeWindow.getLastVideo = function(value = -1) {
  return GM_getValue('last_video', 'none');
};
unsafeWindow.setVideoDay = function(value = 0) {
  GM_setValue('video_day', value);
};
