// ==UserScript==
// @name         SteamCommunity/* (friend_log)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  track friends list activity and store in paste.ee
// @author       byteframe
// @match        *://steamcommunity.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// set/get current friend list and pastes
unsafeWindow.setPastes = function(list_id = '', diff_id = '') {
  if (list_id.length) {
    GM_setValue('list_id', list_id);
  }
  if (diff_id.length) {
    GM_setValue('diff_id', diff_id);
  }
};
function get_paste(paste_id, callback) {
  GM_xmlhttpRequest({
    method: "GET",
    url: 'https://paste.ee/r/' + paste_id,
    onload: function(response) {
      if (response.status != 200) {
        unsafeWindow.console_log('ERROR get_paste (' + paste_id + "): " + response);
      } else {
        callback(response.responseText);
      }
    }
  });
}
function create_paste(contents, callback) {
  GM_xmlhttpRequest({
    method: "POST",
    url: 'https://api.paste.ee/v1/pastes?key=' + paste_key,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: jQuery.param(
      { "expiration": 'never', "sections": [ { "contents": contents, } ], }),
    onload: function(response) {
      response = JSON.parse(response.responseText);
      if (!response.success) {
        unsafeWindow.console_log("ERROR create_paste: " + response);
      } else {
        callback(response.id);
      }
    }
  });
}
function delete_paste(paste_id, callback = null) {
  GM_xmlhttpRequest({
    method: "DELETE",
    url: 'https://api.paste.ee/v1/pastes/' + paste_id + '?key=' + paste_key,
    onload: function(response) {
      response = JSON.parse(response.responseText);
      if (!response.success) {
        unsafeWindow.console_log("ERROR delete_paste: " + response);
      } else if (callback !== null) {
        callback();
      }
    }
  });
}
unsafeWindow.check_friends_list = function(callback) {
  get_paste(GM_getValue('list_id', '0'), function(responseText) {
    last_friends = JSON.parse(responseText);
    get_paste(GM_getValue('diff_id', '0'), function(responseText) {
      diff = responseText.replace(/\n\n/g, '\n').trim();

      // diff contents
      Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
      };
      var removed = last_friends.diff(friends);
      var added = friends.diff(last_friends);

      // retrieve player names and record activity
      function lines(action, players, callback) {
        jQuery.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/' +
          'v0002/?key=' + steam_key + '&steamids=' +
          players.join(',')
        ).done(function(response) {
          var date = new Date();
          response.response.players.forEach(function(player) {
            var line = pad(date.getMonth()+1) + "/" + pad(date.getDate()) +
              "-" + pad(date.getHours()) + ":" + pad(date.getMinutes()) +
              " (" + action + ")=" + friends.length +
              " '<a href=\"http://steamcommunity.com/profiles/" + player.steamid +
              "\">http://steamcommunity.com/profiles/" + player.steamid +
              "</a>', // " + player.personaname;
            diff += "\n" + line + "<br/>";
          });
          callback();
        });
      }
      lines('<font color="red">DEL</font>', removed, function() {
        lines('add', added, function() {

          // update pastes as needed and pass diff contents
          if (!added.concat(removed).length) {
            callback(diff);
          } else {
            create_paste(JSON.stringify(friends, null, 2), function(paste_id) {
              delete_paste(GM_getValue('list_id'), function() {
                GM_setValue('list_id', paste_id);
                create_paste(diff, function(paste_id) {
                  delete_paste(GM_getValue('diff_id'), function() {
                    GM_setValue('diff_id', paste_id);
                    callback(diff);
                  });
                });
              });
            });
          }
        });
      });
    });
  });
};
