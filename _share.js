// ==UserScript==
// @name         Steam {SHARE}
// @namespace    http://tampermonkey.net/
// @version      0.0027
// @description  shared and convenience functions (unused except ready,page_scroll,check_achievements
// @author       byteframe
// @match        *://steamcommunity.com/*
// @match        *://store.steampowered.com/*
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// hide 'add showcase' in (own) profile pages
jQuery(document).ready(function() {
  jQuery('.profile_customization.none_selected').hide();
  jQuery('.profile_recentgame_header').hide();
  jQuery('.recent_games').hide();
  jQuery('.recentgame_quicklinks').parent().hide();

  // changes upload form field values
  jQuery('form[action$=ugcupload] input.inputTagsFilter[name!=tags\\[\\]]').prop('checked', true);
  jQuery('form[action$=ugcupload] input[name=consumer_app_id]').attr('type', '');
  jQuery('form[action$=ugcupload] input[name=file_type]').attr('type', '');
});

// override console logging function
unsafeWindow.console_log = console.log;

// scroll down the page
unsafeWindow.page_scroll = function(p, t) {
  window.scrollBy(0, p);
  setTimeout(page_scroll, t, p, t);
};

// get url
unsafeWindow.get_url = function() {
  return jQuery("#global_actions").find(".playerAvatar")[0].href;
};

// pad value
unsafeWindow.pad = function(i) {
  return (i < 10) ? "0" + i : "" + i;
};

// translate community id to steamid
unsafeWindow.translate_id = function(cid) {
  return '765' + (parseInt(cid) + 61197960265728);
};

// comment message selection/callback
unsafeWindow.comment_message = function(callback, type = -1, args = '') {
  if (type == -1) {
    type = Math.floor(Math.random()*comment_messages.length);
  }
  callback(comment_messages[type](args), type);
};

// get community badge id from appid
unsafeWindow.get_badge_id = function(appid) {
  return g_rgBadgeData.find(function(element) {
    return element.appid == appid;
  }).communityitemid;
};

// shuffle array/string contents
unsafeWindow.shuffle_array = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i + 1)), t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
};
String.prototype.shuffle = function () {
  var a = this.split(""), n = a.length;
  for(var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)), tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};

// retrieve data from custom requests
unsafeWindow.request_data = function(callback) {
  if (!requests.length) {
    callback();
  } else {
    request_count = 0;
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].url !== '') {
        request_count++;
        var request_func = function(i) {
          var finish_request = function(response = '') {
            if (response !== '') {
              requests[i].data = response;
            } else if (typeof requests[i].data == 'undefined') {
              requests[i].data = 'request_data_error';
            }
            request_count--;
            if (request_count === 0) {
              callback();
            }
          };
          if (typeof requests[i].method == 'undefined') {
            requests[i].method = 'GET';
          }
          GM_xmlhttpRequest({
            method: requests[i].method,
            url: requests[i].url,
            onerror: function() {
              unsafeWindow.console_log('request error: ' + i);
              finish_request();
            },
            onload: function(response) {
              var translation = '';
              try {
                translation = requests[i].translation(
                  jQuery.parseHTML(response.responseText));
              } catch (err) {
                unsafeWindow.console_log('request error: ' + i);
              }
              finish_request(translation);
            }
          });
        }(i);
      }
    }
  }
};

// gather friend data
unsafeWindow.friends = [];
unsafeWindow.request_friend_data = function(callback) {
  unsafeWindow.console_log('requesting friend data...');
  jQuery.get('//steamcommunity.com/my/friends/'
  ).fail(function() {
    setTimeout(request_friend_data, 5000);
  }).done(function(response) {
    friends = [];
    jQuery(response).find('div.friendBlock').each(function(index, item) {
      friends.push(translate_id(item.attributes['data-miniprofile'].value));
      friends.sort(function(a, b) {
        return a-b;
      });
    });
    callback();
  });
};

// gather friends list
unsafeWindow.request_friends_list = function(callback) {
  jQuery.get('//api.steampowered.com/ISteamUser/GetFriendList/v1/' +
    '?key=XXX&format=json&steamid=' + g_steamID
  ).fail(function() {
    setTimeout(request_friends_list, 5000);
  }).done(function(response) {
    friends = [];
    response.friendslist.friends.forEach(function(friend) {
      friends.push(friend.steamid);
    });
    callback();
  });
};

// gather app data
unsafeWindow.unplayed_apps = [];
unsafeWindow.request_app_data = function(callback) {
  unsafeWindow.console_log('requesting app data...');
  jQuery.get('//steamcommunity.com/my/games/?tab=all'
  ).fail(function() {
    setTimeout(request_app_data, 5000);
  }).done(function(response) {
    response = jQuery(response).find('script').last()[0].innerText;
    eval(
      response.substr(response.indexOf("var rgGames"), response.indexOf("];"))
    );
    apps = rgGames;
    apps.forEach(function(app) {
      if (typeof app.hours_forever == 'undefined') {
        unplayed_apps.push(app);
      }
    });
    callback();
  });
};

// generate sam idling batch file
unsafeWindow.print_sam_batch = function() {
  var counter = 0
    , batch = 'C:\ncd "C:\\Users\\byteframe\\Downloads\\SteamAchievementManager-7.0.25"';
  unplayed_apps.forEach(function(unplayed_app) {
    if ([280620,510540,531800,250740,520,584210,492840].indexOf(unplayed_app.appid) == -1) {
      batch += '\nREM ' + unplayed_app.name;
      batch += '\nstart SAM.Game.exe ' + unplayed_app.appid + "\ntimeout 3";
      counter++;
      if (counter == 25) {
        batch += '\ntimeout 2700';
        batch += '\ntaskkill /IM SAM.Game.exe';
        counter = 0;
      }
    }
  });
  console.log(batch);
};

// gather gift history
unsafeWindow.gift_history = [];
unsafeWindow.request_gift_history = function() {
  unsafeWindow.console_log('requesting gift history...');
  jQuery.get('//steamcommunity.com/gifts/0/history/'
  ).fail(function() {
    setTimeout(request_gift_history, 8000);
  }).done(function(response) {
    unsafeWindow.console_log('done');
    jQuery(response).each(function(index, item) {
      var date = jQuery(item).find('div.gift_item span')[0].innerText.substr(12);
      if (date.indexOf(',') == -1) {
        date += ", " + new Date().getFullYear();
      }
      gift_history.push(
        [
          jQuery(item).find('a')[0].innerText,
          jQuery(item).find('a')[0].href,
          jQuery(item).find('div.gift_item b')[0].innerText.trim(),
          date,
        ]
      );
    });
  });
};

// gather community item data and other specified inventories
inventory_loaded = false;
unsafeWindow.backgrounds = [];
unsafeWindow.cards = [];
unsafeWindow.emoticons = [];
unsafeWindow.request_item_data = function(callback, once = false) {
  function request_inventory(i = 0) {
    jQuery.ajax({
      url: '//steamcommunity.com/my/inventory/json/' +
        inventories[i].appid + '/' + inventories[i].context,
      dataType: "json"
    }).fail(function() {
      setTimeout(request_inventory, 5000, callback, i);
    }).done(function(response) {
      if (response.success) {
        inventories[i].items = jQuery.map(response.rgInventory, function(value) {
          return value;
        });
        if (inventories[i].appid == 753 && inventories[i].context == 6) {
          jQuery.map(response.rgDescriptions, function(value, index) {
            for (var j = 0; j < inventories[i].items.length; j++) {
              if (value.classid == inventories[i].items[j].classid) {
                value.id = inventories[i].items[j].id;
              }
            }
            if (value.tags[2].name == "Profile Background") {
              backgrounds.push(value);
            } else if (value.tags[2].name == "Emoticon") {
              emoticons.push(value);
            } else if (value.tags.length > 3 && value.tags[3].name == "Trading Card") {
              cards.push(value);
            }
          });
        }
      }
      if (i < inventories.length-1) {
        request_inventory(i+1);
      } else {
        inventory_loaded = true;
        callback();
      }
    });
  }
  if (once && inventory_loaded) {
    callback();
  } else {
    unsafeWindow.console_log('requesting item data...');
    if (typeof inventories == 'undefined') {
      inventories = [{ appid: 753, context: 6}];
      (function request_inventories() {
        jQuery.get('//steamcommunity.com/my/inventory/'
        ).fail(function() {
          setTimeout(request_inventories, 5000);
        }).done(function(response) {
          jQuery(response).find('a[id^=inventory_link]').each(function(i, link) {
            inventories.unshift(
              {appid: link.href.substr(link.href.indexOf('#')+1), context: 2});
          });
          request_inventory();
        });
      }());
    } else {
      inventories.push({ appid: 753, context: 6});
      request_inventory();
    }
  }
};

// post status or profile comments (inactive)
unsafeWindow.post_comment = function(steamid, text, type = 0, post_id = -1, callback = null) {
  if (type == 1) {
    type = 'UserStatusPublished';
  } else if (type == 2) {
    type = 'UserReceivedNewGame';
  } else {
    type = 'Profile';
  }
  jQuery.post('//steamcommunity.com/comment/' + type + '/post/' + steamid + '/' + post_id, {
    sessionid: g_sessionID,
    comment: text,
    count: 6,
  }).fail(function(response) {
    if (callback !== null) {
      callback(response, 1);
    }
  }).done(function(response) {
    if (callback !== null) {
      callback(response, 0);
    }
  });
};

// post status update
unsafeWindow.post_status = function (text, appid, callback = null) {
  jQuery.post(get_url() + "/ajaxpostuserstatus/", {
    sessionid: g_sessionID,
    status_text: text,
    appid: appid,
  }).fail(function(response) {
    unsafeWindow.console_log("FAIL, post_status: " + response);
    if (callback !== null) {
      callback(0);
    }
  }).done(function(response) {
    var post_id = jQuery(response.blotter_html).find(
      "div[id$=_" + g_steamID + "]").eq(0).attr('id').split('_')[1];
    unsafeWindow.console_log("posted status update: " + get_url() + "/status/" + post_id);
    if (callback !== null) {
      callback(post_id);
    }
  });
};

// voteup/votedown/favorite/unfavorite/delete a published file
unsafeWindow.file = function(publishedfileids, type = 'voteup', appid = 0) {
  if (!(publishedfileids instanceof Array)) {
    publishedfileids = [ publishedfileids ];
  }
  (function file(p = 0) {
    jQuery.post('//steamcommunity.com/sharedfiles/' + type, {
      id: publishedfileids[p],
      appid: appid,
      sessionid: g_sessionID,
      file_type: 2,
    }).fail(function() {
      unsafeWindow.console_log('ERROR, file: ' + publishedfileids[p] + "|" + type + "|" + appid);
    }).done(function(response) {
      unsafeWindow.console_log('file: https://steamcommunity.com/sharedfiles/filedetails/?id=' + publishedfileids[p] + " |" + type + "|" + appid);
      if (p != publishedfileids.length-1) {
        file(p+1);
      }
    });
  })();
};

// send random group invites when on a user's page
unsafeWindow.invite_to_groups = function(count = 1, delay = 15000, groups = []) {
  var group_invites = groups.slice();
  if (!group_invites.length) {
    (function request_group_invites() {
      jQuery.get(g_rgProfileData.url + '/ajaxgroupinvite?new_profile=1'
      ).fail(function() {
        setTimeout(request_group_invites, 5000);
      }).done(function(response) {
        jQuery(response).find('div.group_list_option').each(function(index, item) {
          group_invites.push([item.attributes['data-groupid'].value,
            jQuery(item).find('div.group_list_groupname')[0].innerText]);
        });
        shuffle_array(group_invites);
        invite_to_group();
      });
    })();
  } else {
    for (var i = 0; i < group_invites.length; i++) {
      group_invites[i] = [ group_invites[i], "null" ];
    }
    shuffle_array(group_invites);
    invite_to_group();
  }
  function invite_to_group(g = 0) {
    var type;
    jQuery.post('//steamcommunity.com/actions/GroupInvite', {
      json: 1,
      type: 'groupInvite',
      group: group_invites[g][0],
      invitee: g_rgProfileData.steamid,
      sessionID: g_sessionID,
    }).fail(function() {
      type = 'fail';
    }).done(function(response) {
      type = 'dupe';
      if (!response.duplicate) {
        type = 'good';
        count--;
      }
    }).always(function() {
      unsafeWindow.console_log(type + ": " + group_invites[g][1] + "|" + group_invites[g][0]);
      if (count > 0) {
        setTimeout(invite_to_group, delay, g+1);
      }
    });
  }
};

// write review
unsafeWindow.review_create = function(appid, text, rate = true, vis = 0, lang = 'english') {
  jQuery.post('https://store.steampowered.com/friends/recommendgame', {
    appid: appid,
    steamworksappid: appid,
    comment: text,
    rated_up: rate,
    is_public: vis,
    language: lang,
    received_compensation: 0,
    sessionid: g_sessionID,
  }).done(function(data) {
    if (!data.success) {
      unsafeWindow.console_log('error: review create');
    } else {
      unsafeWindow.console_log('review create complete');
    }
  });
};

// edit showcase reviews
unsafeWindow.edit_reviews = function(r = 0) {
  jQuery.get(get_url() + '/recommended/' + review.slots[0][r]
  ).fail(function() {
    setTimeout(edit_reviews, 5000, r);
  }).done(function(response) {
    response = jQuery(response).find('script')[4].innerHTML;
    (function post_request(review_id) {
      jQuery.post('//steamcommunity.com/userreviews/update/' + review_id, {
        received_compensation: false,
        voted_up: true,
        sessionid: g_sessionID,
        review_text: generate_links(),
      }).fail(function() {
        unsafeWindow.console_log('fail2');
        setTimeout(post_request, 5000, review_id);
      }).done(function(response) {
        unsafeWindow.console_log('review ' + review.slots[0][r] + ": " + r + '/' + review.slots[0].length);
        if (r != review.slots[0].length-1) {
          setTimeout(edit_reviews, 5000, r+1);
        }
      });
    })(response.slice(response.indexOf("'")+1, response.indexOf("',")));
  });
};

// edit published file id
unsafeWindow.edit_text = function(publishedfileid, title = null, text = null) {
  jQuery.get('//steamcommunity.com/sharedfiles/itemedittext/?id=' +
    publishedfileid
  ).done(function(response) {
    var data = jQuery(response).find("form#ItemEditText").serializeArray();
    if (title !== null) {
      data[3].value = title;
    }
    if (text !== null) {
      data[4].value = text;
    }
    jQuery.post('//steamcommunity.com/sharedfiles/itemedittext/', data
    ).fail(function(response) {
      unsafeWindow.console_log('FAIL, edit_text: ' + publishedfileid);
    });
  });
};

// edit group headline text
unsafeWindow.edit_group = function(group, headline) {
  jQuery.get('//steamcommunity.com/groups/' + group + '/edit'
  ).done(function(response) {
    var data = jQuery(response).find("form#editForm").serializeArray();
    data[3].value = headline;
    jQuery.post('//steamcommunity.com/groups/' + group + '/edit', data
    ).fail(function(response) {
      unsafeWindow.console_log('FAIL, edit_group Post: ' + group);
    });
  });
};

// add/remove item contributors
unsafeWindow.contributor = function(publishedfileids, steamids, action = 'add') {
  if (!(publishedfileids instanceof Array)) {
    publishedfileids = [ publishedfileids ];
  }
  if (!(steamids instanceof Array)) {
    steamids = [ steamids ];
  }
  (function contributors(p = 0) {
    (function contributor(s = 0) {
      jQuery.post('//steamcommunity.com/sharedfiles/' + action + 'contributor/', {
        sessionid: g_sessionID,
        steamid: steamids[s],
        id: publishedfileids[p],
      }).fail(function(response) {
        unsafeWindow.console_log('FAIL, contributor: ' +
          publishedfileids[p] + "|" + steamids[s]);
      }).done(function(response) {
        if (response.success != 1) {
          unsafeWindow.console_log('ERROR, contributor: {' + response.success + "} " +
            publishedfileids[p] + "|" + steamids[s]);
        } else {
          unsafeWindow.console_log('contributor: ' + publishedfileids[p] + "|" + steamids[s]);
        }
        if (s != steamids.length-1) {
          contributor(s+1);
        } else if (p != publishedfileids.length-1) {
          contributors(p+1);
        }
      });
    })();
  })();
};

// download images from a screenshots/images page
var download_count = 0;
unsafeWindow.get_page = function(url, p = 1) {
  jQuery.get(url.replace(/\?.*/, '') + '/?p=' + p + '&appid=0&sort=newestfirst'
  ).fail(function() {
    get_page(p);
  }).done(function(response) {
    var publishedfileids = jQuery(response).find('a[href*=filedetails]');
    if (publishedfileids.length) {
      unsafeWindow.console_log('page: ' + p);
      (function get_file(f = 0) {
        if (f == publishedfileids.length) {
          get_page(p+1);
        } else {
          jQuery.get(publishedfileids[f].href
          ).fail(function() {
            get_file(f);
          }).done(function(response) {
            var game = jQuery(response).find('div.breadcrumbs a').last()[0].href;
            if (game.indexOf('shortcutid') > -1) {
              game = "sc" + game;
            }
            game = game.replace(/http.*=/, '');
            var date = jQuery(response).find('div.detailsStatRight')[1].innerText;
            if (date.indexOf(',') == -1) {
              date = date.replace(' @', ', 2017 @');
            }
            date = new Date(date.replace(/[,@]/g,'').replace('pm', ' pm').replace(
              'am', ' am')).getTime()/1000;
            var text = jQuery(response).find('div[class$=shotDescription]');
              size = jQuery(response).find(
                'div.detailsStatRight')[2].innerText.replace(/ /g,'');
            if (text.length > 0) {
              text = '--' + text[0].innerText.slice(1,-1).replace(
                /([^a-z0-9\s ,.\(\)\[\]\{\}]+)/gi, '_');
            } else {
              text = '';
            }
            download = publishedfileids[f].href.slice(54) + '_' + game + '_' +
              date + '_' + size + text;
            unsafeWindow.console_log(download);
            download_count++;
            GM_download(jQuery(response).find("div.actualmediactn a")[0].href,
              download + ".jpg");
            setTimeout(get_file, 1000, f+1);
          });
        }
      })();
    } else {
      unsafeWindow.console_log('done: ' + download_count);
    }
  });
};

// find games with locked achievements from the all games page
unsafeWindow.check_achievements = function() {
  var array = []
    , batch = 'C:\ncd "C:\Program Files (x86)\Steam\steamapps\SteamAchievementManager-7.0.25"';
  jQuery('div.gameListRow').each(function(index, element1) {
    var name = jQuery(element1).find('div.gameListRowItemName')[0].innerText;
    jQuery(element1).find('div.recentAchievements').each(function(index, element) {
      var text = element.innerText.trim().replace(/[aA]chievements [eE]arned/, '');
      if (text !== '' && text.indexOf('0 of 0') == -1 && text.indexOf('100%') == -1) {
        var result = text + " " + name + " | " + element1.id.replace('game_', '');
        array.push([result, element1.id.replace('game_', '')]);
      }
    });
  });
  array.forEach(function(appid, index) {
    if (index !== 0 && index % 20 === 0) {
      batch += '\ntimeout /t 27000';
    }
    batch += '\nrem ' + appid[0];
    batch += '\nstart SAM.Game.exe ' + appid[1];
  });
  console.log(batch);
};

// check if any favorite games are owned
unsafeWindow.check_games = function() {
  request_app_data(() => {
    game_favorite.slots[0].forEach((game) => {
      if (apps.findIndex((app) => app.appid == game) > -1) {
        console.log(game);
      }
    });
  });
};