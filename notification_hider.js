// ==UserScript==
// @name         SteamCommunity/* (notification_hider)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  hide notifications from comments on an interval
// @author       byteframe
// @match        *://steamcommunity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

unsafeWindow.start_notification_hider = function(delay = 60000) {
  setInterval(function() {
    jQuery.post(get_url() + "commentnotifications", {
      sessionid: g_sessionID, action: 'markallread', });
  }, delay);
};
