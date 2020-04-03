// ==UserScript==
// @name         SteamPowered/app/* (logo_link)
// @namespace    http://tampermonkey.net/
// @version      0.0026
// @description  include small icon and link to ogg/avatars page in store fronts
// @author       byteframe
// @match        *://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

jQuery(document).ready(function() {
  setTimeout(function() {
    var href = jQuery('a.btnv6_blue_hoverfade.btn_medium').eq(2).attr('href');
    jQuery('a.btnv6_blue_hoverfade.btn_medium').eq(2).attr('href', href.replace('app', 'games') + "/Avatar/List");
    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://steamdb.info/app/' + window.location.href.split('/')[4] + '/info/',
      onerror: function() {
        console.log('error: steamdb get');
      },
      onload: function(response) {
        var icon = '';
        jQuery(response.responseText).find('td a').each(function(index, item) {
          if (item.innerText.indexOf('_thumb') > -1) {
            icon = item.href;
            return false;
          }
        });
        jQuery('.queue_btn_ignore').append(
          '&nbsp;<div class="right" style="float:right; display: inline-block;">' +
          '<span><img width="85px" height="32px" src="' + icon + '"></span></div>');
      }
    });
  }, 1000);
});
