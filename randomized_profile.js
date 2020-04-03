// ==UserScript==
// @name         SteamCommunity/* (randomized_profile)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  alter avatar and profile contents
// @author       byteframe
// @match        *://steamcommunity.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// gather edit form, wait till next minute, then set badge style
var edit = null;
unsafeWindow.start_randomized_profile = function() {
  jQuery.get('//steamcommunity.com/my/edit').done(function(response) {
    edit = jQuery(response);
    edit.find("select#showcase_style_5").val(1);
    if (typeof countries !== "undefined" && !countries.length) {
      countries = {
        shuffle_slots: [],
        shuffle_types: [ -1 ],
        slots: [
          jQuery.map(edit.find("select#country option"), function(value) {
            if (country_blacklist.indexOf(value.value) == -1) {
              return value.value;
            }
          })
        ]
      };
    }

    // request wallet balance
    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://store.steampowered.com/account/',
      onload: function(response) {
        money1 = jQuery(response.responseText).find('.accountLabel').map(function() {
          return jQuery(this).text();
        }).get();
        money2 = jQuery(response.responseText).find('.accountData.price').map(function() {
          return jQuery(this).text();
        }).get();

        // gather and inflate official game group array into avatar pool
        if (typeof avatars == "undefined" || !avatars.pool.length) {
          unsafeWindow.console_log('requesting game avatars...');
          avatars = { index: 0, pool: [] };
          jQuery.get('//steamcommunity.com/actions/GameAvatars'
          ).done(function(data) {
            jQuery.map(jQuery(data).find('a[href$=List]'), function(value) {
              if (avatar_blacklist.indexOf(value.href.slice(30, -12)) == -1) {
                for (var j = 1; j <= value.innerHTML.slice(9, -8); j++) {
                  avatars.pool.push([value.href.slice(30, -12), j-1]);
                }
              }
            });
            request_avatar_url();
          });
        } else {
          request_avatar_url();
        }
      }
    });
  });
};

// retrieve avatar url and custom data
function request_avatar_url() {
  avatar = pool_elements(avatars, 1, null)[0];
  jQuery.get('//steamcommunity.com/ogg/' + avatar[0] + '/Avatar/List'
  ).fail(function() {
    unsafeWindow.console_log('FAIL, request_avatar_url: ' + avatar[0]);
    setTimeout(request_avatar_url, 3000);
  }).done(function(data) {
    avatar[0] = jQuery(data).find('p.returnLink a')[0].href;
    request_data(function() {

      // select new background and/or shuffle array
      background = pool_elements(backgrounds, 1, null)[0];
      edit.find("#profile_background").attr("value", background.id);

      // alter slotted showcases on the form
      function alter_showcase(showcase = '', callback = '') {
        showcase.selection = [];
        if (showcase.shuffle_slots.length) {
          var to_shuffle = [];
          showcase.shuffle_slots.forEach(function(slot) {
            to_shuffle.push([showcase.slots[slot], showcase.shuffle_types[slot]]);
          });
          shuffle_array(to_shuffle);
          showcase.shuffle_slots.forEach(function(slot, i) {
            showcase.slots[slot] = to_shuffle[i][0];
            showcase.shuffle_types[slot] = to_shuffle[i][1];
          });
        }
        showcase.slots.forEach(function(slot, i) {
          if (slot.length && typeof showcase.shuffle_types[i] !== 'undefined') {
            var element;
            if (showcase.shuffle_types[i] === 0) {
              element = slot[Math.floor(Math.random()*slot.length)];
            } else if (showcase.shuffle_types[i] < 0) {
              if (showcase.shuffle_types[i] == -1) {
                shuffle_array(slot);
              }
              element = slot[Math.abs(showcase.shuffle_types[i])-1];
              showcase.shuffle_types[i]--;
              if (Math.abs(showcase.shuffle_types[i])-1 == slot.length) {
                showcase.shuffle_types[i] = -1;
              }
            } else if (showcase.shuffle_types[i] > 0) {
              element = slot[showcase.shuffle_types[i]-1];
              showcase.shuffle_types[i]++;
              if (showcase.shuffle_types[i]-1 == slot.length) {
                showcase.shuffle_types[i] = 1;
              }
            }
            if ({}.toString.call(element) === '[object Function]') {
              element = element();
            }
            showcase.selection[i] = element;
            callback(i, element);
          }
        });
      }
      if (backgrounds.index % 19 == 0) {
        alter_showcase(persona_name, function(i, element) {
          edit.find("input[name=personaName]").attr("value", element);
        });
      }
      alter_showcase(real_name, function(i, element) {
        edit.find("input[name=real_name]").attr("value", element);
      });
      alter_showcase(summary_text, function(i, element) {
        edit.find("textarea#summary").text(element);
      });
      alter_showcase(trade_text, function(i, element) {
        edit.find("textarea#showcase_4_notes").val(element);
      });
      alter_showcase(information_text, function(i, element) {
        edit.find("#showcase_8_notes").val(element);
      });
      alter_showcase(information_title, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[8\\]\\[0\\]\\[title\\]]").attr(
          "value", element);
      });
      alter_showcase(group_primary, function(i, element) {
        edit.find("#primary_group_steamid").attr("value", element.substr(0,18));
      });
      alter_showcase(group_favorite, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[9\\]\\[0\\]\\[accountid\\]]").attr(
          "value", element.substr(0,18));
      });
      alter_showcase(game_favorite, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[6\\]\\[0\\]\\[appid\\]]").attr(
          "value", element);
      });
      alter_showcase(review, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[10\\]\\[0\\]\\[appid\\]]").attr(
          "value", element);
      });
      alter_showcase(badge_favorite, function(i, element) {
        jQuery(edit).find("#favorite_badge_communityitemid").attr(
          "value", element);
      });
      alter_showcase(badge_collector, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[5\\]\\[" + i + "\\]\\[appid\\]]").attr(
          "value", element);
      });
      alter_showcase(workshop_favorite, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[11\\]\\[0\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(workshop_collector, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[12\\]\\[" + i + "\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(guide_favorite, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[15\\]\\[0\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(guide_collector, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[16\\]\\[" + i + "\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(screenshot, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[7\\]\\[" + i + "\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(artwork, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[13\\]\\[" + i + "\\]\\[publishedfileid\\]]").attr(
          "value", element);
      });
      alter_showcase(achievement, function(i, element) {
        edit.find("input[name=rgShowcaseConfig\\[17\\]\\[" + i + "\\]\\[appid\\]]").attr(
          "value", element.substr(0, element.indexOf('_')));
        edit.find("input[name=rgShowcaseConfig\\[17\\]\\[" + i + "\\]\\[title\\]]").attr(
          "value", element.substr(element.indexOf('_')+1));
      });

      // request state/city codes for selected country
      var edit_process = {
        url: '//steamcommunity.com/actions/EditProcess?sId=' + g_steamID,
        method: 'POST',
        data: { xml: 1, type: "locationUpdate" }
      };
      alter_showcase(countries, function(i, element) {
        edit_process.data.country = element;
        edit.find("select#country").val(element);
        jQuery.ajax(edit_process).always(function(response) {
          response = jQuery(response).find('state');
          if (response.length > 1) {
            edit_process.data.state = response[Math.floor(Math.random() * (response.length-1)+1)].attributes['key'].value;
            jQuery.ajax(edit_process).always(function(response) {
              response = jQuery(response).find('city');
              if (response.length > 1) {
                edit_process.data.city = response[Math.floor(Math.random() * (response.length-1)+1)].attributes['key'].value;
              }
            });
          }
        });
      });

      // call intermediate function, then till next minute
      profile_intermediate();
      setTimeout(function() {

        // serialize form, add country/state selections and arrange showcases
        var edit_form = edit.find("#editForm").serializeArray(), j = 0, k = -1;
        edit_form.push({name: "state", value: edit_process.data.state});
        edit_form.push({name: "city", value: edit_process.data.city});
        alter_showcase(showcases, function(i, element) {
          for (; j < edit_form.length; j++) {
            if (k == i) {
              edit_form[j-1].value = element;
              break;
            }
            if (typeof edit_form[j].name !== 'undefined' &&
            edit_form[j].name == 'profile_showcase[]') {
              k++;
            }
          }
        });

        // wait then make changes that require post requests
        function SetShowcaseConfig(showcase, slot, data) {
          data.customization_type = showcase;
          data.slot = slot;
          data.sessionid = g_sessionID;
          jQuery.post(get_url() + '/ajaxsetshowcaseconfig',
            data
          ).fail(function(response) {
            unsafeWindow.console_log('ERROR SetShowcaseConfig: ' + data);
          });
        }
        alter_showcase(game_collector, function(i, element) {
          SetShowcaseConfig(2, i, { appid: element});
        });
        function SetItemShowcaseSlot(id, i, element) {
          element = element.split('_');
          SetShowcaseConfig(id, i, {
            appid: element[0],
            item_contextid: element[1],
            item_assetid: element[2]
          });
        }
        alter_showcase(trade_items, function(i, element) {
          SetItemShowcaseSlot(4, i, element);
        });
        alter_showcase(item_showcase, function(i, element) {
          SetItemShowcaseSlot(3, i, element);
        });

        // post avatar change
        (function change_avatar() {
          jQuery.post(avatar[0] + '/selectAvatar', {
            sessionid: g_sessionID,
            selectedAvatar: avatar[1]
          }).fail(function() {
            setTimeout(change_avatar, 5000);
          }).always(function(data) {

            // post modified profile form
            (function post_profile() {
              jQuery.ajax({
                url: get_url() + 'edit',
                type: "POST",
                data: edit_form,
                xhrFields: { withCredentials: true }
              }).fail(function() {
                setTimeout(post_profile, 5000);

              // reload the page when each background was used
              }).done(function(data) {
                unsafeWindow.console_log(backgrounds.index + '|' + background.market_fee_app +
                  " / " + avatar[0].slice(32) + ' #' + (avatar[1]+1));
                if (backgrounds.index == backgrounds.pool.length-1) {
                  location.reload();
                } else {
                  request_avatar_url();
                }
              });
            })();
          });
        })();
      }, (60-new Date().getSeconds())*1000);
    });
  });
}
