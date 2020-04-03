// ==UserScript==
// @name         SteamCommunity/* (wishlist_redeemer)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  add/remove items from wishlist as they come on the store
// @author       byteframe
// @match        *://store.steampowered.com/news
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

const BLACKLIST_URL = 'https://paste.ee/r/brnSS';
const WISHLIST_MAX = 34666;
const WISHLIST_INTERVAL = 1;

// check for and claim new free apps and make wishlist calls
unsafeWindow.blacklist = [];
unsafeWindow.userdata = [];
unsafeWindow.applist = [];
var added = [], wishlist_index = 0, wishlist_total = -1, wishlist_count = -1;

// request blacklist
unsafeWindow.start_wishlist_redeemer = function() {
  unsafeWindow.console_log('requesting blacklist...');
  GM_xmlhttpRequest({
    method: "GET",
    url: BLACKLIST_URL,
    onerror: function() {
      unsafeWindow.console_log('FAIL: blacklist request');
      setTimeout(start_wishlist_redeemer, 20000);
    },
    onload: function(response) {
      blacklist = jQuery.map(JSON.parse(response.responseText).applist.apps, function(b) {
        return b.appid;
      });

      // interval refresh userdata and applist
      request_userdata();
      setInterval(function() { request_userdata(); }, 60000*45);
    }
  });
};
function request_userdata() {
  unsafeWindow.console_log('requesting userdata...');
  jQuery.get('http://store.steampowered.com/dynamicstore/userdata/'
  ).fail(function() {
    unsafeWindow.console_log('FAIL: userdata request');
    setTimeout(request_userdata, 20000);
  }).done(function(response) {
    userdata = response;
    if (!userdata.rgWishlist.length) {
      return unsafeWindow.console_log('ERROR, empty userdata');
    }
    userdata.rgWishlist.sort(function(a, b) { return a-b; });
    if (wishlist_total == -1) {
      wishlist_total = userdata.rgWishlist.length;
    }
    request_applist();
  });
}
function request_applist() {
  unsafeWindow.console_log('requesting applist...');
  GM_xmlhttpRequest({
    method: "GET",
    url: 'http://api.steampowered.com/ISteamApps/GetAppList/v2',
    onerror: function() {
      unsafeWindow.console_log('FAIL: applist request');
      setTimeout(request_applist, 20000);
    },
    onload: function(response) {

      // find new appids to wishlist
      var wishlist = [];
      applist = JSON.parse(response.responseText).applist;
      applist.apps.forEach(function(app) {
        if (added.indexOf(app.appid) == -1 &&
        userdata.rgWishlist.indexOf(app.appid) == -1 &&
        userdata.rgOwnedApps.indexOf(app.appid) == -1 &&
        userdata.rgOwnedPackages.indexOf(app.appid) == -1 &&
        blacklist.indexOf(app.appid) == -1) {
          wishlist.push(app);
        }
      });
      unsafeWindow.console_log('new: ' + wishlist.length + ', wislist: ' +
        userdata.rgWishlist.length + ', owned: ' + userdata.rgOwnedApps.length);

      // post wishlist requests for new appids
      if (wishlist.length) {
        check_app(wishlist, 0);
      }
    }
  });
}
function check_app(wishlist, a = 0) {
  jQuery.get('//store.steampowered.com/app/' + wishlist[a].appid
  ).fail(function() {
    unsafeWindow.console_log('FAIL: wishlist get');
    setTimeout(check_app, 5000, wishlist, a);
  }).done(function(response) {
    var price = jQuery(response).find('div.game_purchase_price')[0];
    if (typeof price != 'undefined') {
      price = price.innerText.trim();
    } else if (jQuery(response).find('div.game_area_comingsoon').length) {
      price = 'Coming Soon';
    } else {
      price = jQuery(response).find('div.btn_addtocart')[0];
      if (typeof price != 'undefined' && price.innerText.indexOf('Play') > -1) {
        price = "Free License";
      } else {
        price = 'Unknown';
      }
    }
    function list_app(type, app, error = '') {
      unsafeWindow.console_log(wishlist_total + "| " + error + type + ": " + app.name + " | https://store.steampowered.com/app/" +
        app.appid + " (" + price + ")");
    }
    if (price.indexOf('Free') != -1 || price.indexOf('Install') != -1) {
      list_app('free', wishlist[a]);

      // try to find subid from steamdb
      GM_xmlhttpRequest({
        method: "GET",
        url: 'https://steamdb.info/app/' + wishlist[a].appid + '/subs/',
        onerror: function() {
          unsafeWindow.console_log('error: steamdb get');
        },
        onload: function(response) {
          var subid = '';
          jQuery(response.responseText).find(
            'tr.package').each(function(index, item) {
            if (item.innerText.indexOf('Free') > -1) {
              subid = item.attributes['data-subid'].value;
              return false;
            }
          });
          if (subid === '') {
            unsafeWindow.console_log('error: could not find subid (' + wishlist[a].appid + ')');
            wish_app();

          // attempt add free license post
          } else {
            jQuery.post('//store.steampowered.com/checkout/addfreelicense/' + subid, {
              ajax: true, sessionid: g_sessionID,
            }).fail(function(response) {
              unsafeWindow.console_log('FAIL, addfreelicense post');
              wish_app();
            }).done(function(response) {
              if (!response.success) {
                wish_app();
              } else {
                check_app(wishlist, a+1);
              }
            });
          }
        }
      });
    } else {
      wish_app();
    }
    function wish_app(action = 'addto', app = wishlist[a]) {
      jQuery.post('//store.steampowered.com/api/' + action + 'wishlist', {
        appid: app.appid, sessionid: g_sessionID,
      }).fail(function(response) {
        unsafeWindow.console_log('FAIL!, wishlist ' + action + ' ' + app.appid);
        setTimeout(check_app, 5000, wishlist, a);
      }).done(function(response) {
        if (!response.success) {
          list_app(action, app, 'ERROR!, ');
        } else {
          list_app(action, app);
        }
        function remove_app() {
          var app_remove = applist.apps.find(function(app) {
            return app.appid == userdata.rgWishlist[wishlist_index];
          });
          wishlist_index++;
          wish_app('removefrom', app_remove);
        }
        if (action == 'addto') {
          added.push(app.appid);
          if (response.success) {
            wishlist_count++;
            if (++wishlist_total > WISHLIST_MAX) {
              return remove_app();
            }
          }
        } else {
          if (response.success) {
            wishlist_total--;
          }
          if (!response.success || wishlist_total > WISHLIST_MAX) {
            return remove_app();
          }
        }
        if (a < wishlist.length-1) {
          if (wishlist_count < 50) {
            check_app(wishlist, a+1);
          } else {
            wishlist_count = 0;
          }
        }
      });
    }
  });
}
