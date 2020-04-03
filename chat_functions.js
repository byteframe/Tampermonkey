// ==UserScript==
// @name         SteamCommunity/*chat (chat_functions)
// @namespace    http://tampermonkey.net/
// @version      0.0025
// @description  override web chat functions
// @author       byteframe
// @match        https://steamcommunity.com/*chat*
// ==/UserScript==

// retrieve and try to merge local chat history with $new_data (INACTIVE)
CWebChat.prototype.OnChatHistoryLoaded_inactive = function(Friend, ChatDialog, new_data) {
  var data = JSON.parse(localStorage.getItem(Friend.m_unAccountID)) || [],
    old_length = data.length;
  for (i = new_data.length-1, y = data.length-1; i > -1; i--, y--) {
    if (y > -1 && (new_data[i].m_strMessage === data[y].m_strMessage &&
        new_data[i].m_unAccountID == data[y].m_unAccountID)) {
      break;
    }
    data.splice(old_length, 0, new_data[i]);
  }

  // original code for message prep
  Friend.m_bChatHistoryLoaded = true;
  ChatDialog.m_elContent.html('');
  var elPhishingWarning = $J('<div/>', {'class': 'chat_message chat_message_system' });
  elPhishingWarning.append($J('<a/>', {'class': 'whiteLink', href: 'https://support.steampowered.com/kb_article.php?p_faqid=301', target: '_blank' }).text( 'Never tell your password to anyone.' ) );
  ChatDialog.m_elContent.append(elPhishingWarning);
  for (var i = 0; i < data.length; i++) {
    var Sender = this.m_rgPlayerCache[data[i].m_unAccountID];
    if (Sender) {
      var timestamp = new Date(data[i].m_tsTimestamp * 1000);
      var eChatType = CWebChat.CHATMESSAGE_TYPE_NORMAL;
      if (timestamp <= Friend.m_tsLastView)
        eChatType = CWebChat.CHATMESSAGE_TYPE_HISTORICAL;
      else if (Sender == this.m_User)
        eChatType = CWebChat.CHATMESSAGE_TYPE_SELF;

      // remember previous name and append chat (saving new data)
      var currentName = Sender.m_strName,
        oldName = (typeof data[i].original_name !== 'undefined') ? data[i].original_name : currentName;
      Sender.m_strName = oldName;
      ChatDialog.AppendChatMessage(Sender, timestamp, data[i].m_strMessage, eChatType,
        (i >= old_length) ? true : false);
      Sender.m_strName = currentName;
    }
  }
};

// save chat messages that are new to local history (INACTIVE)
CWebChatDialog.prototype.AppendChatMessage_inactive = function(Sender, timestamp, strMessage, eMessageType, store = true) {
  if (store) {
    var cid = jQuery(this.m_elDialog[0]).find('.chatdialog_header')[0].attributes['data-miniprofile'].value,
      local = JSON.parse(localStorage.getItem(cid)) || [];
    local.push({
      m_unAccountID: Sender.m_unAccountID,
      m_tsTimestamp: Date.parse(timestamp)/1000,
      m_strMessage: strMessage,
      original_name: Sender.m_strName,
    });
    localStorage.setItem(cid, JSON.stringify(local));
  }

  // original code for chat message rendering
  var elScrollContainer = this.m_elContent[0].parentNode;
  var nClientHeight = elScrollContainer.clientHeight;
  if (this.m_elContent.css('position') == 'static') {
    elScrollContainer = document.body;
    nClientHeight = $J(window).height();
  }
  var bScrolledToBottom = (elScrollContainer.scrollHeight - nClientHeight - 10 < elScrollContainer.scrollTop);
  if (!this.m_dateLastMessage || (timestamp.getYear() != this.m_dateLastMessage.getYear() ||
     timestamp.getMonth() != this.m_dateLastMessage.getMonth() ||
     timestamp.getDate() != this.m_dateLastMessage.getDate())) {
    if (this.m_dateLastMessage || eMessageType == CWebChat.CHATMESSAGE_TYPE_HISTORICAL)
      this.m_elContent.append($J('<div/>', {'class': 'chat_message_system' }).text(timestamp.toDateString()));
    this.m_dateLastMessage = timestamp;
  }
  var elChatMessage = this.RenderChatMessage(Sender, timestamp, strMessage, eMessageType);
  this.m_elContent.append(elChatMessage);
  if (bScrolledToBottom || eMessageType == CWebChat.CHATMESSAGE_TYPE_SELF || eMessageType == CWebChat.CHATMESSAGE_TYPE_LOCALECHO)
    this.ScrollToBottom();
};

// override and don't autoclear unread messages on messages from other logins
CWebChat.prototype.PollComplete = function(pollid, data) {
  if (data.pollid != this.m_pollid) {
    return;
  }
  if (data.error == 'Timeout') {
    if (data.sectimeout && data.sectimeout > CWebChat.POLL_DEFAULT_TIMEOUT)
      this.m_nSecTimeout = data.sectimeout;
    if (this.m_nSecTimeout < CWebChat.POLL_MAX_TIMEOUT)
      this.m_nSecTimeout = Math.min(this.m_nSecTimeout + CWebChat.POLL_SUCCESS_INCREMENT, CWebChat.POLL_MAX_TIMEOUT);
  } else if (data.error == 'OK') {
    var messages = data.messages || [];
    var dateBaseTime = new Date();
    var nBaseMSOffset = data.timestamp;
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var Friend = message.accountid_from ? this.m_rgPlayerCache[ message.accountid_from ] : null;
      if (message.type == 'personastate') {
        if (Friend) {
          Friend.m_ePersonaState = message.persona_state;
          Friend.OnPersonaStateChange();
          Friend.Refresh();
        }
      } else if (message.type == 'saytext' || message.type == 'my_saytext') {
        if (Friend) {
          var nMSInPast = nBaseMSOffset - message.timestamp;
          var Sender = message.type == 'saytext' ? Friend : this.m_User;
          var eChatMessageType = (message.type == 'saytext' ? CWebChat.CHATMESSAGE_TYPE_NORMAL : CWebChat.CHATMESSAGE_TYPE_SELF);
          if (this.m_rgChatDialogs[ Friend.m_unAccountID ]) {
            this.m_rgChatDialogs[ Friend.m_unAccountID ].AppendChatMessage(Sender, new Date(dateBaseTime.getTime() - nMSInPast), message.text, eChatMessageType);
          }
          if (Sender != this.m_User) {
            if (Friend != this.m_ActiveFriend || !this.m_bWindowHasFocus) {
              Friend.IncrementUnreadMessageCount();
              if (this.m_bBrowserSupportsAudio && !this.GetPref('soundmuted'))
                $J('#message_received_audio')[0].play();
              if (this.m_bBrowserSupportsNotifications && this.GetPref('notifications') && Notification.permission == 'granted') {
                var notification = new Notification('%s sent a message'.replace(/%s/, Friend.m_strName), { body: message.text, icon: Friend.GetAvatarURL( 'medium') });
                var fnOnClick = Friend.m_fnOnClick;
                notification.onclick = function() { fnOnClick(); window.focus(); };
                window.setTimeout(function() {
                  if (notification.close) {
                    notification.close();
                  }
                }, 6000);
              }
            }
            this.AddToRecentChats(Friend);
            Friend.DisplayUnreadMessageTitleNag();
          }
        }
      }
    }
    this.m_message = data.messagelast;
  } else {
    this.PollFailed();
    return;
  }
  this.SetOnline(true);
  this.m_cConsecutivePollFailures = 0;
  this.Poll();
};
