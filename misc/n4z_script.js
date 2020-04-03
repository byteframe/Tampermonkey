// ==UserScript==
// @name         n4z.js
// @namespace    http://tampermonkey.net/
// @version      0.0003
// @description  n4z steam community edgyness sript
// @author       byteframe
// @match        http://steamcommunity.com/*/*/edit
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// allow capture of redirected url
var _orgAjax = jQuery.ajaxSettings.xhr;
jQuery.ajaxSettings.xhr = function() {
  xhr = _orgAjax();
  return xhr;
};

// gather country codes from input selector on the edit form
jQuery(document).ready(function() {
  var countries = jQuery.map(jQuery("select#country option"), function(value) {
    return value.value;
  });

  // gather and inflate official game group array into avatar pool
  console.log('requesting game avatars...');
  var avatars = [];
  jQuery.ajax({
    url: 'http://steamcommunity.com/actions/GameAvatars?l=english'
  }).done(function(data) {
    jQuery.map(jQuery(data).find('a[href$=List]'), function(value) {
      for (var j = 1; j <= value.innerHTML.slice(9, -8); j++) {
        avatars.push([value.href.slice(30, -12), j-1]);
      }
    });

    // start profile change interval
    setInterval(function() {
      change_profile();
    }, 48000);
    change_profile();
    function change_profile() {

      // pick random avatar then deduce avatar url
      console.log('total avatars: ' + avatars.length);
      var avatar = avatars[Math.floor(Math.random()*avatars.length)];
      jQuery.ajax({
        url: 'http://steamcommunity.com/ogg/' + avatar[0] + '/Avatar/List'
      }).fail(function() {
        console.log('error: request_avatar_url');
      }).done(function(data) {
        avatar[0] = xhr.responseURL.replace(
          'http://steamcommunity.com/ogg/', '').slice(0, -12);

        // post avatar change
        jQuery.ajax({
          url: avatar[0] + '/selectAvatar',
          type: "POST",
          data: {
            sessionid: g_sessionID,
            selectedAvatar: avatar[1]
          }
        }).fail(function() {
          console.log('error: post_avatar');
        }).done(function(data) {

          // select random country and post profile change
          jQuery("select#country").val(
            countries[Math.floor(Math.random()*countries.length)]);
          jQuery.ajax({
            url: jQuery("#global_actions").find(".playerAvatar")[0].href + '/edit',
            type: "POST",
            data: jQuery("#editForm").serializeArray(),
            xhrFields: { withCredentials: true }
          }).always(function(response) {
            console.log('avatar + profile changed');
          });
        });
      });
    }
  });
});