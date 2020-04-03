// ==UserScript==
// @name         image_test
// @namespace    http://tampermonkey.net/
// @version      0.0022
// @description  trying to uplaod avatars
// @author       byteframe
// @match        *://steamcommunity.com/groups/primarydataloop
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==\

unsafeWindow.image = null;
unsafeWindow.data = null;
jQuery(document).ready(function() {
  var url = 'https://google.com/image.jpeg';
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    overrideMimeType: 'text/plain; charset=x-user-defined',
    responseType: "arraybuffer",
    onload: function(response) {
      image = response.response;
    }
  });
});
unsafeWindow.upload = function() {
  data = {
    MAX_FILE_SIZE: image.byteLength,
    type: 'group_avatar_image',
    gId: '103582791432273268',
    sessionid: g_sessionID,
    doSub: 1,
    json: 1,
    avatar: {
      value: new Uint8Array(image).toString(),
      options: {
        filename: 'avatar.jpg',
        contentType: 'image/jpeg'
      }
    }
  };
  jQuery.ajax({
    url: "//steamcommunity.com/actions/FileUploader",
    method: 'POST',
    dataType: 'json',
    contentType: "application/octet-stream",
    processData: false,
    data: data,
  }).always(function(response) {
    console.log(response.responseText);
  });
};