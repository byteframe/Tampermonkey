// ==UserScript==
// @name         Steam {SHARE}
// @namespace    http://tampermonkey.net/
// @version      0.0027
// @description  shared and convenience functions
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

// open websites per account
unsafeWindow.accounts = [ '',
  '76561198050000229','76561198050098959','76561198050350517','76561198050511182',
  '76561198050499943','76561198050511528','76561198050511684','76561198050661239',
  '76561198050661647','76561198050671354','76561198050662043','76561198061404072',
  '76561198061399630','76561198061336093','76561198061404400','76561198061698639',
  '76561198062221184','76561198062379337','76561198062430931','76561198063216844',
  '76561198063148102','76561198063308489','76561198063306324','76561198063678185',
  '76561198063713764','76561198064443361','76561198064478674','76561198064476618',
  '76561198066538424','76561198069749209','76561198069748891','76561198069813822',
  '76561198069817150','76561198079000256','76561198079006642','76561198079023768',
  '76561198078984631','76561198079006563','76561198079015076','76561198084874687',
  '76561198085059065','76561198085117453','76561198085907368','76561198085947774',
  '76561198085976273','76561198089357961','76561198089264685','76561198089428563',
  '76561198089458492','76561198089385379','76561198089322432','76561198089493403',
  '76561198089435643','76561198089435997','76561198089390798','76561198089481130',
  '76561198089369230','76561198089388162','76561198089439308','76561198089351359',
  '76561198089277783','76561198089462998','76561198089445073','76561198089567129',
  '76561198089673547','76561198089566153','76561198089609576','76561198089661208',
  '76561198089574220','76561198090751518','76561198090774853','76561198090633478',
  '76561198090636536','76561198090373548','76561198090570353','76561198090480159',
  '76561198090659151','76561198090526516','76561198090453789','76561198090465182',
  '76561198090462615','76561198090474128','76561198090331195','76561198090336836',
  '76561198090280476','76561198090354202','76561198090503006','76561198090449694',
  '76561198090350631','76561198090225668','76561198090225025','76561198090248093',
  '76561198090195742','76561198049139196','76561198030580645','76561197976737508',
  'bf','aw','ef','pdl',
  '76561198178392694','76561198178678206','76561198178686559','76561198178711223',
  '76561198178707578','76561198178670211','76561198178704265','76561198178670251',
  '76561198178681434','76561198178781594','76561198178780563','76561198178806497',
  '76561198178829058','76561198178894394','76561198178895902','76561198178853354',
  '76561198179473519','76561198211453228','76561198179397249','76561198211536824',
  '76561198179361029','76561198179419823','76561198179424285','76561198211557460',
  '76561198179509657','76561198211599340','76561198179500879','76561198211562428',
  '76561198211598984','76561198211563240','76561198179518505','76561198179517018',
  '76561198179555655','76561198211691280','76561198179551309','76561198179695038',
  '76561198179639682','76561198179556699','76561198179575562','76561198211741980',
  '76561198211655604','76561198179603631','76561198211670820','76561198179589975',
  '76561198211715440','76561198179618386','76561198179677447','76561198179573195',
  '76561198179635013','76561198179633358','76561198179608271','76561198179634866',
  '76561198179634913','76561198179668874','76561198211661172','76561198179596342',
  '76561198179709777','76561198211754472','76561198179733738','76561198179730218',
  '76561198179768678','76561198179803382','76561198179757550','76561198179702987',
  '76561198179697385','76561198211794508','76561198211804512','76561198179710665',
  '76561198211842796','76561198179682287','76561198211819232','76561198179762074',
  '76561198211895108','76561198179841167','76561198211850636','76561198211879112',
  '76561198179804107','76561198179842674','76561198179819838','76561198179782901',
  '76561198179863334','76561198211853304','76561198179844987','76561198179802829',
  '76561198179814253','76561198179819778','76561198179804603','76561198179854946',
  '76561198179809165','76561198211882476','76561198179780423','76561198179847314',
  '76561198179797383','76561198179809977','76561198179860286','76561198179843803',
  '197','198','199','200',
  '76561198062952487','76561198062921446','76561198063238532','76561198063202910',
  '76561198063163921','76561198063199735','76561198069688165','76561198136520887',
  '76561198136512908','76561198136563190','76561198136596351','76561198136600139',
  '76561198136609340','76561198136646501','76561198136610953','76561198136641527',
  '76561198149513344','76561198149519213','76561198152680817','76561198152652862',
  '76561198152743100','76561198152718208','76561198152762491','76561198152757797',
  '76561198152664152','76561198152660551','76561198152698207','76561198152737908',
  '76561198152739622','76561198152734693','76561198152855390','76561198152682252',
];
unsafeWindow.account = function(start, end = start, website = 'stm_com') {
  if (website == 'stm_inv') {
    website = 'http://steamcommunity.com/profiles/${account}/inventory/#753';
  } else if (website == 'stm_com') {
    website = 'http://steamcommunity.com/profiles/${account}';
  } else if (website == 'tf2b') {
    website = 'https://tf2b.com/tf2/${account}';
  } else {
    unsafeWindow.console_log('ERORR, unknown website: ' + website);
  }
  var count = 0;
  for (var i = start; i <= end; i++) {
    count++;
    setTimeout(function(i) {
      GM_openInTab(website.replace('${account}', accounts[i]));
    }, count*200, i);
  }
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
    , batch = 'D:\ncd "D:\\Software\\Windows\\SteamAchievementManager-7.0.25"';
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

// replace typed tokens with comment messages in message textareas
found = -1;
jQuery(document).keyup(function(event) {
  if (event.which == 27) {
    jQuery('textarea.commentthread_textarea, textarea#chatmessage').each(function(index, item) {
      if (found == -1) {
        var text = jQuery(item).val();
        found = text.indexOf('$|');
        if (found > -1) {
          jQuery(item).val(text + "?");
          request_data(function() {
            comment_message(function(msg) {
              found = -1;
              jQuery(item).val(text.substr(0, found)+msg);
              jQuery(item).click();
            }, parseInt(text.substr(found+2,2)), text.substr(found+4));
          });
        }
      }
    });
  }
});

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
    , batch = 'D:\ncd "D:\\Software\\Windows\\SteamAchievementManager-7.0.25"';
  jQuery('div.gameListRow').each(function(index, element1) {
    var name = jQuery(element1).find('div.gameListRowItemName')[0].innerText;
    jQuery(element1).find('div.es-achieveBar-gl').each(function(index, element) {
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

// translate text
unsafeWindow.fonts = [
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔', h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚', n: '𝑛', o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢', v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧', A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺', H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀', N: '𝑁', O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈', V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',  },
  { 0: '𝟎', 1: '𝟏', 2: '𝟐', 3: '𝟑', 4: '𝟒', 5: '𝟓', 6: '𝟔', 7: '𝟕', 8: '𝟖', 9: '𝟗', a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳', A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ', A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', H: 'H', I: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', O: 'O', P: 'P', Q: 'Q', R: 'R', S: 'S', T: 'T', U: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Z',  },
  { 0: '𝟶', 1: '𝟷', 2: '𝟸', 3: '𝟹', 4: '𝟺', 5: '𝟻', 6: '𝟼', 7: '𝟽', 8: '𝟾', 9: '𝟿', a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣', A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: 'ⲁ', b: 'ⲃ', c: 'ⲥ', d: 'ⲇ', e: 'ⲉ', f: '𝓯', g: '𝓰', h: 'ⲏ', i: 'ⲓ', j: '𝓳', k: 'ⲕ', l: '𝓵', m: 'ⲙ', n: 'ⲛ', o: 'ⲟ', p: 'ⲣ', q: '𝓺', r: 'ꞅ', s: '𝛓', t: 'ⲧ', u: '𐌵', v: '𝓿', w: 'ⲱ', x: 'ⲭ', y: 'ⲩ', z: 'ⲍ', A: 'Ⲁ', B: 'Ⲃ', C: 'Ⲥ', D: 'Ⲇ', E: 'Ⲉ', F: '𝓕', G: '𝓖', H: 'Ⲏ', I: 'Ⲓ', J: '𝓙', K: 'Ⲕ', L: '𝓛', M: 'Ⲙ', N: 'Ⲛ', O: 'Ⲟ', P: 'Ⲣ', Q: '𝓠', R: 'Ꞅ', S: 'Ϩ', T: 'Ⲧ', U: 'ⴑ', V: '𝓥', W: 'Ⲱ', X: 'Ⲭ', Y: 'Ⲩ', Z: 'Ⲍ',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷', A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉', A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼', N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉',  },
  { 0: '⓪', 1: '①', 2: '②', 3: '③', 4: '④', 5: '⑤', 6: '⑥', 7: '⑦', 8: '⑧', 9: '⑨', a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ', n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ', A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ', N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',  },
  { 0: '𝟢', 1: '𝟣', 2: '𝟤', 3: '𝟥', 4: '𝟦', 5: '𝟧', 6: '𝟨', 7: '𝟩', 8: '𝟪', 9: '𝟫', a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁', i: '𝗂', j: '𝗃', k: '𝗄', l: '𝗅', m: '𝗆', n: '𝗇', o: '𝗈', p: '𝗉', q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑', y: '𝗒', z: '𝗓', A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧', I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭', O: '𝖮', P: '𝖯', Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷', Y: '𝖸', Z: '𝖹',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻', A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',  },
  { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '𝙖', b: '𝙗', c: '𝙘', d: '𝙙', e: '𝙚', f: '𝙛', g: '𝙜', h: '𝙝', i: '𝙞', j: '𝙟', k: '𝙠', l: '𝙡', m: '𝙢', n: '𝙣', o: '𝙤', p: '𝙥', q: '𝙦', r: '𝙧', s: '𝙨', t: '𝙩', u: '𝙪', v: '𝙫', w: '𝙬', x: '𝙭', y: '𝙮', z: '𝙯', A: '𝘼', B: '𝘽', C: '𝘾', D: '𝘿', E: '𝙀', F: '𝙁', G: '𝙂', H: '𝙃', I: '𝙄', J: '𝙅', K: '𝙆', L: '𝙇', M: '𝙈', N: '𝙉', O: '𝙊', P: '𝙋', Q: '𝙌', R: '𝙍', S: '𝙎', T: '𝙏', U: '𝙐', V: '𝙑', W: '𝙒', X: '𝙓', Y: '𝙔', Z: '𝙕',  },
  { 0: '𝟬', 1: '𝟭', 2: '𝟮', 3: '𝟯', 4: '𝟰', 5: '𝟱', 6: '𝟲', 7: '𝟳', 8: '𝟴', 9: '𝟵', a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇', A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',  },
  { 0: '⓿', 1: '➊', 2: '➋', 3: '➌', 4: '➍', 5: '➎', 6: '➏', 7: '➐', 8: '➑', 9: '➒', a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖', h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝', o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤', v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩', A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗', I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩',  },
  { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'q', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ', A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'Q', R: 'ᴿ', S: 'ᔆ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',  },
];
unsafeWindow.font = function(input, f) {
  if (f == -1) {
    return input;
  }
  var output = '';
  for (var i = 0; i < input.length; i++) {
    if (fonts[f][input[i]] !== undefined) {
      output += fonts[f][input[i]];
    } else {
      output += input[i];
    }
  }
  return output;
};
