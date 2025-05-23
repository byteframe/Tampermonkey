// ==UserScript==
// @name         Steam {USER}
// @namespace    http://tampermonkey.net/
// @version      0.0026
// @description  user-specific definitions
// @author       byteframe
// @match        *://steamcommunity.com/*
// @match        *://store.steampowered.com/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

// find proper ogg avatar urls
var array = avatars.pool
  , found = {}
  , new_avatars = [];
find_avatar_url = (index = 0) => {
  if (index == array.length) {
    return console.log('done');
  }
  if (array[index][0] in found) {
    new_avatars.push([found[''+array[index][0]], array[index][1]]);
    console.log('found: ' + array[index][0] + "/" + array[index][1]);
    find_avatar_url(index+1);
  } else {
    jQuery.get('//steamcommunity.com/ogg/' + array[index][0] + '/Avatar/List'
    ).fail(function() {
      console.log('FAIL, request_avatar_url: ' + avatar[0]);
      setTimeout(find_avatar_url, 3000, index);
    }).done(function(data) {
      var url = '';
      try {
        url = jQuery(data).find('p.returnLink a')[0].href.substr(33);
      } catch (e) {
        console.log(e);
        return setTimeout(find_avatar_url, 3000, index);
      }
      found[''+array[index][0]] = url;
      new_avatars.push([url, array[index][1]]);
      console.log('new: ' + url + "/" + array[index][1]);
      setTimeout(find_avatar_url, 3000, index+1);
    });
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

// select element(s) from a pool object for end shuffling
unsafeWindow.pool_elements = function(pool, length = 1, join = '') {
  if (length === 0) {
    return '';
  }
  var elements = [];
  for (; length > 0; pool.index++) {
    if (pool.index == pool.pool.length) {
      pool.index = 0;
    }
    if (pool.index === 0) {
      shuffle_array(pool.pool);
    }
    elements.push(pool.pool[pool.index]);
    length--;
  }
  if (join !== null) {
    return elements.join(join);
  }
  return elements;
};

// generate review banner links
unsafeWindow.my_links = [
  '[b][url=http://steamcommunity.com/id/byteframe/allcomments][u]' + font('Comments', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/id/byteframe/myworkshopfiles/?browsefilter=myfavorites][u]' + font('Favorite', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/groups/primarydataloop#announcements/detail/1280555665818891978][u]' + font('Note', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/groups/primarydataloop/discussions/0/1290691937724869711/][u]' + font('Multimedia', 3) + '[/u][/url][/b]',
  '[b][url=https://steamcommunity.com/tradeoffer/new/?partner=752001&token=JICW9lTq][u]' + font('Trade', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/sharedfiles/filedetails/?id=937093789][u]' + font('Setup', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/groups/primarydataloop#events/1280555665818907939][u]' + font('Lounge', 3) + '[/u][/url][/b]',
  '[b][url=http://steamcommunity.com/groups/primarydataloop][u]' + font('Group', 3) + '[/u][/url][/b]',
];
unsafeWindow.generate_links = function() {
  shuffle_array(my_links);
  var links = pool_elements(emoticon_static[6], 1) + ' ' + my_links[0] + ' ' + pool_elements(emoticon_static[8], 1) + ' ' +
  my_links[1] + ' ' + pool_elements(emoticon_static[2], 1) + ' ' +
  my_links[2] + ' ' + pool_elements(emoticon_static[4], 1) + ' ' +
  my_links[3] + ' ' + pool_elements(emoticon_static[3], 1) + ' ' +
  my_links[4] + ' ' + pool_elements(emoticon_static[11], 1) + ' ' +
  my_links[5] + ' ' + pool_elements(emoticon_static[9], 1) + ' ' +
  my_links[6] + ' ' + pool_elements(emoticon_static[5], 1) + ' ' + my_links[7];
  return links.replace(/:/g, 'ː');
};

// generate heart
unsafeWindow.generate_heart = function(hearts, right, index = -1) {
  var h;
  if (index != -1) {
    h = hearts.pool[index];
  } else {
    h = pool_elements(hearts, 1, null)[0];
  }
  if (typeof right == "undefined") {
    right = h[6];
  }
  return "" +
  h[0] + h[0] + h[0] + h[0] + h[0] + h[0] + h[0] + h[0] + h[0] + right[0] + "\n" +
  h[1] + h[2] + h[2] + h[1] + h[1] + h[1] + h[2] + h[2] + h[1] + right[1] + "\n" +
  h[2] + h[3] + h[3] + h[2] + h[1] + h[2] + h[3] + h[3] + h[2] + right[2] + "\n" +
  h[2] + h[3] + h[3] + h[3] + h[2] + h[3] + h[3] + h[3] + h[2] + right[3] + "\n" +
  h[1] + h[2] + h[3] + h[3] + h[4] + h[3] + h[3] + h[2] + h[1] + right[4] + "\n" +
  h[1] + h[1] + h[2] + h[3] + h[3] + h[3] + h[2] + h[1] + h[1] + right[5] + "\n" +
  h[1] + h[1] + h[1] + h[2] + h[3] + h[2] + h[1] + h[1] + h[1] + right[6] + "\n" +
  h[5] + h[5] + h[5] + h[5] + h[2] + h[5] + h[5] + h[5] + h[5] + right[7];
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

// profile
unsafeWindow.steamid_blacklist = [ ];
unsafeWindow.avatar_blacklist = [ '227940','51100', ];
unsafeWindow.inventories = [];
unsafeWindow.countries = [];
unsafeWindow.country_blacklist = [ 'IM','CW','AQ','AD','BL','JE','BQ','SS','GG','SX','XK', ];
function finish_request_haiku(response) {
  return jQuery(response).find("strong").text().replace(
    '\n\n\n', '\n').replace('\n\n', '\n').replace('\n\n', '\n').trim();
}
function finish_request_bsdfortune(response) {
  return jQuery(response).find(".fortune p").text().replace('\n\n','').trim();
}
function finish_request_subfushion(response) {
  return jQuery(response)['9'].innerText.trim().replace(/\n\n\n\n\n\n/g, "\n\n");
}
unsafeWindow.requests = [
  { url: "http://smalltime.com/Haiku",
    translation: function(response) { return finish_request_haiku(response); }
  },
  { url: "http://bsdfortune.com/discworld.php",
    translation: function(response) { return finish_request_bsdfortune(response); }
  },
  { url: "http://www.behindthename.com/random/random.php?number=1" +
      "&gender=m&surname=&randomsurname=yes&norare=yes&nodiminutives=yes&all=no" +
      "&usage_eng=1",
    translation: function(response) {
      return jQuery(response).find(".heavyhuge").text().trim();
    }
  },
  { url: "http://dfrench.hypermart.net/cgi-bin/bashFortune/mkFortune.cgi?FORTFILE=./fortunes.txt",
    translation: function(response) {
      return jQuery(response).find("table")[0].innerText.trim();
    }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=cookie&number=1",
    translation: function(response) {
      return jQuery(response)['9'].innerText.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }
  },
  { url: "http://smalltime.com/Haiku",
    translation: function(response) { return finish_request_haiku(response); }
  },
  { url: "http://smalltime.com/Haiku",
    translation: function(response) { return finish_request_haiku(response); }
  },
  { url: "http://bsdfortune.com/xfiles.php",
    translation: function(response) { return finish_request_bsdfortune(response); }
  },
  { url: "http://bsdfortune.com/xfiles.php",
    translation: function(response) { return finish_request_bsdfortune(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=startrek&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://www.bash.org/?random",
    translation: function(response) {
      return jQuery(response).find("td")[4].innerText;
    }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=calvin&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=futurama&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=love&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=drugs&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=pets&number=2",
    translation: function(response) { return finish_request_subfushion(response); }
  },
  { url: "http://subfusion.net/cgi-bin/quote.pl?quote=zippy&number=1",
    translation: function(response) { return finish_request_subfushion(response); }
  },
];
unsafeWindow.showcases = {
  shuffle_slots: [],
  shuffle_types: [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  slots: [
     [ 4 ], // trade
    [ 13 ], // artwork
    [ 17 ], // achievement
    [ 15 ], // guide
     [ 3 ], // item
    [ 12 ], // workshops
    [ 10 ], // review
     [ 7 ], // screenshot
    [ 11 ], // workshop
     [ 5 ], // badge
     [ 8 ], // custom info
     [ 2 ], // games
     [ 9 ], // group
     [ 6 ], // game
  ],
};
unsafeWindow.ascii_face = { index: 0, pool: ['( ͠° ͟ʖ ͡°)','٩(̾●̮̮̃̾•̃̾)۶', '٩(͡๏̯͡๏)۶','[]_ ([]) []_',
 'ʕʘ̅͜ʘ̅ʔ','ʕ•ᴥ•ʔ','( ͡° ͜ʖ ͡°)','٩(- ̮̮̃-̃)۶','(♥_♥)','ˁ˚ᴥ˚ˀ','┌ಠ_ಠ)┌∩┐',
 'ô¿ô', '(◔/‿\◔)','٩(^‿^)۶','(‾⌣‾)','ˁ(OᴥO)ˀ','^ↀᴥↀ^',]};
unsafeWindow.emojis = { index: 0, pool: [
  { index: 0, pool: [ '🌂','🎈','🏓','🏀','📕','👹','💗','💄','🐠','🌸','💃','🍖','🌋','🚗', ]},
  { index: 0, pool: [ '🎄','🎍','⛳','🔋','📗','👽','💚','🐊','🐛','🌳','🥒','🥗','🕺','🚙', ]},
  { index: 0, pool: [ '🐟','🎫','🎽','👔','📘','👾','💙','💎','🐳','🍇','🍆','🍧','🌏','🚘', ]},
  { index: 0, pool: [ '⚡','🎁','📣','📀','📒','😺','💛','👑','🐝','👃','🌽','🥞','👳','🚕', ]},
]};
unsafeWindow.emojis_singular = { index: 0, pool: [
  '🌂','🎄','🐟','⚡','🎈','🎍','🎫','🎁','🏓','⛳','🎽','📣',
  '🏀','🔋','👔','📀','📕','📗','📘','📒','👹','👽','👾','😺',
  '💗','💚','💙','💛','💄','🐊','💎','👑','🐠','🐛','🐳','🐝',
  '🌸','🌳','🍇','👃','💃','🥒','🍆','🌽','🍖','🥗','🍧','🥞',
  '🌋','🕺','🌏','👳','🚗','🚙','🚘','🚕',
]};
unsafeWindow.smileys = { index: 0, pool: [
  '🤣','🙁','😫','😩','🙂','😍','😘','😗','😙','😚','🤑','🤗','🤓','🤠','🤒','🤕',
  '😶','😯','😲','😵','😱','🤤','😭','😪','😴','🙄','🤔','🤥','😬','🤐','🤧','😷',
]};
unsafeWindow.persona_name = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        var adjective = '';
        while(true) {
          adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
          adjective = 'byteframe ' + pool_elements(smileys) + " is " +
            adjective.toLowerCase() + " " + pool_elements(smileys);
          var m = encodeURIComponent(adjective).match(/%[89ABab]/g)
            , b = adjective.length + (m ? m.length : 0);
          if (b < 33) {
            return adjective;
          }
        }
      }
    ],
  ],
};
unsafeWindow.real_name = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        return "/" + pool_elements(pool_elements(emojis, 1, null)[0]) + "/ " +
        requests[2].data.replace('  ', " |" + pool_elements(pool_elements(emojis, 1, null)[0]) + "| ") +
        " [" + pool_elements(pool_elements(emojis, 1, null)[0]) + "] " +
        Math.floor(Math.random()*(35-18)+18) +
        " {" + pool_elements(pool_elements(emojis, 1, null)[0]) + "} → " +
        pool_elements(ascii_face);
      }
    ],
  ],
};
unsafeWindow.summary_text = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        function generate_friend_activity() {
          var lines = '';
          diff.split('\n').reverse().slice(0,8).forEach(function(line) {
            line = line.replace(/'\<a .*profiles\//, '[/b]| [u]').replace(
              '(add)=', " - [" + pool_elements(green_icons) + '] [b] ').replace(
              '(<font color="red">DEL</font>)=', " - [" + pool_elements(red_icons) + '] [b]').replace(
              '</a>\', \/\/ ', "[/u] | " + pool_elements(emoticon_static[1]) + " = [i]\"").replace(
              "<br/>", "\"");
            var nameLength = line.substr(line.indexOf('=')+2).length
            if (nameLength > 22) {
              line = line.slice(0, -(nameLength-22));
            }
            lines += line + "[/i]\n";
          });
          return lines;
        }
        film = films[Math.floor(Math.random()*films.length)];
        show = shows[Math.floor(Math.random()*shows.length)];
        artist = artists[Math.floor(Math.random()*artists.length)];
        money3 = (302.19-money2[0].replace(/[$,]/g, ''));
        return '[h1]' +
        pool_elements(emoticon_static[2], 3) + pool_elements(emoticon_static[3], 3) + pool_elements(emoticon_static[4], 3) +
        pool_elements(emoticon_static[5], 3) + pool_elements(emoticon_static[6], 3) + pool_elements(emoticon_static[7], 3) +
        pool_elements(emoticon_static[8], 3) + pool_elements(emoticon_static[9], 3) + pool_elements(emoticon_static[12], 1) + '\n' +
        pool_elements(emoticon_static[2], 3) + pool_elements(emoticon_static[3], 3) + pool_elements(emoticon_static[4], 3) +
        pool_elements(emoticon_static[5], 3) + pool_elements(emoticon_static[6], 3) + pool_elements(emoticon_static[7], 3) +
        pool_elements(emoticon_static[8], 3) + pool_elements(emoticon_static[9], 3) + pool_elements(emoticon_static[12], 1) + '\n' +
        pool_elements(emoticon_static[2], 3) + pool_elements(emoticon_static[3], 3) + pool_elements(emoticon_static[4], 3) +
        pool_elements(emoticon_static[5], 3) + pool_elements(emoticon_static[6], 3) + pool_elements(emoticon_static[7], 3) +
        pool_elements(emoticon_static[8], 3) + pool_elements(emoticon_static[9], 3) + pool_elements(emoticon_static[12], 1) +
        '[/h1]\n\n' +
        '[i]This profile is self aware, and shuffles itself every minute to suit your needs.[/i]\n' +
        '[i]It is operated by a team of mad scientists with an artificial-intelligence core.[/i]\n' +
        '[i]You may converse with this organism using any human/machine language.[/i]\n' +
        '[i]We are from the future, please keep secret your knowledge of our existence.[/i]\n\n' +
        '[h1]Besties:[/h1]\n' +
        ((line = '', colors = [2,3,4,5,8,9], besties = [ 'Sidekick', 'Associate', 'Companion', 'Roommate', 'Intimate']) => {
          shuffle_array(besties);
          shuffle_array(colors);
          besties.forEach(function(bestie, index) {
            line += pool_elements(emoticon_static[colors[index]]) +
              ' [url=steamcommunity.com/profiles/' + friends[Math.floor(Math.random() * friends.length)] + ']' + bestie + "[/url] "
          });
          return line + pool_elements(emoticon_static[colors[5]]) + "\n\n";
        })() +
        '[h1]Wallpaper:[/h1]\n' +
        pool_elements(emoticon_static[1]) + ' [url=http://steamdb.info/app/' + background.market_fee_app + ']' +
          background.tags[1].name + '[/url] ' + pool_elements(emoticon_static[1]) + ' [url=http://steamcommunity.com/id/byteframe/inventory/#753_6_' +
          background.id + ']' + background.market_name.replace(' (Profile Background)', '') + '[/url]\n\n' +
        '[h1]Favorites:[/h1]\n' +
        pool_elements(emoticon_static[0]) + ' [url=http://imdb.com/find?q=' + film + ']' + film + '[/url]\n' +
        pool_elements(emoticon_static[0]) + ' [url=https://themoviedb.org/search?query=' + show + ']' + show + '[/url]\n' +
        pool_elements(emoticon_static[0]) + ' [url=https://discogs.com/search/?q=' + artist + ']' + artist + '[/url]\n' +
        '\n[h1]Hyperlinks:[/h1]\n' +
        pool_elements(emoticon_static[5]) + ' [url=https://youtube.com/c/byteframe]YouTube[/url]' +
          pool_elements(emoticon_static[10]) + ' [url=https://twitch.tv/byteframe]TwitchTV[/url]' +
          pool_elements(emoticon_static[3]) + ' [url=https://twitter.com/byteframe]Twitter[/url]' +
          pool_elements(emoticon_static[8]) + ' [url=https://discord.com/byteframe#0942]Discord[/url]\n' +
          pool_elements(emoticon_static[8]) + ' [url=https://steamladder.com/profile/76561197961017729]SteamLadder[/url]' +
          pool_elements(emoticon_static[8]) + ' [url=https://github.com/byteframe]GitHub[/url]' +
          pool_elements(emoticon_static[4]) + ' [url=https://www.reddit.com/user/byteframe]Reddit[/url]\n\n' +
        '[h1]Friend Activity:[/h1]\n' +
        generate_friend_activity() + "\n" +
        '[h1]Financial Data:[/h1]\n' +
        ':SweezyPapers: ║ [i]' + money1[0] + "[/i] [b](" + money2[0] + ")[/b]\n" +
        pool_elements(emoticon_static[12]) + ' ║ [i]Store Purchases:[/i]' + " [b]($" + (1386.22+money3).toFixed(2) + ")[/b]\n" +
        pool_elements(emoticon_static[12]) + ' ║ [i]Gift Purchases:[/i]' + " [b]($328.41)[/b]" + "\n" +
        pool_elements(emoticon_static[12]) + ' ║ [i]In-Game Purchases:[/i]' + " [b]($293.80)[/b]" + "\n" +
        '[u]' + pool_elements(emoticon_static[12]) + ' ║ [i]Market Transactions:[/i]' + " [b]($3,502.09)[/b][/u]" + "\n" +
        pool_elements(emoticon_static[12]) + ' ║ Total Spent:' + " [b]($" + (5510.52+money3).toFixed(2) + ")[/b]";
      }
    ],
  ],
};
green_icons = { index: 0, pool: [
  ':alliedstar:',':em03:',':melon:',':GreenSphere:',':weed:',':clover:',
  ':neutralgear:',':TrollGerka:',':alkat:',':wazapple:',':greenlightorb:',
  ':GreenCube:',':PlanetYelaxot:',':zzacid:',':ZE3_Escape:',':g_heart:'
]};
red_icons = { index: 0, pool: [
  ':gore:',':ZE3_GameOver:',':bloodsplat:',':zzenergy:',':LightRedCube:',
  ':redlightorb:',':redrose:',':Angrygerka:',':bloodgear:',':em05:',
]};
unsafeWindow.badge_favorite = {
  shuffle_slots: [],
  shuffle_types: [ -1 ],
  slots: [
    [ 
      3903567090, // 318530, // wingsofvi
      3903409368, // 207370, // exceed
      3897132956, // 262150, // vanguard
      1080140943, //  46500, // syberia
        20239993, //   3830, // psychonauts
      4081378630, // 481600, // bebe
      3883660370, // 278460, // skyborn
      4018084850, // 576440, // professional
      4018105362, // 558610, // manhunter
      1564921930, // 283180, // samaritan
      1221922657, // 278530, // 3stars
      3743638544, // 425210, // shadwen
       581103425, // 107200, // spacepirates
      3864843445, // 291130, // akane >>>>>>>>
       581101925, // 113020, // monoko ^^^^^^^^
      4027412263, // 571910, // nightmare
      4018152465, // 414070, // shutupanddig
      4018069793, // 555940, // fairyland
      4027327538, // 448780, // sixtiethkilometer
       693204231, // 241320, // ittledew
      3903260384, // 364350, // apotheosisproject
      4018021724, // 581280, // Animeoihistory
      3897054522, // 385360, // supertrenchattack 2
      4018089546, // 568890, // lastchancenewschool
      3903264153, // 337630, // bermuda
      3798399302, // 423770, // ourlovewillgrow
      3864850796, // 336380, // catmouthisland
      3864895212, // 340800, // unhack
      3888877987, // 251870, // gogonippon
      3778669576, // 314200, // bionicheart1
      3903359505, // 565720, // prettygirlspanic
    ],
  ],
};
unsafeWindow.badge_collector = {
  shuffle_slots: [ 1, 2, 3, 4, 5 ],
  shuffle_types: [ 1, 1, 1, 1, 1, 1 ],
  slots: [
    [ 291030, 305490, 472870 ], // blonde
    [ 546080, 398150, 410890 ], // green
    [ 342380, 383080, 310360 ], // brown
    [ 277470, 555430, 526490 ], // blue
    [ 265870, 520520, 540610 ], // red
    [   3820, 533820, 575550 ], // black
  ],
};
unsafeWindow.my_greetings = [
  '[url=http://steamcommunity.com/id/byteframe?l=english]Hello![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=schinese]你好![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=polish]Witaj![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=spanish]¡Hola![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=thai]สวัสดี![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=ukrainian]Привіт![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=russian]Здравствуй![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=korean]안녕하세요![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=german]Hallo![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=japanese]こんにちは![/url]',
  '[url=http://steamcommunity.com/id/byteframe?l=brazilian]Olá![/url]',
];
unsafeWindow.generate_greetings = function(delimiter = "/") {
  shuffle_array(my_greetings);
  var greeting = my_greetings[0] + ' [b]' + delimiter + '[/b] ';
  for (var i = 1; i < my_greetings.length-1; i++) {
    greeting = greeting + my_greetings[i] + ' [b]' + delimiter + '[/b] ';
  }
  return greeting;
};
unsafeWindow.trade_text = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        var text = ' ';
        pool_elements(emoticon_static_trade, 33, null).forEach(function(trade_pool) {
          text = text + pool_elements(trade_pool, 1) + '';
        });
        return text + '\n\n' + generate_greetings() +
          my_greetings[my_greetings.length-1];
      }
    ],
  ],
};
unsafeWindow.trade_items = {
  shuffle_slots: [ 0, 1, 2, 3, 4, 5 ],
  shuffle_types: [ 1, 1, 1, 1, 1, 1 ],
  slots: [
    [ '570_2_9963601440','753_6_1221896485','753_6_1079871296','730_2_11221969527',
      '753_6_5181306534','753_6_5905349580',
    ],
    [ '570_2_9963591696','753_6_3756024704','753_6_3879488889','730_2_11122318708',
      '753_6_5647983979','753_6_5906116106',
    ],
    [ '570_2_9963592469','753_6_3799863344','753_6_4816873821','730_2_11122318475',
      '753_6_3876786892','753_6_3904622686',
    ],
    [ '570_2_9963590459','753_6_3912087760','753_6_4081263603','730_2_11122317674',
      '753_6_5207900423','753_6_3859561925',
    ],
    [ '570_2_9963602194','753_6_3757818127','753_6_3915708018','730_2_11122317280',
      '753_6_3904251338','753_6_6136497787',
    ],
    [ '570_2_9963596109','753_6_3882467481','753_6_3909222572','730_2_11122316803',
      '753_6_5646792819','753_6_3905920234',
    ],
  ],
};
unsafeWindow.item_showcase = {
  shuffle_slots: [                                        ],
  shuffle_types: [ -1, -1, -1, -1, -1, -1,  1,  1,  1,  1 ],
  slots: [
    [ '753_6_3942345359','753_6_3723921808','753_6_3905736607','753_6_3932451777',
      '753_6_3908259220','753_6_3668349261','753_6_3726628719','753_6_694303945',
      '753_6_619728096','753_6_3940621362','753_6_3905427962','753_6_3864488325',
      '753_6_4990893681','753_6_3959895060','753_6_3743638546','753_6_3568911651',
      '753_6_3511119893','753_6_3867165965','753_6_3942161753','753_6_3779745544',
      '753_6_5026700987','753_6_3629326162','753_6_4669417187','753_6_3945508263',
      '753_6_3907511948','753_6_3900854520','753_6_3889846198','753_6_3663543079',
      '753_6_3933953698','753_6_5228520590','753_6_4529224882','753_6_3950032125',
      '753_6_4418554122','753_6_3771795487','753_6_3448503039','753_6_725080295',
      '753_6_3684440407','753_6_3778651834','753_6_3719640265', ], // BLONDE
    [ '753_6_5233322580','753_6_3946265734','753_6_3897093841','753_6_5086727733',
      '753_6_2760526052','753_6_3978490436','753_6_3706142320','753_6_3880499025',
      '753_6_5200908031','753_6_3865699933','753_6_4036107103','753_6_4006690584',
      '753_6_3874282903','753_6_3904344542','753_6_5233007370','753_6_3798540694',
      '753_6_3947431516','753_6_725079443','753_6_711660675','753_6_3484215416',
      '753_6_3950706444','753_6_5195674456','753_6_3903563473','753_6_3929392973',
      '753_6_3804696741', ], // PURPLE
    [ '753_6_2961954888','753_6_5009205182','753_6_4579689277','753_6_3909902638',
      '753_6_3963990833','753_6_3048931676','753_6_3361710397','753_6_694258148',
      '753_6_3905680696','753_6_5220513828','753_6_3841068121','753_6_3654304951',
      '753_6_3922382885','753_6_3918029452','753_6_3934161225','753_6_3945508265',
      '753_6_3946978043','753_6_3968991595','753_6_3752918249','753_6_3970566141',
      '753_6_3636905181','753_6_3839507233','753_6_4983378360','753_6_5172590087',
      '753_6_5084686843','753_6_3878978881','753_6_3963375548','753_6_5208154272', ], // GREEN
    [ '753_6_3932957780','753_6_3968454142','753_6_3934765701','753_6_3864854002',
      '753_6_3960131926','753_6_5171959701','753_6_3799230690','753_6_3888913263',
      '753_6_5094982811','753_6_725078702','753_6_694303665','753_6_5004361525',
      '753_6_5225217246','753_6_3918006706','753_6_4954329535','753_6_3633114701',
      '753_6_3888170810','753_6_3901290048','753_6_3905063259','753_6_3833691470',
      '753_6_3820553394','753_6_4719350433','753_6_3941452741','753_6_3911997948',
      '753_6_3864550472','753_6_5172340972','753_6_1078491587','753_6_3885708466',
      '753_6_3943683289','753_6_3362746910','753_6_3915618286','753_6_990833869',
      '753_6_3466143111','753_6_3904856646','753_6_3805617998','753_6_4902393563',
      '753_6_3216889825', ], // PINK
    [ '753_6_3612165312','753_6_3877012601','753_6_3904901886','753_6_3933580586',
      '753_6_3918331694','753_6_3963375546','753_6_5107423108','753_6_3714549837',
      '753_6_3864867690','753_6_3943038924','753_6_5057835116','753_6_3903855767',
      '753_6_1497921408','753_6_3854790497','753_6_3820790448','753_6_5227254485',
      '753_6_3956808584','753_6_5234353176','753_6_1015715033','753_6_3950439347',
      '753_6_3903359507','753_6_3975060876','753_6_3656554658','753_6_3901271260',
      '753_6_4018091865','753_6_3014818010','753_6_449995362','753_6_3922904852',
      '753_6_3888909078','753_6_3888906739', ], // BLUE
    [ '753_6_692381668','753_6_3924463441','753_6_3876118627','753_6_3741398949',
      '753_6_3337057274','753_6_3798494347','753_6_3834966570','753_6_3929901976',
      '753_6_3798062542','753_6_3874989247','753_6_3922403933','753_6_3912215523',
      '753_6_4036107197','753_6_3747253803','753_6_3946300926','753_6_3924825660',
      '753_6_3901277056','753_6_5238848191','753_6_3772049407','753_6_3868117879',
      '753_6_2898257245','753_6_3586240350','753_6_3847918888','753_6_3655968689',
      '753_6_3443410429','753_6_3693700210','753_6_3935272317','753_6_945373485',
      '753_6_3864945373','753_6_2975399793','753_6_3712495436','753_6_3951311169',
      '753_6_4958197425','753_6_3663894275','753_6_3964190241','753_6_4537538730',
      '753_6_3002113948','753_6_3727168278','753_6_3745889923','753_6_3897298294',
      '753_6_3811187685','753_6_3908144705','753_6_3853608303','753_6_3864854029',
      '753_6_3166503648','753_6_3883642718','753_6_3901174615', ], // RED
    [ '753_6_3935570199','753_6_4979300586','753_6_3740807529','753_6_3682857468',
      '753_6_5037468158','753_6_4183659231','753_6_5051747583','753_6_4911134370',
      '753_6_4105204705','753_6_4980136906','753_6_3908288742','753_6_5062243441',
      '753_6_3788231271','753_6_3778669604','753_6_4672474391','753_6_3213178912',
      '753_6_5053767284','753_6_3948549454', ], // BG1
    [ '753_6_4989818547','753_6_4906192664','753_6_1221927802','753_6_3972333165',
      '753_6_4961332747','753_6_5063717406','753_6_4843893542','753_6_4954174471',
      '753_6_3897119382','753_6_4184065904','753_6_3276636756','753_6_5063345354',
      '753_6_4785833510','753_6_3778651833','753_6_5042098743','753_6_5037879879',
      '753_6_4693895202','753_6_3891105139', ], // BG2
    [ '753_6_4853656868','753_6_5068983252','753_6_3953315449','753_6_5358778910',
      '753_6_5000252237','753_6_4793114353','753_6_5045044706','753_6_4924996672',
      '753_6_5033523794','753_6_5052652541','753_6_4879690891','753_6_5070169469',
      '753_6_3864876895','753_6_4766922455','753_6_4713051942','753_6_5004540363',
      '753_6_5046960113','753_6_5042009560', ], // BG3
    [ '753_6_3948368633','753_6_5228426952','753_6_5041447847','753_6_5381640071',
      '753_6_4995202851','753_6_5003199094','753_6_4034911919','753_6_4838084625',
      '753_6_4923600225','753_6_4092024974','753_6_4906148331','753_6_5080902380',
      '753_6_5042183257','753_6_3740976123','753_6_5046031734','753_6_5060734035',
      '753_6_5239431049','753_6_4867834234', ], // BG4
  ],
};
unsafeWindow.screenshot = {
  shuffle_slots: [      1,  2,  3 ],
  shuffle_types: [ -1, -1, -1, -1 ],
  slots: [
    [ 1252820631,1254088226,1225522826,1225325342,1225325731,1225325800,
      1254838645,1225326202,1254838713,1225326360,1225326855,1225326958,
      1323845076,1225330043,1225330123,1225335467,1225335545,1225335628,
      1225335741,1254838787,1225336443,937100380, ],
    [ 1225273163,1225273092,1225273011,1254834754,1225270661,1225270570,
      1225270517,1225270099,1225270043,1225269969,1225262208,1225262120,
      1225262033,1225261191,1254834708,1225258340,1225256695,1225250044,
      1225237405,1225237114,1225236926, ],
    [ 1225276364,1225276454,1225276940,1254088303,1225282344,1225282452,
      1225282562,1225282638,1254835478,1254835557,1225283209,1225283310,
      1225283415,1225283497,1321431196,1225283686,1225285080,1225290732,
      1225290806,1225290887,1225290909, ],
    [ 1295644093,1254835821,1225295787,1225295862,1225296171,1225296255,
      1225296336,1225296391,1225296567,1225296645,1225297669,1225297748,
      1225297898,1225303216,1225303297,1225303376,1225303450,1225303518,
      1225303595,1225303685,1225303756, ],
  ],
};
unsafeWindow.artwork = {
  shuffle_slots: [      1,  2,  3 ],
  shuffle_types: [ -1, -1, -1, -1 ],
  slots: [
    [ 1282752545,923767620,923768589,923770077,923775011,923779214,923793573,
      923842237,923842493,1276624475,923842674,923842764,923872988,923842970,
      923880913,923879799,923843278,923877870,1282752592,923843567,923843656,
      1282687584,1282687657,1282687799,1282687849,1282687956 ],
    [ 923975223,923742871,923743039,923743209,923743572,923743827,923744043,
      923744320,923744441,923744611,923745136,923745652,923745827,923745955,
      923746088,923746245,923763462,923746566,923746704,923746820,923747257, ],
    [ 923702274,923702408,923702543,923704598,923704880,923705068,923705305,
      923705457,923705942,923706059,923706292,923706534,923707005,923707123,
      923707558,923707844,923707978,923708599,923708822,923708991,923709179, ],
    [ 923650498,923652778,923653429,923655804,923656024,923656975,923657277,
      923657505,923657677,923658425,923674847,923675097,923675259,923676270,
      923676432,923676592,923676782,923677507,923678024,923678201,923678318, ],
  ],
};
unsafeWindow.review = {
  shuffle_slots: [],
  shuffle_types: [ 1 ],
  slots: [
    [ 575550, // hellgirls
      610750, // games/girls
      575620, // sayaka
      535150, // busted
      542260, // herbalist
      291030, // alwaysremember
      416130, // writteninthesky
      423880, // carpediem
      420880, // imustkill
      510660, // bigbangempire
      348620, // voicesfromthesea
      445230, // lostgirls
      349720, // audition
      300970, // fiesta
      557880, // saygoodbye
      354290, // lovebeat
      603880, // soundsofherlove
      345650, // withoutwithin
      509800, // thelastweekend
      395140, // Miracle_Fly
      369400, // Let_the_Cat_in
      368370, // Her_Story
      466170, // Idling_to_Rule_the_Gods
      776340, // Gay_World
      360650, // 12_Labours_of_Hercules_III_Girl_Power
      643870, // Kitten_Adventures_in_City_Park
      625400, // Sisters_in_hotel
      581130, // Metal_Waltz_Anime_tank_girls
      351790, // Invisible_Apartment
      328100, // Gunspell__Steam_Edition
      378830, // The_Princess_Heart
      340800, // Unhack
      598820, // Aloha_Paradise_Hotel
      771450, // ERROR_Human_Not_Found
      768840, // FIRST_STEAM_GAME_VHS__COLOR_RETRO_RACER__MILES_CHALLENGE
      718940, // Prey_with_Gun
      575510, // Sakura_Agent
      531190, // HEBEREKE_March_Red_Army_Girls_Brigade
    ],
  ],
};
unsafeWindow.achievement =  {
  shuffle_slots: [ 0, 1, 2,    4, 5, 6 ],
  shuffle_types: [ 1, 1, 1, 1, 1, 1, 1 ],
  slots: [
   // everlastings alwaywsremeb bionic_heart1 bionic_heart2 tlastweekend mysticdestin
   // deliciouspgs metalslugdef gogonipponmtj lostgirldiary banzai_pecan crush__crush
   // 100orangejui 99___spirits fairebloomfre jigokukisetsu legenddarkwi samsaandthek
   // ____________ lorentheamaz planetstrongh rustRuneoEcho questforinmy pixelpuzzleA
   // pixelpuzzleU metroconflic emm/rsof/otom duplicityofli sk/d/e/ei/mm winter/catla
   // in/gg/hl/sp3 o/o/a/l/s/jgYYY 0AND3YYYsv/gw/he/bh__ spacechan/sou nar12/blrose wis/omd/hell
    [ '331470_1_4','291030_1_7','314200_1_23','317290_1_22','509800_1_8','431510_1_0',
      '540610_1_8','356310_2_24','251870_3_19','445230_3_8','341440_1_1','459820_1_19',
      '282800_1_12','258090_2_2','214590_1_7','368950_2_3','420770_2_15','371320_2_15',
                    '257970_2_1','291050_1_3','36630_1_17','264560_2_25','350810_1_23',
      '351030_40_5','356640_2_6','588010_1_1','335690_2_2','284930_2_14','253110_1_20',
      '391660_1_9','448750_1_7','286360_1_17','71260_1_10','264380_1_3','416130_1_1',
    ],
    [ '331470_1_3','291030_1_6','314200_1_22','317290_1_20','509800_1_6','431510_1_18',
      '540610_1_3','356310_2_23','251870_3_18','445230_3_6','341440_1_11','459820_1_18',
      '282800_262_31','258090_2_4','214590_2_12','368950_2_2','420770_2_18','371320_2_18',
                    '257970_1_9','291050_1_2','36630_1_16','264560_2_19','350810_1_26',
      '351030_40_8','356640_1_24','588010_1_0','335690_2_0','284930_2_10','72900_3_27',
      '610750_1_2','457330_12_16','286360_1_16','71260_1_2','264380_1_0','575550_11_23',
    ],
    [ '331470_1_5','291030_1_5','314200_1_18','317290_1_19','509800_1_4','431510_1_16',
      '540610_1_2','356310_2_26','251870_3_10','445230_3_3','341440_1_12','459820_1_17',
      '282800_308_14','258090_1_21','214590_2_13','368950_2_1','420770_2_20','371320_2_16',
                    '257970_1_5','291050_1_5','36630_1_10','264560_2_12','350810_1_21',
      '351030_40_2','356640_2_4','307190_1_5','335690_1_26','248800_1_9','72900_3_30',
      '305490_1_15','291130_1_6','259640_1_17','71260_1_6','362660_1_4','575550_11_29',
    ],
    [ '386360_5_30','291030_1_4','314200_1_1','317290_1_6','509800_1_7','431510_1_15',
      '540610_1_11','356310_2_19','251870_1_3','445230_3_9','341440_1_5','459820_1_23',
      '282800_262_29','258090_2_8','214590_2_3','368950_1_3','420770_2_2','371320_2_17',
                    '257970_2_6','291050_1_9','485800_1_1','264560_2_0','350810_1_7',
      '351030_38_30','356640_1_20','429940_1_5','335690_1_2','521200_1_29','253110_1_10',
      '610750_1_1','291130_2_5','367120_1_22','247140_1_5','264380_1_4','365070_1_3',
    ],
    [ '331470_1_6','291030_1_3','314200_1_15','317290_1_12','509800_1_3','431510_1_7',
      '540610_1_7','356310_2_18','251870_3_11','445230_3_2','341440_1_7','459820_1_16',
      '282800_308_5','258090_2_1','214590_2_14','368950_1_31','420770_2_13','371320_2_11',
                    '257970_1_6','291050_1_4','585990_1_10','264560_2_23','350810_1_12',
      '351030_40_4','356640_1_18','429940_1_7','335690_1_16','248800_1_2','253110_1_16',
      '429470_1_6','57740_30_27','302950_1_2','71260_1_5','362660_1_20','575550_11_14',
    ],
    [ '331470_1_2','291030_1_1','314200_1_12','317290_1_8','509800_1_2','431510_1_11',
      '540610_1_6','356310_2_7','251870_1_31','445230_3_1','341440_1_4','459820_1_1',
      '282800_262_8','258090_1_24','214590_2_6','368950_1_27','420770_2_16','371320_2_14',
                    '257970_2_0','291050_1_1','585990_1_6','264560_2_21','350810_1_10',
      '351030_38_28','356640_1_23','307190_1_3','335690_1_8','472680_2_0','253110_1_11',
      '439250_1_3','367120_1_0','305490_1_14','71260_1_11','362660_1_10','365070_1_9',
    ],
    [ '331470_1_1','291030_1_0','314200_1_7','317290_1_3','509800_1_1','431510_1_1',
      '540610_1_4','356310_2_22','251870_1_11','445230_3_5','341440_1_3','459820_1_5',
      '282800_1_29','258090_1_25','214590_2_5','368950_1_22','420770_2_19','371320_2_10',
                    '257970_1_7','291050_1_0','585990_1_11','264560_2_22','350810_1_13',
      '351030_38_25','356640_1_19','588010_1_2','335690_1_12','485390_1_7','72900_3_29',
      '446640_1_4','231910_1_5','317920_1_17','71260_1_9','362660_1_1','365070_1_8',
    ],
  ],
};
unsafeWindow.information_title = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        return "Earth Time " + pool_elements(pool_elements(emojis, 1, null)[0]) + ' ' + 
          new Date().toUTCString().replace('GMT','').replace(',','').replace(
            '2017', '2017 ' + pool_elements(pool_elements(emojis, 1, null)[0])) + 
          pool_elements(pool_elements(emojis, 1, null)[0]) + ' {' +
          pool_elements(ascii, 2) + '} ' + pool_elements(pool_elements(emojis, 1, null)[0]) +
          " " + [ 'ᶫᵒᵛᵉᵧₒᵤ', 'ᶠᵘᶜᵏᵧₒᵤ'][Math.floor(Math.random()*2)];
      }
    ],
  ],
};
unsafeWindow.information_text = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [
    [ function() {
        var my_informations = [
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Profile[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[b]Forgive all my clickbait.[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]I have no real personality.[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Talk[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]I am your chat dumpster.[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]Please verbally abuse me![/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Friend[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]Managed by computer code.[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]I have no control...[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Likes[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]Fast-Food, SteamVR, Linux,[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]you, your house pets.[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Specs[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]4690k,1070gtx,16c8,z97itx,[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]500m, 2q08,st50fp,Vive[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Gifts[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]I might assail you with gifts.[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]Accept, then insult me.[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Fears[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]Guillotines, screaming, tofu[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]hyper-intelligent lefties[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Rank[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]Silver 1. I fall in love with [/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]purple, and then we lose.[/i]',
          ' ♡║ ' + pool_elements(pool_elements(emojis, 1, null)[0]) + '[u]Robot[/u]' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [b]I am a machine.[/b] ' + pool_elements(pool_elements(emojis, 1, null)[0]) + ' [i]I auto-rate anything you upload.[/i]',
        ];
        shuffle_array(my_informations);
        pool_elements(pool_elements(emojis, 1, null)[0]);
        var mandela = pool_elements(mandelas).trim().split('\n');
        for (var i = 0; i < my_informations.length; i++) {
          mandela[i] += my_informations[i];
        }
        return mandela.join("\n");
      }
    ],
  ],
};
unsafeWindow.workshop_favorite = {
  shuffle_slots: [],
  shuffle_types: [ -1 ],
  slots: [
    [ 1166113861,1166113842,1166113821,1166113812,1166113799,1166113789,
      1166113774,1166113729,1166113706,1166113014,1166112994,1166112983,
      1166112888,1166112867,1166112845,1166112829,1166112809,1166112797,
      1166112778,1166112760,1166112749,1166112724,1166112707,1166112697,
      1166111105,1166111087,1166111073,1166111054,1166111038,1166111017,
      1166110995,1166110987,1166110965,1166110940,1166110905,1166110871,
      1166110837,1166110804,1166110767,1166110739,1166110707,1166110672,
      1166110554,1166110482,1166110453,1166110435,1166110406,1166110374,
      1166110311,1166109832,1166109786,1166109739,1166109692,1166109646,
      1166109614,1166109571,1166109534,1166109481,1166109265,1166108984,
      1166108928,1166108890,1166108848,1166108748,1166108698,1166108633,
      1166108606,1166108535,1166108344,
    ],
  ],
};
unsafeWindow.workshop_collector = {
  shuffle_slots: [  0,  1,  2,  3 ],
  shuffle_types: [ -1, -1, -1, -1 ],
  slots: [
    [ 1165867291,1165867062,1165864414,1165864261,1165861626,1165861362,
      1165859176,1165858932,1165858615,1165856115,1165855282,1165854794,
      1165854331,1165853479,1165853064,1165852474,1165852098, ],
    [ 1165867224,1165867011,1165864372,1165864216,1165861564,1165861321,
      1165859107,1165858863,1165858554,1165856016,1165855229,1165854705,
      1165854224,1165853396,1165853001,1165852360,1165852015, ],
    [ 1165867156,1165866967,1165864341,1165864176,1165861501,1165861242,
      1165859037,1165858746,1165858501,1165855948,1165855106,1165854609,
      1165853912,1165853318,1165852741,1165852259,1165851921, ],
    [ 1165867107,1165866920,1165864304,1165864139,1165861453,1165861183,
      1165858996,1165858699,1165858463,1165855905,1165855020,1165854520,
      1165853791,1165853268,1165852649,1165852178,1165850830, ],
  ],
};
unsafeWindow.game_favorite = {
  shuffle_slots: [],
  shuffle_types: [ -1 ],
  slots: [
    [ 582450, // hackTheFbi
      666940, // Welcome_Back_To_2007/
      799080, // 5_Star_Hawaii_Resort__Your_Resort/
      687920, // Tropical_Liquor/
      802760, // Mariko_Hot_Nightlife/
      423740, // saveYourMother
      512060, // Stay_Stay_Democratic_Peoples_Republic_of_Korea/
      465510, // Sinful_Eden/
      407320, // My_Little_Kitties/
      745220, // There_Is_A_Genie_In_My_Szechuan_Sauce/
      586080, // Age_of_Heroes_VR/
      766940, // Snares_of_Ruin/
      498300, // Of_Love_And_Sorrow/
      752830, // Choice_of_the_Rock_Star/
      459640, // You_and_who_else/
      779420, // WarGames
      435840, // The_Preposterous_Awesomeness_of_Everything/
      767610, // if you know what I mean
      764880, // Brazilian_Adventure/
      790460, // Bad_Girls_from_Mars/
      785110, // animeGirlOrbottle
      766260, // Cyberpunk Arena
      782690, // gazingFromBeyond
      726070, // hiddenobjeftsweethome
      754840, // mylifeasamaiden
      541530, // lampoon dirty movie
      738920, // Sexy Seriel Killer
      618750, // Choose Wisely
      751430, // Puzzle of Santa Girl VR
      765210, // Your_Royal_Gayness
      457370, // alexaswildnight
      449250, // A Little Lily Princess
      763050, // Happiness Drops!
      423320, // Pendragon Rising
      517360, // The Secret Order 4: Beyond Time
      508230, // Anime Studio Simulator
      578720, // A Mortician's Tale
      720240, // Legend of Fainn Dynasty ～Battles of Beautiful
      545830, // Princess of Tavern Collector's Edition
      731580, // milf
      727610, // hotpool
      748480, // Wild Romance: Mofu Mofu
      767130, // vrg2
      664920, // embraceVampire
      704690, // Elisa Innkeeper
      666510, // Female Fight Squad
      685740, // SchoolWar__become_a_VR_AnimeGirl/
      527450, // Cockroach_Simulator
      637430, // Random_Tropical_Paradise
      535490, // Porno_Studio_Tycoon
      678480, // WTF
      435750, // Cyberlink_ColorDirector_4
      679590, // CyberLink_ColorDirector_6_Ultra
      713860, // My_Name_is_Addiction
      632930, // Strip_Club_Massacre
      537240, // cgwallpapers.com Demo
      382670, // Loves_Her_Gun
      541530, // National_Lampoons_Dirty_Movie
      526370, // Super_Kinky
      611790, // House_Party
      634250, // Australiens
      387530, // Lets_Ruin_It_With_Babies
      643120, // After_School_Massacre
      372750, // Girl_Amazon_Survival
      564060, // Girl_Asleep
      582760, // Drugstore_Cowboy
      452740, // Perks_of_Being_a_Wallflower
      371230, // Coffee_Kill_Boss
      659600, // Vampire_Academy
      638040, // Gina_Yashere_Skinny_Btch
      725790, // Tiffany_Haddish_She_Ready_From_The_Hood_To_Hollywood
      688570, // Romance_with_Chocolate__Hidden_Object_in_Paris/
      541680, // earthgirlsareasy
      580450, // thelovewitch
      533170, // dontchatwithstrangers
      455490, // dontdiedatelessdummy
       33710, // pawsandclawspetschool
      433170, // Die_Young
      453790, // Candice_DeBbs_Incredibly_Trick_Lifestyle/
      441130, // Meatballs
      437260, // cougers inc
      426370, // cooties
      599970, // Kathleen_Madigan_Madigan_Again/
      601980, // Deep_Fear
      747100, // MILKY_BOOBS
      617610, // Japanese_Women__Animated_Jigsaws
      665400, // Dreaming_about_you
      718370, // LSD $0.99
      657580, // What_My_Neighbors_Are_Demons
      739980, // Lets_not_stay_friends
      612110, // Sweet_fantasy
      404180, // Club_Life
      588240, // friskybusiness
      562670, // Masha_Rescues_Grandma
      586280, // Dima_Rescues_Ira
      504410, // Escape_from_Pleasure_Planet
      387510, // See_You_Next_Tuesday
      538120, // indignation
      672230, // I_fell_from_Grace
      387560, // Forevers_End
      654880, // Dream_Daddy_A_Dad_Dating_Simulator
      332400, // Girlfriend_Rescue
      467680, // Love Stories
      617970, // Love_Bites
      511280, // Beach_Girls
      511270, // Basketball_Girls
      699080, // Jakes_Love_Story
      605190, // Getaway_Island
      601570, // Fix_Me_Fix_You/
      695760, // Girls_and_Dungeons
      500870, // Riddles_Of_The_Past/
      564700, // Scar_of_the_Doll/
      387490, // homejames
      695280, // Ten_Days_in_the_Valley
      695920, // Super_Seducer/
      467710, // Highschool_Girlfriend
      596200, // Blood_n_Bikinis/
      589370, // Fur_Fun
      276340, // My Riding Stables: Life with Horses
      276240, // My Vet Practice: In the Country
      698490, // Tower_of_Lust/
      588920, // BADASS
      379980, // Panzermadels_Tank_Dating_Simulator
      733260, // Daddys_Girls
      659190, // Sorry_James
      646770, // That_Gal_Who_Was_In_That_Thing
      373810, // Hot_Pinball_Thrills
      413610, // Pray_For_Diamonds
      641370, // The_Last_Face
      440200, // unearthing
      540470, // dancingblueiguana
      371270, // quietgirlsguidetoviolence
      506220, // getajob VERY WHITE
      379960, // Mahjong_Pretty_Girls_Battle__School_Girls_Edition
      426530, // The_Twilight_Saga_Breaking_Dawn_Part_1
      423650, // summerfling
      593190, // Iliza_Shlesinger_Freezing_Hot
      670460, // MAGIX_Video_deluxe_2017_Steam_Edition
      647720, // Big_Eyes
      677580, // Simple_Creature
      386200, // STLD_Redux_Episode_02
      582730, // assignement
      744430, // Deep_GachiGASM
      320760, // Tokyo_School_Life
      510980, // Freeloaders
      475310, // 54_The_Directors_Cut/
      421300, // driveangry
      421420, // rapture palooza
      459020, // Melting_Hearts_Our_Love_Will_Grow_2/
      685300, // Portrait_Wizard
      505560, // Dirty_30/
      42200,  // Nancy_Drew_Dossier_Resorting_to_Danger/
      268970, // You_Are_Not_The_Hero/
      364940, // Pony_World_3/
      701540, // EVIL_STAR/
      464080, // Kyoto_Colorful_Days/
      459540, // Cherry_Tree_High_Girls_Fight/
      629960, // A_summer_promise_to_forever/
      447180, // My_Secret_Pets/
      816270, // Sounds_of_Verity/
      818940, // Oakwood_Academy_of_Spells_and_Sorcery/
      820300, // Crypto_Girl_The_Visual_Novel/
      813660, // What_is_love/
      694520, // His_Chuunibyou_Cannot_Be_Cured/
      812430, // Touch_the_devil_VR/
      790490, // Cheerleader_Ninjas/
      772870, // But_Deliver_Us_From_Evil/
      751440, // VR_Kanojo__VR/
      834500, // Rich_Boy_Rich_Girl/
    ],
  ],
};
unsafeWindow.game_collector = {
  shuffle_slots: [  0,  1,  2,  3 ],
  shuffle_types: [ -1, -1, -1, -1 ],
  slots: [
    [ 616620,758980,819230,3820,7000,788910,691450,686190,694620,686180,680320,660180,434600,566750,
      444170,557770,502300,523730,518440,426000,373770,345700,207370,341440,
      340730,360550,618720,415950,417110,503300,518460,372000,771240,57640,
      630100,790260,625820,341150,576400,589690,716680 ],
    [ 362160,386990,354950,343580,572800,37260,431700,271990,6200,662190,
      257830,294230,572800,589860,497470,493450,496630,443980,406110,407720,
      25850,657040,637670,704910,721030,626420,562280,603120,317320,407330,
      307050,405710,671490,578440,370670,486230,396790,536930 ],
    [ 836110,280140,290990,268420,316720,326480,362660,658260,375200,351640,420950,
      386970,462950,443330,664420,716050,662990,760960,533360,536420,299540,
      333980,490160,485340,437020,488660,610610,627820,701930,574260,599560,
      776490,703730,771100,266490,298830,429610,466490,558790 ],
    [ 316600,440340,512600,414140,565690,514310,437030,326340,381560,282800,
      251870,420980,545330,564150,505080,452570,764430,776830,574140,621720,
      298820,321150,364450,603700,612100,416450,39660,219340,300220,317300,
      555640,581520,584940,438130,447570,629430,718910,505090 ],
  ],
};
unsafeWindow.group_primary = {
  shuffle_slots: [],
  shuffle_types: [ 0 ],
  slots: [ [ '103582791432273268', ] ],
};
unsafeWindow.group_favorite = {
  shuffle_slots: [],
  shuffle_types: [ -1 ],
  slots: [
    [ '103582791460539768_pdluno','103582791460539840_twopdl','103582791460539942_quatropdl',
      '103582791460539976_funfpdl','103582791460540021_seispdl','103582791460540047_7pdl',
      '103582791460540093_pdlocho','103582791460540139_neinpdl','103582791460540181_10pdl',
      '103582791460540491_elevenpdl','103582791460540514_dozenpdl','103582791460540553_diezytrespdl',
      '103582791460540576_fourteenpdl','103582791460540604_pdl15','103582791460540634_psixdteenl',
      '103582791460540654_sevenpdlteen','103582791460540677_pdl8teen','103582791460540693_pneindteenl',
      '103582791460540715_pdlproper3',
    ],
  ],
};
unsafeWindow.guide_favorite = {
  shuffle_slots: [],
  shuffle_types: [ -1 ],
  slots: [
    [ 952217347,952218702,952220607,952220615,952220647,952220678,952220705,
      952220733,952220766,952220790,952220828,952220859,952220888,952220922,
      952220963,952220989,952221015,952221053,952221099,952221123,952221164,
      952221186,952221221,952221254,952221300,952221333,952221445,952221593,
      952221598,952221639,952221668,952221691,952221718,952221740,952221762,
      952221786,952221834,952221864,1166090442,1166091057,1166091112,
      1166092301,1166092326,1166092361,1166092434,1166092465,1166092496,
      1166092523,1166092554,1166092580,1166092626,1166092647,1166092667,
      1166092703,1166092730,1166092765,1166092798,1166092827,1166092854,
      1166092885,1166092917,1166092941,1166092979,1252782268
    ],
  ],
};
unsafeWindow.guide_collector = {
  shuffle_slots: [ 0, 1, 2, 3 ],
  shuffle_types: [ 1, 1, 1, 1 ],
  slots: [ [ 768266375 ],[ 768269500 ],[ 768268103 ],[ 768271127 ], ],
};
unsafeWindow.chinese = `誨耳去矣意誨吉安而來矣冒認收玉不題出事汗流如雨父親回衙意也懊悔不此是後話饒爾去罷事關雎出誨關雎可出覽曰愈聽愈惱此是後話也懊悔不饒爾去罷吉安而來玉不題汗流如雨父親回衙冒認收﻿白圭志誨出樂而不淫事建章曰不稱讚矣訖乃返去耳第回第回第回貢院不題愈聽愈惱也懊悔不饒爾去罷此是後話矣事覽愈聽愈惱饒爾去罷也懊悔不此是後話第回第四回第回第回第六回意覽矣饒爾去罷愈聽愈惱此是後話也懊悔不父親回衙汗流如雨冒認收吉安而來玉不題矣關雎曰誨耳`;
unsafeWindow.barcode = '║▌║█║▌│║▌║▌█';
unsafeWindow.guideRainbow = { index: 0, pool: [
  ':fivecolors:',':threecolors:',':trippybat:',
  ':heartless:',':TheDonuts:',':crystals:',':egg:',
  ':Prainbow:',':rainbowfart:',':lollypop:',':pcars:',
  ':righteye:',':garfunkel:',':rainbow:',':The_Ball:',
  ':candyrainbow:',':tisdestroyer:',':tiselements:',':tisbomb:',
  ':uno_wild:',':clownhair:',':glasswindow:',':shockedIro:',
]};
unsafeWindow.equalizer = ['▇','▅', '█', '▅', '▇', '▂', '▃', '▁', '▁', '▅', '▃', '▅', '▅', '▄', '▅', '▇'];
unsafeWindow.profile_intermediate = function() {
  edit_text(guide_favorite.selection[0], pool_elements(pool_elements(emojis, 1, null)[0]) + " " + comment_luck(1).replace(/\[[//u]*\]/g, '') + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " [̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]",
    (
    "\nEQ: [u]" + shuffle_array(equalizer).join(' ') + "[/u]\n" +
    "| " + pool_elements(ascii) + " " + pool_elements(guideRainbow) + ' ' + 
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' ' +
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' ' +
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' ' +
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' ' +
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' ' +
    pool_elements(ascii) + ' ' + pool_elements(guideRainbow) + ' '
    ).replace(/:/g, 'ː') + pool_elements(ascii) + "\n" +
    "[i]" + requests[0].data.replace(/\n/g, '/').trim().toLowerCase().replace(/[.,'"?!]/g, '').replace(/ \//g, '/') +
    "[/i] " + barcode.shuffle() + "_" + pool_elements(pool_elements(emojis, 1, null)[0]) + "_" + chinese.shuffle().substr(0, 4) + ' (' + pool_elements(alphabet).toUpperCase() + ') + ' + pool_elements(pool_elements(emojis, 1, null)[0])
  );
  var array = [requests[0].data, requests[5].data, requests[6].data];
  var min = array.filter(v => typeof v === 'string')
                    .reduce((a, v) => a && a.length <= v.length ? a : v, '').split('\n');
  edit_text(artwork.selection[0], pool_elements(pool_elements(emojis, 1, null)[0]) +
    " " + min[0].toLowerCase() + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " + min[1].toLowerCase() +
    " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " + min[2].toLowerCase() + " " + pool_elements(pool_elements(emojis, 1, null)[0]))
  var rainbow = pool_elements(rainbows, 1, null)[0];
  var text = rainbow[0] + "●▬▬▬▬▬▬▬▬▬▬▬▬▬ 웃" + pool_elements(pool_elements(emojis, 1, null)[0]) + "유 ▬▬▬▬▬▬▬▬▬▬▬▬▬●\n" +
    rainbow[1] + "[i] → " + requests[4].data.substr(0,52) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " \n" +
    rainbow[2] + " → " + requests[3].data.replace(/\s+/g, ' ').replace(/\n/g, " ").substr(0,52) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + "\n" +
    rainbow[3] + " → " + requests[1].data.replace(/\s+/g, ' ').replace(/\n/g, " ").substr(0,52) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + "\n" +
    rainbow[4];
  edit_text(workshop_favorite.selection[0],
    chinese.shuffle().substr(0, 2) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " +
    chinese.shuffle().substr(0, 2) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " +
    chinese.shuffle().substr(0, 2) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " +
    chinese.shuffle().substr(0, 2) + " " + pool_elements(pool_elements(emojis, 1, null)[0]) + " " +
    chinese.shuffle().substr(0, 2),
    text.replace(/[-.,"']/g, '').toLowerCase());
  var dog_fact = pool_elements(dog_facts);
  while (true) {
    if (dog_fact.indexOf('YYY') > -1) {
      dog_fact = dog_fact.replace(
        "YYY", pool_elements(pool_elements(emojis, 1, null)[0]));
    } else {
      break;
    }
  }
  edit_group(group_favorite.selection[0].substr(19), dog_fact);
};
unsafeWindow.inactive_screenshot_text = function(sharedid) {
  if (!shareid instanceof Array) {
    sharedid = [shareid];
  }
  shareid.forEach(function(sid) {
    var line = font('ITEMS = \ ', 13);
    for (var i = 0; i < 19; i++) {
      line += pool_elements(pool_elements(emojis, 1, null)[0]) + "-";
    }
    edit_text(sid, line.slice(0,-1) + " /", line.slice(0,-1));
    pool_elements(pool_elements(emojis, 1, null)[0]);
  });
};
unsafeWindow.rainbows = { index: 0, pool: [
  [ 'ːem05ː','ːem03ː','ːem01ː','ːem04ː','ːem02ː', ] ,
  [ 'ːblocks1ː','ːblocks4ː','ːblocks5ː','ːblocks3ː','ːblocks2ː', ] ,
  [ 'ːSNF2ː','ːSNF4ː','ːSNF1ː','ːSNF5ː','ːSNF3ː', ] ,
  [ 'ːbloodgearː', 'ːneutralgearː','ːicegearː','ːgoldengearː','ːdullgearː', ] ,
  [ 'ːAngrygerkaː','ːTrollGerkaː','ːSadGerkaː','ːCheergerkaː','ːHappyGerkaː', ] ,
  [ 'ːLightRedCubeː','ːGreenCubeː','ːLightBlueCubeː','ːYellowCubeː','ːPinkCubeː', ] ,
  [ 'ːRed_Boxː','ːGreen_Boxː','ːBlue_Boxː','ːYellow_Boxː','ːPurple_Boxː', ] ,
]};
unsafeWindow.singleDigits = { index: 0, pool: [
  '1','2','3','4','5','6','7','8','9',
]};
unsafeWindow.alphabet = { index: 0, pool: [
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
]};
unsafeWindow.hearts = { index: 0, pool: [
  [':quarpjet:',':Yellow_Box:',':dreadnought:',':toglove:',':spirallove:',':quarpjet:',
    [ ' ║♥ #001 Standard Issue', ' ║✩ "Gold!"', '', '', '', '', '', '']],
  [':rainbow:',':crystals:',':dia:',':spacemarineshield:',':spirallove:',':rainbow:',
    [ ' ║♥ #002 Diamonds', ' ║✩ "You\'re forever..."', '', '', '', '', '', '']],
  [':butterfly:',':rosepink:',':sunflower:',':orangelily:',':spirallove:',':bud:',
    [ ' ║♥ #003 The Unique Orchid', ' ║✩ "One of a kind."', '', '', '', '', '', '']],
  [':ruby:',':emerald:',':dia:',':medal:',':spirallove:',':amethyst:',
    [ ' ║♥ #004 Shiny Things', ' ║✩ "Like yourself!"', '', '', '', '', '', '']],
  [':shinealight:',':Wisp:',':ss2heart:',':YQ_Imp:',':ss2heart:',':DuncanFree:',
    [ ' ║♥ # 005 The Ocean', ' ║✩ "From whence we came..."', '', '', '', '', '', '']],
  [':b_star:',':bud:',':newcogs:',':redrose:',':newcogs:',':Gflower:',
    [ ' ║♥ #006 Winter Solstice', ' ║✩ "Stay Warm!"', '', '', '', '', '', '']],
  [':faerie:',':rainbowfart:',':Gflower:',':balloon:',':spirallove:',':crystals:',
    [ ' ║♥ #007 Good Luck', ' ║✩ "Find Fortune!"', '', '', '', '', '', '']],
  [':bflower:',':rosebud:',':sunflower:',':rosepink:',':spirallove:',':clover:',
    [ ' ║♥ #008 Waiting for Spring', ' ║✩ "Brighter days ahead..."', '', '', '', '', '', '']],
  [':evosnowtree:',':melon:',':clownhair:',':beefu:',':toglove:',':yummyhamburger:',
    [ ' ║♥ #009 "Treat Yo-Self!"', ' ║✩ "You deserve it."', '', '', '', '', '', '']],
  [':greenalien:',':alliedstar:',':alkat:',':SweezyPapers:',':g_heart:',':bud:',
    [ ' ║♥ #010 Cold Hard Cash', ' ║✩ "You\'re so money..."', '', '', '', '', '', '']],
  [':_O_:',':skillhealth:',':Pikabu:',':wheretomato:',':bflower:',':wazapple:',
    [ ' ║♥ #011 On Your Windowsill...', ' ║✩ "I baked you a pie!"', '', '', '', '', '', '']],
  [':Pikabu:',':Pizza:',':pizzalove:',':ZippleRocks:',':redrose:',':yummyhamburger:',
    [ ' ║♥ #012 Food Fight!', ' ║✩ "I\'m hungry!"', '', '', '', '', '', '']],
  [':zzacid:',':fbpearl:',':g_heart:',':PlanetYelaxot:',':vahlen:',':zzcarniplant:',
    [ ' ║♥ #013 Alien Invasion', ' ║✩ "You\'ve been abducted..."', '', '', '', '', '', '']],
  [':catpuzzle:',':redyokai:',':sdcat:',':GreenMagic:',':kysathecat:',':paw:',
    [ ' ║♥ #014 You\'re the Cat\'s PJs', ' ║✩ "AKA Cool Cat..."', '', '', '', '', '', '']],
  [':balloon:',':kalisymbol:',':infamy:',':zcrystal:',':happyfrog:',':biblis:',
    [ ' ║♥ #015 Positive Purple', ' ║✩ ":)"', '', '', '', '', '', '']],
  [':pill:',':gore:',':zzenergy:',':bloodsplat:',':health:',':brain:',
    [ ' ║♥ #016 The Stimpack', ' ║✩ "Pills Here!"', '', '', '', '', '', '']],
  [':Blue_Box:',':skullbomb:',':Yellow_Box:',':Red_Box:',':rubik:',':Green_Box:',
    [ ' ║♥ #017 Jelly Heart', ' ║✩ "I\'m bad with emoticons."', '', '', '', '', '', '']],
]};
unsafeWindow.ascii = { index: 0, pool: [
  '☺','☻','♦','♣','♠','♥','♂','♀','♪','♫','☼','↕','✿','✪','✣','✤','✥','✶',
  '✦','✧','✩','✫','✬','✭','✯','✰','✱','✲','✳','❃','❂','❁','❀','✿',
  '✴','❄','❉','❋','❖','♧','✿','♂','♀','∞','☆','☀','☢','✈','❦','ß','✖',
  '♡','ღ','☼','★','ٿ','●','♫','♪','♀','♂','☂','☁','☎','¤','☣','❄','✏','☁','✔',
]};
unsafeWindow.comment_luck = function(f = -1) {
  return '[u]' + font('Lucky Numbers', f) + '[/u]: ' + Math.floor(Math.random()*9) + ',' +
    Math.floor(Math.random()*9) + ',' + Math.floor(Math.random()*9);
};
unsafeWindow.split_words = function(s) {
  var middle = Math.floor(s.length / 2);
  var before = s.lastIndexOf(' ', middle);
  var after = s.indexOf(' ', middle + 1);
  if (middle - before < after - middle) {
      middle = before;
  } else {
      middle = after;
  }
  return [ s.substr(0, middle), s.substr(middle + 1) ];
};
unsafeWindow.comment_messages = [
  function(args) {
    return generate_heart(hearts);
  }, // heart (0)
  function(args) {
    var dimensions = [[2,32],[3,26],[4,19],[5,16],[6,13],[7,11],[8,9],[9,8],[10,7],[12,6]];
    var pools = [0, 1, 12, 20], pool_index = 0;
    if (!/^[-0-9][-0-9,]*$/.test(args)) {
      args = "-1,-1";
    }
    args = args.split(',');
    if (args.length < 2) {
      args.push(-1);
    }
    if (args[0] < 0) {
      args[0] = Math.floor(Math.random() * dimensions.length);
    }
    var blast = '', pool = args[1];
    if (args[1] == "-2") {
      pool = pools[Math.floor(Math.random() * pools.length)];
    }
    for (var l = 0; l < dimensions[args[0]][0]; l++) {
      if (args[1] == -1) {
        pool = pools[pool_index];
        pool_index++;
        if (pool_index == pools.length) {
          pool_index = 0;
        }
      }
      if (pool == 20) {
        pool_elements(emoticon_static_trade, dimensions[args[0]][1], null).forEach(function(trade_pool) {
          blast = blast + pool_elements(trade_pool, 1) + '';
        });
        blast = blast + "\n";
      } else {
        blast = blast + pool_elements(emoticon_static[pool], dimensions[args[0]][1]) + "\n";
      }
    }
    return blast;
  }, // emoticons (1)
  function() {
    var fortune = split_words(requests[3].data);
    return pool_elements(emoticon_static[1], 14) + " → " + pool_elements(emoticon_static[0]) + "[i]" + fortune[0] + "... " + pool_elements(emoticon_static[0]) + "\n" +
    pool_elements(emoticon_static[1], 14) + " → " + pool_elements(emoticon_static[0]) + "..." + fortune[1] + "[/i] " + pool_elements(emoticon_static[0]) + "\n" +
    pool_elements(emoticon_static[1], 14) + " → " + pool_elements(emoticon_static[0]) + "[u]Lucky Numbers:[/u] " + pool_elements(emoticon_static[0]) + "\n" +
    pool_elements(emoticon_static[1], 14) + " → " + pool_elements(emoticon_static[0]) + " " + Math.floor(Math.random()*99) + ',' +
    Math.floor(Math.random()*99) + ',' + Math.floor(Math.random()*99) + " " + pool_elements(emoticon_static[0]);
  }, // fortune (2)
  function() {
    var emoticon_strip1 = '', emoticon_strip2 = '';
    pool_elements(emoticon_static_trade, 20, null).forEach(function(trade_pool) {
      emoticon_strip1 = emoticon_strip1 + pool_elements(trade_pool, 1) + ' | ';
    });
    pool_elements(emoticon_static_trade, 20, null).forEach(function(trade_pool) {
      emoticon_strip2 = emoticon_strip2 + pool_elements(trade_pool, 1) + ' | ';
    });
    return emoticon_strip1.slice(0, -2) + "\n\n[i]" + requests[1].data +
      "[/i]\n\n" + emoticon_strip2.slice(0, -2);
  }, // pratchett (3)
  function() {
    var pools = shuffle_array([8, 2, 3, 4, 5]);
    var haikus = [
      requests[0].data.split('\n'),
      requests[5].data.split('\n'),
      requests[6].data.split('\n'),
    ];
    return pool_elements(emoticon_static[pools[0]], 10) + "\n[i]" +
      "[b][u] Here's Some Haiku for You...[/u][/b]\n" +
      pool_elements(emoticon_static[pools[1]], 10) + "\n" +
      " » " + haikus[0][0] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[0][1] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[0][2] + " " + pool_elements(ascii) + " \n" +
      pool_elements(emoticon_static[pools[2]], 10) + "\n" +
      " » " + haikus[1][0] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[1][1] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[1][2] + " " + pool_elements(ascii) + " \n" +
      pool_elements(emoticon_static[pools[3]], 10) + "\n" +
      " » " + haikus[2][0] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[2][1] + " " + pool_elements(ascii) + " \n" +
      " » " + haikus[2][2] + " " + pool_elements(ascii) + " \n" +
      pool_elements(emoticon_static[pools[4]], 10);
  }, // haiku (4)
  function() {
    return pool_elements(emoticon_static[12], 15) + "\n" +
      pool_elements(emoticon_static[12], 15) + "\n" +
      "[i]" + split_words(requests[4].data).join('\n') + "[/i]\n" +
      pool_elements(emoticon_static[12], 15) + "\n" +
      pool_elements(emoticon_static[12], 15);
  }, // quote (5)
  function(args) {
    var categories = [], reviewText = "[i]";
    shuffle_array(my_performances);
    while (true) {
      var category = Math.floor(Math.random()*my_performances.length);
      if (categories.indexOf(category) == -1) {
        categories.push(category);
        reviewText = reviewText +=
          my_performances[category][Math.floor(Math.random()*3)] + " ";
        if (categories.length == 4) {
          break;
        }
      }
    }
    return pool_elements(emoticon_static[12], 3) + " [b][u]Performance review for " + args + " [/u][/b] " + pool_elements(emoticon_static[12], 3) + "\n\n" +
      reviewText.replace(/\$NAME/g, args) + "[/i]\n\n" +
      pool_elements(emoticon_static[0], 1) + " + " + pool_elements(emoticon_static[0], 1)
      + " = " + pool_elements(emoticon_static[1]);
  }, // performance (6)
  function() {
    var symbol = pool_elements(ascii);
    return pool_elements(emoticon_static[0], 15, ' ' + symbol + ' ') + "\n" +
    "[i]" + requests[7].data.replace("\n\n",'') + "\n\n" +
    requests[8].data.replace("\n\n",'') +
    "[/i]\n" +
    pool_elements(emoticon_static[0], 15, ' ' + symbol + ' ');
  }, // xfiles (7)
  function() {
    function rainbow_set() {
      return shuffle_array(pool_elements(rainbows, 1, null)[0]).join('').replace(/,/g, '');
    }
    function line() {
      return "--------------------------------------------------------------\n";
    }
    return "[b][i]" + line() +
      requests[9].data.replace(/\n\n/g, "\n" + line()) + "\n" +
      line() +
      rainbow_set() + rainbow_set() + rainbow_set() + "\n" +
      rainbow_set() + rainbow_set() + rainbow_set() + "\n" +
      rainbow_set() + rainbow_set() + rainbow_set();
  }, // startrek (8)
  function() {
    return pool_elements(emoticon_static[7], 15, " -- ") + "\n" +
      "[spoiler]" + requests[10].data.trim().replace(/\n\n/g, '\n').substr(0, 450).replace(/\n#/g, '\n\n#') + "\n" +
      "[/spoiler]\n" +pool_elements(emoticon_static[7], 15, " -- ");
  }, // bashorg (9)
  function() {
    return pool_elements(emoticon_static[8], 10, " ") + "\n" +
    ":bundleoftulips: [u][ Calvin and Hobbes Quotes ][/u] :bundleoftulips:[i]\n" +
    pool_elements(emoticon_static[6], 10, " ") + "\n" +
    requests[11].data + "\n" +
    pool_elements(emoticon_static[10], 10, " ");
  }, // calvin (10)
  function() {
    var line = requests[12].data.replace(/\n/g, ' ').replace(/  /g, ' ');
    while (true) {
      if (line.indexOf(' ') == -1) {
        break;
      } else {
        line = line.replace(' ', pool_elements(emoticon_static[12]));
      }
    }
    return "[b]" + pool_elements(emoticon_static[12]) + line + pool_elements(emoticon_static[12]);
  }, // futurama (11)
  function() {
    var love1 = { index: 0, pool: [
      ':r_heart:',':dhruby:',':zzenergy:',':heartless:',':rosepink:',':oohapresent:',
      ':tilasmouth:',':bloodgear:',':toglove:',':redrose:',
    ]};
    function line() {
      var line = '';
      for (var I = 0; I < 6; I++) {
        line = line + ' ♥ ' + pool_elements(love1) + ' ♥ ' + pool_elements(emoticon_static[5])
      }
      return line;
    }
    return line() + "\n" + requests[13].data.replace(/\n\n/g, "\n" + line() + "\n") + "\n" + line();
  }, // love (12)
  function() {
    var green_stuff = { index: 0, pool: [
      ':g_heart:',':ZombillieMushrooms:',':zgblob:',':zombieboyboom:',':ZombieKills:',
      ':zzcarniplant:',':zzacid:',':wnotree:',':greenlightorb:',':TrollGerka:',
      ':SweezyPapers:',':neutralgear:',':clover:',':weed:',':GreenSphere:',
    ]};
    return ":weed: + [b][u][Secret Drug Facts][/u][/b] + :weed: [i]\n" +
    pool_elements(emoticon_static[4], 16, ' ') + "\n" +
    requests[14].data.replace(/\n\n/, '\n[spoiler]') + "[/spoiler]\n" +
    pool_elements(green_stuff, 16, ' ');
  }, // drugs (13)
  function(args) {
    var cat_icons = { index: 0, pool: [ ':Wizardhatcat:',':Kinghatcat:',':catpuzzle:',':kysathecat:',':Christmashatcat:' ]};
    return "[b][u]" + pool_elements(cat_icons) + " Dear " + args + "... "  + pool_elements(cat_icons) + "[/u][/b]\n[i]" +
    "→ " + requests[15].data.replace(/\n\n/g, "\n → ").replace(/\n/g, ' ').replace(/→ /g, "\n→ ") + "[/i]\n" +
    "[u]" + pool_elements(emoticon_static[0], 15, ' ' + pool_elements(ascii) + ' ') + "[/u]\n" +
    "Yours truly, " + requests[2].data + " (the cat)\n" +
    pool_elements(cat_icons) + " [spoiler]http://steamcommunity.com/sharedfiles/filedetails/?id=" +
         cats[Math.floor(Math.random()*cats.length)] + "[/spoiler] " + pool_elements(cat_icons) + "\n";
  }, // pets (14)
  function() {
    var zippy = requests[16].data.replace(/\n/g, ' ').trim();
    var line = '[i]';
    for (var R = 0; R < 10; R++) {
      for (var C = 0; C < R; C++) {
        line = line + pool_elements(emoticon_static[9]);
      }
      var word = '', space = zippy.indexOf(' ');
      if (space != -1) {
        word = zippy.substr(0, space);
        zippy = zippy.slice(space+1).replace('  ', ' ');
      }
      line = line + " " + pool_elements(ascii) + " " + word + "\n";
    }
    return line + ' ' + zippy;
  }, // ascii white staircase (15)
  function() {
    function flair() {
      var amount = Math.floor(Math.random() * 5);
      switch (Math.floor(Math.random() * 5)) {
      case 0:
        return pool_elements(ascii, amount);
      case 1:
        return pool_elements(ascii_face, amount, ' ');
      case 2:
        var line = '';
        for (var i = 0; i < 4; i++) {
          line += pool_elements(pool_elements(emojis, 1, null)[0]);
        }
        return line;
      case 3:
      case 4:
        return pool_elements(emoticon_static[Math.floor(Math.random() * emoticon_static.length)], amount);
      };
    }
    var adj_good = { index: 0, pool: [ 'good','super','fun','nice','cool','awesome','marvelous',
      'splendid','great','excellent','superb','wonderful','neat','stupendous',
      'dope','boss','fantastic' ]};
    var pleedings0 = { index: 0, pool: [ 'i','we','we all','all of us_','everyone_','everybody_','steam_','the humans','humanity_' ]};
    var pleedings1 = { index: 0, pool: [ 'hope','think','expect','trust','assume', ]};
    var pleedings2 = { index: 0, pool: [ 'you will','you\ll','you are going', ]};
    var to_like = { index: 0, pool: [ 'enjoy','like','love','dig','fancy','adore','relish','savor' ]};
    var to_like_long = { index: 0, pool: [ 'get a kick out of','be entertained','are pleased by','take pleasure in' ]};
    var noun_games = { index: 0, pool: [ 'this game','your game','your new game','this stuff' ]};
    var gl_hf = { index: 0, pool: [ 'hf','gl','glhf','gl hf','good luck','have fun','good luck, have fun', ]};
    var gl_hf_long = { index: 0, pool: [ 'have a ball','do it big','cut loose','party down','get funky' ]};
    var exclamation = { index: 0, pool: [ 'wow','!!!','look at this','wooooooooooooooo','look','','', ]};
    var punctuation = { index: 0, pool: [ '!','.',',','-','|','*' ] };
    var font_indexes = { index: 0, pool: [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] };
    var singles = { index: 0, pool: [
      pool_elements(exclamation),
      pool_elements(gl_hf),
      pool_elements(gl_hf_long),
      pool_elements(adj_good),
      pool_elements(adj_good) + ' game',
      (function() {
        var pleedings = [ pool_elements(pleedings0), pool_elements(pleedings1),
          pool_elements(pleedings2),
        ];
        if (pleedings[0].slice(-1) == '_') {
          pleedings[0] = pleedings[0].slice(0, -1);
          pleedings[1] += 's';
        }
        return pleedings[0] + ' ' + pleedings[1] + ' ' + pleedings[2] + ' ' +
          pool_elements(to_like) + ' ' + pool_elements(noun_games);
      })()
    ]};
    var msg = pool_elements(emoticon_static[Math.floor(Math.random() * emoticon_static.length)], 2) + " " + flair();
    segment();
    function segment() {
      var single = pool_elements(singles);
      if (Math.floor(Math.random() * 2) == 1) {
        single = single.toUpperCase();
      }
      msg += ' ' + font(single, pool_elements(font_indexes)) +
        pool_elements(punctuation) + ' ' + flair();
      if (Math.floor(Math.random()*5) == 4) {
        msg += "\n" + flair() + ' ';
      }
    }
    for (var i = 0; i <= Math.floor(Math.random()*5); i++) {
      segment();
    }
    return msg + ' ' + pool_elements(emoticon_static[Math.floor(Math.random() * emoticon_static.length)], 2);
  }, // new game message (16)
  function() {
    return ("[b]" + questions[Math.floor(Math.random() * questions.length)] + "[/b]\n" +
      " >> " + pool_elements(rainbows, 1, null)[0].join('') + " <<").replace(/ː/g, ':');
  }, // question (17)
  function() {
    return (pool_elements(emoticon_static[0], 3) + " [i]" +
      questions[Math.floor(Math.random() * questions.length)] + "[/i] " +
        pool_elements(emoticon_static[0], 3)).replace(/ː/g, ':');
  }, // question (18)
  function() {
    var symbol = pool_elements(ascii);
    return (pool_elements(emoticon_static[1], 12, " " + symbol + " ") + "\n[u]" +
      questions[Math.floor(Math.random() * questions.length)] + "[/u]\n" +
      pool_elements(emoticon_static[1], 12, " " + symbol + " ")).replace(/ː/g, ':');
  }, // question (19)
  function() {
    var question = split_words(questions[Math.floor(Math.random() * questions.length)]);
    return (pool_elements(emoticon_static[12], 5) + " [b]|" +
      question[0] + "| " + pool_elements(emoticon_static[12], 8) + "\n" +
      pool_elements(emoticon_static[12], 5) + " |" + question[1] + "| " + pool_elements(emoticon_static[12], 8)).replace(/ː/g, ':')
  }, // question (20)
  function() {
    var question = split_words(questions[Math.floor(Math.random() * questions.length)]);
    var emoticon_strip1 = '', emoticon_strip2 = '';
    pool_elements(emoticon_static_trade, 8, null).forEach(function(trade_pool) {
      emoticon_strip1 = emoticon_strip1 + pool_elements(trade_pool, 1) + ' | ';
    });
    pool_elements(emoticon_static_trade, 8, null).forEach(function(trade_pool) {
      emoticon_strip2 = emoticon_strip2 + pool_elements(trade_pool, 1) + ' | ';
    });
    return ("[i]" + question[0] + " | " + emoticon_strip1 + "\n" +
      question[1] + " | " + emoticon_strip2).replace(/ː/g, ':');
  }, // question (21)
  function() {
    var question = split_words(questions[Math.floor(Math.random() * questions.length)]);
    var symbols = pool_elements(ascii, 20, ' ');
    return (pool_elements(rainbows, 1, null)[0].join('') + " - " + symbols + "\n" +
      pool_elements(rainbows, 1, null)[0].join('') + " - [u]" + question[0] + "[/u]\n" +
      pool_elements(rainbows, 1, null)[0].join('') + " - ㅤㅤ [u]" + question[1] + "[/u]\n" +
      pool_elements(rainbows, 1, null)[0].join('') + " - " + symbols.split(' ').reverse().join(' ')).replace(/ː/g, ':');
  }, // question (22)
  function() {
    return mandelas1[Math.floor(Math.random() * mandelas1.length)];
  }, // mandelas (23)
  function() {
    return "[u][b]Free Jokes![/b][/u]" + "[spoiler]Sorry if they're crude![/spoiler]\n\n" +
    pool_elements(emoticon_static[1], 16, ' * ') + "\n" +
    "ㅤ* " + jokes[Math.floor(Math.random() * jokes.length)] + "\n" +
    "ㅤ* " + jokes[Math.floor(Math.random() * jokes.length)] + "\n" +
    "ㅤ* " + jokes[Math.floor(Math.random() * jokes.length)] + "\n" +
    pool_elements(emoticon_static[1], 16, ' * ') + "\n\n" +
    "ㅤㅤㅤㅤ[i]" + [ 'Chuckle, Chuckle!', 'Yuck yuck yuck...', 'hehehehehehehehe', 'lol!',
      'kkkkkkkkkkkkkkkkkkkkkkkkkk', "I'm here all week!", 'Ba-Dum-Tiss!',
      'ROFL!', 'I\'m chortling!', 'Smile!','teehee!', '*snickers*', 'I\'m giggling!'][Math.floor(Math.random()*13)] + "[/i]";
  }, // joke (24)
];
unsafeWindow.emoticon_static = [
  { index: 0,
    pool: [ // NORMAL 0
      ':ruby:',':amethyst:',':sapphire:',':emerald:',':quartz:',':Grey_Box:',
      ':alliedstar:',':slugpoo:',':skillhealth:',':dia:',':evosnowtree:',
      ':heartglow:',':faerie:',':bud:',':rosepink:',':purplelilac:',':orangelily:',
      ':sunflower:',':happyfrog:',':fbpearl:',':melon:',':balloon:',':toglove:',
      ':health:',':mcmouth:',':GreenMagic:',':goldduck:',':kalisymbol:',
      ':spirallove:',':bflower:',':Gflower:',':rflower:',':Pizza:',':pizzalove:',
      ':weed:',':clover:',':tilasmouth:',':RadioactiveWarning:',':SweezyPapers:',
      ':shodan:',':ss2heart:',':pill:',':poop:',':senator:',':oohapresent:',
      ':shinealight:',':poop_narco:',':DuncanFree:',':rosebud:',':butterfly:',
      ':smileud:',':quarpjet:',':alkat:',':redtulip:',':pinktulip:',':paw:',
      ':bundleoftulips:',':newcogs:',':redrose:',':whiterose:',':dreadnought:',
      ':spacemarineshield:',':Yummmmy:',':redlightorb:',':greenlightorb:',
      ':bluelightorb:',':wazapple:',':wazpear:',':wheretomato:',':Wisp:',
      ':YellowS:',':lilacR:',':GoldenH:',':wnotree:',':biblis:',':sedium:',
      ':dhruby:',':wnhappy:',':Greenalien:',':redyokai:',':PlanetYelaxot:',
      ':kysathecat:',':YQ_Imp:',':infamy:',':Dragonic:',':dangerousplanet:',
      ':zzcarniplant:',':zzacid:',':zz:',':zzenergy:',':rubik:',':skullbomb:',
      ':bloodsplat:',':beholder:',':ZE3_Decision:',':ZE3_Escape:',':zcrystal:',
      ':zgblob:',':reggafish:',':zeusambrosia:',':flame:',':ZE3_GameOver:',
      ':ZippleRocks:',':ZombieKills:',':zombieboyboom:',':medal:',':beefu:',
      ':gore:',':yummyhamburger:',':brain:',':rocketair:',':ZombillieEye:',
      ':ZombillieMushrooms:',':Zombillie:',':Pikabu:',':b_ball:',':b_star:',
      ':y_star:',':g_heart:',':r_heart:',':w_heart:',':_O_:',':vhss:',
      ':BlueSphere:',':GreenSphere:',':PurpleSphere:',':TheGoldenSphere:',
      ':WhiteSphere:',
    ]
  },
  { index: 0,
    pool: [ // WEEB 1
      ':maddie:',':sarahsmile:',':alisa:',':Nova_horror:',':southey:',':lexa:',
      ':byron:',':alexpope:',':Rae:',':erin:',':zara:',':morgane:',':Happyaku:',
      ':CeliaWhat:',':lismile:',':dl1vera:',':lorelaismile:',':doridetermined:',
      ':vanitygrin:',':rubysad:',':teresagrin:',':dh2_dawn:',':smoker:',
      ':tellme:',':taejin:',':possessiongirl:',':eoa_angry:',':miridisgust:',
      ':ef_pamela:',':e3_fang:',':Enola2:',':eve2_jenny:',':Eryn:',':Vivian:',
      ':Marissa:',':Karin:',':Alice:',':Itazura_KitsuneTati:',':prnss:',
      ':happygirl:',':happyk:',':smiling:',':flirtylora:',':Playful:',':Luana:',
      ':skirt:',':hcs_sarah:',':hcs_lailani:',':hp_tiffany:',':hp_kyanna:',
      ':hp_audrey:',':hp_lola:',':hp_nikki:',':hp_jessie:',':hp_beli:',':iffy:',
      ':vert:',':SisterRam:',':asukaneutral:',':sayurianger:',':raizy:',
      ':Lilly:',':mayumi:',':rui:',':Repairman:',':mpgb_tsubasa:',':suzuka:',
      ':mpgb_sge_akane:',':MariaTheWitch:',':CarlaFace:',':GirlFace:',':misa:',
      ':Nami:',':leira:',':spherical_scenery_of_creation:',':BethCon:',
      ':BrendaCon:',':LanaCon:',':KrissyCon:',':RebeccaCon:',':ppgb_arisu:',
      ':ppgb_marika:',':ppgb_rieru:',':ppgb_yuri:',':pgp_sakuya:',':yogiri:',
      ':RayGigant_Riona:',':RayGigant_Kyle:',':catpuzzle:',':junsmirk:',
      ':yuurisad:',':rfga_gold_mine_girl:',':rfga_women:',':sdyomi:',
      ':rfgc_gold_mine_girl:',':sschool:',':hschool:',':scKnight:',':sdceri:',
      ':sdsylvi:',':sdwandwitch:',':sdfoxmiko:',':amaya2:',':skybornsad:',
      ':sakuraspacekotori:',':sakuraspacenami:',':skybornangry:',
      ':skybornannoyed:',':skyborngrin:',':mari_sd:',':himeno_sd:',':XmasAura:',
      ':XmasJennyNaught:',':sitfacepalm:',':liciaheart:',':asagapeace:',
      ':icari:',':kryska:',':spplmomiji:',':bleedingheart1:',':Consuela:',
      ':asako_ag:',':em1_nurse:',':diaochan:',':tr_slavya:',':makina_lg:',
      ':yumiko_lg:',':Asagiri_Ohgiya:',':Xie_Smile:',':Chen_Yu_Contempt:',
      ':tso4_princess:',':Clementine:',':tfs_annabel:',':tfs_diver:',
      ':tfs_plunger:',':a2:',':ahh:',':maria:',':vl_rose:',':vahlen:',
      ':pretty:',':yazdgirl:',':sdadol:',':sdelena:',':superel:',':fallinlove:',
    ]
  },
  { index: 0,
    pool: [ // PURPLE 2
      ':qq2_Alchemist:',':picard:',':SinlessCute:',':chigara:',':weedy:',
      ':THUNDER_SHERMIE:',':celestia:',':reah:',':feena:',':thankyou:',':e5:',
      ':cheffie:',':cinnamon:',':Resh_Emoticon:',':mei:',':dnage_mr:',':ODWS:',
      ':Hoshiglasses:',':Nana:',':luca:',':shibuya:',':griselda:',':sakur:',
      ':yuricry:',':charlottecry:',
    ]
  },
  { index: 0,
    pool: [ // BLUE 3
      ':zoya2:',':eliselaugh:',':At2_Meya:',':joyfin:',':ianthumb:',
      ':con2_narika:',':Shoja:',':Shoji:',':siren:',':mpgb_sge_ouka:',
      ':angryjasmine:',':happyjasmine:',':RockCrystal:',':Sybry:',':ailish:',
      ':interesting:',':Asumi:',':erune:',':frigideer:',':whitewing:',
      ':shymisa:',':mw1_mermaid:',':lunareally:',':batakun:',':hwhappy:',
      ':august:',':dexsmile:',':pgms_2_yuno:',':pgms_2_mei:',':pgp_maya:',
    ]
  },
  { index: 0,
    pool: [ // GREEN 4
      ':azumi:',':frustration:',':elenashame:',':happysarah:',':dnage_cd:',
      ':akio:',':hisuifemale:',':freesia:',':jeska:',':higu_mion:',
      ':shereeimpulse:',':Inc_Seraphia:',':madoka:',':tibby:',':sadsuren:',
      ':NightVigilClover:',':cryingrika:',':nlaItsuki:',':oasenaoru:',
      ':laughingfairy:',':sakurafantasyethy:',':shsumm:',':funny:',
      ':svhyuka:',':vsgilda:',':d4_cry:',':d4_smile:',':con2_ellie:',
    ]
  },
  { index: 0,
    pool: [ // PINK 5
      ':charlotte:',':SoraSmile:',':pgms_2_rui:',':selva:',':celesta:',':ow:',
      ':MisakiSmile:',':tiffany:',':ravenbust:',':shimadastare:',':dnage_ctr:',
      ':tetley:',':uplum:',':LeaTeacher:',':irishappy:',':michelle:',
      ':lora:',':mpgb_ayumi:',':mpgb_sge_urara:',':weelisa:',':violettOK:',
      ':carmellia:',':oaseaeza:',':projectstarship_smile:',':zbrsniper:',
      ':ginhappy:',':rithmn:',':NyanNyan:',':pnk_hrd:',':scherza:',
      ':ohh_yeah:',':LiselotCute:',':Kami:',':knowledge:',':wnoannemarie:',
      ':sachi_komine:',':legionwoodfemale:',
    ]
  },
  { index: 0,
    pool: [ // RED 6
      ':Dania:',':whateverr:',':cs1_susan:',':drewcolor:',':kurenai:',
      ':little_girl:',':fairylovely:',':Kota:',':gs_angry:',':scarygirl:',
      ':WinkyFace:',':junkgirl:',':thora:',':sinclair:',':mpgb_sge_kotomi:',
      ':Nurse:',':Allison:',':pgms_risa:',':Lili:',':skepticalMierol:',
      ':RockZoe:',':odell:',':DemonLady:',':lyria:',':sitoops:',':Kaori:',
      ':blrosa:',':wnosarah:',':sleepmode:',':tm1_vivien:',':parcelmagna:',
      ':IzzyWink:',':yui:',':mw1_emma:',':VPofSales:',':herolegionwood:',
      ':littlemarie:',':gl3_camilla:',':FortifiedRocket:',':LaneyHappy:',
      ':Nell:',':tooru:',':BRRayne:',':bulauren:',':selena:',':RayneHead:',
      ':6in1rrh:',
    ]
  },
  { index: 0,
    pool: [ // BLACK 7
      ':medoll:',':A_elleria:',':arlengineer:',':Asia:',':yuuki:',':Ferril:',
      ':nico:',':kyliebust:',':delgaze:',':Dawn:',':madoctober:',':brandon:',
      ':AmberKingsley:',':WaterSmile:',':insincere_elisa:',':Lize:',
      ':koikoijapan_aoi:',':maiko:',':mpgb_sge_airi:',':anaPLF:',
      ':nebula_human:',':nftd_scared:',':chin:',':maiangry:',':laverne:',
      ':p2chell:',':Lukako:',':Mayuri:',':sakurabeachayumilaugh:',':sdcat:',
      ':swimmieko:',':Women:',':KseniaSmiles:',':buki:',':nursejulie1:',
      ':BullyGirl:',':AdaRE4:',':vdsour:',':vdmerchant:',':yennefer:',
      ':fatapauline:',':sakurafantasykeira:',':OR_Mercury:',':Yeka:',':loren:',
      ':Kagari:',':HbFireGirl:',':geisha:',':kolyazared:',
    ]
  },
  { index: 0,
    pool: [ // BLONDE 8
      ':EvelynEmoticon:',':AoD_princess:',':minek:',':focusedsloane:',
      ':rints:',':vega:',':eve_mary:',':listine:',':cheerful:',':gs_lol:',
      ':id_sergeant:',':ms_alice:',':ana:',':sakurabeachmomokolaugh:',
      ':frightenedgirl:',':SoulMate:',':svmel:',':Julialove:',':hillary:',
      ':AshleyRE4:',':hugo:',':happy_youtuber:',':hina:',':fatamaria:',
      ':tappene:',':sakurafantasygwynne:',':rc2anka:',':rcanka:',':pi3_bella:',
      ':grill:',':jacksonevil:',':smilingreia:',':carissia:',':ElfHero:',
      ':littleheileen:',':sana:',':marian:',':serpent_helen:',':chiquita:',
    ]
  },
  { index: 0,
    pool: [ // WHITE 9
      ':yamiko:',':A_meya:',':fpalm:',':shynie:',':Shio1:',
      ':sakurafantasyardena:',':chinatsu:',':toal:',':mermaid:',':Vivianne:',
      ':NannyBrown:',':pgms_erina:',':lucille:',':amazedhitomi:',':mpgb_resabell:',
      ':Selina:',':Thunder_Girl_3:',':gl2_queen:',':ftm2_jack:',':ftm2_moon:',
      ':Enola4:',':dnage_tn:',':rei:',':gwenda:',':lei:',':ginny:',':ODWR:',
    ]
  },
  { index: 0,
    pool: [ // BROWN_A 10
      ':christine:',':AliciaVanVolish:',':rita:',':pcrita:',':maihappy:',
      ':tso4_sarah:',':ath_skydiver:',':jo:',':bcjosie:',':bdrosa:',':dh_dawn:',
      ':outsider:',':Ophelia:',':shou:',':KidMorgane:',':janetbust:',
      ':dnage_st:',':Subaru:',':xia:',':Heart_Broken:',':juliakill:',
      ':telina:',':e3_britney:',':yuna:',':evilhero:',':ftm2_elf:',':cs1_lily:',
      ':ftm1_daughter:',':Rika:',':pgms_rin:',':giselle:',':isabel:',
      ':alyx:',':boom_boom:',':ebele:',
    ]
  },
  { index: 0,
    pool: [ // BROWN_B 11
      ':Inc_Hesper:',':yuko:',':lililil:',':elenor:',':Quiet:',':bryda:',
      ':sophiemean:',':ara:',':oasezelan:',':OR_Carmine:',':mainormal:',
      ':TongueGuest:',':pgms_ayame:',':Milla:',':re0rebecca:',':Suzuha:',
      ':sakuranovareika:',':yuukismile:',':embarrassed:',':tblatha:',
      ':RedheadSarah:',':nuri:',':mechanicalengineer:',':fatanellie:',
      ':tso2_Sarah:',':elf_archer:',':karina_stream:',':XiaSleep:',':jmp_luna:',
      ':yunica:',':wee2rena:',':famous_youtuber:',':asuka:',':lisa:',':happyaka:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 12
      ':fivecolors:',':threecolors:',':trippybat:',':astralprojection:',
      ':heartless:',':TheDonuts:',':crystals:',':egg:',':fakecoloursgameicon:',
      ':Prainbow:',':rainbowfart:',':lollypop:',':fairycompanion:',':pcars:',
      ':righteye:',':garfunkel:',':HalloweenFlowers:',':rainbow:',':The_Ball:',
      ':candyrainbow:',':tisdestroyer:',':tiselements:',':tisbomb:',
      ':uno_wild:',':clownhair:',':glasswindow:',':shockedIro:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 13
      ':em05:',':em03:',':em01:',':em04:',':em02:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 14
      ':blocks1:',':blocks4:',':blocks5:',':blocks3:',':blocks2:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 15
      ':SNF2:',':SNF4:',':SNF1:',':SNF5:',':SNF3:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 16
      ':bloodgear:', ':neutralgear:',':icegear:',':goldengear:',':dullgear:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 17
      ':Angrygerka:',':TrollGerka:',':SadGerka:',':Cheergerka:',':HappyGerka:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 18
      ':LightRedCube:',':GreenCube:',':LightBlueCube:',':YellowCube:',':PinkCube:',
    ]
  },
  { index: 0,
    pool: [ // RAINBOW 19
      ':Red_Box:',':Green_Box:',':Blue_Box:',':Yellow_Box:',':Purple_Box:',
    ]
  },
];
unsafeWindow.emoticon_static_trade = { index: 0, pool: [
  { index: 0, pool: emoticon_static[2].pool.slice(0) },
  { index: 0, pool: emoticon_static[3].pool.slice(0) },
  { index: 0, pool: emoticon_static[4].pool.slice(0) },
  { index: 0, pool: emoticon_static[5].pool.slice(0) },
  { index: 0, pool: emoticon_static[6].pool.slice(0) },
  { index: 0, pool: emoticon_static[7].pool.slice(0) },
  { index: 0, pool: emoticon_static[8].pool.slice(0) },
  { index: 0, pool: emoticon_static[9].pool.slice(0) },
  { index: 0, pool: emoticon_static[10].pool.slice(0) },
  { index: 0, pool: emoticon_static[11].pool.slice(0) },
]};
unsafeWindow.avatars = { index: 0, pool: [
  [398150,0],[398150,1],[398150,2],[398150,4],[398150,5],[398150,6],
  [388750,2],[388750,3],[388750,7],[388750,9],[388750,11],[388750,17],[388750,21],
  [639780,0],[639780,1],[639780,2],[639780,5],[639780,7],[639780,9],[639780,10],[639780,11],[639780,12],[639780,13],
  [439350,1],[439350,4],[439350,14],[439350,15],[439350,18],[439350,60],[439350,66],[439350,78],[439350,90],
  [691770,0],[691770,1],[691770,2],[691770,3],[691770,6],[691770,7],[691770,9],[691770,10],[691770,12],[691770,14],
  [644200,0],[644200,1],[644200,4],[644200,7],[644200,10],
  [576020,1],[576020,2],[576020,5],
  [458730,1],[458730,2],[458730,3],[458730,4],[458730,5],[458730,6],[458730,7],
  [294810,1],[294810,4],[294810,8],[294810,11],
  [204960,0],[204960,4],[204960,5],
  [604170,0],[604170,1],[604170,2],[604170,3],[604170,4],[604170,5],[604170,6],[604170,7],
  [575650,3],
  [452440,0],[452440,1],[452440,4],[452440,7],[452440,8],
  [444140,0],[444140,7],
  [408640,0],[408640,4],
  [377880,0],[377880,1],[377880,2],[377880,3],[377880,4],
  [413410,0],[413410,5],[413410,8],[413410,11],[413410,15],
  [390730,4],[390730,7],[390730,13],
  [263300,6],
  [413420,0],[413420,4],[413420,5],[413420,6],[413420,13],
  [609940,3],
  [574740,0],[574740,2],
  [445430,3],[445430,5],[445430,6],[445430,7],
  [776490,0],[776490,1],[776490,2],[776490,3],[776490,4],[776490,5],[776490,6],[776490,7],[776490,8],[776490,9],[776490,10],[776490,11],[776490,12],[776490,13],[776490,14],
  [421600,0],[421600,1],[421600,2],[421600,3],[421600,4],[421600,6],
  [215830,0],[215830,2],[215830,3],
  [557420,0],[557420,1],[557420,2],[557420,3],[557420,4],
  [438090,0],
  [379980,0],[379980,1],[379980,2],[379980,3],[379980,4],
  [222940,1],[222940,2],[222940,9],[222940,16],[222940,17],[222940,19],[222940,22],[222940,33],
  [720150,0],
  [601790,0],
  [622670,0],
  [653950,0],
  [477740,1],[477740,5],[477740,7],[477740,12],[477740,13],[477740,16],
  [574860,0],
  [587570,1],
  [712790,0],
  [686760,0],[686760,1],
  [600090,0],
  [687750,0],
  [565660,0],
  [544190,0],
  [533470,0],
  [486510,0],[486510,1],[486510,2],[486510,3],
  [490390,0],
  [490160,0],
  [421670,0],
  [444000,0],
  [333980,0],
  [325150,1],
  [712050,0],
  [712840,0],
  [427700,1],
  [740260,0],
  [727090,0],
  [748480,0],
  [711990,0],
  [255070,0],[255070,5],
  [27000,0],[27000,1],[27000,2],[27000,4],[27000,5],[27000,7],[27000,9],[27000,12],[27000,13],
  [92220,2],
  [31980,1],
  [738920,0],[738920,1],
  [57000,2],
  [251410,3],
  [321330,0],
  [374030,1],[374030,2],
  [600550,0],
  [320760,0],[320760,1],[320760,2],[320760,3],[320760,4],[320760,5],[320760,6],
  [317280,0],[317280,2],
  [476020,0],[476020,1],
  [558490,0],
  [284140,0],[284140,1],[284140,3],[284140,6],
  [262470,12],
  [327310,0],[327310,2],
  [449340,0],
  [409280,0],
  [446250,0],
  [464670,0],[464670,2],[464670,3],[464670,4],[464670,5],[464670,6],[464670,7],[464670,8],[464670,9],
  [399130,0],[399130,2],
  [555320,0],
  [440340,0],[440340,1],[440340,2],[440340,3],
  [530500,0],
  [508740,3],
  [529660,0],
  [623940,0],
  [654390,3],[654390,4],[654390,5],[654390,6],[654390,7],[654390,9],[654390,12],
  [645690,0],
  [458680,13],[458680,23],
  [669280,0],[669280,1],[669280,2],[669280,3],[669280,4],
  [259490,5],
  [252030,1],[252030,3],
  [217140,0],[217140,4],
  [211260,1],[211260,2],
  [92000,0],
  [315850,0],
  [290790,19],
  [494230,0],
  [603700,0],
  [578720,0],[578720,1],
  [688570,0],
  [372750,0],[372750,1],[372750,2],[372750,3],[372750,4],[372750,5],
  [717610,2],
  [512600,0],
  [512120,0],
  [328640,0],
  [319470,1],
  [323490,0],[323490,1],[323490,2],[323490,3],[323490,4],[323490,5],[323490,6],[323490,7],[323490,9],
  [435360,0],[435360,1],[435360,2],[435360,3],[435360,4],[435360,5],[435360,6],
  [334850,5],
  [277890,0],
  [340730,3],[340730,5],[340730,6],
  [348240,0],[348240,1],[348240,2],[348240,3],[348240,4],[348240,5],[348240,7],[348240,8],[348240,9],[348240,10],[348240,11],[348240,12],
  [302290,0],[302290,1],[302290,2],[302290,3],
  [371120,0],[371120,1],[371120,2],[371120,3],[371120,4],[371120,6],
  [325120,0],[325120,1],[325120,2],[325120,3],[325120,4],[325120,5],[325120,6],[325120,7],
  [720280,0],
  [686180,0],
  [716030,0],
  [102200,1],
  [102700,5],[102700,24],[102700,27],
  [104700,6],
  [108710,1],
  [109400,1],[109400,3],[109400,8],
  [109410,2],
  [203750,3],
  [204300,5],[204300,6],[204300,7],[204300,31],[204300,32],
  [206500,8],[206500,9],[206500,16],[206500,17],[206500,18],[206500,19],[206500,20],[206500,22],[206500,24],[206500,28],[206500,32],[206500,38],[206500,42],[206500,43],[206500,44],[206500,45],[206500,46],[206500,48],[206500,51],
  [207230,3],[207230,4],[207230,5],[207230,6],[207230,7],[207230,13],[207230,14],[207230,16],[207230,17],[207230,29],[207230,30],[207230,31],[207230,39],
  [210770,0],[210770,1],
  [212480,8],[212480,10],[212480,16],[212480,25],
  [218330,22],[218330,23],
  [218620,48],
  [221790,0],[221790,7],[221790,8],[221790,15],
  [226980,0],[226980,4],[226980,10],[226980,17],[226980,22],
  [227560,0],
  [228960,9],[228960,11],
  [232450,12],[232450,15],[232450,16],
  [232890,9],
  [236110,2],
  [236150,5],
  [237990,0],[237990,7],
  [239220,18],
  [2400,2],
  [250110,0],[250110,2],[250110,3],[250110,10],[250110,12],[250110,14],
  [251290,0],[251290,3],[251290,6],
  [251850,0],
  [252310,1],
  [253230,1],[253230,8],
  [253610,2],
  [256460,0],[256460,1],[256460,2],
  [258090,0],[258090,2],[258090,4],[258090,17],[258090,21],
  [261350,1],
  [261720,3],
  [262150,0],
  [263400,7],[263400,16],
  [263520,0],
  [263600,0],
  [264360,6],
  [264560,4],[264560,5],[264560,13],
  [265870,1],[265870,2],
  [266030,0],
  [266490,0],
  [268930,0],[268930,2],[268930,4],[268930,8],
  [272060,0],
  [273110,2],[273110,6],[273110,8],[273110,20],[273110,24],[273110,27],[273110,28],
  [277110,0],[277110,3],[277110,4],
  [277270,1],[277270,2],[277270,4],
  [282800,7],[282800,10],[282800,11],[282800,16],[282800,24],[282800,41],
  [283880,1],[283880,4],
  [290710,0],
  [290830,3],[290830,4],
  [291130,0],
  [291410,2],[291410,5],[291410,13],[291410,21],[291410,30],
  [291710,4],
  [293260,5],
  [293680,0],[293680,1],[293680,2],[293680,3],[293680,4],[293680,6],
  [294860,0],[294860,2],[294860,3],[294860,5],[294860,7],
  [298160,1],
  [299360,6],[299360,7],[299360,12],
  [302830,10],
  [303290,7],[303290,8],[303290,10],[303290,16],
  [311240,2],[311240,4],[311240,6],[311240,7],
  [313130,2],
  [313740,0],[313740,1],[313740,2],[313740,3],[313740,4],
  [314120,1],[314120,6],[314120,7],[314120,10],
  [316010,1],
  [316140,5],
  [317400,2],
  [319970,1],[319970,3],[319970,5],[319970,6],
  [328060,2],[328060,8],[328060,9],
  [328270,2],[328270,4],[328270,8],[328270,10],[328270,17],
  [331390,0],
  [333930,1],[333930,5],[333930,8],[333930,13],[333930,20],
  [334030,0],[334030,1],[334030,2],[334030,3],[334030,12],[334030,19],[334030,21],[334030,29],[334030,31],
  [336090,2],
  [336380,0],
  [345820,0],[345820,1],[345820,2],[345820,3],[345820,10],
  [35600,21],
  [36620,2],
  [36630,0],
  [368750,0],[368750,4],
  [372000,0],
  [375040,1],
  [379870,2],[379870,3],
  [381560,0],
  [385070,1],[385070,2],[385070,7],
  [38600,0],[38600,1],[38600,7],[38600,10],
  [386360,6],[386360,7],[386360,9],[386360,10],[386360,11],[386360,13],[386360,14],[386360,16],[386360,18],[386360,20],[386360,25],[386360,29],[386360,31],[386360,38],[386360,39],[386360,40],[386360,41],[386360,42],[386360,50],[386360,51],
  [386770,0],[386770,2],[386770,3],[386770,4],[386770,6],[386770,7],[386770,8],[386770,9],[386770,10],[386770,11],[386770,12],[386770,13],[386770,15],
  [387240,0],
  [39120,4],[39120,7],
  [391660,3],[391660,4],[391660,7],[391660,8],
  [41010,5],[41010,9],[41010,15],
  [411830,0],
  [412170,1],[412170,6],
  [412310,4],
  [41300,0],
  [414080,0],
  [41740,0],
  [726990,0],
  [754620,0],
  [418240,0],[418240,5],
  [429790,5],[429790,16],[429790,28],
  [436150,0],
  [438100,3],[438100,5],[438100,16],[438100,29],[438100,30],[438100,39],
  [442080,14],[442080,15],[442080,16],[442080,17],[442080,19],
  [446550,1],[446550,8],[446550,10],
  [447530,0],[447530,1],[447530,4],
  [452780,0],
  [454410,0],
  [612820,1],[612820,2],[612820,6],
  [601530,0],[601530,2],
  [457590,1],[457590,2],
  [459820,0],[459820,2],[459820,3],[459820,5],[459820,6],[459820,7],[459820,8],[459820,9],[459820,10],[459820,11],[459820,12],
  [460790,0],
  [463390,0],[463390,4],[463390,6],[463390,10],[463390,11],[463390,12],
  [46520,1],[46520,3],[46520,4],
  [46570,1],[46570,2],[46570,6],[46570,8],[46570,10],
  [466170,1],[466170,3],
  [470490,0],[470490,1],[470490,2],[470490,3],
  [484950,0],
  [489070,4],[489070,5],
  [489560,0],[489560,6],[489560,7],[489560,10],[489560,12],
  [502800,0],[502800,1],
  [503300,0],
  [504230,0],
  [504410,3],
  [505080,3],
  [511680,0],[511680,1],[511680,2],
  [512060,0],[512060,1],
  [513150,2],[513150,5],[513150,8],
  [521330,2],[521330,7],[521330,14],[521330,15],[521330,16],[521330,20],
  [521470,0],[521470,4],[521470,5],
  [523680,1],[523680,44],[523680,53],[523680,64],
  [529000,0],
  [535490,0],
  [542260,0],[542260,1],[542260,2],[542260,4],
  [545650,1],[545650,3],[545650,16],[545650,17],
  [546080,2],[546080,3],[546080,4],[546080,5],
  [555210,2],
  [557890,0],
  [562540,0],
  [563760,0],
  [575010,0],
  [575550,0],
  [57740,4],[57740,11],[57740,13],
  [578900,0],[578900,3],[578900,6],
  [581130,0],
  [58230,5],[58230,6],
  [586030,1],[586030,3],
  [587460,0],[587460,3],
  [603140,4],
  [611790,0],
  [612100,0],
  [612110,0],
  [613330,1],
  [618050,0],
  [620,3],
  [622060,3],[622060,8],[622060,13],
  [63200,6],
  [633360,1],
  [635730,0],
  [639790,1],[639790,2],[639790,3],[639790,4],[639790,5],[639790,6],[639790,7],[639790,8],[639790,9],
  [639790,10],[639790,11],[639790,12],[639790,13],[639790,14],[639790,15],[639790,16],[639790,17],
  [639790,18],[639790,19],[639790,20],[639790,22],[639790,23],[639790,24],[639790,25],[639790,26],
  [639790,27],[639790,28],[639790,29],[639790,30],[639790,31],
  [644560,0],
  [657010,0],
  [661960,0],[661960,1],
  [665090,0],
  [665180,0],
  [673940,0],
  [675680,0],
  [680320,0],
  [686940,2],
  [688430,3],[688430,4],[688430,5],
  [701540,0],
  [703610,0],
  [710030,0],[710030,1],[710030,2],[710030,3],
  [720950,0],
  [732950,1],
  [739000,0],
  [420950,0],
  [746620,0],[746620,2],
  [90530,6],[90530,9],[90530,13],[90530,14],[90530,21],[90530,40],[90530,41],[90530,42],[90530,48],[90530,49],[90530,50],[90530,76],[90530,94],[90530,95],
]};
unsafeWindow.my_performances = [
  [ "$NAME pays great attention to detail. They always presented work properly checked and completely free of error.",
    "$NAME is generally good with detail and checks work thoroughly, but there have been one or two minor errors in work presented in the current period.",
    "One or two minor errors have been spotted in work presented in the current period, not putting the business at risk, but which could have been prevented if the facts and figures had been properly checked.", ],
  [ "Aiming for a top job in the organization. They set very high standards, aware that this will bring attention and promotion.",
    "$NAME is aiming for promotion, but recognizes that capabilities and prospects are limited. They set high personal standards in an attempt to do as well as possible.",
    "Expects promotion to a higher grade at some time in the future, although success at work is not the highest priority to them. Not one to exert themself unduly.",  ],
  [ "From a set of data, $NAME is able to establish a principle, or work out a rule, or suggest a reason for failure or success. Their analysis is always accurate and sometimes original.",
    "From a set of data, $NAME is able to establish a principle, or work out a rule, or suggest a reason for failure or success. Their analysis is usually accurate but not original.",
    "When working with a set of data, $NAME is beginning to learn how to organize the results, but is not yet ready or competent enough to draw the right conclusions.", ],
  [ "$NAME has outstanding artistic or craft skills, bringing creativity and originality to the task.",
    "$NAME has strong artistic or craft skills.",
    "$NAME can copy reasonably accurately, but they does not produce their own ideas.", ],
  [ "When ideas are challenged by others, $NAME listens to their view politely, but is able to maintain a position firmly and persuasively without aggression.",
    "When ideas are challenged by others, $NAME listens to their view and tries to defend a position, but may not yet have the experience or authority to present the case well. Or may be over-aggressive in defending a position.",
    "Keen to put their own ideas across, but $NAME does not give others the chance to express their view. May be tempted to overlook the input of others.", ],
  [ "No absences without valid reason in 6 months.",
    "Missed fewer than 2 days without valid reason in 6 months.",
    "Missed more than 2 but fewer than 5 days without valid reason in 6 months.", ],
  [ "Meticulous in keeping the workplace clean and tidy. $NAME makes a habit of keeping own area clean and hazard-free and also assists and encourages others to do the same.",
    "Keeps own area neat, tidy and hazard-free, but does not necessarily help or encourage others to do the same.",
    "Generally clean and tidy, but at times, their work-station needs organizing and tidying. Sometimes $NAME fails to clean up at the end of the day.", ],
  [ "Always succeeds in explaining ideas clearly. Others find $NAME easy to understand. They also has the ability to listen carefully to what others are saying, to understand and then to respond appropriately. Conversations with $NAME are two-way.",
    "$NAME has the potential to be a good communicator, although may occasionally confuse some listeners. Gives others the chance to speak too, and seems to take on board their point of view.",
    "Communicates reasonably well, but not someone you would choose to present a case effectively or to get across detailed instructions. $NAME generally seems to listen to others and take on board their views.", ],
  [ "$NAME always completes any assignment on time and to a high standard.",
    "$NAME completes 90% of assignments on time and to a good standard.",
    "$NAME completes more than 75% but less than 90% of assignments on time and to a good standard.", ],
  [ "Able to concentrate and stay focused for periods of several hours, even when tasks are relatively mundane, and doesn't make mistakes. They have a high boredom threshold.",
    "Able to concentrate and stay focused for period of several hours when a task is interesting, but attention may waver if a job is relatively mundane.",
    "Able to concentrate and stay focused for short periods of up to an hour but tends to drift after this if not presented with a new task.", ],
  [ "Always assured and confident in demeanour and presentation of ideas without being aggressively over-confident.",
    "Appears confident with familiar situations and people, but still sometimes nervous or over-confident when in an unfamiliar context.",
    "Uncertain of capabilities and needing frequent reassurance. Or over-confident and sometimes overbearing.", ],
  [ "$NAME is willing to face physical risks and danger, and appears to do so without fear. Sets an example of bravery that inspires others.",
    "May not always appear to be the bravest, but is nevertheless ready to take on tasks that involve physical risk and danger.",
    "Somewhat nervous about taking on tasks that involve physical risk and danger, but prepared to participate provided others do too.", ],
  [ "Polite, courteous, respectful and charming at all times and in all situations, without being obsequious. Unfailingly courteous even when dealing with a difficult person or situation.",
    "Generally polite, courteous and respectful, though may sometimes lose a little control when confronted with a difficult person or situation. Or perhaps sometimes seems over-polite.",
    "$NAME can be polite, respectful and courteous on occasions and with certain people, but is not by nature polite, and has upset someone once or twice in the last six months – inside the business or outside – with a lack of respect.", ],
  [ "Regularly produces creative, original ideas, plans, products or methods, well-attuned to the needs and capabilities of the organization, and producing clear benefits.",
    "Has proven ability to produce creative, original ideas, plans, products or methods,even if they’re not always practical, in line with organization needs, or successful.",
    "Has produced several plans, ideas, products and methods in the last six months. But generally they’ve been more of the same – not bursting with freshness and originality.", ],
  [ "Reacts quickly and decisively in an emergency, keeping a cool head and effectively leading others.",
    "Is a good team member in an emergency, following instructions quickly, but not taking a leadership role.",
    "Stays cool in an emergency, but needs help from others to take the right action quickly.", ],
  [ "Reaches a decision rapidly after taking account of all likely outcomes and estimating the route most likely to bring success. The decisions almost always turn out to be good ones.",
    "Makes decisions rapidly and well when dealing with small or personal matters, but still has to gain the confidence to make major decisions. Most of the decisions made turn out to be effective.",
    "Is usually decisive, but too often fails to take account of all possibilities, and this has caused a few problems in the past 6 months. Or takes account of all possibilities but takes too long to reach the final decision.", ],
  [ "Does not shirk duties, but always instigates and encourages load-sharing with other members of the team, resulting in strong group output. Consistently plans and monitors the work of team-members.",
    "Does not shirk duties, and can share the workload with other people in the team to achieve maximum group output – but does not do so consistently. Good at planning and monitoring the work of team-members.",
    "Does not shirk duties, and can share the workload with other people in the team to achieve maximum group output – but does not do so consistently. Not good at planning and monitoring the work of team-members.", ],
  [ "Responds to setbacks or adversity with redoubled vigour and enthusiasm. Will never accept that defeat is a foregone conclusion, and inspires others to stay positive and fight on.",
    "In the face of setbacks or adversity will continue to pursue the objective, and doesn’t give up. But may not be able to inspire others to continue as well.",
    "In the face of setbacks or adversity will wait to see how others respond before continuing. Will continue to pursue the objective as long as others lead the way. but will give up otherwise.", ],
  [ "Has a natural flair for jobs involving the use of the hands or hand-tools. Able to cope expertly with intricate detail.",
    "Carries out jobs requiring the use of the hands or hand-tools well, but is not yet a master craftsman.",
    "Uses the hands or hand-tools reasonably well, but has not not yet achieved fully mastery and control, and still struggles with detail and new processes.", ],
  [ "A skillful negotiator, who instinctively reads a situation correctly, understands the motivations and feelings of the other party, and chooses the right time to proceed or withdraw.",
    "A good negotiator, who usually chooses the right time to proceed or withdraw in a negotiation after reading the situation correctly. But not yet infallible and may need more experience.",
    "In negotiations, is generally aware of the motivations and feelings of the other party, but prone to an occasional blunder, which has prevented a successful outcome and may have soured a relationship.", ],
  [ "Understands the importance of confidentiality, and can always be trusted not to reveal confidential or private information to unauthorized parties.",
    "Has proved to be trustworthy, but has not yet been given access to material of a highly confidential or sensitive nature.",
    "Is somewhat casual with sensitive or confidential information, and may speak too freely to others.", ],
  [ "Always eager to take on a new task, whether hard or simple, and tackles it diligently, without question or complaint. This positive attitude inspires others too.",
    "Usually eager to work, but on one or two occasions has been less than willing to tackle an assignment within the range of competence, or reluctant to learn something new.",
    "Generally takes on tasks or assignments without objection, but does not appear to be strongly motivated, and will not inspire others.", ],
  [ "They will always willingly and successfully try to do what is required, even if it means performing tasks that are not in the job description or if required to do extra work unexpectedly.",
    "They will always try to do what is required, even if it means performing tasks that are not in the job description or if required to do extra work unexpectedly. However, may sometimes complain about the extra load.",
    "They will only grudgingly perform tasks that are outside the job description or which require extra work. However, these additional tasks are usually carried out successfully.", ],
  [ "Always follows instructions precisely and completely. However, when meeting a situation outside the rules, they knows exactly how to act in an appropriate manner. $NAME is careful to understand the instructions before starting.",
    "Follows instructions well, but has a tendency to be too literal, and can be lost unless there are firm guidelines. Or sometimes may not take sufficient care to check the instructions before starting.",
    "Tries to follow instructions but can sometimes miss a step or misinterpret what is required.", ],
  [ "Physically fit, very rarely sick, and able to meet the demands of a physically demanding job.",
    "Normally physically fit but has suffered from injury or sickness in the recent past. No problem predicted with physically demanding jobs in the future.",
    "Question-marks over physical fitness and may not be ready at this time for a physically demanding job.", ],
  [ "A self-starter – someone who always finds out the right thing to do and gets on with the job. If a manager has given no guidance $NAME will still take appropriate action. If the required tools are unavailable, they is able to improvise.",
    "$NAME always gets on with the job after being given clear parameters. Generally able to come up with they own ideas when help is not available, but may be still lacking the self-confidence to trust own judgment.",
    "Needs a supervisor to give instructions, but after receiving them gets on with the job. However, sometimes needs to come back and ask for more guidance.", ],
  [ "Habitually asks questions in order to fully understand a position or a statement. Keeps asking until the facts are clear and the truth is understood.",
    "$NAME is interested in finding out why things are the way they are. Asks questions, but may stop if not getting the answers quickly or easily enough.",
    "Interested in learning about other people and the world, but tends to let others ask the questions and find the answers.", ],
  [ "Applies professional experience and/or knowledge of people expertly to forecast outcomes with at least 90% accuracy. Others trust their judgement because the choices have usually been good.",   "Applies professional experience and/or knowledge of people well to forecast outcomes with at least 75% accuracy.",
    "Applies professional experience and/or knowledge of people reasonably well to forecast outcomes with at least 60% accuracy.", ],
  [ "A natural leader. People tend to listen and follow their example and guidance. $NAME is chosen as leader without making an issue of leadership.",
    "Works well in association with another leader. A good number 2, commanding the respect of a team.",
    "$NAME has some leadership qualities, but sometimes upsets people in the team by being over-assertive. Or still reluctant to take the lead.", ],
  [ "$NAME has a flair for creative, original writing and makes an impact on the reader. Can adapt the style to the purpose. Never makes mistakes with grammar, spelling or style.",
    "They are a competent writer who reliably produces professional business correspondence and reports free of spelling, grammar and structural mistakes.",
    "With a supervisor checking for occasional spelling, grammar and style errors, $NAME can produce business correspondence and reports of acceptable quality.", ],
  [ "When working to a firm but realistic deadline, $NAME always completes tasks to a high standard. Care and accuracy is obvious even when put under pressure of time. Prepared to work all the extra hours it takes to meet the deadline.",
    "When working to a firm but realistic deadline, $NAME always completes tasks to an adequate standard. Accuracy and neatness may suffer but the outcome is acceptable. Puts in some extra hours to meet the deadline.",
    "When working to a firm but realistic deadline, $NAME sometimes fails to complete the task because unprepared to work extra hours to meet the deadline. Or completes the task, but with some serious flaws.", ],
  [ "Intellectually versatile. When a topic is unfamiliar or new concepts are put forward, $NAME listens, learns and adjusts quickly, and is soon making a full and useful contribution to the conversation.",
    "Smart, and not afraid of unfamiliar topics and new concepts, and shows a good ability to learn and adapt. But it usually takes a session or two before $NAME will engage in the discussion.",
    "When a topic is unfamiliar or new concepts are put forward, $NAME engages in the conversation, but contributions show a lack of understanding at first. Needs to make more effort to listen, learn and adjust.", ],
  [ "Silver-tongued, and usually successful when trying to persuade others to move from their original position towards or beyond compromise. Using personality, logic, persistence, $NAME always manages to get the best deal.",
    "Always looking for the opportunity to negotiate and often successful in getting a good deal. But sometimes $NAME fails to press home the advantage, and doesn't get the best deal possible.",
    "Sometimes $NAME  needs to be reminded to negotiate, but then does so reasonably well, and sometimes manages to get others to change their position and get a good deal.", ],
  [ "Fast and accurate at solving mental math problems and has high-level skills requiring complex calculation and analysis.",
    "Fast and accurate at solving mental math problems involving addition, subtraction, multiplication, division and percentages – but without high-level skills that might be required in jobs requiring complex calculation and analysis.",
    "Accurate at solving mental math problems involving addition, subtraction, multiplication, division and percentages – but without a calculator, cannot reach the answer at speed.", ],
  [ "Prioritizes and sequences own tasks and those of other people in the team. Makes sure that the priority tasks are always completed on time.",
    "Good at organizing own work and usually finishes priority tasks on time, but there is less evidence of organizing the work of the team.",
    "$NAME does the right things at the right time when instructed. But without instruction, sometimes they fails to spot the priorities and sometimes completes work late.", ],
  [ "When dressed for the job, personal appearance and dress immediately impress. Distinctive, perhaps distinguished.",
    "When dressed for the job, personal appearance and dress don’t stand out, but this person is always neat and tidy.",
    "Not especially neat and tidy, but adequate for the job.", ],
  [ "A pleasant, outgoing personality who always gets on well with others. $NAME will always be noticed and popular in a group.",
    "Easy-going, relaxed, always welcome in a group – though not the strongest personality.",
    "$NAME willingly joins groups, but tends to remain anonymous.", ],
  [ "$NAME has a powerful physique, suited for heavyweight jobs, or situations when it’s an advantage to appear strong.",
    "Not necessarily a powerful build, but someone who is capable of taking on heavy, physically demanding jobs.",
    "Of average build. $NAME is ready to contribute to heavy or physical jobs, but needs help from people better equipped.", ],
  [ "$NAME habitually plans and sequences own work and that of others. Ensures that objectives are clearly established, and that work is systematically carried out in order to achieve the objectives. Communicates plans clearly to others.",
    "$NAME habitually plans and sequences own work but not that of others. Ensures that objectives are clearly established, and that work is systematically carried out in order to achieve the objectives.",
    "$NAME is capable of planning and sequencing own work, but does not yet do so consistently. When work is planned, usually works systematically towards objectives.", ],
  [ "$NAME enjoys public speaking, and is very well received by audiences. Eloquent, clear, persuasive, interesting, always captures the interest and fires the imagination of listeners. Comfortable in any situation, even when speaking unprepared and without notes.",
    "A persuasive, engaging speaker when well-prepared, but uncomfortable and less effective when asked to speak off-the-cuff.",
    "$NAME can hold and engage an audience, but not convincing or persuasive enough to be used as a keynote speaker/presenter.", ],
  [ "$NAME responds well when put under pressure – and accepts that pressure is a regular part of the job.",
    "$NAME responds well when put under pressure – but prefers not to be pressurized all the time.",
    "$NAME copes with short periods of pressure, but the quality of work and level of enthusiasm begin to decline if the pressure continues for a longer period.", ],
  [ "In all aspects of work, $NAME is not satisfied unless achieving the highest standards. Works relentlessly to improve skills and knowledge, and the quality of work output.",
    "Performs most jobs well and has the habit of checking work outcomes. $NAME is achieving excellence in some areas but in others is not yet achieving the highest standards.",
    "Performs to an adequate standard but is not yet achieving excellence in any area. $NAME generally checks work to make sure it has been done properly.", ],
  [ "Considers problems as a challenge and enjoys finding creative yet appropriate solutions. $NAME is able to work out their own solutions, but also works well with a group to solve problems.",
    "$NAME likes to work with problems and enjoys problem-solving sessions. They present ideas and solutions but these are sometimes limited or unworkable.",
    "$NAME has their own ideas when faced with a problem, but is reluctant to implement them unless others are supportive. Cautious with original ideas.", ],
  [ "Late on fewer than 3 occasions in 6 months.",
    "Late on more than 3 but fewer than 5 occasions in 6 months.",
    "Late on more than 5 but fewer than 8 occasions in 6 months.", ],
  [ "$NAME accepts criticism cheerfully, and uses criticism productively to develop own abilities and skills.",
    "$NAME takes criticism seriously and tries to learn from it, though can sometimes be a little defensive.",
    "Usually defensive when efforts are criticised – but they nevertheless tries to learn from mistakes.", ],
  [ "Always contributes vigorously to the efforts of the team, whether as a leader or a team member. Understands own weaknesses ond others’ strengths and goes to the right people for help. Sympathetically helps others to address their weaknesses.",
    "Works willingly in a team and tolerant of others, no matter what their strengths and weaknesses. But does not always make a strong contribution.",
    "Works willingly in a team and tolerant of others, no matter what their strengths and weaknesses. But tends to rely mostly on the contributions of others, and makes only a limited contribution.", ],
  [ "$NAME enjoys working without supervision and always continues to carry out duties effectively. But also knows when a supervisor’s advice or authority is required, and seeks help at the appropriate time.",
    "$NAME enjoys working without supervision and usually continues to carry out duties effectively. Still needs to learn when it is appropriate to call for a supervisor’s advice or authority to act.",
    "$NAME still needs to learn the job better and required supervisor's assistance regularly. Provided supervisor help is close at hand, performs the job well.", ],
];
unsafeWindow.backgrounds = { index: 0, pool: [
  { id: 3792187130, market_fee_app: 342580, market_name: "Megara", tags: [{}, { name: "12 Labours of Hercules"}] },
  { id: 3858841470, market_fee_app: 369420, market_name: "Entering the asylum", tags: [{}, { name: "9 Clues 2: The Ward"}] },
  { id: 3778651833, market_fee_app: 284870, market_name: "Town's Library", tags: [{}, { name: "9 Clues: The Secret of Serpent Creek"}] },
  { id: 3882446587, market_fee_app: 460910, market_name: "A-Gents Emma Uniform", tags: [{}, { name: "A-Gents"}] },
  { id: 4142833138, market_fee_app: 315340, market_name: "Survivor", tags: [{}, { name: "A.R.E.S. Extinction Agenda EX"}] },
  { id: 4672474391, market_fee_app: 315340, market_name: "Operator Room", tags: [{}, { name: "A.R.E.S. Extinction Agenda EX"}] },
  { id: 4999429957, market_fee_app: 265170, market_name: "Iru and QP", tags: [{}, { name: "Acceleration of Suguri X-Edition"}] },
  { id: 4023014699, market_fee_app: 265170, market_name: "Sora and Kae", tags: [{}, { name: "Acceleration of Suguri X-Edition"}] },
  { id: 5061638179, market_fee_app: 483420, market_name: "Allie Wolfe", tags: [{}, { name: "Adam Wolfe"}] },
  { id: 3858849357, market_fee_app: 326190, market_name: "Anna", tags: [{}, { name: "Alchemy Mysteries: Prague Legends"}] },
  { id: 4737093423, market_fee_app: 266940, market_name: "Ms. Patterson", tags: [{}, { name: "Alex Hunter - Lord of the Mind"}] },
  { id: 5041447847, market_fee_app: 291030, market_name: "Amy & Nina", tags: [{}, { name: "Always Remember Me"}] },
  { id: 3740807529, market_fee_app: 291030, market_name: "Abigail Elegant", tags: [{}, { name: "Always Remember Me"}] },
  { id: 4018021725, market_fee_app: 581280, market_name: "OiBackground 1", tags: [{}, { name: "Anime! Oi history!"}] },
  { id: 5051747583, market_fee_app: 440540, market_name: "Heroes of Ara Fell", tags: [{}, { name: "Ara Fell"}] },
  { id: 4839232638, market_fee_app: 273240, market_name: "Whoo!", tags: [{}, { name: "Armored Hunter GUNHOUND EX"}] },
  { id: 5032600274, market_fee_app: 273240, market_name: "Base at Dusk", tags: [{}, { name: "Armored Hunter GUNHOUND EX"}] },
  { id: 4853656868, market_fee_app: 386990, market_name: "Samantha Taylor Coleridge", tags: [{}, { name: "Asphyxia"}] },
  { id: 3948368633, market_fee_app: 386990, market_name: "Lillian Wordsworth", tags: [{}, { name: "Asphyxia"}] },
  { id: 3589349189, market_fee_app: 386990, market_name: "Tabitha De Quincey", tags: [{}, { name: "Asphyxia"}] },
  { id: 4989818547, market_fee_app: 386990, market_name: "Roberta Southey", tags: [{}, { name: "Asphyxia"}] },
  { id: 3935570199, market_fee_app: 386990, market_name: "Alexandra Pope", tags: [{}, { name: "Asphyxia"}] },
  { id: 5063345354, market_fee_app: 268420, market_name: "Guardian - Gardienne", tags: [{}, { name: "Aura Kingdom"}] },
  { id: 5070169469, market_fee_app: 268420, market_name: "Sorcerer - Grimoire", tags: [{}, { name: "Aura Kingdom"}] },
  { id: 5239431049, market_fee_app: 529000, market_name: "lola", tags: [{}, { name: "Bad ass babes"}] },
  { id: 3782857014, market_fee_app: 314200, market_name: "Tina", tags: [{}, { name: "Bionic Heart"}] },
  { id: 3778669604, market_fee_app: 314200, market_name: "Julia", tags: [{}, { name: "Bionic Heart"}] },
  { id: 3740976123, market_fee_app: 317290, market_name: "Tanya", tags: [{}, { name: "Bionic Heart 2"}] },
  { id: 4718688946, market_fee_app: 9940, market_name: "Darque", tags: [{}, { name: "Blade Kitten"}] },
  { id: 4793114353, market_fee_app: 386480, market_name: "Dina", tags: [{}, { name: "Blood Code"}] },
  { id: 5063717406, market_fee_app: 386480, market_name: "Alison", tags: [{}, { name: "Blood Code"}] },
  { id: 5053767284, market_fee_app: 49520, market_name: "The Siren Calls", tags: [{}, { name: "Borderlands 2"}] },
  { id: 4862702334, market_fee_app: 262940, market_name: "Bijou", tags: [{}, { name: "Broken Sword 5 - the Serpent's Curse"}] },
  { id: 4951714899, market_fee_app: 262940, market_name: "Nico", tags: [{}, { name: "Broken Sword 5 - the Serpent's Curse"}] },
  { id: 3749983568, market_fee_app: 335660, market_name: "Evil Marin", tags: [{}, { name: "CAFE 0 ~The Drowned Mermaid~"}] },
  { id: 4693895202, market_fee_app: 386770, market_name: "Eleanor Riegel", tags: [{}, { name: "Caladrius Blaze"}] },
  { id: 3908195796, market_fee_app: 290710, market_name: "Kathleen Petersen", tags: [{}, { name: "Cloud Chamber"}] },
  { id: 4285230653, market_fee_app: 292200, market_name: "Miss Bella and Miss Andressa", tags: [{}, { name: "Crazy Plant Shop"}] },
  { id: 5197826842, market_fee_app: 542290, market_name: "Hinomoto Aoi", tags: [{}, { name: "Da Capo 3 R"}] },
  { id: 3858878531, market_fee_app: 394280, market_name: "Teacher", tags: [{}, { name: "Dark Heritage: Guardians of Hope"}] },
  { id: 4151942358, market_fee_app: 532090, market_name: "Vera", tags: [{}, { name: "Dawn's Light 2"}] },
  { id: 5004540363, market_fee_app: 314180, market_name: "Follet & Rosa", tags: [{}, { name: "Deathsmiles"}] },
  { id: 3778715822, market_fee_app: 330990, market_name: "Dawn at Garden", tags: [{}, { name: "Demon Hunter: Chronicles from Beyond"}] },
  { id: 4858693067, market_fee_app: 284220, market_name: "Determination", tags: [{}, { name: "Diadra Empty"}] },
  { id: 4932146059, market_fee_app: 371120, market_name: "Supporting actors", tags: [{}, { name: "Discouraged Workers"}] },
  { id: 4983088104, market_fee_app: 371120, market_name: "Clerk", tags: [{}, { name: "Discouraged Workers"}] },
  { id: 4865335896, market_fee_app: 432180, market_name: "Newspaper delivery", tags: [{}, { name: "Discouraged Workers TEEN"}] },
  { id: 5080902380, market_fee_app: 495280, market_name: "Rozalin", tags: [{}, { name: "Disgaea 2 PC"}] },
  { id: 326985907, market_fee_app: 225140, market_name: "Invasion", tags: [{}, { name: "Duke Nukem 3D: Megaton Edition"}] },
  { id: 4766922455, market_fee_app: 258030, market_name: "Rebellious Princess", tags: [{}, { name: "Earthlock: Festival of Magic"}] },
  { id: 5008348780, market_fee_app: 356560, market_name: "Kurenai - Standard Boxart", tags: [{}, { name: "East Tower - Kurenai"}] },
  { id: 4862901697, market_fee_app: 284770, market_name: "Scared to death", tags: [{}, { name: "Enigmatis 2: The Mists of Ravenwood"}] },
  { id: 4306711044, market_fee_app: 284750, market_name: "Town", tags: [{}, { name: "Enigmatis: The Ghosts of Maple Creek"}] },
  { id: 5058864622, market_fee_app: 292120, market_name: "Serah", tags: [{}, { name: "FINAL FANTASY XIII"}] },
  { id: 4932647698, market_fee_app: 259720, market_name: "Sophia's on an adventure", tags: [{}, { name: "Fading Hearts"}] },
  { id: 5052127690, market_fee_app: 259720, market_name: "Welcome to the Maid Cafe!", tags: [{}, { name: "Fading Hearts"}] },
  { id: 4932647680, market_fee_app: 259720, market_name: "Strength in Numbers", tags: [{}, { name: "Fading Hearts"}] },
  { id: 5046960113, market_fee_app: 303790, market_name: "Heroes of Avalon", tags: [{}, { name: "Faery - Legends of Avalon"}] },
  { id: 5003199094, market_fee_app: 599480, market_name: "Site", tags: [{}, { name: "Flamel's miracle（弗拉梅尔的奇迹）"}] },
  { id: 4961332814, market_fee_app: 290990, market_name: "Jill", tags: [{}, { name: "Flower Shop: Summer In Fairbrook"}] },
  { id: 1222011172, market_fee_app: 290990, market_name: "Clara", tags: [{}, { name: "Flower Shop: Summer In Fairbrook"}] },
  { id: 3716503239, market_fee_app: 332400, market_name: "Joy", tags: [{}, { name: "Girlfriend Rescue"}] },
  { id: 4115347004, market_fee_app: 449170, market_name: "Wizard", tags: [{}, { name: "Gnomes Garden 2"}] },
  { id: 4843893542, market_fee_app: 406220, market_name: "Qloey the Gnome", tags: [{}, { name: "Gnomes Vs. Fairies"}] },
  { id: 3907477153, market_fee_app: 279800, market_name: "The ultimate sacrifice", tags: [{}, { name: "Grim Legends 2: Song of the Dark Swan"}] },
  { id: 5037468158, market_fee_app: 314030, market_name: "[GG#R] Baiken", tags: [{}, { name: "Guilty Gear X2 #Reload"}] },
  { id: 4961332747, market_fee_app: 314030, market_name: "[GG#R] Dizzy", tags: [{}, { name: "Guilty Gear X2 #Reload"}] },
  { id: 4995202851, market_fee_app: 314030, market_name: "[GG#R] Millia", tags: [{}, { name: "Guilty Gear X2 #Reload"}] },
  { id: 5000252237, market_fee_app: 314030, market_name: "[GG#R] May", tags: [{}, { name: "Guilty Gear X2 #Reload"}] },
  { id: 5046712232, market_fee_app: 314030, market_name: "[GG#R] I-No", tags: [{}, { name: "Guilty Gear X2 #Reload"}] },
  { id: 3903066843, market_fee_app: 260550, market_name: "Haunted Background 03", tags: [{}, { name: "Haunted"}] },
  { id: 4240432745, market_fee_app: 494230, market_name: "Allison & Team", tags: [{}, { name: "Heart's Medicine - Time to Heal"}] },
  { id: 3742411724, market_fee_app: 302950, market_name: "Marie", tags: [{}, { name: "Heileen 1: Sail Away"}] },
  { id: 4006932277, market_fee_app: 302950, market_name: "Lora", tags: [{}, { name: "Heileen 1: Sail Away"}] },
  { id: 3904910924, market_fee_app: 305490, market_name: "Forbidden fruit", tags: [{}, { name: "Heileen 3: New Horizons"}] },
  { id: 4164865491, market_fee_app: 305490, market_name: "Heileen saint", tags: [{}, { name: "Heileen 3: New Horizons"}] },
  { id: 5115774707, market_fee_app: 482990, market_name: "Rene", tags: [{}, { name: "Heirs And Graces"}] },
  { id: 4071561348, market_fee_app: 271970, market_name: "Apil", tags: [{}, { name: "Hero and Daughter+"}] },
  { id: 5042183257, market_fee_app: 347590, market_name: "Heracles", tags: [{}, { name: "Heroes of Hellas 3: Athens"}] },
  { id: 4838395757, market_fee_app: 347610, market_name: "How it all started", tags: [{}, { name: "Hidden Object Bundle 4 in 1"}] },
  { id: 4785833510, market_fee_app: 347610, market_name: "Lack of Scientists", tags: [{}, { name: "Hidden Object Bundle 4 in 1"}] },
  { id: 4981012392, market_fee_app: 310360, market_name: "Rena Ryugu", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.1 Onikakushi"}] },
  { id: 3925865231, market_fee_app: 310360, market_name: "Mion Sonozaki", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.1 Onikakushi"}] },
  { id: 5041760349, market_fee_app: 310360, market_name: "Satoko Houjou", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.1 Onikakushi"}] },
  { id: 5054625988, market_fee_app: 410890, market_name: "Mion Sonozaki", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.2 Watanagashi"}] },
  { id: 5192772327, market_fee_app: 410890, market_name: "Rena Ryugu", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.2 Watanagashi"}] },
  { id: 5041760336, market_fee_app: 410890, market_name: "Satoko Houjou", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.2 Watanagashi"}] },
  { id: 5048735105, market_fee_app: 472870, market_name: "Rumiko Chie", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.3 Tatarigoroshi"}] },
  { id: 3925865243, market_fee_app: 526490, market_name: "Oddball", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.4 Himatsubushi"}] },
  { id: 4892525345, market_fee_app: 577480, market_name: "Surprised", tags: [{}, { name: "Higurashi When They Cry Hou - Ch.5 Meakashi"}] },
  { id: 5063414166, market_fee_app: 554290, market_name: "Asuka", tags: [{}, { name: "Himawari - The Sunflower -"}] },
  { id: 5000026833, market_fee_app: 467960, market_name: "Banan", tags: [{}, { name: "Home Behind"}] },
  { id: 4030831219, market_fee_app: 286500, market_name: "Good old times", tags: [{}, { name: "House of 1,000 Doors - Family Secrets"}] },
  { id: 5007295257, market_fee_app: 486810, market_name: "High Society", tags: [{}, { name: "House of Snark 6-in-1 Bundle"}] },
  { id: 5041908043, market_fee_app: 415480, market_name: "Hyperdevotion Vio", tags: [{}, { name: "Hyperdevotion Noire: Goddess Black Heart"}] },
  { id: 3947564491, market_fee_app: 343430, market_name: "Hypnosis Maya", tags: [{}, { name: "Hypnosis"}] },
  { id: 4184267809, market_fee_app: 326480, market_name: "Ageha", tags: [{}, { name: "If My Heart Had Wings"}] },
  { id: 5055954720, market_fee_app: 326480, market_name: "Asa", tags: [{}, { name: "If My Heart Had Wings"}] },
  { id: 3788231271, market_fee_app: 302290, market_name: "Casual Hangout", tags: [{}, { name: "Infinite Game Works Episode 0"}] },
  { id: 3806414563, market_fee_app: 243970, market_name: "Nika & Banks", tags: [{}, { name: "Invisible, Inc."}] },
  { id: 4843347694, market_fee_app: 327670, market_name: "Ironcast - Ironcast Ladies", tags: [{}, { name: "Ironcast"}] },
  { id: 5060011194, market_fee_app: 464080, market_name: "Walk on the bridge", tags: [{}, { name: "Kyoto Colorful Days"}] },
  { id: 5053025420, market_fee_app: 487630, market_name: "The Princess Awaits", tags: [{}, { name: "Lantern"}] },
  { id: 4978489485, market_fee_app: 355530, market_name: "Whitty Gawship", tags: [{}, { name: "Last Word"}] },
  { id: 4393315458, market_fee_app: 554600, market_name: "Charlotte & Tia", tags: [{}, { name: "Learn Japanese To Survive! Katakana War"}] },
  { id: 3908288742, market_fee_app: 284890, market_name: "Where are they?", tags: [{}, { name: "Left in the Dark: No One on Board"}] },
  { id: 3908199819, market_fee_app: 328270, market_name: "Leviathan: Mother", tags: [{}, { name: "Leviathan: The Last Day of the Decade"}] },
  { id: 4106559074, market_fee_app: 350490, market_name: "Shopping", tags: [{}, { name: "Love And Order"}] },
  { id: 4961416329, market_fee_app: 353330, market_name: "Cool", tags: [{}, { name: "Love at First Sight"}] },
  { id: 5030834366, market_fee_app: 547340, market_name: "Sara and Akiba", tags: [{}, { name: "LoveKami -Divinity Stage-"}] },
  { id: 5062490867, market_fee_app: 547340, market_name: "Kagura and Akiba", tags: [{}, { name: "LoveKami -Divinity Stage-"}] },
  { id: 5228426952, market_fee_app: 626510, market_name: "Goddesses and the Old Town", tags: [{}, { name: "LoveKami -Useless Goddess-"}] },
  { id: 4034911919, market_fee_app: 523150, market_name: "Level 1", tags: [{}, { name: "Mahjong World Contest"}] },
  { id: 5041904580, market_fee_app: 443330, market_name: "The Polar Laboratory - light -", tags: [{}, { name: "Malus Code"}] },
  { id: 5365502241, market_fee_app: 443330, market_name: "Yuri & Yae", tags: [{}, { name: "Malus Code"}] },
  { id: 5040768170, market_fee_app: 496810, market_name: "Vert Background", tags: [{}, { name: "MegaTagmension Blanc + Neptune VS Zombies"}] },
  { id: 4838399646, market_fee_app: 243200, market_name: "Satinav's Watchful Eye", tags: [{}, { name: "Memoria"}] },
  { id: 5068983252, market_fee_app: 473460, market_name: "Have a rest", tags: [{}, { name: "Memory Oblivion Box"}] },
  { id: 4979300586, market_fee_app: 386970, market_name: "Reina & Sorano", tags: [{}, { name: "Memory's Dogma CODE:01"}] },
  { id: 4906192664, market_fee_app: 386970, market_name: "Haruna", tags: [{}, { name: "Memory's Dogma CODE:01"}] },
  { id: 3917411862, market_fee_app: 298820, market_name: "Dee", tags: [{}, { name: "Millennium 2 - Take Me Higher"}] },
  { id: 3968770029, market_fee_app: 298850, market_name: "Marine and Jeanne", tags: [{}, { name: "Millennium 5 - The Battle of the Millennium"}] },
  { id: 3947299577, market_fee_app: 298850, market_name: "Karine and Jezabel", tags: [{}, { name: "Millennium 5 - The Battle of the Millennium"}] },
  { id: 5073991491, market_fee_app: 623670, market_name: "Moe Mekuri 2 girls", tags: [{}, { name: "Moe Mekuri SP - 萌めくりSP -"}] },
  { id: 5379687203, market_fee_app: 529160, market_name: "Iruse", tags: [{}, { name: "Moékuri: Adorable + Tactical SRPG"}] },
  { id: 5060105216, market_fee_app: 385800, market_name: "Everyone", tags: [{}, { name: "NEKOPARA Vol. 0"}] },
  { id: 4968681586, market_fee_app: 355240, market_name: "Princess of Crustaceans", tags: [{}, { name: "NEO AQUARIUM - The King of Crustaceans -"}] },
  { id: 1221927802, market_fee_app: 307190, market_name: "Nicole at work", tags: [{}, { name: "Nicole (otome version)"}] },
  { id: 3444048535, market_fee_app: 284810, market_name: "Dead bay at night", tags: [{}, { name: "Nightmares from the Deep 3: Davy Jones"}] },
  { id: 4867834234, market_fee_app: 284810, market_name: "Pirate’s sorrow", tags: [{}, { name: "Nightmares from the Deep 3: Davy Jones"}] },
  { id: 5042009560, market_fee_app: 367020, market_name: "Yui", tags: [{}, { name: "No One But You"}] },
  { id: 4933049703, market_fee_app: 325120, market_name: "Redemption and Renewal", tags: [{}, { name: "Notch - The Innocent LunA: Eclipsed SinnerS"}] },
  { id: 4183659231, market_fee_app: 323490, market_name: "Lin's Walking in Garden", tags: [{}, { name: "Oblivious Garden ~Carmina Burana"}] },
  { id: 5010372127, market_fee_app: 365070, market_name: "Dexp home", tags: [{}, { name: "One Manga Day"}] },
  { id: 4983669597, market_fee_app: 365070, market_name: "Shrine", tags: [{}, { name: "One Manga Day"}] },
  { id: 3891105139, market_fee_app: 446390, market_name: "Wall confronting", tags: [{}, { name: "Onechanbara Z2: Chaos"}] },
  { id: 3686131346, market_fee_app: 423770, market_name: "Brenda", tags: [{}, { name: "Our Love Will Grow"}] },
  { id: 5358778910, market_fee_app: 562410, market_name: "RiverSide", tags: [{}, { name: "Panty Party"}] },
  { id: 5381640071, market_fee_app: 562410, market_name: "StreetCross", tags: [{}, { name: "Panty Party"}] },
  { id: 4494222040, market_fee_app: 268810, market_name: "Heather and Katrina", tags: [{}, { name: "Paranormal State: Poison Spring Collector's Edition"}] },
  { id: 3912033661, market_fee_app: 291050, market_name: "Lisa Nelson", tags: [{}, { name: "Planet Stronghold"}] },
  { id: 3953315449, market_fee_app: 435260, market_name: "Diana Nelson", tags: [{}, { name: "Planet Stronghold: Colonial Defense"}] },
  { id: 3953319196, market_fee_app: 435260, market_name: "Queen Shiler", tags: [{}, { name: "Planet Stronghold: Colonial Defense"}] },
  { id: 4745892378, market_fee_app: 466490, market_name: "Evil against Good", tags: [{}, { name: "Princess Isabella: The Rise of an Heir"}] },
  { id: 3948549454, market_fee_app: 384180, market_name: "The Beast", tags: [{}, { name: "Prominence Poker"}] },
  { id: 3903061229, market_fee_app: 264560, market_name: "Voleris and Kayanna", tags: [{}, { name: "Quest for Infamy"}] },
  { id: 5148106431, market_fee_app: 39120, market_name: "Crucia", tags: [{}, { name: "RIFT"}] },
  { id: 4170107673, market_fee_app: 400910, market_name: "Erina and Irisu", tags: [{}, { name: "Rabi-Ribi"}] },
  { id: 4186397704, market_fee_app: 400910, market_name: "Bunny in Town", tags: [{}, { name: "Rabi-Ribi"}] },
  { id: 5077485236, market_fee_app: 400910, market_name: "Sisters: Rumi and Miru", tags: [{}, { name: "Rabi-Ribi"}] },
  { id: 4170773009, market_fee_app: 541720, market_name: "Rose Dreams", tags: [{}, { name: "Redrum: Dead Diary"}] },
  { id: 4873341266, market_fee_app: 312600, market_name: "Rime Berta Background No.1", tags: [{}, { name: "Rime Berta"}] },
  { id: 4494868244, market_fee_app: 312600, market_name: "Rime Berta Background No.3", tags: [{}, { name: "Rime Berta"}] },
  { id: 4105204705, market_fee_app: 317300, market_name: "Roxanne", tags: [{}, { name: "Roommates"}] },
  { id: 3897119382, market_fee_app: 317300, market_name: "Halloween Witch", tags: [{}, { name: "Roommates"}] },
  { id: 4304641652, market_fee_app: 295550, market_name: "Sniper and Hunter", tags: [{}, { name: "Royal Quest"}] },
  { id: 4204182694, market_fee_app: 407330, market_name: "Sylvi and Ryuuou", tags: [{}, { name: "Sakura Dungeon"}] },
  { id: 5063285448, market_fee_app: 407330, market_name: "Panda and Tiger", tags: [{}, { name: "Sakura Dungeon"}] },
  { id: 5042288408, market_fee_app: 370280, market_name: "Garden of sunflowers", tags: [{}, { name: "Season of 12 Colors"}] },
  { id: 3945504553, market_fee_app: 449340, market_name: "Reluctant Regent", tags: [{}, { name: "Serafina's Crown"}] },
  { id: 4092024974, market_fee_app: 307050, market_name: "Waiting Alone", tags: [{}, { name: "Shan Gui"}] },
  { id: 4184065904, market_fee_app: 307050, market_name: "The First Bike Ride", tags: [{}, { name: "Shan Gui"}] },
  { id: 4980136906, market_fee_app: 307050, market_name: "A Kiss on the Cheek", tags: [{}, { name: "Shan Gui"}] },
  { id: 4923600225, market_fee_app: 289070, market_name: "Cleopatra", tags: [{}, { name: "Sid Meier's Civilization VI"}] },
  { id: 3700984620, market_fee_app: 340320, market_name: "Plaza", tags: [{}, { name: "Sinless"}] },
  { id: 3897093817, market_fee_app: 340320, market_name: "Street", tags: [{}, { name: "Sinless"}] },
  { id: 4906148331, market_fee_app: 528070, market_name: "Sea surf", tags: [{}, { name: "Solitaire Beach Season"}] },
  { id: 5223319460, market_fee_app: 383460, market_name: "Mayu, Himeno, Sayo and Miku", tags: [{}, { name: "Sound of Drop - fall into poison -"}] },
  { id: 3682857468, market_fee_app: 407340, market_name: "Licia", tags: [{}, { name: "Strawberry Vinegar"}] },
  { id: 3972333165, market_fee_app: 407340, market_name: "Yukine", tags: [{}, { name: "Strawberry Vinegar"}] },
  { id: 4879690891, market_fee_app: 314070, market_name: "Alisha Woodrow", tags: [{}, { name: "Super Mega Baseball: Extra Innings"}] },
  { id: 5274310089, market_fee_app: 496350, market_name: "Alice Kamishiro", tags: [{}, { name: "Supipara - Chapter 1 Spring Has Come!"}] },
  { id: 5122735883, market_fee_app: 496350, market_name: "Hotaru Amano", tags: [{}, { name: "Supipara - Chapter 1 Spring Has Come!"}] },
  { id: 3276636756, market_fee_app: 295730, market_name: "Sweezy Gunner Ship and Jax", tags: [{}, { name: "Sweezy Gunner"}] },
  { id: 3864876895, market_fee_app: 252310, market_name: "Captain Reyes", tags: [{}, { name: "Syder Arcade"}] },
  { id: 3955904564, market_fee_app: 323370, market_name: "Castanica", tags: [{}, { name: "TERA"}] },
  { id: 3895184222, market_fee_app: 375520, market_name: "Explosion Girl Stage", tags: [{}, { name: "Taimumari"}] },
  { id: 3947436312, market_fee_app: 375520, market_name: "Twosided Girl Stage", tags: [{}, { name: "Taimumari"}] },
  { id: 5060734035, market_fee_app: 351970, market_name: "Alisha - Rountabel Palace", tags: [{}, { name: "Tales of Zestiria"}] },
  { id: 5052652541, market_fee_app: 351970, market_name: "Rose - Volgran Forest", tags: [{}, { name: "Tales of Zestiria"}] },
  { id: 5221367949, market_fee_app: 351970, market_name: "Edna - Rayfalke Spiritcrest", tags: [{}, { name: "Tales of Zestiria"}] },
  { id: 5023702910, market_fee_app: 491420, market_name: "Suzu & Mai", tags: [{}, { name: "The 9th Day"}] },
  { id: 5064679447, market_fee_app: 542260, market_name: "Surprise", tags: [{}, { name: "The Herbalist"}] },
  { id: 4163181069, market_fee_app: 542260, market_name: "Pirozhki", tags: [{}, { name: "The Herbalist"}] },
  { id: 4911134370, market_fee_app: 542260, market_name: "The Herbalist", tags: [{}, { name: "The Herbalist"}] },
  { id: 4954174471, market_fee_app: 251150, market_name: "Lovely Ladies", tags: [{}, { name: "The Legend of Heroes: Trails in the Sky"}] },
  { id: 4924996672, market_fee_app: 251150, market_name: "Estelle & Joshua", tags: [{}, { name: "The Legend of Heroes: Trails in the Sky"}] },
  { id: 4838084625, market_fee_app: 436670, market_name: "Beer Me!", tags: [{}, { name: "The Legend of Heroes: Trails in the Sky the 3rd"}] },
  { id: 4974009815, market_fee_app: 464500, market_name: "Amane & Michiru", tags: [{}, { name: "The Melody of Grisaia"}] },
  { id: 5318141483, market_fee_app: 390940, market_name: "The Beginning", tags: [{}, { name: "The Musketeers: Victoria's Quest"}] },
  { id: 3913084381, market_fee_app: 517360, market_name: "Sarah Pennington", tags: [{}, { name: "The Secret Order 4: Beyond Time"}] },
  { id: 5033523794, market_fee_app: 549850, market_name: "Lailah's Garden", tags: [{}, { name: "The Shadows of Pygmalion"}] },
  { id: 3944362672, market_fee_app: 499520, market_name: "AvaBackground", tags: [{}, { name: "The Turing Test"}] },
  { id: 3955285563, market_fee_app: 499520, market_name: "Ava Background 2", tags: [{}, { name: "The Turing Test"}] },
  { id: 3874820178, market_fee_app: 313650, market_name: "Ancient love", tags: [{}, { name: "Time Mysteries 2: The Ancient Spectres"}] },
  { id: 3907509057, market_fee_app: 313650, market_name: "Welcome to the mansion", tags: [{}, { name: "Time Mysteries 2: The Ancient Spectres"}] },
  { id: 3847394717, market_fee_app: 319320, market_name: "Innocents in the Crossfire", tags: [{}, { name: "Time Mysteries 3: The Final Enigma"}] },
  { id: 3718200938, market_fee_app: 350010, market_name: "Time travel beckons", tags: [{}, { name: "Time Mysteries: Inheritance - Remastered"}] },
  { id: 4018185723, market_fee_app: 350010, market_name: "Stonehenge in the moonlight", tags: [{}, { name: "Time Mysteries: Inheritance - Remastered"}] },
  { id: 5049833127, market_fee_app: 320760, market_name: "Little Buddies", tags: [{}, { name: "Tokyo School Life"}] },
  { id: 4186494882, market_fee_app: 495990, market_name: "fengxi", tags: [{}, { name: "True Love ～Confide to the Maple～"}] },
  { id: 4097102877, market_fee_app: 495990, market_name: "fengyi", tags: [{}, { name: "True Love ～Confide to the Maple～"}] },
  { id: 3787584831, market_fee_app: 279160, market_name: "Revenge is serious business", tags: [{}, { name: "Ultionus: A Tale of Petty Revenge"}] },
  { id: 5037879879, market_fee_app: 406550, market_name: "Jessica and Kanon", tags: [{}, { name: "Umineko"}] },
  { id: 4775256138, market_fee_app: 406550, market_name: "Maria and Sakutaro", tags: [{}, { name: "Umineko"}] },
  { id: 3865699929, market_fee_app: 340800, market_name: "A2", tags: [{}, { name: "Unhack"}] },
  { id: 3865699932, market_fee_app: 340800, market_name: "Sisters", tags: [{}, { name: "Unhack"}] },
  { id: 5062243441, market_fee_app: 252030, market_name: "Dragon and Cursed", tags: [{}, { name: "Valdis Story: Abyssal City"}] },
  { id: 5056767898, market_fee_app: 414660, market_name: "Rose Vlayna", tags: [{}, { name: "Vampire Legends: The True Story of Kisilova"}] },
  { id: 3897140574, market_fee_app: 262150, market_name: "Eri Background", tags: [{}, { name: "Vanguard Princess"}] },
  { id: 5048143155, market_fee_app: 243470, market_name: "Clara", tags: [{}, { name: "Watch_Dogs"}] },
  { id: 3213178912, market_fee_app: 427510, market_name: "Kouta & Osei", tags: [{}, { name: "Way of the Samurai 3"}] },
  { id: 5046031734, market_fee_app: 397090, market_name: "Canopy Mood", tags: [{}, { name: "Wind Child"}] },
  { id: 5055836936, market_fee_app: 397090, market_name: "Girl Next Door", tags: [{}, { name: "Wind Child"}] },
  { id: 4181794166, market_fee_app: 318530, market_name: "Rubi and Vi", tags: [{}, { name: "Wings of Vi"}] },
  { id: 4958876901, market_fee_app: 602930, market_name: "Ada", tags: [{}, { name: "Wordlase"}] },
  { id: 5226914351, market_fee_app: 602930, market_name: "Ada's Riverside", tags: [{}, { name: "Wordlase"}] },
  { id: 5053486867, market_fee_app: 610810, market_name: "Parfait Hana", tags: [{}, { name: "Your Friend Hana"}] },
  { id: 5045044706, market_fee_app: 610810, market_name: "Happy Birthday", tags: [{}, { name: "Your Friend Hana"}] },
  { id: 4150685423, market_fee_app: 223810, market_name: "Twins of Fate", tags: [{}, { name: "Ys I"}] },
  { id: 4859229086, market_fee_app: 223870, market_name: "Reunion", tags: [{}, { name: "Ys II"}] },
  { id: 5042098743, market_fee_app: 223870, market_name: "Double Lilia", tags: [{}, { name: "Ys II"}] },
  { id: 3947314893, market_fee_app: 207350, market_name: "Epona", tags: [{}, { name: "Ys Origin"}] },
  { id: 4713051942, market_fee_app: 207350, market_name: "The Search Party", tags: [{}, { name: "Ys Origin"}] },
  { id: 4182388717, market_fee_app: 207320, market_name: "The Villager", tags: [{}, { name: "Ys: The Oath in Felghana"}] },
  { id: 4163295659, market_fee_app: 315810, market_name: "Lavie", tags: [{}, { name: "eden*"}] },
  { id: 5054243279, market_fee_app: 315810, market_name: "Maya", tags: [{}, { name: "eden*"}] },
  { id: 4088310362, market_fee_app: 344770, market_name: "Rune", tags: [{}, { name: "fault - milestone two side:above"}] },
]};
unsafeWindow.artists = [
  "808 State","Advent, The","Artificial Arm, The","AS1","Autechre","Automat",
  "Automatic Tasty","Autonomous Bass Heads","Aux 88","Biosphere","Blackploid",
  "Boris Divider","Clatterbox","Clone Machine, The","Clone Theory","CN",
  "Computron","Cosmic Force","Cybotron","Cybrid","Cygnus","Cylob","Das Muster",
  "DeFeKT","Detroit in Effect","Dexorcist, The","Dexter","DJ Stingray",
  "Drexciya","Drop Man","Dynamik Bass System","Dynamix II","Ectomorph",
  "Ed Upton","Egypt Ear Werk","Electronome","EleKtroniK Android","Elysis",
  "Exaltics, The","Exzakt","Fah","Frank de Groodt","Gate Zero","Gerald Donald",
  "Global Communication","Global Goon","Gosub","Group X","Hashim","Headnoaks",
  "Heuristic Audio","Higher Intelligence Agency","Hydraulix","Illektrolab",
  "Jackal and Hyde","James Stinson","Komarken Electronics","Kosmik Kommando",
  "Kraftwerk","Kronos Device","Lee Norris","Luis Ruiz","Luke Vibert","Mandroid",
  "MC Hawking","Megatron","Morphology","Mr. Velcro Fastener","Mu-Ziq","Orbital",
  "Paul Blackford","Phil Klein","Plant43","Prodigy, The","Q-Chip","Volsoc",
  "Radioactive Man","Richard D. James","Ruxpin","Sbassship","Scape One",
  "Silicon Scally","Sonar Base","Sonic Mayhem","Spacetime Continuum","Sync 24",
  "Squarepusher","Tim and Eric","Zeta Reticula",
];
unsafeWindow.shows = [
  "12 Oz. Mouse","30 Rock","3rd Rock from the Sun","Absolutely Fabulous",
  "Adventures of Batman and Robin, The","Adventures of Pete and Pete, The",
  "American Body Shop","Another Period","Aqua Teen Hunger Force","Archer",
  "Arrested Development","Assy McGee","Band of Brothers","Baskets",
  "Batman, Animated Series, The","Batman Beyond","Beavis and Butthead",
  "Benson Interruption, The","Better Call Saul","Between Two Ferns",
  "Black Dynamite","Black Jesus","Boardwalk Empire","Bob's Burgers",
  "Boondocks, The","Bored to Death","Brad Neely's Sclopio Peepio",
  "Brak Show, The","Breaking Bad","Broad City","Chappelle's Show",
  "Check It Out! with Dr. Steve Brule","Children's Hospital","China, IL",
  "Clerks, The Animated Series","Code Monkeys","Comedy Central Roasts",
  "Corner, The","Crank Yankers","Critic, The","Da Ali G Show","Superjail!",
  "Dana Carvey Show, The","Daria","Decker","Delocated","Derek","Dilbert",
  "Documentary Now!","Dog Bites Man","Drinky Crow Show, The","Idiot Abroad, An",
  "Dr. Katz, Professional Therapist","Drunk History","Duckman","Eagleheart",
  "Eastbound and Down","Eric Andre Show, The","Extras","Family Guy","Fargo",
  "Fat Guy Stuck in Internet","Flight of the Conchords","Freaks and Geeks",
  "Freak Show","Frisky Dingo","Futurama","Gargoyles","Generation Kill","Taxi",
  "Goode Family, The","Go Open","Greatest Event in Television History, The",
  "Halfway Home","Harvey Birdman, Attorney at Law","Heart, She Holler, The",
  "Home Movies","Horace and Pete","House of Cards","X-Files, The",
  "I'm with Busey","Increasingly Poor Decisions of Todd Margaret, The",
  "Inside Amy Schumer","Inside the Actors Studio","Invader Zim","IT Crowd, The",
  "It's Always Sunny in Philadelphia","Jack and Triumph Show, The",
  "Jeselnik Offensive, The","Jim Gaffigan Show, The","Jon Benjamin Has a Van",
  "Karl Pilkington, The Moaning of Life","Key and Peele","Kids in the Hall",
  "Kids in the Hall, Death Comes to Town","King of the Hill","Kroll Show",
  "Life and Times of Tim, The","Life's Too Short","Lone Gunmen, The","Lost",
  "Louie","Lucky Louie","Lucy, The Daughter of the Devil","Maron",
  "Mary Shelley's Frankenhole","Metalocalypse","Mighty Boosh, The",
  "Mike Tyson Mysteries","Mission Hill","Monty Python's Flying Circus",
  "Moral Orel","Mr. Pickles","Mr. Robot","Mr. Show","Nathan for You",
  "Neon Joe, Werewolf Hunter","New Batman Adventures, The","News Radio",
  "NTSF.SD.SUV","Oblongs, The","Office, The","Office, The (UK)","O'Grady",
  "Pacific, The","Parks and Recreation","Peaky Blinders","Peep Show",
  "Penn and Teller, Bullshit","Perfect Hair Forever","Portlandia",
  "Ren and Stimpy Season","Reno 911!","Rick and Morty","Ricky Gervais Show",
  "Sarah Silverman Program, The","Saul of the Mole Men","Scrubs","Sealab 2021",
  "Seinfeld","Shorties Watchin' Shorties","Short Poppies","Snuff Box",
  "Sopranos, The","South Park","Space Ghost Coast to Coast","Squidbillies",
  "Star Trek","Star Trek, Deep Space Nine","Star Trek, Enterprise",
  "Star Trek, The Next Generation","Star Trek, Voyager","State, The",
  "Stella","Strangers with Candy","Stranger Things","Stroker and Hoop",
  "Summer Heights High","Xtacles, The","Your Pretty Face is Going to Hell",
  "Terminator, The Sarah Connor Chronicles","That's My Bush!","Human Giant",
  "Tim and Eric Awesome Show, Great Job!","Tim and Eric Nite Live!",
  "Tim and Eric's Bedtime Stories","Time Traveling Bong","Titan Maximum",
  "Tom Goes to the Mayor","Trailer Park Boys","Transparent","Treme",
  "True Detective","TV Funhouse","Twin Peaks","Undeclared","Undergrads",
  "Venture Brothers","Vice Principals","Whitest Kids U' Know, The","Wilfred",
  "Wilfred (AU)","Wire, The","Wonder Showzen","Xavier, Renegade Angel",
];
unsafeWindow.films = [
  "12 Monkeys","2001, A Space Odyssey","28 Days Later","Awakenings","Bandits",
  "40-Year-Old Virgin, The","9","About Schmidt","Ace Ventura, Pet Detective",
  "Ace Venture, When Nature Calls","Adaptation","Addams Family, The",
  "Addams Family Values","A.I. Artificial Intelligence","Airheads","Aladdin",
  "Alice in Wonderland, Animated","Alice in Wonderland","Baby Mama","Batman",
  "Alice Through the Looking Glass","Alien 3","Alien","Alien, Resurrection",
  "Aliens","Aliens vs. Predator, Requiem","Alien vs. Predator","Bad Santa",
  "Ali G in Da House","All of Me","Along Came Polly","Altered States","Amelie",
  "American Beauty","American Gangster","American History X","American Hustle",
  "American Psycho","Amistad","Analyze That","Analyze This","Anchorman","Cake",
  "Anger Management","Animatrix, The","Antitrust","Apt Pupil","Barfly",
  "Aqua Teen Hunger Force Movie","Art School Confidential","As Good as It Gets",
  "Austin Powers, The International Man of Mystery","Back to School","Casino",
  "Back to the Future","Barton Fink","Basketball Diaries, The","Basquiat",
  "Batman and Mr. Freeze, SubZero","Batman Begins","Batman Returns",
  "Batman Beyond, Return of the Joker","Batman, Mask of the Phantasm",
  "Batman, Mystery of the Batwoman","Battle of Algiers, The","Beach, The",
  "Beautiful Mind, A","Beauty and the Beast","Beaver, The","Caddyshack",
  "Bedknobs and Broomsticks","Beetlejuice","Being John Malkovich","Cast Away",
  "Be Kind Rewind","Bernie","Best in Show","Better Off Dead","Big Daddy","CB4",
  "Big Eyes","Big Fish","Big Lebowski, The","Big Short, The","Big White, The",
  "Billy Madison","Birdcage, The","Black Hawk Down","Black Snake Moan",
  "Black Swan","Blade III, Trinity","Blade II","Blade","Blood Diamond","Blow",
  "Body of Lies","Bon Voyage Charlie Brown","Boogie Nights","Boondock Saints",
  "Borat","Bottle Rocket","Boyhood","Boy","Boy Named Charlie Brown, A",
  "Boys from Brazil, The","Breakfast Club, The","Break Up","Bruce Almighty",
  "Bringing Out the Dead","Bronx Tale, A","Brother's Grimsby, The",
  "Bubba Ho-Tep","Bubble Boy","Bug's Life, A","Burn After Reading",
  "But I'm a Cheerleader","Butterfly Effect, The","Cable Guy, The","Fight Club",
  "Career Opportunities","Carlito's Way","Casino Jack","Catch Me if You Can",
  "Central Intelligence","Charlie Brown Christmas, A","Zombieland",
  "Charlie Wilson's War","Chasing Amy","Chinatown","Dancer in the Dark",
  "Chronicles of Narnia, The Lion, the Witch, and the Wardrobe","C.H.U.D",
  "Cinderella Man","City of Lost Children, The","City Slickers 2","Colors",
  "City Slickers","Clerks 2","Clerks","Clockwork Orange, A","Coming to America",
  "Coffee and Cigarettes","Comedy, The","Dan in Real Life","Date Night","Fido",
  "Con Air","Coneheads","Cop Out","Coraline","Corpse Bride","Cube",
  "Daddy's Home","Darjeeling Limited, The","Dark Knight Rises, The",
  "Dark Knight, The","Dawn of the Dead","Dazed and Confused","Dead Man Walking",
  "Dead Poet's Society","Death at a Funeral","Death Becomes Her","Death Proof",
  "Death to Smoochy","Departed, The","Der Untergang","Devil's Advocate, The",
  "Dictator, The","Die Hard 2","Die Hard 3","Die Hard 4","Die Hard",
  "Dinner for Schmucks","Dirty Dancing","Dodgeball","Dogma","Donnie Brasco",
  "Donnie Darko","Don Verdean","Doom","Down to Earth","Dragnet","Wrong Cops",
  "Dr. Strangelove","Drugstore Cowboy","Dummy","Dune","Dutch","Eagle vs Shark",
  "Eastern Promises","Easy Rider","Eat the Rich","Edward Scissorhands","Elf",
  "End of Days","Enemy at the Gates","Eraserhead","Ernest, Scared Stupid",
  "Escape from Alcatraz","Escape from Tomorrow","Driving Miss Daisy",
  "Everything is Illuminated","Everything Must Go","Horrible Bosses",
  "Evil Dead 2, Dead By Dawn","Evil Dead, The","Ewoks, The Battle for Endor",
  "Exorcism of Emily Rose, The","Exorcist, The","Factory Girl","Falling Down",
  "Fantasia","Fantastic Mr. Fox","Fargo","Fear and Loathing in Las Vegas",
  "Ferris Bueller's Day Off","Few Good Men, A","Fifth Element, The","How High",
  "Fighter, The","Filth and Wisdom","Finding Forrester","Fish Called Wanda, A",
  "Fisher King, The","Flight of the Navigator","Forgetting Sarah Marshall",
  "Forrest Gump","For Your Consideration","Fountain, The","Four Lions",
  "Fox and the Hound, The","Fracture","Frankenweenie","Freaky Friday",
  "Freeheld","Frida","Friday","Frost Nixon","Full Metal Jacket","Galaxy Quest",
  "Gambler, The","Game Change","Game, The","Gandhi","Garfield in Disguise",
  "Gentlemen Broncos","Getaway, The","Ghostbusters 2016","Ghostbusters 2",
  "Ghostbusters","Ghost World","Gladiator","Godfather, The Part 1","Help, The",
  "Godfather, The Part 2","Godfather, The Part 3","Gone in Sixty Seconds",
  "Good Day to Die Hard, A","Goodfellas","Good Girl, The","Grandma's Boy",
  "Good Heart, The","Good Shepherd, The","Good Will Hunting","Goonies, The",
  "Grand Budapest Hotel, The","Grand, The","Gran Torino","Great Outdoors, The",
  "Green Mile, The","Grosse Pointe Blank","Groundhog Day","Grumpier Old Men",
  "Grumpy Old Men","Half Baked","Halloween III, Season of the Witch","Hatchet",
  "Halloween II","Halloween","Hangover, The","Hannibal","Hannibal Rising",
  "Happening, The","Happiness","Happy Gilmore","Hard Candy","Harold and Maude",
  "Harold and Kumar Escape from Guantanamo Bay","Heavy Weights","He Got Game",
  "Harold and Kumar Go to White Castle","Hateful Eight, The","High Fidelity",
  "Hebrew Hammer, The","History of Violence, A","Home Alone","Idiocracy",
  "Hitchhiker's Guide to the Galaxy","How the Grinch Stole Christmas",
  "Hobbit, The, An Unexpected Journey","Hunt for the Wilderpeople",
  "Hobbit, The, Battle of the Five Armies","Hotel Rwanda","Terminator, The",
  "Hobbit, The, Desolation of Smaug","Ides of March, The","The Crucible",
  "Home Alone 2, Lost in New York","Hunting Ground, The","Independance Day",
  "I Heart Huckabees","I Love You Man","Imperium","Inception","Ten, The",
  "Indiana Jones and the Kingdom of the Crystal Skull","That Thing you Do",
  "Indiana Jones and the Last Crusade","Indiana Jones and the Temple of Doom",
  "Indiana Jones and the Raiders of the Lost Ark","Waiting for Guffman",
  "Infiltrator, The","Infinitely Polar Bear","Inglourious Basterds","They Live",
  "Inland Empire","Insider, The","Insomnia","Journey of Natty Gann, The",
  "Insomnia US","In the Loop","Into the Wild","Invention of Lying, The",
  "Invictus","Iron Giant, The","Iron Man","I Saw the Light","Taxi Driver",
  "I Sell the Dead","It's a Wonderful Life","Last King of Scotland, The",
  "It's the Great Pumpkin, Charlie Brown","Jackie Brown","Temple Grandin",
  "James and the Giant Peach","Jay and Silent Bob Strike Back","Sweet Jane",
  "Jerk, The","Jerry Maguire","JFK","Joe vs. the Volcano","Terminal, The",
  "Junior","Juno","Jurassic Park","Kids are Alright, The","Team America",
  "Kids in the Hall, Brain Candy","Kill Bill, Vol 1","Kill Bill, Vol 2",
  "Kindergarten Cop","Kingpin","Kiss Kiss Bang Bang","L.A. Confidential",
  "Ladykillers, The","Last Days","Last Dragon, The","Thank You for Smoking",
  "Lawnmower Man, The","Layer Cake","Leap of Faith","Leaving Las Vegas",
  "Lebanon","Liar, Liar","Life Aquatic, The","Life of Crime","Lilo and Stitch",
  "Lion King, The","Lions for Lambs","Lionshare, The","Little Mermaid, The",
  "Little Miss Sunshine","Little Nicky","Lone Star","Looper","Super Troopers",
  "Lord of the Rings, The, Animated","One Flew Over the Cuckoo's Nest",
  "Lord of the Rings, The, The Fellowship of the Ring","Super Mario Brothers",
  "Lord of the Rings, The, The Return of the King","Sword in the Stone, The",
  "Lord of the Rings, The, The Two Towers","Neverending Story, The","It's Pat",
  "Lost Highway","Lost in Translation","Machinist, The","My Fair Lady",
  "Magnolia","Malcolm X","Mallrats","Manchester by the Sea","Mystic River",
  "Manhunter","Man of the Year","Man on Fire","Man Who Fell to Earth, The",
  "Man with Two Brains, The","Maria Full of Grace","Marihuana","One Hour Photo",
  "Mars Attacks","Martian, The","Mary and Max","Mascots","Master, The",
  "Matchstick Men","Matilda","Matrix Reloaded, The","Matrix Revolutions, The",
  "Matrix, The","Meet Joe Black","Meet the Fockers","Meet the Parents",
  "Melinda and Melinda","Memento","Men in Black 2","Men in Black","Stargate",
  "Men of Honor","Men Who Stare at Goats, The","Michael Clayton","Mystery Men",
  "Michael Jackson's Thriller","Mighty Ducks, The","Mighty Wind, A","Syriana",
  "Million Dollar Baby","Minority Report","Miral","Misery","Monster's Ball",
  "Monsters Inc","Monty Python and the Holy Grail","Nacho Libre","Omen, The",
  "Monty Python's and Now for Something Completely Different","Network",
  "Monty Python's Life of Brian","Monty Python's The Meaning of Life","Tremors",
  "Monuments Men, The","Moonrise Kingdom","Mortdecai","Motorcycle Diaries, The",
  "Mr. Deeds","Mrs Doubtfire","Mulholland Drive","Muppet Christmas Carol, The",
  "My Blue Heaven","My Cousin Vinny","Night at the Roxbury, A","Old School",
  "Nightmare Before Christmas, The","No Country for Old Men","Notorious",
  "Nutty Professor, The","O Brother, Where Art Thou","Observe and Report",
  "Ocean's 11","Ocean's Thirteen","Ocean's Twelve","October Sky","Office Space",
  "One Flew Over the Cuckoo's Nest","Onion Movie, The","Other Guys, The",
  "Other Sister, The","Parent Trap, The","Patch Adams","Patton","Rushmore",
  "Pay It Forward","Pecker","Peep World","People, Places, Things","Scarface",
  "People vs. Larry Flynt, The","Perfect Storm, The","Salton Sea, The",
  "Perks of Being a Wallflower, The","Pervert's Guide to Cinema, The","Sisters",
  "Philadelphia","Pianist, The","Pi","Pineapple Express","Run Lola Run",
  "Pirate Movie, The","Pirates of Silicon Valley","Running with Scissors",
  "Planes, Trains, and Automobiles","Platoon","Pleasantville","Poltergeist",
  "Popeye","Postal","Predator 2","Predator","Predators","Pretty in Pink",
  "Primal Fear","Primer","Proof","Public Enemies","Pulp Fiction","Pure Luck",
  "Rain Man","Rambo,.First Blood Part II","Rambo, First.Blood Part I",
  "Rambo","Rambo, Part III","Ravenous","Reality Bites","Rear Window","Red 2",
  "Red Dragon","Red","Reign of Fire","Requiem for a Dream","Reservoir Dogs",
  "Return of the King, The, Animated","Rite, The","River's Edge","Road, The",
  "Road to Guantanamo, The","Robin Hood, Men in Tights","Robin Hood","Signs",
  "RoboCop 2","RoboCop","Rockstar","Rocky Horror Picture Show, The","Shrek",
  "Role Models","Rounders","Roxanne","Royal Tenenbaums, The","Say Anything",
  "Rudolph the Red Nosed Reindeer","Saving Private Ryan","Saving Silverman",
  "Scanner Darkly, A","Scent of a Woman","Schindler's List","Shallow Hal",
  "School of Rock, The","Scrooged","Secretary","Secret of Nimh, The","Takedown",
  "Seeking a Friend for the End of the World","See No Evil, Hear No Evil",
  "Serial Mom","Serious Man, A","Seven","Seven Psychopaths","Shining, The",
  "Seven Year Itch, The","Seven Years in Tibet","Shaun of the Dead","Spun",
  "Shawshank Redemption, The","Shut Up Little Man! An Audio Misadventure",
  "Sid and Nancy","Sidekicks","Siege, The","Silence of the Lambs, The","Wrong",
  "Simple Plan, A","Simpsons Movie, The","Sister Act 2, Back in the Habit",
  "Sister Act","Sixth Sense, The","Slammin' Salmon, The","Sling Blade","X-Men",
  "Slumdog Millionaire","Slums of Beverly Hills","Smokin' Aces","Snatch",
  "So I Married an Axe Murderer","Soloist, The","Some Kind of Wonderful",
  "South Park, Bigger Longer and Uncut","Spaceballs","Spirited Away","Spork",
  "Stand By Me","Star Trek, Beyond","Star Trek, First Contact","Superheroes",
  "Star Trek, Generations","Star Trek III, The Search for Spock","Stripes",
  "Star Trek II, The Wrath of Khan","Star Trek, Insurrection","Superbad",
  "Star Trek, Into Darkness","Star Trek IV, The Voyage Homemp4","Stigmata",
  "Star Trek","Star Trek, Nemesis","Star Trek, The Motion Picture","Stone",
  "Star Trek V, The Final Frontier","Star Wars, A New Hope","St. Vincent","Up",
  "Star Wars, Attack of the Clones","Star Wars, Return of the Jedi","Super",
  "Star Wars, Revenge of the Sith","Star Wars, The Empire Strikes Back","Tron",
  "Star Wars, The Force Awakens","Star Wars, The Phantom Menace","Swordfish",
  "State of Play","Steel Magnolias","Step Brothers","Stephen King's It","Ted",
  "Stephen King, The Stand","Strangers with Candy","Stranger Than Fiction",
  "Eternal Sunshine of the Spotless Mind","Charlie Brown Thanksgiving, A",
  "Teenage Mutant Ninja Turtles, The Movie","Vanishing, The","Wag the Dog",
  "Terminator 2, Judgement Day","Terminator 3, Rise of the Machines","Willow",
  "Terminator, Genisys","Terminator, Salvation","Upstream Color","Virtuosity",
  "Texas Chainsaw Massacre","There's Something About Mary","This is 40","W",
  "This is America, Charlie Brown","This is Spinal Tap","Uncle Buck","Wiz, The",
  "Three Amigos","Throw Mamma from the Train","Usual Suspects, The","Wall-E",
  "Tim and Eric's Billion Dollar Movie","V for Vendetta","View from the Top",
  "Tomorrow Night","Too Big to Fail","Total Recall","Town, The","Toy Story",
  "Trading Places","Visioneers","Walk Hard, The Dewey Cox Story","Wall Street",
  "Trailer Park Boys, Countdown to Liquor Day","Untouchables, The","Wanderlust",
  "Trailer Park Boys, The Big Dirty","Training Day","Trainspotting","Valkyrie",
  "Trainwreck","Tropic Thunder","True Lies","True Romance","True Romance",
  "Trumbo","Twin Peaks, Fire Walk with Me","Twins","UHF","Unbroken",
  "Warriors, The","Waterboy, The","Watership Down","Waynes World 2",
  "Waynes World","Wedding Singer, The","Weird Science","Woodsman, The",
  "Welcome to the Dollhouse","What About Bob_","What's Eating Gilbert Grape",
  "What We Do in the Shadows","Where the Buffalo Roam","Witches, The",
  "Where the Wild Things Are","White Christmas","Whole Nine Yards, The",
  "Willy Wonka and the Chocolate Factory","Witches of Eastwick, The",
  "Wizard, The","Wrestler, The","Writer's Bone","Wrong Guy, The","Zoolander",
  "X-Files, The, Fight the Future","You Don't Know Jack",
  "You Don't Mess with the Zohan",
];
unsafeWindow.cats = [
  1167100839,1167100792,1167100708,1167100665,1167100603,1167100561,1167100510,
  1167100470,1167100441,1167100322,1167100304,1167099678,1167099618,1167099561,
  1167099508,1167099438,1167099403,1167099361,1167099340,1167099296,1167099248,
  1167099206,1167099149,1167099092,1167098995,1167098938,1167098500,1167098467,
  1167098435,1167098419,1167098402,1167098373,1167098346,1167098298,1167098245,
  1167098187,1167098138,1167098102,1167098074,1167097905,1167097829,1167097028,
  1167096936,1167096870,1167096815,1167096728,1167096672,1167096636,1167096599,
  1167096552,1167096499,1167096435,1167096388,1167096343,1167096304,1167096270,
  1167095734,1167095710,1167095673,1167095585,1167095541,1167095484,1167095418,
  1167095375,1167095343,1167095304,1167095228,1167095166,1167095130,1167095073,
  1167095057,1167094615,1167094588,1167094532,1167094489,1167094459,1167094424,
  1167094384,1167094316,1167094288,1167094230,1167094198,1167094170,1167094135,
  1167094096,1167094049,1167091242,1167090678,1167090649,1167090626,1167090608,
  1167090583,1167090556,1167090535,1167090502,1167090474,1167090436,1167090409,
  1167090345,1167090317,1167090281,1167087159,1167087143,1167087126,1167087113,
  1167087084,1167087057,1167087015,1167086984,1167086952,1167086923,1167086898,
  1167086877,1167086854,1167086829,1167086802,1167086361,1167086326,1167086293,
  1167086273,1167086239,1167086213,1167086191,1167086158,1167086134,1167086107,
  1167086077,1167086050,1167086030,1167086001,1167085957,1167085190,1167085184,
  1167085168,1167085148,1167085130,1167085097,1167085070,1167085050,1167085018,
  1167084990,1167084964,1167084936,1167084908,1167084888,1167084880,1167084242,
  1167084226,1167084209,1167084195,1167084178,1167084162,1167084147,1167084130,
  1167084114,1167084101,1167084079,1167084067,1167084042,1167084026,1167084005,
  1167081051,1167081002,1167080108,1167080078,1167080046,1167080011,1167079971,
  1167079940,1167079896,1167079861,1167079791,1167079734,1167079702,1167079656,
  1167079448,1167078093,1167078059,1167078026,1167078003,1167077985,1167077957,
  1167077918,1167077890,1167077857,1167077813,1167077788,1167077760,1167077214,
  1167077185,1167077160,1167071024,1167070974,1167070945,1167070904,1167070880,
  1167070850,1167070827,1167070799,1167070763,1167070728,1167070678,1167070619,
  1167070586,1167070544,1167070466,1167069500,1167069464,1167069434,1167069403,
  1167069366,1167069325,1167069291,1167069261,1167069230,1167069196,1167069162,
  1167069124,1167069086,1167069035,1167069014,1167067741,1167067702,1167067672,
  1167067640,1167067616,1167067567,1167067528,1167067490,1167067465,1167067442,
  1167067427,1167067406,1167067392,1167067374,1167067341,1167066547,1167066512,
  1167066472,1167066446,1167066418,1167066387,1167066352,1167066321,1167066275,
  1167066256,1167066202,1167066156,1167066133,1167066103,1167066052,1167065107,
  1167065086,1167065063,1167065053,1167065036,1167065024,1167065009,1167064999,
  1167064976,1167064960,1167064944,1167064927,1167064901,1167064880,1167064834,
  1167063904,1167063886,1167063867,1167063846,1167063815,1167063788,1167063767,
  1167063746,1167063720,1167063699,1167063673,1167063647,1167063629,1167063596,
  1167063524,1167062394,1167062345,1167062276,1167062252,1167062236,1167062209,
  1167062186,1167062162,1167062124,1167062059,1167062035,1167062012,1167061989,
  1167061965,1167061938,1167060764,1167060745,1167060717,1167060690,1167060640,
  1167060597,1167060576,1167060526,1167060494,1167060454,1167060405,1167060368,
  1167060331,1167060289,1167060250,1167059047,1167059024,1167058995,1167058967,
  1167058932,1167058889,1167058649,1167058615,1167058586,1167058560,1167058534,
  1167058501,1167058472,1167058449,1167058409,1167048319,1167048289,1167048253,
  1167048234,1167048204,1167048178,1167048151,1167048111,1167048081,1167048055,
  1167048020,1167047991,1167047962,1167047943,1167047876,1167046988,1167046956,
  1167046918,1167046882,1167046858,1167046820,1167046764,1167046658,1167046628,
  1167046602,1167046572,1167046542,1167046510,1167046389,1167046336,1167045153,
  1167045123,1167045101,1167045079,1167045054,1167045028,1167045006,1167044985,
  1167044963,1167044931,1167044904,1167044872,1167044832,1167044798,1167044761,
  1167043087,1167043055,1167043018,1167042972,1167042930,1167042906,1167042877,
  1167042852,1167042834,1167042808,1167042779,1167042758,1167042737,1167042703,
  1167042673,1167041394,1167041343,1167041317,1167041305,1167041279,1167041258,
  1167041233,1167041189,1167040996,1167040969,1167040943,1167040923,1167040889,
  1167040861,1167040824,1167038824,1167038796,1167038767,1167038742,1167038725,
  1167038704,1167038683,1167038656,1167038632,1167038609,1167038582,1167038554,
  1167038530,1167038505,1167038476,1167037700,1167037671,1167037647,1167037624,
  1167037605,1167037589,1167037572,1167037534,1167037496,1167037472,1167037448,
  1167037393,1167037355,1167037330,1167037298,1167035965,1167035936,1167035903,
  1167035869,1167035834,1167035782,1167035750,1167035717,1167035678,1167035640,
  1167035595,1167035570,1167035528,1167035484,1167035433,1167033474,1167033421,
  1167033377,1167033341,1167033304,1167033259,1167033221,1167033187,1167033150,
  1167033111,1167033068,1167033036,1167032926,1167032905,1167032854,1167031235,
  1167031220,1167031198,1167031176,1167031156,1167031131,1167031109,1167031081,
  1167031064,1167031030,1167031007,1167030978,1167030955,1167030931,1167030903,
  1167027969,1167027945,1167027913,1167027882,1167027862,1167027838,1167027819,
  1167027800,1167027756,1167027715,1167027680,1167027651,1167027612,1167027529,
  1167027489,1167021644,1167021597,1167021499,1167021397,1167021374,1167021340,
  1167021315,1167021287,1167021256,1167021220,1167021186,1167021160,1167021135,
  1167021089,1167021043,1167019628,1167019606,1167019584,1167019560,1167019542,
  1167019522,1167019498,1167019448,1167019413,1167019360,1167019305,1167019289,
  1167019258,1167019237,1167019214,1167017695,1167017676,1167017636,1167017606,
  1167017578,1167017540,1167017480,1167017441,1167017394,1167017364,1167017336,
  1167017282,1167017236,1167017189,1167017152,1167014796,1167014765,1167014738,
  1167014704,1167014676,1167014653,1167014623,1167014597,1167014583,1167014545,
  1167014527,1167013943,1167013878,1167013771,1167013715,1167012579,1167012545,
  1167012503,1167012469,1167012424,1167012395,1167012351,1167012298,1167012252,
  1167012214,1167012178,1167012131,1167012083,1167011998,1167011959,1167010377,
  1167010334,1167010295,1167010257,1167010222,1167010195,1167010155,1167010098,
  1167009330,1167009132,1167009037,1167006056,
];
unsafeWindow.dog_facts = { index: 0, pool: [
  "YYY All dogs can be traced YYY back 40 million years ago YYY to a weasel-like animal called the YYY Miacis which dwelled in trees and dens. YYY The Miacis later evolved into the Tomarctus, YYY a forbear of Canis, YYY which includes wolfs. YYY",
  "YYY Pekingese and Japanese Chins were so important YYY in the Far East that they had YYY servants and were carried YYY around trade routes as YYY gifts for kings and emperors. YYY Pekingese were even YYY worshipped in China for centuries. YYY",
  "YYY After the fall of Rome, YYY human survival became YYY more important than breeding and training dogs. There were legends of YYY Werewolves YYY emerged YYY as abandoned dogs YYY roamed the dark streets terrifying the human villagers. YYY",
  "YYY The shape of a dog’s face suggests YYY how long it lives. Dogs with sharp, pointed faces YYY looking like wolves YYY typically live longer lives. YYY Dogs with very YYY flat faces, such as bulldogs, YYY sadly often have shorter lives. YYY",
  "YYY French poodles did not originate YYY in France but in Germany (“poodle” comes YYY from the German pudel, YYY meaning “splashing”). YYY Some scholars speculate the YYY puffs evolved when hunters shaved YYY it for more efficient swimming. YYY",
  "YYY Scholars argue over the metaphysical YYY interpretation of Dorothy’s pooch, YYY in \"Wizard of Oz\". One postulates YYY that Toto represents YYY Anubis, the YYY Egyptian dog-god, because Toto YYY keeps Dorothy from returning home. YYY",
  "YYY In Egypt, a person bitten by a YYY rabid dog was encouraged to YYY eat the roasted liver of a dog infected YYY with rabies to avoid getting it. YYY The tooth of the dog  YYY would be put in a YYY band tied to the arm of the person. YYY",
  "YYY In Iran, it is against the law to YYY own a dog. If an owner can YYY prove the dog is a guard/hunting dog, YYY the restriction won't apply. YYY Muslim reticence concerning YYY dogs is due to the fact that rabies YYY has been endemic. YYY",
  "YYY Some dogs can smell dead bodies under water, YYY hiding termites, YYY and natural gas buried under YYY 40 feet of dirt. They can detect YYY cancer that is too small to be YYY detected and can find YYY lung cancer by sniffing breath. YYY",
  "YYY Male dogs will raise their legs YYY while urinating to aim higher YYY because they want to leave a YYY message that they are tall and intimidating YYY. YYY Some dogs in Africa try to run up trees while YYY to appear to be very large. YYY",
  "YYY 30 percent of all Dalmatians are YYY deaf in one or both ears. YYY Bulldogs have short muzzles, YYY and spend their lives fighting YYY suffocation. Chihuahuas have YYY small skulls, so the flow YYY of spinal fluid is restricted. YYY",
  "YYY Puppies are like having YYY a child in the house. YYY A group of pugs is called a grumble. YYY One kind of Pekingese is referred to as a “sleeve” YYY because it was bred to fit in YYY a Chinese empress sleeves, YYY and carried around. YYY",
  "YYY The best dog to attract YYY a date is the Golden Retriever. YYY Worst is the Pit Bull. YYY A person should never kick a facing dog YYY. Some dogs bite 10 times before YYY a human responds. People YYY bitten require medical attention. YYY",
  "YYY Dogs can smell about 1,000-10,000 YYY times better than humans. YYY We have 5 million smell-detecting cells, YYY dogs have more than 220 million. YYY The part of the brain that YYY interprets smell is also four YYY times larger in dogs. YYY",
  "YYY Different smells in the a dog’s YYY urine can tell other dogs whether YYY the dog is YYY female or male, old or young, YYY sick or healthy, happy or angry. YYY The most popular dog breed in YYY Canada and US is the Labrador retriever. YYY",
  "YYY Zorba an English mastiff, YYY is the biggest dog recorded. YYY He weighed 343 pounds and was YYY 8’3 from nose to tail. YYY One female dog and her female YYY pups produce 4372 puppies in 7 years. YYY 18 muscles or more move a dog’s ear. YYY",
  "YYY There are an estimated 400 million dogs YYY in the world. The U.S. has the highest dog YYY population in the world. YYY France has the second. YYY It's easier for dogs to learn spoken YYY commands if they are used YYY with hand signals. YYY",
  "YYY The phrase “raining cats and dogs” YYY originated in 17-century YYY England. During heavy rainstorms, YYY homeless animals would drown YYY and float in the streets, YYY giving the appearance that it had YYY rained cats and dogs. YYY",
  'YYY Apple and pear seeds contain arsenic, YYY which is deadly to dogs. YYY Dogs have sweat glands between their paws. YYY Dogs have three eyelids. The third, YYY called a nictitating membrane, YYY keeps the eye YYY lubricated and protected. YYY',
  'YYY Touch is the first sense the dog develops. YYY The entire body, including paws, YYY is covered with touch-sensitive nerve endings. YYY Dog nose prints are as YYY unique as human YYY finger prints and can be used to YYY identify them. YYY',
  'YYY Puppies are sometimes rejected by their mother YYY if they are YYY born by cesarean and cleaned before YYY being returned. Dalmatians are YYY completely white at birth. YYY Plato once said that YYY “a dog has the soul of a philosopher. YYY',
  'YYY Most experts believe YYY humans domesticated dogs YYY before donkeys, horses, sheep, goats, YYY cattle, or chickens. YYY Dogs with big square heads and large YYY ears (like the Saint Bernard) are the YYY best at hearing subsonic sounds. YYY',
  'YYY In Croatia, YYY scientists discovered that YYY lampposts were falling down because a chemical in YYY the urine of male dogs was rotting the metal. YYY Dogs have a wet nose to collect more of YYY the tiny drops of YYY smelling chemicals. YYY',
  'YYY The earliest European YYY images of dogs are found YYY in cave paintings dating back 12,000 years YYY ago in Spain. A dog most likely YYY interprets a smiling person as YYY baring their teeth, which is an act of YYY aggression. YYY',
  'YYY The dog was frequently YYY depicted in Greek art, YYY including Cerberus, the three-headed hound YYY guarding the entrance to the underworld, YYY and the hunting dogs which YYY accompanied the virgin YYY goddess of the chase, Diana. YYY',
  'YYY The term “dog days of summer” YYY was coined by the ancient YYY Greeks and Romans to describe the hottest YYY days of summer that coincided with the YYY rising of the Dog Star, YYY Sirius. Eighteen muscles or more YYY move a dog’s ear. YYY',
  'YYY A dog can locate the YYY source of a sound in 1/600 YYY of a second and hears YYY sounds four times farther YYY away than a human can. YYY Bloodhound dogs have a keen sense of smell YYY and were used since the Middle Ages fight crime YYY',
  'YYY Those born under the sign of YYY the dog in Chinese astrology YYY are considered to be loyal and discreet, YYY though temperamental. YYY Alexander the Great is said to have YYY founded and named a city Peritas, YYY in memory of his dog. YYY',
  'YYY Laika, a Russian stray, YYY was the first living mammal to orbit the YYY Earth, in the Soviet Sputnik YYY. Though she died in space, her YYY daughter Pushnika had four puppies with YYY President JFK\'s YYY terrier, Charlie. YYY',
  'YYY A dog’s shoulder blades are unattached YYY to their skeleton to YYY allow greater running flexibility. YYY The American Kennel Club, YYY the most influential dog club, YYY was founded in 1884. Dachshunds YYY were bred to fight badgers. YYY',
  'YYY During the Middle Ages, YYY Great Danes were sometimes YYY suited with armor YYY to enter a battle or to defend caravans. YYY The most popular male dog names are Max and Jake. YYY Popular female YYY names are Maggie and Molly. YYY',
  'YYY In 2003, Dr. Roger Mugford YYY invented the “wagometer,” a YYY device that claims to YYY interpret a dog’s exact mood YYY by measuring the wag of its tail. YYY Dachshunds were bred to fight badgers. YYY Dogs are more than just friends. YYY',
  'YYY Rock star Ozzy Osborne saved his wife YYY Pomeranian from a coyote by YYY wresting the coyote until it YYY released. The ancient religion YYY Zoroastrianism includes in its YYY religious text a YYY section devoted to the care of dogs. YYY',
  'YYY President FDR YYY created a minor incident YYY when he claimed he sent a destroyer to YYY the Aleutian Islands just to pick YYY up his Scottish Terrier, YYY who had been left behind. The dog\'s name on the Cracker YYY Jack box is Bingo. YYY',
  'YYY The Mayans symbolized every YYY 10th day with a dog, and those born YYY under this sign were thought to have YYY leadership skills. YYY Dog trainers in China were YYY held in high esteem. YYY The Taco Bell dog is rescue named Gidget. YYY',
  'YYY The smallest dog was YYY a matchbox  Yorkshire Terrier. YYY It was 2.5" tall at the shoulder, YYY 3.5" from nose tip to tail, and YYY weighed only 4 ounces. YYY A female dog and her female YYY pups can produce 4372 puppies in 7 years. YYY',
  'YYY Weird dog laws include allowing police YYY in to bite a dog to YYY quiet it. In YYY Ventura County, cats and YYY dogs are not allowed to have sex without a permit. YYY Dogs with flatter faces don\'t live as YYY long as longer face dogs. YYY',
  'YYY Dogs in a pack are more likely to chase YYY and hunt than a single dog on its own. YYY Two dogs are enough to form a pack. YYY Countess Libenstein of Germany YYY left approximately $106 mil YYY to her Alsatin, YYY when she died in 1992. YYY',
  'YYY In Greece, YYY dog kennels were kept at the YYY sanctuary of Asclepius. YYY Dogs were sacrificed because they were YYY plentiful, inexpensive and easy to control. YYY In July YYY, sacrifices were performed to appease the ancestors. YYY',
  'YYY Hollywood’s first and YYY best canine YYY superstar was Rin Tin Tin, YYY a five-day-old German YYY Shepherd found wounded in battle in France YYY and adopted by an American YYY. He would sign his own contracts with his paw print. YYY',
  'YYY Dogs like sweets a lot more than cats. YYY Cats have around 473 taste buds, YYY dogs have about 1,700 taste buds. YYY Humans have 9,000. YYY A lost Dachshund was found swallowed YYY in the stomach of a giant YYY catfish on July 2003. YYY',
  'YYY It is easier for dogs to YYY learn spoken commands if given YYY with signals. YYY Toto earned $125 per week of filming, YYY but each Munchkin earned $50. YYY In Christian tradition, YYY St. Christopher is depicted with a dog’s head. YYY',
  'YYY Dogs can see in color, YYY though they likely see colors YYY similar to a color-blind human. YYY They see better with low light. YYY Dogs have lived with humans for over YYY 14k years. YYY Cats have lived with people for only 7k years. YYY',
  'YYY The oldest dog on record was an YYY Australian cattle dog named Bluey YYY who lived 29 years and 5 months. YYY In human years, that is more than YYY 160 years old. The most popular dog breed YYY in Canada YYY is the Labrador retriever. YYY',
  'YYY During the Middle Ages, YYY mixed breeds of peasants’ YYY dogs were required to wear blocks YYY around their necks to keep them from breeding YYY with noble hunting dogs. YYY Purebreds were expensive and YYY hunting was for the rich. YYY',
  'YYY In the Middle Ages, YYY the leisured class often kept dogs YYY as pets, while the rest of the population YYY mainly used them for protection and herding. YYY At the end of WWI, the Germans YYY trained the guide dogs for YYY the blind. YYY',
  'YYY The origin of amputating a dog’s YYY tail may go back to the Roman writer YYY Columella’s assertion that tail YYY docking prevented rabies. YYY One of Shakespeare’s mischievous YYY characters is Crab, YYY the dog belonging to Launce. YYY',
  'YYY The names of 77 YYY ancient Egyptian dogs have been recorded. YYY The names refer to color and YYY character, such as Blackie, YYY Ebony, Good Herdsman, and Reliable YYY. The US has YYY the highest dog population in the world. YYY',
  'YYY During the Renaissance, YYY portraits of the dog as a YYY symbol of fidelity appeared YYY in mythological, and YYY religious art throughout Europe, YYY including works by Leonardo da Vinci, YYY Jan van Eyck, and Albrecht Durer. YYY',
  'YYY The first dog chapel was YYY established in 2001. YYY It was built in Vermont, by Stephan Huneck, YYY a children’s book author whose YYY five dogs helped him YYY recuperate from illness. YYY The Basenji is the world’s barkless dog. YYY',
  'YYY Dogs are as smart as a YYY two year old. YYY They understand 200 words, YYY including signals and hand movements YYY with the same meaning as words. YYY There are almost 5 million dog bites per year; YYY children are the main victims. YYY',
  'YYY Within hours of the 0/11, YYY attack on the World Trade Center, YYY specially trained dogs were on the scene, YYY including German Shepherds, YYY and a few Dachshunds. YYY It costs $10,000 to train a YYY certified search and rescue dog. YYY',
]};
unsafeWindow.adjectives = [
  "Abiding",
  "Able-bodied",
  "Abloom",
  "Abounding",
  "Above",
  "Aboveboard",
  "Absolute",
  "Absolved",
  "Abundant",
  "Accelerated",
  "Acceptable",
  "Accepted",
  "Accepting",
  "Accessible",
  "Acclaimed",
  "Accommodated",
  "Accommodating",
  "Accommodative",
  "Accomplished",
  "Accordant",
  "Accountable",
  "Accredited",
  "Aces",
  "Achieving",
  "Accurate",
  "Accustomed",
  "Acknowledged",
  "Acknowledging",
  "Acquainted",
  "Active",
  "Actual",
  "Actualized",
  "Acuminate",
  "Acuminous",
  "Adaptable",
  "Adapted",
  "Adapting",
  "Adaptive",
  "Adept",
  "Adequate",
  "Adjusted",
  "Admirable",
  "Admired",
  "Admissible",
  "Adonic",
  "Adorable",
  "Adored",
  "Adoring",
  "Adroit",
  "Advanced",
  "Advantaged",
  "Advantageous",
  "Adventuresome",
  "Adventurous",
  "Advisable",
  "Advocative",
  "Aeonian",
  "Aesthetic",
  "Aesthetical",
  "Affable",
  "Affecting",
  "Affectionate",
  "Affective",
  "Affiliated",
  "Affine",
  "Affined",
  "Affirming",
  "Afflated",
  "Afflating",
  "Affluencial",
  "Affluent",
  "Affordable",
  "Agapeistic",
  "Ageless",
  "Agile",
  "Agreeable",
  "Airy",
  "Alacritous",
  "Alaudine",
  "Alert",
  "Alfresco",
  "Alimental",
  "Alimentary",
  "Alive",
  "All-ears",
  "All-heart",
  "Alright",
  "All-set",
  "All-systems-go",
  "Allegiant",
  "Allied",
  "All-important",
  "Allowed",
  "Allowing",
  "Alluring",
  "Altruistic",
  "Alright",
  "Amaranthine",
  "Amative",
  "Amatory",
  "Amazed",
  "Amazing",
  "Ambidextrous",
  "Ambitious",
  "Ambrosial",
  "Ambrosian",
  "Ameliorative",
  "Amelioratory",
  "Amenable",
  "Amiable",
  "Amicable",
  "Ample",
  "Amoroso",
  "Amused",
  "Amusing",
  "Anamnestic",
  "Angelic",
  "Animastic",
  "Animated",
  "Animating",
  "Anodyne",
  "Anointed",
  "Anthophilous",
  "Aplenty",
  "Aphrodisiacal",
  "Apodictic",
  "Apollonian",
  "Apparent",
  "Appealing",
  "Appeasing",
  "Aperitive",
  "Appetent",
  "Appetizing",
  "Applauded",
  "Apposite",
  "Appreciated",
  "Appreciative",
  "Apprehensible",
  "Approachable",
  "Appropriate",
  "Approving",
  "Apropos",
  "Apt",
  "Arcadian",
  "Archangelic",
  "Ardent",
  "Aristocratic",
  "Aromatic",
  "Aroused",
  "Arousing",
  "Arresting",
  "Arriving",
  "Artful",
  "Articulate",
  "Artisanal",
  "Artistic",
  "Ascendant",
  "Ascending",
  "Aspirant",
  "Aspiring",
  "Assertive",
  "Assiduous",
  "Assisting",
  "Assistive",
  "Associated",
  "Associative",
  "Assured",
  "Assurgent",
  "Assuring",
  "Astonishing",
  "Astounding",
  "Astral",
  "Astute",
  "At-ease",
  "At-hand",
  "At-leisure",
  "Athletic",
  "Attainable",
  "At-the-ready",
  "Attentive",
  "Attractive",
  "Atypical",
  "August",
  "Auroral",
  "Auriferous",
  "Auspicious",
  "Authentic",
  "Authenticated",
  "Authoritative",
  "Authorized",
  "Autodidactic",
  "Autonomous",
  "Available",
  "Avant-garde",
  "Avid",
  "Awaited",
  "Awake",
  "Aware",
  "Awakening",
  "Awed",
  "Awesome",
  "Axiological",
  "Axiomatic",
  "Baconian",
  "Balanced",
  "Balmy",
  "Baronial",
  "Beaming",
  "Beamish",
  "Beatific",
  "Beauteous",
  "Beautified",
  "Beautiful",
  "Becoming",
  "Bedazzling",
  "Beefy",
  "Befriended",
  "Believable",
  "Beloved",
  "Benedictive",
  "Benedictory",
  "Benefic",
  "Beneficent",
  "Beneficial",
  "Beneficiary",
  "Benevolent",
  "Benign",
  "Benignant",
  "Best",
  "Best-loved",
  "Better",
  "Bewitching",
  "Beyond-compare",
  "Big",
  "Big-league",
  "Big-hearted",
  "Big-time",
  "Bijou",
  "Blameless",
  "Blazing",
  "Blessed",
  "Blissful",
  "Blithe",
  "Blithesome",
  "Blockbuster",
  "Blooming",
  "Blossoming",
  "Blue-ribbon",
  "Bodacious",
  "Boisterous",
  "Bold",
  "Boffo",
  "Bonafide",
  "Bonny",
  "Bonzer",
  "Boss",
  "Bounding",
  "Bounteous",
  "Bountiful",
  "Brainy",
  "Brave",
  "Brawny",
  "Breathtaking",
  "Breezy",
  "Breviloquent",
  "Brief",
  "Bright",
  "Brill",
  "Brilliant",
  "Brimming",
  "Brisk",
  "Broadminded",
  "Brotherly",
  "Bubbly",
  "Buccal",
  "Bucolic",
  "Budding",
  "Buff",
  "Bulletproof",
  "Bullish",
  "Bully",
  "Buoyant",
  "Burgeoning",
  "Business-like",
  "Bursting",
  "Busting",
  "Bustling",
  "Busy",
  "Buxom",
  "Callipygous",
  "Calm",
  "Calmative",
  "Calming",
  "Candescent",
  "Canny",
  "Canoodling",
  "Canorous",
  "Canty",
  "Cantier",
  "Capable",
  "Capital",
  "Captivating",
  "Cared-for",
  "Carefree",
  "Careful",
  "Caring",
  "Caretaking",
  "Casual",
  "Categorical",
  "Causal",
  "Causative",
  "Celebrated",
  "Celebratory",
  "Celeritous",
  "Celestial",
  "Centered",
  "Central",
  "Cerebral",
  "Certain",
  "Champion",
  "Changeable",
  "Changeless",
  "Chaplinesque",
  "Charismatic",
  "Charitable",
  "Charmed",
  "Charming",
  "Cheerful",
  "Cherished",
  "Cherishing",
  "Cherry",
  "Chic",
  "Chief",
  "Childlike",
  "Chipper",
  "Chirpy",
  "Chivalrous",
  "Chocolatey",
  "Choice",
  "Chosen",
  "Chummy",
  "Civic",
  "Civil",
  "Civilized",
  "Clairvoyant",
  "Classic",
  "Classical",
  "Classy",
  "Clean",
  "Cleansing",
  "Clear",
  "Clear-cut",
  "Clear-eyed",
  "Clearheaded",
  "Clear-sighted",
  "Clement",
  "Clever",
  "Climactic",
  "Climbing",
  "Clinquant",
  "Close",
  "Closing",
  "Coadjutant",
  "Cock-a-hoop",
  "Coequal",
  "Cogent",
  "Cogitabund",
  "Cognizant",
  "Coherent",
  "Cohortative",
  "Collaborative",
  "Collected",
  "Collegial",
  "Collegiate",
  "Colossal",
  "Colourful",
  "Coltish",
  "Columbine",
  "Come-at-able",
  "Come-hither",
  "Comely",
  "Comfortable",
  "Comforting",
  "Comic",
  "Comical",
  "Commendable",
  "Commendatory",
  "Commending",
  "Commiserative",
  "Committed",
  "Commodious",
  "Commonsensical",
  "Communal",
  "Communicative",
  "Commutual",
  "Companionable",
  "Compassionate",
  "Compatible",
  "Compelling",
  "Compendious",
  "Competent",
  "Complaisant",
  "Complete",
  "Completed",
  "Complimentary",
  "Composed",
  "Comprehensive",
  "Concentrated",
  "Conceptual",
  "Conciliatory",
  "Concise",
  "Conclusive",
  "Concordant",
  "Concrete",
  "Condolatory",
  "Conducive",
  "Confelicitous",
  "Conferrable",
  "Confident",
  "Confirmed",
  "Congenial",
  "Congruent",
  "Congruous",
  "Conjugate",
  "Connected",
  "Conquering",
  "Conscientious",
  "Conscious",
  "Consecrated",
  "Consensual",
  "Consentaneous",
  "Consentient",
  "Consequential",
  "Considerable",
  "Considerate",
  "Consistent",
  "Consolidated",
  "Consonant",
  "Constitutional",
  "Constitutive",
  "Constructive",
  "Consubstantial",
  "Contemplative",
  "Contemporary",
  "Content",
  "Contiguous",
  "Continuous",
  "Contributive",
  "Convenient",
  "Conversant",
  "Convictive",
  "Convincing",
  "Convivial",
  "Cool",
  "Cooperative",
  "Coordinated",
  "Copacetic",
  "Copious",
  "Cordial",
  "Corking",
  "Correct",
  "Correlative",
  "Coruscant",
  "Cosmic",
  "Cosmopolitan",
  "Cosy",
  "Courageous",
  "Courteous",
  "Courtly",
  "Couthie",
  "Cozy",
  "Crack",
  "Crackerjack",
  "Cranked",
  "Creamy",
  "Creative",
  "Credential",
  "Credible",
  "Creditable",
  "Credited",
  "Crisp",
  "Crowd-pleasing",
  "Crucial",
  "Cuddly",
  "Culminating",
  "Cultivated",
  "Cultivating",
  "Cultured",
  "Cunning",
  "Curative",
  "Curious",
  "Current",
  "Curvaceous",
  "Curvy",
  "Cushy",
  "Cute",
  "Cutting-edge",
  "Daedal",
  "Dainty",
  "Dandy",
  "Dapatical",
  "Dapper",
  "Daring",
  "Darling",
  "Dashing",
  "Dauntless",
  "Dazzled",
  "Dazzling",
  "Dear",
  "Debonair",
  "Decent",
  "Deciding",
  "Decisive",
  "Decorous",
  "Dedicated",
  "Deductive",
  "Deep",
  "Defiant",
  "Definite",
  "Definitive",
  "Deft",
  "Delectable",
  "Deliberate",
  "Delicate",
  "Delicious",
  "Delighted",
  "Delightful",
  "Delish",
  "Deluxe",
  "Democratic",
  "Demonstrative",
  "Demulcent",
  "Dependable",
  "Deserving",
  "Designer",
  "Desirable",
  "Desired",
  "Desirous",
  "Destined",
  "Determinant",
  "Determined",
  "Developed",
  "Developing",
  "Devoted",
  "Devotional",
  "Devout",
  "Dexterous",
  "Dialectical",
  "Didactic",
  "Didascalic",
  "Diehard",
  "Different",
  "Dignified",
  "Diligent",
  "Dinkum",
  "Diplomatic",
  "Direct",
  "Disarming",
  "Discerning",
  "Disciplined",
  "Discreet",
  "Discrete",
  "Discriminating",
  "Dispassionate",
  "Distinct",
  "Distinctive",
  "Distinguished",
  "Distinguishing",
  "Diverse",
  "Diverting",
  "Divine",
  "Doable",
  "Dominant",
  "Doted-on",
  "Doting",
  "Doubtless",
  "Doughty",
  "Dovelike",
  "Doxological",
  "Dreamy",
  "Driven",
  "Driving",
  "Droll",
  "Ducky",
  "Dulcet",
  "Durable",
  "Dutiful",
  "Dynamic",
  "Dynamite",
  "Eager",
  "Earnest",
  "Earthy",
  "Easy",
  "Easygoing",
  "Easy-peasy",
  "Ebullient",
  "Ecclesiastical",
  "Echt",
  "Eclectic",
  "Economic",
  "Economical",
  "Ecstatic",
  "Ecumenical",
  "Edified",
  "Edifying",
  "Educated",
  "Educational",
  "Effective",
  "Effectual",
  "Effervescent",
  "Efficacious",
  "Efficient",
  "Effortless",
  "Effulgent",
  "Elated",
  "Elating",
  "Electric",
  "Electrifying",
  "Elegant",
  "Eleemosynary",
  "Elemental",
  "Elevated",
  "Elevating",
  "Eleutherian",
  "Eligible",
  "Eloquent",
  "Emerging",
  "Eminent",
  "Empathetic",
  "Empathic",
  "Employable",
  "Empowered",
  "Empowering",
  "Empyrean",
  "Emulated",
  "Enabled",
  "Enabling",
  "Enamoured",
  "Enamouring",
  "Enchanted",
  "Enchanting",
  "Encouraged",
  "Encouraging",
  "Endeared",
  "Endearing",
  "Endeavouring",
  "Endless",
  "Endorsed",
  "Endorsing",
  "Endowed",
  "Enduring",
  "Energetic",
  "Energizing",
  "Engaged",
  "Engaging",
  "Engrossed",
  "Engrossing",
  "Enhanced",
  "Enjoyable",
  "Enjoyed",
  "Enkindling",
  "Enlightened",
  "Enlightening",
  "Enlivened",
  "Enlivening",
  "Ennobled",
  "Ennobling",
  "Enough",
  "Enormous",
  "Enraptured",
  "Enrapturing",
  "Enriched",
  "Enriching",
  "Ensured",
  "Ensuring",
  "Enterprising",
  "Entertaining",
  "Enthralled",
  "Enthralling",
  "Enthusiastic",
  "Enticed",
  "Enticing",
  "Entranced",
  "Entrancing",
  "Entrepreneurial",
  "Entrusted",
  "Epic",
  "Epigamic",
  "Epicurean",
  "Epideictic",
  "Epididactic",
  "Epinician",
  "Equable",
  "Equal",
  "Equalized",
  "Equanimous",
  "Equipollent",
  "Equiponderant",
  "Equiponderate",
  "Equipollent",
  "Equipped",
  "Equitable",
  "Erogenous",
  "Erotic",
  "Erudite",
  "Especial",
  "Essential",
  "Established",
  "Esteemed",
  "Eternal",
  "Ethereal",
  "Esthetic",
  "Esthetical",
  "Ethical",
  "Eupeptic",
  "Euphonic",
  "Euphonious",
  "Euphoric",
  "Eurythmic",
  "Even-handed",
  "Eventful",
  "Evident",
  "Eviternal",
  "Evocative",
  "Evolved",
  "Evolving",
  "Exact",
  "Exalted",
  "Exalting",
  "Exceeding",
  "Excellent",
  "Excelling",
  "Excelsior",
  "Exceptional",
  "Excited",
  "Exciting",
  "Exclusive",
  "Executive",
  "Exemplary",
  "Exhaustive",
  "Exhilarated",
  "Exhilarating",
  "Exhortative",
  "Exhortatory",
  "Expansive",
  "Expectant",
  "Expedient",
  "Expeditious",
  "Expeditive",
  "Expergefacient",
  "Expensive",
  "Experienced",
  "Expert",
  "Explorative",
  "Expressive",
  "Exquisite",
  "Exotic",
  "Extraordinaire",
  "Extraordinary",
  "Exuberant",
  "Exultant",
  "Exulting",
  "Eyesome",
  "Eye-catching",
  "Fab",
  "Fabulous",
  "Facilitative",
  "Factual",
  "Fain",
  "Fair",
  "Faithful",
  "Famed",
  "Familial",
  "Familiar",
  "Family",
  "Famous",
  "Fancy",
  "Fancy-free",
  "Fanciful",
  "Fantabulous",
  "Fantastic",
  "Far-out",
  "Far-reaching",
  "Far-sighted",
  "Fascinated",
  "Fascinating",
  "Fashionable",
  "Fast",
  "Fatherly",
  "Faultless",
  "Favourable",
  "Favoured",
  "Favourite",
  "Fearless",
  "Feasible",
  "Featous",
  "Fecund",
  "Feelgood",
  "Felicitous",
  "Feminine",
  "Fertile",
  "Feracious",
  "Fervent",
  "Festal",
  "Festive",
  "Fetching",
  "Fidelitous",
  "Fiery",
  "Figureoutable",
  "Filled",
  "Filling",
  "Filigreed",
  "Fine",
  "Finer",
  "Firm",
  "First",
  "First-class",
  "First-order",
  "First-rate",
  "Fit",
  "Fitting",
  "Five-star",
  "Flamboyant",
  "Flashy",
  "Flavoured",
  "Flavourful",
  "Flavoursome",
  "Flawless",
  "Fleet",
  "Flexible",
  "Flourishing",
  "Flowing",
  "Fluent",
  "Fluttering",
  "Fly",
  "Flying",
  "Focussed",
  "Fond",
  "Foolproof",
  "Forbearant",
  "Forbearing",
  "Forceful",
  "Foremost",
  "Foresighted",
  "Forgivable",
  "Forgiving",
  "Formidable",
  "For-real",
  "Forthcoming",
  "Forthright",
  "Fortified",
  "Fortifying",
  "Fortuitous",
  "Fortunate",
  "Forward-thinking",
  "Foundational",
  "Foundationary",
  "Four-star",
  "Foxy",
  "Frabjous",
  "Fragrant",
  "Frank",
  "Fraternal",
  "Free",
  "Freethinking",
  "Fresh",
  "Friendly",
  "Frisky",
  "Frolicsome",
  "Front-page",
  "Fruitful",
  "Fulfilled",
  "Fulfilling",
  "Fulgent",
  "Full",
  "Fun",
  "Fundamental",
  "Funny",
  "Futuristic",
  "Gainful",
  "Gallant",
  "Galore",
  "Galvanized",
  "Galvanizing",
  "Game",
  "Gamesome",
  "Gargantuan",
  "Gastronomic",
  "Gay",
  "Gelastic",
  "Gelogenic",
  "Generative",
  "Generous",
  "Genial",
  "Genteel",
  "Gentle",
  "Gentlemanly",
  "Genuine",
  "Germane",
  "Get-at-able",
  "Gettable",
  "Gifted",
  "Giggly",
  "Giving",
  "Glabrous",
  "Glad",
  "Glamorous",
  "Gleaming",
  "Gleeful",
  "Glistening",
  "Glorified",
  "Glorious",
  "Glowing",
  "Gnarly",
  "Gnomic",
  "Goal-oriented",
  "Godlike",
  "Godly",
  "Golden",
  "Good",
  "Goodhearted",
  "Good-feeling",
  "Good-humoured",
  "Good-looking",
  "Goodly",
  "Good-natured",
  "Gorgeous",
  "Graced",
  "Graceful",
  "Gracile",
  "Gracious",
  "Gradely",
  "Graith",
  "Graithly",
  "Grand",
  "Grateful",
  "Gratified",
  "Gratifying",
  "Gratis",
  "Great",
  "Greathearted",
  "Gregarious",
  "Groovy",
  "Grounded",
  "Growing",
  "Grown",
  "Guaranteed",
  "Gubernatorial",
  "Guided",
  "Guiding",
  "Guileless",
  "Guilt-free",
  "Guiltless",
  "Gumptious",
  "Gustatory",
  "Gung-ho",
  "Gutsy",
  "Gymnastic",
  "Halcyon",
  "Hale",
  "Haloed",
  "Hallowed",
  "Handsome",
  "Handy",
  "Happening",
  "Happy",
  "Happy-go-lucky",
  "Hard-working",
  "Hardy",
  "Harmless",
  "Harmonic",
  "Harmonious",
  "Harmonizable",
  "Haunting",
  "Head",
  "Healing",
  "Healthful",
  "Healthy",
  "Heartfelt",
  "Heart-to-heart",
  "Heartsome",
  "Heart-stopping",
  "Heartwarming",
  "Hearty",
  "Heavenly",
  "Heavyweight",
  "Heedful",
  "Henotic",
  "Helped",
  "Helpful",
  "Helping",
  "Hep",
  "Heralded",
  "Heroic",
  "Heuristic",
  "High-Calibre",
  "High-class",
  "High-demand",
  "High-minded",
  "High-powered",
  "High-priority",
  "High-quality",
  "High-reaching",
  "High-spirited",
  "Highly-regarded",
  "Highly-seasoned",
  "Highly-valued",
  "Hilarious",
  "Hip",
  "Holy",
  "Honest",
  "Honeyed",
  "Honorary",
  "Honourable",
  "Honoured",
  "Hopeful",
  "Hortative",
  "Hortatory",
  "Hospitable",
  "Hot",
  "Hotshot",
  "Huge",
  "Huggy",
  "Huggable",
  "Human",
  "Humane",
  "Humanistic",
  "Humanitarian",
  "Humble",
  "Humorous",
  "Hunky",
  "Hunky-Dory",
  "Hygeian",
  "Hygienic",
  "Hypersonic",
  "Hypnotic",
  "Ideal",
  "Idealistic",
  "Idiosyncratic",
  "Idolized",
  "Idoneous",
  "Illecebrous",
  "Illimitable",
  "Illuminable",
  "Illuminated",
  "Illuminating",
  "Illustrious",
  "Imaginative",
  "Imitable",
  "Immaculate",
  "Immarcescible",
  "Immeasurable",
  "Immediate",
  "Immense",
  "Immortal",
  "Immune",
  "Impartial",
  "Impassioned",
  "Impavid",
  "Impeccable",
  "Impeccant",
  "Imperturbable",
  "Impish",
  "Important",
  "Impressive",
  "Improved",
  "Improving",
  "Improvisational",
  "Inaurate",
  "Incandescent",
  "Incisive",
  "Included",
  "Inclusive",
  "Incomparable",
  "Incomplex",
  "Incontestable",
  "Incontrovertible",
  "Incorrupt",
  "Incorruptible",
  "Incredible",
  "Inculpable",
  "Indefatigable",
  "In-demand",
  "Independent",
  "Indestructible",
  "Indispensable",
  "Indisputable",
  "Individual",
  "Individualistic",
  "Indivisible",
  "Indomitable",
  "Indubitable",
  "Industrious",
  "Inebriating",
  "Ineffable",
  "Inerrant",
  "Inexhaustible",
  "Infallible",
  "Infatuated",
  "Infatuating",
  "In-favour",
  "Infinite",
  "Influential",
  "Informative",
  "Informed",
  "Ingenious",
  "Inimitable",
  "Initiative",
  "Innate",
  "Innocent",
  "Innocuous",
  "Innovative",
  "In-order",
  "Innoxious",
  "Inquisitive",
  "In-the-now",
  "Insightful",
  "Insouciant",
  "Inspirational",
  "Inspired",
  "Inspiring",
  "Inspirited",
  "Inspiriting",
  "Instantaneous",
  "Instinctive",
  "Instructive",
  "Instrumental",
  "Integral",
  "Integrated",
  "Integrative",
  "Intemerate",
  "Interconnected",
  "Interconnective",
  "Internal",
  "Intellectual",
  "Intelligent",
  "Intense",
  "Intent",
  "Interactive",
  "Interested",
  "Interesting",
  "International",
  "Intertwined",
  "In-the-bag",
  "In-the-mainstream",
  "In-the-pink",
  "In-the-saddle",
  "Intimate",
  "Intoxicating",
  "Intrepid",
  "Intrigued",
  "Intriguing",
  "Intrinsic",
  "Introspective",
  "Inventive",
  "Invigorated",
  "Invigorating",
  "Invincible",
  "Inviolable",
  "Inviting",
  "In-vogue",
  "Irenic",
  "Iridescent",
  "Iridine",
  "Irrefragable",
  "Irrefutable",
  "Irreplaceable",
  "Irrepressible",
  "Irreproachable",
  "Irresistible",
  "Irrevincible",
  "Jam-packed",
  "Jaunty",
  "Jazzed",
  "Jazzy",
  "Jestful",
  "Jesting",
  "Jewelled",
  "Jiggish",
  "Jocose",
  "Jocoserious",
  "Jocular",
  "Joculatory",
  "Jocund",
  "Joint",
  "Jointed",
  "Jolif",
  "Jolly",
  "Jovial",
  "Joyful",
  "Joyous",
  "Joysome",
  "Jubilant",
  "Judicious",
  "Juicy",
  "Junoesque",
  "Just",
  "Justified",
  "Just-right",
  "Juvenescent",
  "Keen",
  "Kempt",
  "Key",
  "Kind",
  "Kind-hearted",
  "Kindly",
  "Kindred",
  "Kinetic",
  "Kingly",
  "Kissable",
  "Knightly",
  "Knowable",
  "Knowing",
  "Knowledgeable",
  "Known",
  "Kooky",
  "Kosher",
  "Ladylike",
  "Laid-back",
  "Lambent",
  "Large",
  "Largifical",
  "Lasting",
  "Latitudinarian",
  "Laudable",
  "Laudatory",
  "Laureate",
  "Lautitious",
  "Lavish",
  "Law-abiding",
  "Lawful",
  "Leading",
  "Leading-edge",
  "Learned",
  "Learning",
  "Legal",
  "Legendary",
  "Legible",
  "Legit",
  "Legitimate",
  "Leisured",
  "Leisurely",
  "Lenient",
  "Leonine",
  "Lepid",
  "Lettered",
  "Level-headed",
  "Liberal",
  "Liberated",
  "Liberating",
  "Libertarian",
  "Liefly",
  "Light",
  "Lightened",
  "Lightening",
  "Light-hearted",
  "Likable",
  "Liked",
  "Likely",
  "Like-minded",
  "Limber",
  "Limpid",
  "Lionhearted",
  "Lionized",
  "Lissome",
  "Literary",
  "Literate",
  "Lithe",
  "Lithesome",
  "Littoral",
  "Live",
  "Lively",
  "Living",
  "Logical",
  "Longanimous",
  "Long-established",
  "Long-lived",
  "Long-standing",
  "Lordly",
  "Lovable",
  "Loved",
  "Lovely",
  "Loving",
  "Loyal",
  "Lucent",
  "Lucid",
  "Lucky",
  "Luciferous",
  "Lucrative",
  "Lucriferous",
  "Luculent",
  "Ludibund",
  "Ludic",
  "Luminous",
  "Luscious",
  "Lush",
  "Lustrous",
  "Lusty",
  "Lusory",
  "Luxuriant",
  "Luxurious",
  "Mabsoot",
  "Macrobian",
  "Magical",
  "Magistral",
  "Magnanimous",
  "Magnetic",
  "Magnificent",
  "Maiden",
  "Main",
  "Mainstream",
  "Majestic",
  "Major",
  "Major-league",
  "Manageable",
  "Managerial",
  "Manifest",
  "Malleable",
  "Manly",
  "Mannerly",
  "Many",
  "Margaric",
  "Margaritiferous",
  "Marketable",
  "Marmoreal",
  "Marmorean",
  "Marvellous",
  "Masculine",
  "Massagable",
  "Massive",
  "Master",
  "Masterful",
  "Masterly",
  "Matchless",
  "Maternal",
  "Matter-of-fact",
  "Mature",
  "Maturing",
  "Maxed",
  "Maximal",
  "Maximum",
  "Meaningful",
  "Measured",
  "Mediagenic",
  "Meditative",
  "Meek",
  "Meet",
  "Melioristic",
  "Mellifluous",
  "Melliloquent",
  "Mellisonant",
  "Mellow",
  "Melodious",
  "Memorable",
  "Meracious",
  "Merciful",
  "Meritable",
  "Meritorious",
  "Merry",
  "Mesmerizing",
  "Metaphysical",
  "Meteoric",
  "Methodical",
  "Methodological",
  "Meticulous",
  "Mettlesome",
  "Mickle",
  "Mighty",
  "Mind-blowing",
  "Mindful",
  "Minikin",
  "Ministerial",
  "Mint",
  "Miraculous",
  "Mirific",
  "Mirthful",
  "Mischievous",
  "Mitigative",
  "Mitigatory",
  "Model",
  "Modern",
  "Modernist",
  "Modernistic",
  "Modest",
  "Momentous",
  "Moneyed",
  "Monumental",
  "Moral",
  "More",
  "Most",
  "Motherly",
  "Motivated",
  "Motivating",
  "Motivational",
  "Mouthwatering",
  "Moved",
  "Moving",
  "Mucho",
  "Muliebral",
  "Muliebrile",
  "Muliebrous",
  "Multicultural",
  "Multidimensional",
  "Multidisciplined",
  "Multifaceted",
  "Multifarious",
  "Multilingual",
  "Munificent",
  "Muscular",
  "Musical",
  "Mutual",
  "Nailed-Down",
  "Nascent",
  "Natalitial",
  "National",
  "Nationwide",
  "Native",
  "Natty",
  "Natural",
  "Nearby",
  "Neat",
  "Necessary",
  "Needed",
  "Neighbourly",
  "Neoteric",
  "Neutral",
  "Never-failing",
  "New",
  "Newborn",
  "New-fashioned",
  "Next",
  "Nice",
  "Nifty",
  "Nimble",
  "Nimble-witted",
  "Nitid",
  "Nobiliary",
  "Noble",
  "Noetic",
  "Noctiflorous",
  "Nonchalant",
  "Nonpareil",
  "Normal",
  "Normative",
  "Notable",
  "Noted",
  "Noteworthy",
  "Nourished",
  "Nourishing",
  "Novel",
  "Now",
  "Nubigenous",
  "Nubile",
  "Number-1",
  "Number-one",
  "Numero-uno",
  "Nurtured",
  "Nurturing",
  "Nutrimental",
  "Nutritional",
  "Nutritious",
  "Objective",
  "Obliging",
  "Observant",
  "Obtainable",
  "Oecumenical",
  "Okay",
  "Okayed",
  "Olympian",
  "Omnipotent",
  "Omnipresent",
  "On",
  "On-hand",
  "On-target",
  "On-the-ball",
  "On-the-beam",
  "On-the-button",
  "On-the-job",
  "On-the-money",
  "On-the-move",
  "On-the-nose",
  "One",
  "Oneiric",
  "Open",
  "Open-handed",
  "Open-hearted",
  "Open-minded",
  "Opinable",
  "Opportune",
  "Optimal",
  "Optimistic",
  "Optimum",
  "Opulent",
  "Orbific",
  "Orderly",
  "Organic",
  "Organized",
  "Oriented",
  "Original",
  "Ornamental",
  "Orphean",
  "Oscular",
  "Outdoorsy",
  "Outgoing",
  "Out-of-sight",
  "Out-of-this-world",
  "Outspoken",
  "Outstanding",
  "Overflowing",
  "Overjoyed",
  "Overjoying",
  "Overriding",
  "Overruling",
  "Overt",
  "Pabulous",
  "Pacific",
  "Paciferous",
  "Pacifistic",
  "Painstaking",
  "Palatable",
  "Pally",
  "Palmarian",
  "Palmary",
  "Panglossian",
  "Pansophical",
  "Pansophistical",
  "Paramount",
  "Pardonable",
  "Parental",
  "Par-excellence",
  "Paradisaic",
  "Paradisal",
  "Paradisiacal",
  "Parnassian",
  "Parthenian",
  "Participative",
  "Participatory",
  "Particular",
  "Passionate",
  "Paternal",
  "Patient",
  "Peaceable",
  "Peaceful",
  "Peachy",
  "Peachy-keen",
  "Peak",
  "Pecuniary",
  "Peerless",
  "Peppy",
  "Pellucid",
  "Penetrating",
  "Perceptive",
  "Perceptual",
  "Percipient",
  "Perdurable",
  "Peregal",
  "Perennial",
  "Perfect",
  "Perfectible",
  "Perfective",
  "Perky",
  "Permissive",
  "Perpetual",
  "Perseverant",
  "Persevering",
  "Persistent",
  "Personable",
  "Perspicacious",
  "Perspicuous",
  "Persuasive",
  "Pert",
  "Permanent",
  "Pertinent",
  "Pet",
  "Petite",
  "Pharaonic",
  "Phenomenal",
  "Philanthropic",
  "Philodemic",
  "Philoprogenitive",
  "Philosophical",
  "Philoxenial",
  "Phlegmatic",
  "Picked",
  "Picturesque",
  "Pierian",
  "Pioneering",
  "Pious",
  "Piquant",
  "Pithy",
  "Pivotal",
  "Placid",
  "Planetary",
  "Plausible",
  "Playful",
  "Pleasant",
  "Pleased",
  "Pleasing",
  "Pleasurable",
  "Plenary",
  "Plenteous",
  "Plentiful",
  "Pliable",
  "Plucky",
  "Plum",
  "Plummy",
  "Pluperfect",
  "Poetic",
  "Poignant",
  "Poised",
  "Polished",
  "Polite",
  "Pollent",
  "Popular",
  "Posh",
  "Positive",
  "Possible",
  "Potable",
  "Potent",
  "Potential",
  "Powerful",
  "Practicable",
  "Practical",
  "Practiced",
  "Pragmatic",
  "Praised",
  "Praiseworthy",
  "Prayerful",
  "Precious",
  "Precise",
  "Precocious",
  "Predominant",
  "Preeminent",
  "Preemptory",
  "Preferable",
  "Preferred",
  "Prefulgent",
  "Premier",
  "Premium",
  "Prepared",
  "Preponderant",
  "Prepossessing",
  "Prepotent",
  "Prescient",
  "Present",
  "Presentable",
  "Presidential",
  "Prestigious",
  "Pretty",
  "Prevalent",
  "Prevailing",
  "Prevenient",
  "Prevoyant",
  "Priceless",
  "Primal",
  "Primary",
  "Prime",
  "Primed",
  "Primo",
  "Princely",
  "Principal",
  "Principled",
  "Priority",
  "Pristine",
  "Privileged",
  "Prized",
  "Prize-winning",
  "Pro",
  "Proactive",
  "Probable",
  "Probative",
  "Procinct",
  "Procurable",
  "Prodigious",
  "Productive",
  "Professional",
  "Proficient",
  "Profitable",
  "Profound",
  "Profulgent",
  "Profuse",
  "Progressive",
  "Proleptic/Proleptical",
  "Prolific",
  "Prominent",
  "Promising",
  "Promoted",
  "Promoting",
  "Prompt",
  "Proper",
  "Propertied",
  "Propitious",
  "Prophetic",
  "Prospective",
  "Prospering",
  "Prosperous",
  "Protean",
  "Protected",
  "Protective",
  "Providential",
  "Provocative",
  "Proud",
  "Proven",
  "Prudent",
  "Psyched-up",
  "Psychic",
  "Public-spirited",
  "Puissant",
  "Pulchritudinous",
  "Pukka",
  "Pumped",
  "Pumped-up",
  "Punchy",
  "Punctual",
  "Pure",
  "Purified",
  "Purifying",
  "Purposeful",
  "Purposive",
  "Quaint",
  "Quantifiable",
  "Qualified",
  "Qualitative",
  "Quality",
  "Queenly",
  "Quemeful",
  "Quick",
  "Quickened",
  "Quick-witted",
  "Quiet",
  "Quietsome",
  "Quintessential",
  "Quixotic",
  "Quotable",
  "Racy",
  "Rad",
  "Radiant",
  "Rapid",
  "Rapt",
  "Rapturous",
  "Rare",
  "Rascally",
  "Rathe",
  "Ratiocinative",
  "Rational",
  "Ravishing",
  "Razor-sharp",
  "Reachable",
  "Readied",
  "Ready",
  "Real",
  "Realistic",
  "Realizable",
  "Reasonable",
  "Reassuring",
  "Recherche'",
  "Recognizable",
  "Receiving",
  "Receptive",
  "Recipient",
  "Reciprocal",
  "Recognized",
  "Recommendable",
  "Recommended",
  "Recuperative",
  "Red-carpet",
  "Redolent",
  "Refined",
  "Refreshed",
  "Refreshing",
  "Refulgent",
  "Regal",
  "Regnant",
  "Regular",
  "Rejoicing",
  "Rejuvenating",
  "Rejuvenescent",
  "Related",
  "Relative",
  "Relaxed",
  "Relaxing",
  "Relevant",
  "Reliable",
  "Relieved",
  "Relieving",
  "Relished",
  "Relishing",
  "Remarkable",
  "Remissive",
  "Renascent",
  "Renewable",
  "Renewing",
  "Renewed",
  "Renowned",
  "Replete",
  "Reputable",
  "Resilient",
  "Resolute",
  "Resolved",
  "Resounding",
  "Resourceful",
  "Respectable",
  "Respected",
  "Respectful",
  "Resplendent",
  "Responsible",
  "Responsive",
  "Rested",
  "Restful",
  "Restorative",
  "Retentive",
  "Revealing",
  "Revelational",
  "Revered",
  "Reverent",
  "Revitalized",
  "Revitalizing",
  "Revived",
  "Reviviscent",
  "Revivifying",
  "Rewardable",
  "Rewarded",
  "Rewarding",
  "Rhapsodic",
  "Riant",
  "Rich",
  "Rident",
  "Ridibund",
  "Right",
  "Righteous",
  "Rightful",
  "Risible",
  "Risorial",
  "Robust",
  "Rock-solid",
  "Rollicking",
  "Romantic",
  "Rosy",
  "Roused",
  "Rousing",
  "Ruling",
  "Rutilant",
  "Sacred",
  "Sacrosanct",
  "Safe",
  "Sage",
  "Sagacious",
  "Salubrious",
  "Salutary",
  "Salutiferous",
  "Saintly",
  "Sanative",
  "Sanatory",
  "Sanctified",
  "Sanctiloquent",
  "Sanctioned",
  "Sanguine",
  "Sanitary",
  "Sapid",
  "Sapiential",
  "Sapient",
  "Sapiential",
  "Saporific",
  "Saporous",
  "Sartorial",
  "Sassy",
  "Satisfactory",
  "Satisfied",
  "Satisfying",
  "Sative",
  "Saucy",
  "Saved",
  "Saving",
  "Savouring",
  "Savoury",
  "Savvy",
  "Scented",
  "Scholarly",
  "Scientific",
  "Scintillant",
  "Scintillated",
  "Scintillating",
  "Scintillescent",
  "Scrumptious",
  "Scrupulous",
  "Seamless",
  "Seasoned",
  "Second-to-none",
  "Secure",
  "Secured",
  "Sedulous",
  "Seemly",
  "Select",
  "Selected",
  "Self-accepting",
  "Self-assertive",
  "Self-assured",
  "Self-confident",
  "Self-disciplined",
  "Self-expressive",
  "Self-governing",
  "Selfless",
  "Self-made",
  "Self-sacrificing",
  "Self-starting",
  "Self-sufficient",
  "Self-taught",
  "Sensate",
  "Sensational",
  "Sensible",
  "Sensitive",
  "Sensual",
  "Sensuous",
  "Sentimental",
  "Seraphic",
  "Serendipitous",
  "Serene",
  "Service-minded",
  "Service-oriented",
  "Sesquipedalian",
  "Set",
  "Settled",
  "Settling",
  "Sexual",
  "Sexy",
  "Shapely",
  "Sharing",
  "Sharp",
  "Sharp-eyed",
  "Sharp-witted",
  "Sheltering",
  "Shining",
  "Shiny-eyed",
  "Shipshape",
  "Showy",
  "Shrewd",
  "Sightly",
  "Significant",
  "Simple",
  "Sincere",
  "Sinewy",
  "Singular",
  "Sisterly",
  "Sizable",
  "Skilful",
  "Skilled",
  "Skookum",
  "Slamin'",
  "Sleek",
  "Slick",
  "Smart",
  "Smashing",
  "Smiley",
  "Smiling",
  "Smitten",
  "Smooth",
  "Snazzy",
  "Snappy",
  "Snod",
  "Snug",
  "Snugly",
  "Soaring",
  "Sociable",
  "Social",
  "Societal",
  "Soft-hearted",
  "Soigne",
  "Solacious",
  "Solar",
  "Sole",
  "Solid",
  "Solid-gold",
  "Solomon-like",
  "Something-else",
  "Sonorous",
  "Sonsy",
  "Sooth",
  "Soothed",
  "Soothfast",
  "Soothing",
  "Sophic",
  "Sophisticated",
  "Sought",
  "Sought-after",
  "Soulful",
  "Sound",
  "Souped-up",
  "Sovereign",
  "Spacious",
  "Spanking",
  "Sparkling",
  "Sparkly",
  "Special",
  "Spectacular",
  "Speedy",
  "Spellbinding",
  "Spicy",
  "Spiffy",
  "Spirited",
  "Spiritual",
  "Splendid",
  "Splendiferous",
  "Splendorous",
  "Spontaneous",
  "Sponsal",
  "Sporting",
  "Sportive",
  "Sportsmanlike",
  "Sporty",
  "Spotless",
  "Spot-on",
  "Sprauncy",
  "Sprightly",
  "Spruce",
  "Spruced-up",
  "Spry",
  "Spunky",
  "Square",
  "Stable",
  "Staid",
  "Stainless",
  "Stalwart",
  "Stand-up",
  "Star",
  "Stately",
  "State-of-the-art",
  "Statuesque",
  "Staunch",
  "Steadfast",
  "Steady",
  "Stellar",
  "Sterling",
  "Sthenic",
  "Stick-to-itive",
  "Still",
  "Stimulated",
  "Stimulating",
  "Stimulative",
  "Stimulatory",
  "Stipendiary",
  "Stirred",
  "Stirring",
  "Stonking",
  "Storied",
  "Stouthearted",
  "Straightforward",
  "Strapping",
  "Strategic",
  "Street-smart",
  "Streetwise",
  "Strengthening",
  "Striking",
  "Striving",
  "Strong",
  "Strong-willed",
  "Studious",
  "Stunning",
  "Stupendous",
  "Sturdy",
  "Stylish",
  "Suasive",
  "Suave",
  "Suaveloquent",
  "Suaveolent",
  "Sublime",
  "Substant",
  "Substantial",
  "Substantive",
  "Subtle",
  "Successful",
  "Succinct",
  "Succulent",
  "Sufficient",
  "Sui-generis",
  "Suitable",
  "Suited",
  "Summary",
  "Summery",
  "Sumptuous",
  "Sunny",
  "Super",
  "Superabundant",
  "Super-angelic",
  "Superb",
  "Super-duper",
  "Supercalifragilisticexpialidocious",
  "Super-civilized",
  "Super-eminent",
  "Super-ethical",
  "Super-excellent",
  "Superior",
  "Superlative",
  "Supernal",
  "Super-popular",
  "Supersensible",
  "Supersonic",
  "Supple",
  "Supported",
  "Supporting",
  "Supportive",
  "Supraliminal",
  "Supreme",
  "Sure",
  "Sure-fire",
  "Sure-footed",
  "Sure-handed",
  "Surpassing",
  "Surprised",
  "Surprising",
  "Sustained",
  "Sustaining",
  "Sustentative",
  "Svelte",
  "Swank",
  "Swaying",
  "Sweeping",
  "Sweet",
  "Sweet-smelling",
  "Swell",
  "Swift",
  "Sybaritic",
  "Sylvan",
  "Symbiotic",
  "Symmetrical",
  "Sympathetic",
  "Synergistic",
  "Systematic",
  "Tachytelic",
  "Tactful",
  "Tailor-made",
  "Take-charge",
  "Talented",
  "Tangible",
  "Tantalizing",
  "Tasteful",
  "Tasty",
  "Taught",
  "Teachable",
  "Teaching",
  "Teeming",
  "Telegenic",
  "Teleorganic",
  "Tempean",
  "Temperate",
  "Tempestive",
  "Tenable",
  "Tenacious",
  "Tender",
  "Tender-hearted",
  "Terrific",
  "Thankful",
  "Thankworthy",
  "Thaumatological",
  "Theanthropic",
  "Theanthropic",
  "Therapeutic",
  "There",
  "Thorough",
  "Thoroughgoing",
  "Thoughtful",
  "Thrilled",
  "Thrilling",
  "Thriving",
  "Tickety-Boo",
  "Tickled",
  "Tidy",
  "Tight",
  "Time-honoured",
  "Timeless",
  "Timely",
  "Timeous",
  "Time-saving",
  "Tip-top",
  "Tireless",
  "Titanic",
  "Titillated",
  "Titillating",
  "Today",
  "Together",
  "Tolerant",
  "Tonic",
  "Tony",
  "Toothsome",
  "Topical",
  "Top",
  "Top-notch",
  "Tops",
  "Totally-tubular",
  "To-the-max",
  "Touched",
  "Touching",
  "Tough",
  "Touted",
  "Traditive",
  "Trailblazing",
  "Tranquil",
  "Transcendent",
  "Transcendental",
  "Transformable",
  "Transformative",
  "Transnormal",
  "Transparent",
  "Transpicuous",
  "Transporting",
  "Traveled",
  "Treasurable",
  "Treasured",
  "Tremendous",
  "Trim",
  "Triumphant",
  "True",
  "True-blue",
  "Trusted",
  "Trustful",
  "Trusting",
  "Trustworthy",
  "Trusty",
  "Truthful",
  "Tuneful",
  "Tutelary",
  "Twitterpated",
  "Tympanic",
  "Uber",
  "Ubiquitous",
  "Ultimate",
  "Ultra-precise",
  "Unabashed",
  "Unadulterated",
  "Unaffected",
  "Unafraid",
  "Unalloyed",
  "Unambiguous",
  "Unanimous",
  "Unarguable",
  "Unassuming",
  "Unattached",
  "Unbeatable",
  "Unbeaten",
  "Unbiased",
  "Unbigoted",
  "Unblemished",
  "Unbroken",
  "Uncensurable",
  "Uncommon",
  "Uncomplicated",
  "Uncompromising",
  "Unconditional",
  "Uncontestable",
  "Unconventional",
  "Uncorrupted",
  "Undamaged",
  "Undauntable",
  "Undaunted",
  "Undefeated",
  "Undefiled",
  "Undeniable",
  "Undesigning",
  "Under-control",
  "Understandable",
  "Understanding",
  "Understood",
  "Undiminished",
  "Undisputed",
  "Undivided",
  "Undoubted",
  "Unencumbered",
  "Unequalled",
  "Unequivocable",
  "Unequivocal",
  "Unerring",
  "Unfailing",
  "Unfaltering",
  "Unfaultable",
  "Unfeigned",
  "Unfettered",
  "Unflagging",
  "Unflappable",
  "Unforgettable",
  "Ungrudging",
  "Unhampered",
  "Unharmed",
  "Unhesitating",
  "Unhurt",
  "Unified",
  "Unigenous",
  "Unimpaired",
  "Unimpeachable",
  "Unimpeded",
  "Unique",
  "Unisonous",
  "Unisonal",
  "Unisonant",
  "United",
  "Universal",
  "Univocal",
  "Unlimited",
  "Unmistakable",
  "Unmitigated",
  "Unobjectionable",
  "Unobstructed",
  "Unobtrusive",
  "Unopposed",
  "Unparalleled",
  "Unprejudiced",
  "Unpretentious",
  "Unquestionable",
  "Unrefuted",
  "Unreserved",
  "Unrivalled",
  "Unruffled",
  "Unselfish",
  "Unshakable",
  "Unshaken",
  "Unspoiled",
  "Unspoilt",
  "Unstoppable",
  "Unsullied",
  "Unsurpassed",
  "Untarnished",
  "Untiring",
  "Untouched",
  "Untroubled",
  "Unusual",
  "Unwavering",
  "Unwithdrawing",
  "Unzymotic",
  "Up",
  "Up-and-coming",
  "Upbeat",
  "Upbuilding",
  "Upcoming",
  "Updated",
  "Up-front",
  "Uplifted",
  "Uplifting",
  "Uppermost",
  "Upright",
  "Upstanding",
  "Up-to-code",
  "Up-to-date",
  "Up-to-par",
  "Up-to-snuff",
  "Up-to-speed",
  "Uptown",
  "Upward",
  "Upwardly",
  "Urbane",
  "Usable",
  "Useful",
  "User-friendly",
  "Utile",
  "Utilitarian",
  "Utilizable",
  "Utmost",
  "Utopian",
  "Utopic",
  "Uxorial",
  "Valiant",
  "Valid",
  "Validating",
  "Validatory",
  "Valorous",
  "Valuable",
  "Valued",
  "Vast",
  "Vatic",
  "Vaticinal",
  "Vaulting",
  "Vegete",
  "Vehement",
  "Velocious",
  "Venerable",
  "Venerated",
  "Venial",
  "Ventorious",
  "Venturesome",
  "Venust",
  "Veracious",
  "Verdant",
  "Verdurous",
  "Verecund",
  "Veridical",
  "Veridicous",
  "Verified",
  "Verifiable",
  "Veriloquent",
  "Veritable",
  "Vernal",
  "Versatile",
  "Versed",
  "Vestal",
  "Veteran",
  "Viable",
  "Vibrant",
  "Victorious",
  "Vigilant",
  "Vigorous",
  "Viparious",
  "Virile",
  "Virtuous",
  "Visionary",
  "Vital",
  "Vitalizing",
  "Vitative",
  "Vivacious",
  "Vivid",
  "Vivifying",
  "Vocal",
  "Vogue",
  "Volable",
  "Volant",
  "Volcanic",
  "Volitional",
  "Voluptuary",
  "Voluptuous",
  "Vulnerary",
  "Waggish",
  "Wanted",
  "Warm",
  "Warm-hearted",
  "Warranted",
  "Wealthy",
  "Weighty",
  "Welcome",
  "Welcomed",
  "Welcoming",
  "Weleful",
  "Welfaring",
  "Well",
  "Well-arranged",
  "Well-behaved",
  "Well-built",
  "Well-disposed",
  "Well-done",
  "Well-established",
  "Well-founded",
  "Well-grounded",
  "Well-informed",
  "Well-intentioned",
  "Well-known",
  "Well-liked",
  "Well-made",
  "Well-meaning",
  "Well-planned",
  "Well-proportioned",
  "Well-read",
  "Well-received",
  "Well-spoken",
  "Well-suited",
  "Well-timed",
  "Welsome",
  "Whimsical",
  "Whiz-bang",
  "Whole",
  "Wholehearted",
  "Wholesome",
  "Wide-awake",
  "Widely-used",
  "Wight",
  "Willing",
  "Winnable",
  "Winged",
  "Winning",
  "Winsome",
  "Wired",
  "Wise",
  "With-it",
  "Within-reach",
  "Without-equal",
  "Without-error",
  "Without-limit",
  "Witty",
  "Wizardly",
  "Wonderful",
  "Wonderstruck",
  "Wonder-working",
  "Wondrous",
  "Workable",
  "Working",
  "World-class",
  "Worldly",
  "Worldly-wise",
  "Worshipful",
  "Worshipped",
  "Worthwhile",
  "Worthy",
  "Xenial",
  "Xenodocial",
  "Yare",
  "Yern",
  "Youthful",
  "Yummy",
  "Zany",
  "Zappy",
  "Zazzy",
  "Zealed",
  "Zealous",
  "Zestful",
  "Zesty",
  "Zippy",
  "Zoetic",
];
unsafeWindow.memes =[
  '934431295','932947498','932892709','936298774','933200331','933941557',
  '933494477','933978540','932900245','934728706','932916803','935019360',
  '932925876','936323472','936309283','934452137','933462040','932995590',
  '935056018','932959781','935878159','934388604','932905029','933188891',
  '935801739','932868798','933286470','932931694','932984101','936320030',
  '935242553','935906381','933550277','933314053','932997529','934184227',
  '935840059','933583044','933312203','933619668','935808026','934742263',
  '934429276','933203713','933423407','934115278','932989542','934980323',
  '932904704','932942561','934034642','933295153','932941441','934890144',
  '934131010','934208433','932958569','932914223','932930584','934199125',
  '934022565','932910864','934168359','933353042','932908533','934020891',
  '932907022','932884638','936341183','936332844','933634707','933645943',
  '933520446','932882608','932914522','932883136','933533145','935876352',
  '933210587','933967218','934974594','933196646','933341741','933291851',
  '933676993','933527932','935884088','932906317','933618520','932967617',
  '932967356','933273715','933371702','932923422','936208337','935897194',
  '933001164','933488283','932995229','936225969','932906713','932920704',
  '935871093','934896153','933186603','932892977','932936097','932925264',
  '932966333','933358605','934442257','933482112','933304842','933401247',
  '933330087','933995877','936092131','933935752','933424435','933003298',
  '932895559','933467312','935788130','935031478','933551328','936145191',
  '932932712','933503404','936113353','934085939','933323938','934195864',
  '932979047','936245669','934387177','933463767','936287794','933325496',
  '932927683','933383282','933420149','933696090','934217402','932960171',
  '933430200','936167434','934054775','933479458','933276194','932884202',
  '932948794','932897302','933257687','936297624','933005837','934126815',
  '935263157','933351498','932998386','933926003','935255463','932930065',
  '933004202','932991285','936153716','933992094','937032561','933350575',
  '932964760','934046195','933338637','934436961','933218693','933499358',
  '935194695','935205231','933259182','932899703','932887471','933321095',
  '934121800','933327300','933964100','933216888','933928173','934017508',
  '933268042','934077719','932892038','933224333','932944529','932912010',
  '933318224','934038879','932918366','935888111','933677532','933191129',
  '935475229','932923045','932867185','933481006','933950539','933949708',
  '934420288','934390656','932894569','935234028','935042981','934432818',
  '933199266','933457628','932885730','936235285','933399238','932868349',
  '932894236','932921738','932866657','935244877','933449860','933197451',
  '933368930','933446954','932864796','936099386','932967837','935211201',
  '933209659','932983006','934032952','934102279','932951386','934427962',
  '934052507','933518798','933934134','932890854','933468724','935862580',
  '933232568','933379274','932915576','933664244','933607672','932905333',
  '932916430','934095524','932865326','932948299','932957635','934891221',
  '934414946','934407007','935823675','935872606','932867612','933194283',
  '936294285','933953801','932868123','933256207','933272548','932869507',
  '933444101','933230528','932946470','932943258','932903262','932920090',
  '934743583','933398159','932986665','933529024','933301421','932939937',
  '933191758','933003659','932951703','932896186','937077166','933642453',
  '933536212','933389995','932947021','933631121','932935748','932928552',
  '932890219','932934354','935202130','932933989','933921625','935867855',
  '935045195','933999907','936251044','933211562','933304110','933367307',
  '932887065','936133612','932988694','932911106','935034624','934438358',
  '933957829','933256842','935827981','932998031','932984997','933002179',
  '932924001','933305717','935870173','932978274','933231790','933330738',
  '934883698','933626518','933609207','933381239','935214872','934150560',
  '934005804','933621035','933454060','935455561','932900547','932893979',
  '933408339','933612353','933946855','932958125','932992568','933951688',
  '932891230','932917016','933563410','935212867','935430795','932924779',
  '934143255','933333505','935880358','932937145','933290699','935808786',
  '932888254','933411456','934384100','932907905','934082566','936206946',
  '936307740','932992028','933515524','935874622','935543122','933449083',
  '932883920','932932937','933316958','932993622','934064416','932955754',
  '933635515','933475966','932887954','932866299','934047986','934391934',
  '932961463','935238694','936311510','932956299','933266085','932935232',
  '932957197','935903356','932986143','935869655','933679225','934966379',
  '933466254','933440276','932995920','932996546','933929342','933415163',
  '933207933','933302267','933000676','932999163','934009251','933653241',
  '933417652','933190085','932868591','932898744','932921223','935856842',
  '933955501','933409648','932999484','933263747','933293197','934967763',
  '933976394','933254959','934012744','933193258','934416180','933300301',
  '932959252','933331667','932902180','933225773','932965385','932939259',
  '933312942','934417525','932946756','933188031','933187312','934180884',
  '934092779','935863565','932987926','936216176','932916075','932915075',
  '934016021','933432454','933602420','933426256','935049171','936274120',
  '934426324','933266606','933374337','932903857','935258331','933373471',
  '932911533','932938455','932983404','933233400','933004687','933212463',
  '934113273','934894239','933614337','933221273','934177812','934885891',
  '934118440','936262211','933671340','933288187','933222156','936279966',
  '933220650','932929414','935907298','933269239','933669420','935875619',
  '932913992','934173140','934204116','932919016','932908756','932990294',
  '933611508','933445264','933477024','933956911','932953669','932912526',
  '932962083','932922057','934737437','934456367','936106908','933217648',
  '932891468','934135498','933506310','935879684','932907637','932977872',
  '932949579','934382660','932892302','935254047','933298872','933972929',
  '933361798','932920311','935051190','932979620','933189634','932896688',
  '936335230','933581765','933388463','932990794','935263847','936142767',
  '933219930','932869148','934079974','933204906','933459207','932931152',
  '932928895','933336996','932865551','936125271','934922364','934750279',
  '933198647','932909802','933306903','933343315','933470936','933492156',
  '933452451','933270755','932985543','933403649','934002081','932978645',
  '933005187','933349353','932910105','932984338','932950153','932956830',
  '933433853','935479378','933989312','932864099','932913123','934116523',
  '935240427','936268380','933508732','935225221','936348281','933512422',
  '933644055','934159255','933340393','934098863',
];
unsafeWindow.questions = [
  'If you had to leave earth on a spaceship and take 4 friends with you, who would they be?',
  'Tell me 3 things you remember about kindergarten.',
  'Whose parents do/did you wish you had?',
  'If you could change one thing about yourself, what would it be?',
  'If you had to pick a “spirit animal,” what would it be?',
  'What’s the best present you’ve ever received?',
  'Can you tell when someone is telling the truth?',
  'Who is your favorite athlete?',
  'Who is the kindest person you know?',
  'Who would play you in a movie of your life?',
  'What has been your favorite family vacation?',
  'If you could master any instrument on earth, what would it be?',
  'Do you have any irrational fears and if so, what are they?',
  'What are your 3 favorite movies?',
  'Have you ever met a famous person?',
  'What’s your favorite smell in the whole world?',
  'Do you like pets? Do you have any?',
  'What’s going to be carved on your (hypothetical) tombstone?',
  'Do you believe that everyone deserves forgiveness?',
  'What is your favorite Disney movie?',
  'Have you ever had a mentor?',
  'If you could custom blend a perfume or cologne, what would it include?',
  'Would you rather live for a week in the past or the future?',
  'What’s the right age to get married?',
  'Have you ever pushed your body further than you dreamed possible?',
  'When you see peers / competitors getting things you want, how do you react?',
  'Who was your worst teacher? Why?',
  'If your job isn’t your passion, what is?',
  'Who would you like to live like for a day?',
  'What is your favorite movie quote?',
  'Have you ever had a psychic reading? Did you believe it? Was it accurate?',
  'What’s one mistake you keep repeating (and repeating)?',
  'Have you ever dreamed about starting a business?',
  'If you could be an Olympic athlete, in what sport would you compete?',
  'If you could choose your own nickname, what would it be?',
  'What’s your favorite thing to do when you’re totally alone?',
  'If you could change something about the world, what would it be & why?',
  'What is your favorite day of the week?',
  'When’s the last time you failed spectacularly at something?',
  'What’s your favorite kind of sandwich?',
  'What’s your dream job?',
  'If you could sit down with your 15-year old self, what would you tell him or her?',
  'Have you ever (actually) kept a New Year’s Resolution?',
  'What do you value most: free time, recognition, or money?',
  'What’s the first thing you do when you get home from a trip?',
  'What age do you hope to live to?',
  'Which famous person, dead or alive, would you most like to know?',
  'What are you an expert on? Is it because of training, lived experience, or both?',
  'Which historical figure would you like to be?',
  'Have you ever screamed at someone? (How come?)',
  'Would you rather win an Olympic medal, an Academy Award or the Nobel prize?',
  'Have you ever won an award? What was it for?',
  'What was your very first job?',
  'Have you ever been caught lying?',
  'Do you sleep with your sheets tucked in or out?',
  'Who was your favorite teacher? Why?',
  'What’s your pet peeve(s)?',
  'If you could you try any kind of activity, what activity would you try?',
  'Have you ever left someone you still loved?',
  'When’s the last time you felt seriously disappointed?',
  'Ever fantasize about being in a rock band? What would your group be called?',
  'If you were guaranteed to be successful in a different job, what would you want to do?',
  'Have you ever unplugged from the Internet for more than a week?',
  'What’s your recipe for recuperating from extreme heartbreak?',
  'What living person, other than family members, do you most admire?',
  'Do you have any habits you wish you could erase?',
  'If you could save one endangered species from extinction, which would you choose?',
  'Do you love kids?',
  'Did you feel closer to your mom or dad growing up?',
  'What’s something you’ve tried, that you’ll never, ever try again?',
  'Do you have any irrational fears?',
  'Do you prefer group dinners or one-on-ones with friends?',
  'If social media didn’t exist, how would your life be different?',
  'What’s your best childhood memory?',
  'What’s your favorite time of day?',
  'What’s the best birthday cake you ever ate?',
  'What’s your favorite thing about one of your grandparents?',
  'Would you rather spend five days exploring Disney or New York City?',
  'Who is the funniest person you know?',
  'If you could eat only 3 foods for the rest of your life, what would they be?',
  'What’s the yuckiest food you ever tasted?',
  'Do you have any physical features that you try to cloak or hide? How come?',
  'Where would you live if you had no ties to any specific place?',
  'If reincarnation is a thing, what form would you want to take on in your next life?',
  'What do you wanna be when you grow up?',
  'If you wrote romance novels or erotic fiction, what would your “pen name” be?',
  'What do you do in your free time?',
  'If you could ask the President one question, what would it be?',
  'Would you rather have a live-in massage therapist, or a live-in chef?',
  'What’s the funniest or most traumatic thing that’s ever happened on a date?',
  'What’s one choice you really regret?',
  'On a scale of 1-10, how strict are/were your parents?',
  'Do you believe that people deserve to be happy?',
  'Do you consider yourself a mentor to anyone right now?',
  'Have you ever been genuinely afraid for your physical safety?',
  'What was your proudest moment from the past twelve months?',
  'Is there something that people consistently ask you for help with? What is it?',
  'What’s the title of your future memoir?',
  'Using one word, how would you describe your family?',
  'Read any scandalous news lately?',
  'What do you like to do on a rainy day?',
  'What’s the strangest date you’ve ever been on?',
  'Who are the 3 greatest living musicians?',
  'What are you starving for?',
  'What is your favorite color?',
  'How do you reign in self-critical voices?',
  'What was the most agonizing hour of your life?',
  'Do you ever yearn for your life, before Facebook?',
  'If you had an extra $100 to spend on yourself every week, what would you do?',
  'Do you think we should live like we’re dying?',
  'What’s in your pocket (or purse, or man-purse) right now?',
  'What kind of people do you like?',
  'What do you think is the greatest invention of all time?',
  'If you could change one thing about your past, what would it be?',
  'If you could pick a new first name, what would it be?',
  'Do you think you’re currently operating at 100% capacity?',
  'If you could time travel, where would you go?',
  'What are you good at?',
  'If you could have tea with one fictional character, who would it be?',
  'What’s the most out-of-character choice you’ve ever made?',
  'What’s the most rebellious thing you did growing up?',
  'What’s your greatest talent?',
  'What’s the best compliment you’ve ever received?',
  'If you could switch careers without any concern for money, what would you do?',
  'What paper that you’ve written are you most proud of?',
  'What’s your favorite season?',
  'When was the last time you astonished yourself?',
  'What was your favorite toy growing up?',
  'If you could shop for free at one store, which one would you choose?',
  'Do you believe in the concept of “the one”?',
  'Do you think they’ll make another Batman movie?',
  'Have you ever met someone who was genuinely evil?',
  'What’s your earliest childhood memory?',
  'What’s the most courageous thing you’ve ever done?',
  'Tell me the 3 best things about you.',
  'Who do you trust more than anyone else?',
  'Do you ever count your steps when you walk?',
  'What do you do when you’re home alone and the power goes out?',
  'If you could change one thing about yourself, what would it be?',
  'Are there any household chores you secretly enjoy? Which ones — and why?',
  'When’s the last time you stayed up all night?',
  'What do you think you were in a past life?',
  'What’s your favorite childhood book?',
  'Have you ever fantasized about writing an advice column?',
  'Name a celebrity you think is lame.',
  'If you could have dinner with anyone from history, who would it be?',
  'When was the last time you saw an animal in the wild?',
  'What’s the one food you could never bring yourself to eat?',
  'Tell me about a favorite event of your adulthood/childhood.',
  'What was the last movie you have seen?',
  'Would you rather be the most popular kid in school or the smartest kid in school?',
  'Would you rather be the best player on a horrible team or the worst on a great team?',
  'Name 3 celebrities you most admire.',
  'If you could travel anywhere in the world, where would it be?',
  'What was your weirdest interest or hobby as a kid?',
  'What accomplishment are you most proud of?',
  'If you could be great at one sport which would you choose?',
  'Heard any good jokes lately?',
  'What would you do if you were invisible for a day?',
  'How long can you go without checking your emails or texts?',
  'Do you have any secret untapped passions?',
  'What’s the most beautiful place you’ve ever been?',
  'Which good cause is closest to your heart?',
  'Who’s your celebrity crush?',
  'What’s the most bizarre situation you’ve ever walked into?',
  'When you’re having a bad day, what do you do to make yourself feel better?',
  'What’s your favorite holiday?',
  'What super-power would you most like to have, and why?',
  'What personal trait has gotten you in the most trouble?',
  'What is the best piece of advice you’ve received?',
  'Which TV family is most like your own?',
  'If you were heading out on a road trip right this minute, what would you pack?',
  'How would you describe me to your friends?',
  'If you were to die three hours from now, what would you regret most?',
  'Have you ever fantasized about changing your first name? To what?',
  'Are you useful in a crisis?',
  'Who is the last person that deeply disappointed you? (What happened?)',
  'What is the best part of being a part of your family?',
  'Would you rather have an extra $200 a day, or an extra 2 hours a day?',
  'Have you ever lived in another country?',
  'What 3 famous people, living or dead, would you want at your fantasy dinner party?',
  'Which would you pick: being attractive, a genius, or famous?',
  'If you could be anywhere else right now, where would it be?',
  'What’s your favorite ice cream flavor?',
  'Are you a starter or a finisher?',
  'What’s your most embarrassing childhood memory?',
  'What is the scariest movie you’ve ever seen?',
  'Are you afraid of flying in airplanes? (How come?)',
  'Are you a risk taker or someone who’s more risk averse?',
  'Would you rather be a lonely genius, or a sociable idiot?',
  'What was the last book you read?',
  'What about your teenage self embarrasses you most?',
  'What fictional character do you wish you could meet?',
  'How do you engage with panhandlers on the street?',
  'Which of the places you’ve traveled to inspired you the most, and why?',
  'Name a product or service you love so much that you’d happily be that company’s spokesperson.',
  'How do you really feel about your boss?',
  'Under what circumstances do you tend to feel shy?',
  'Are you living your life purpose — or still searching?',
  'What’s the creepiest dream you’ve ever had?',
  'What’s your family’s weirdest tradition?',
  'What’s one thing you’re deeply proud of — but would never put on your résumé?',
  'What are you freakishly good at?',
  'Would you like to write a book? (About what?)',
  'Do you like to be saved — or do the saving?',
  'Have you ever set two friends up on a date? (How did it go?)',
  'Do you feel like a leader or a follower?',
  'What’s the most disturbing thought you’ve ever had?',
  'What makes you smile without fail?',
  'What’s a great book you’ve read recently?',
  'What would your dream house be like?',
  'Have you ever stolen anything? (Money, candy, hearts, time?)',
  'What are you bored of?',
  'If you had to pick a new name for yourself, what name would you pick?',
  'What’s in your fridge, right this moment?',
  'Do you think everyone has the capacity to be a leader?',
  'Do you believe in magic? When have you felt it?',
  'What’s your definition of an ideal houseguest?',
  'When was the last time you laughed so hard you cried?',
  'Which of your friends are you proudest of? Why?',
  'What’s your most urgent priority for the rest of the year?',
  'What was the best part of your day, so far?',
  'Has a teacher ever changed your life? How so?',
  'Would you consider yourself an introvert, extrovert, or ambivert?',
  'When’s the last time you really indulged, and for what occasion?',
  'Can you tell when someone is lying?',
  'What is the sound you love the most?',
  'Is there a talent or skill you’ve always secretly wanted?',
  'What’s your guiltiest of guilty pleasures?',
  'What is your favorite family tradition?',
  'Have you ever had to make a public apology? (How come?)',
  'Do you have a morning ritual?',
  'As a child, what did you wish to become when you grew up?',
  'What’s the worst thing you did as a kid?',
  'What was your worst haircut / hairstyle of all time?',
  'What languages do you know how to speak?',
  'What is your favorite thing about the beach?',
  'What’s one dream that you’ve tucked away for the moment? How come?',
  'What is your spirit animal?',
  'If you could ask your pet 3 questions, what would they be?',
  'If you could live in any TV home, what would it be?',
  'What are you devoted to creating, in the New Year?',
  'What’s the best part about having siblings?',
  'If you had to live in a different place, what would it be?',
  'What’s your opinion about black nails on men?',
  'Do you have any personal rituals for the end of the year?',
  'Are there any laws or social rules that completely baffle you?',
  'Tell the person to your right your favorite thing about them.',
  'What trait do you like the most about yourself?',
  'What’s your personal anthem or theme song?',
  'If you could choose your own life obstacles, would you keep the ones you have?',
  'When was the last time you got stuck in a rut? How did you get out of it?',
  'Do you ever talk to yourself? When and what do you say?',
  'Do you ever hunt for answers or omens in dreams?',
  'What’s the last white lie you told and got away with?',
  'If you could be a cartoon character for a week, who would you be?',
  'Which of the Seven Dwarfs is most like you?',
  'Do you secretly miss Polaroid cameras?',
  'Do you think we’re designed for monogamy? (Why or why not?)',
  'What kind of food do you prefer eating when you eat out?',
  'Is war a necessary evil?',
  'What are your hobbies or special interests?',
  'What’s the hardest thing you ever had to write — and why?',
  'Where & when do you get your best ideas?',
  'What’s the last book that you couldn’t put down?',
  'What was the best kiss of your entire life?',
  'Cake or pie?',
  'Do you believe in fate?',
  'Which celebrity chef would you most like to fix you a meal?',
  'Have you ever met one of your heroes?',
  'Which of your family members do you admire most, and why?',
  'How would you fix the economy?',
  'What’s the worst piece of advice you’ve ever been given?',
  'Do you know any good conversation starters?',
  'What impacts your moods more than anything else?',
];
unsafeWindow.mandelas1 = [
`:SNF2::Red_Box::blocks1::Red_Box::blocks1::Red_Box::blocks1::Red_Box::SNF2:
:Red_Box::SNF5::Yellow_Box::blocks3::Yellow_Box::blocks3::Yellow_Box::SNF5::Red_Box:
:blocks1::Yellow_Box::SNF4::Green_Box::blocks4::Green_Box::SNF4::Yellow_Box::blocks1:
:Red_Box::blocks3::Green_Box::SNF1::Blue_Box::SNF1::Green_Box::blocks3::Red_Box:
:blocks1::Yellow_Box::blocks4::Blue_Box::rubik::Blue_Box::blocks4::Yellow_Box::blocks1:
:Red_Box::blocks3::Green_Box::SNF1::Blue_Box::SNF1::Green_Box::blocks3::Red_Box:
:blocks1::Yellow_Box::SNF4::Green_Box::blocks4::Green_Box::SNF4::Yellow_Box::blocks1:
:Red_Box::SNF5::Yellow_Box::blocks3::Yellow_Box::blocks3::Yellow_Box::SNF5::Red_Box:
:SNF2::Red_Box::blocks1::Red_Box::blocks1::Red_Box::blocks1::Red_Box::SNF2:
`,
`:medal::fivecolors::Yellow_Box::blocks1::Red_Box::blocks1::Yellow_Box::fivecolors::medal:
:fivecolors::amethyst::dia::blocks4::Green_Box::blocks4::dia::amethyst::fivecolors:
:Yellow_Box::dia::emerald::SNF1::Blue_Box::SNF1::emerald::dia::Yellow_Box:
:blocks1::blocks4::SNF1::Gflower::flame::Gflower::SNF1::blocks4::blocks1:
:Red_Box::Green_Box::Blue_Box::flame::rainbowfart::flame::Blue_Box::Green_Box::Red_Box:
:blocks1::blocks4::SNF1::Gflower::flame::Gflower::SNF1::blocks4::blocks1:
:Yellow_Box::dia::emerald::SNF1::Blue_Box::SNF1::emerald::dia::Yellow_Box:
:fivecolors::amethyst::dia::blocks4::Green_Box::blocks4::dia::amethyst::fivecolors:
:medal::fivecolors::Yellow_Box::blocks1::Red_Box::blocks1::Yellow_Box::fivecolors::medal:
`,
`:infamy::SNF3::fivecolors::slugpoo::y_star::slugpoo::threecolors::SNF3::infamy:
:SNF3::icegear::blocks5::fivecolors::Yellow_Box::threecolors::blocks5::icegear::SNF3:
:fivecolors::blocks5::r_heart::blocks1::id_sergeant::blocks1::r_heart::blocks5::threecolors:
:slugpoo::fivecolors::blocks1::PlanetYelaxot::SNF4::PlanetYelaxot::blocks1::threecolors::slugpoo:
:y_star::Yellow_Box::id_sergeant::SNF4::shodan::SNF4::id_sergeant::Yellow_Box::y_star:
:slugpoo::threecolors::blocks1::PlanetYelaxot::SNF4::PlanetYelaxot::blocks1::fivecolors::slugpoo:
:threecolors::blocks5::r_heart::blocks1::id_sergeant::blocks1::r_heart::blocks5::fivecolors:
:SNF3::icegear::blocks5::threecolors::Yellow_Box::fivecolors::blocks5::icegear::SNF3:
:infamy::SNF3::threecolors::slugpoo::y_star::slugpoo::fivecolors::SNF3::infamy:
`,
`:rainbow::rosebud::smileud::weed::rflower::weed::smileud::rosebud::rainbow:
:rosebud::smileud::weed::redrose::dia::redrose::weed::smileud::rosebud:
:smileud::weed::redrose::bflower::orangelily::bflower::redrose::weed::smileud:
:weed::redrose::bflower::flame::slugpoo::flame::bflower::redrose::weed:
:rflower::dia::orangelily::slugpoo::crystals::slugpoo::orangelily::dia::rflower:
:weed::redrose::bflower::flame::slugpoo::flame::bflower::redrose::weed:
:smileud::weed::redrose::bflower::orangelily::bflower::redrose::weed::smileud:
:rosebud::smileud::weed::redrose::dia::redrose::weed::smileud::rosebud:
:rainbow::rosebud::smileud::weed::rflower::weed::smileud::rosebud::rainbow:
`,
`:lollypop::threecolors::Prainbow::Prainbow::uno_wild::Prainbow::Prainbow::fivecolors::lollypop:
:threecolors::heartglow::SNF2::Red_Box::r_heart::Red_Box::SNF2::heartglow::fivecolors:
:Prainbow::SNF2::blocks4::zeusambrosia::lollypop::zeusambrosia::blocks4::SNF2::Prainbow:
:Prainbow::Red_Box::zeusambrosia::weed::spirallove::weed::zeusambrosia::Red_Box::Prainbow:
:uno_wild::r_heart::lollypop::spirallove::shockedIro::spirallove::lollypop::r_heart::uno_wild:
:Prainbow::Red_Box::zeusambrosia::weed::spirallove::weed::zeusambrosia::Red_Box::Prainbow:
:Prainbow::SNF2::blocks4::zeusambrosia::lollypop::zeusambrosia::blocks4::SNF2::Prainbow:
:fivecolors::heartglow::SNF2::Red_Box::r_heart::Red_Box::SNF2::heartglow::threecolors:
:lollypop::fivecolors::Prainbow::Prainbow::uno_wild::Prainbow::Prainbow::threecolors::lollypop:
`,
`:neutralgear::TrollGerka::TrollGerka::Grey_Box::beholder::Grey_Box::SadGerka::SadGerka::icegear:
:TrollGerka::SNF2::SNF2::Grey_Box::fbpearl::Grey_Box::SNF5::SNF5::SadGerka:
:TrollGerka::SNF2::em05::Grey_Box::fbpearl::Grey_Box::em04::SNF5::SadGerka:
:Grey_Box::Grey_Box::Grey_Box::Grey_Box::redyokai::Grey_Box::Grey_Box::Grey_Box::Grey_Box:
:beholder::fbpearl::fbpearl::redyokai::Yummmmy::redyokai::fbpearl::fbpearl::beholder:
:Grey_Box::Grey_Box::Grey_Box::Grey_Box::redyokai::Grey_Box::Grey_Box::Grey_Box::Grey_Box:
:Cheergerka::blocks5::em01::Grey_Box::fbpearl::Grey_Box::em03::SNF4::Angrygerka:
:Cheergerka::blocks5::blocks5::Grey_Box::fbpearl::Grey_Box::SNF4::SNF4::Angrygerka:
:goldengear::Cheergerka::Cheergerka::Grey_Box::beholder::Grey_Box::Angrygerka::Angrygerka::bloodgear:
`,
`:shodan::em03::em03::em03::Prainbow::em01::em01::em01::shodan:
:em03::y_star::SNF5::Yellow_Box::crystals::Yellow_Box::SNF5::y_star::em01:
:em03::SNF5::w_heart::dullgear::uno_wild::dullgear::w_heart::SNF5::em01:
:em03::Yellow_Box::dullgear::threecolors::egg::fivecolors::dullgear::Yellow_Box::em01:
:Prainbow::crystals::uno_wild::egg::rubik::egg::uno_wild::crystals::Prainbow:
:em02::Yellow_Box::dullgear::fivecolors::egg::threecolors::dullgear::Yellow_Box::em05:
:em02::SNF5::w_heart::dullgear::uno_wild::dullgear::w_heart::SNF5::em05:
:em02::y_star::SNF5::Yellow_Box::crystals::Yellow_Box::SNF5::y_star::em05:
:shodan::em02::em02::em02::Prainbow::em05::em05::em05::shodan:
`,
`:wheretomato::rosebud::sunflower::Yellow_Box::blocks3::Yellow_Box::sunflower::rosebud::wheretomato:
:bflower::wazapple::SNF5::bundleoftulips::bud::bundleoftulips::SNF5::wazapple::bflower:
:sunflower::SNF5::clover::weed::wnotree::weed::clover::SNF5::sunflower:
:Yellow_Box::bundleoftulips::weed::catpuzzle::purplelilac::catpuzzle::weed::bundleoftulips::Yellow_Box:
:blocks3::bud::wnotree::purplelilac::rainbowfart::purplelilac::wnotree::bud::blocks3:
:Yellow_Box::bundleoftulips::weed::catpuzzle::purplelilac::catpuzzle::weed::bundleoftulips::Yellow_Box:
:sunflower::SNF5::clover::weed::wnotree::weed::clover::SNF5::sunflower:
:bflower::wazapple::SNF5::bundleoftulips::bud::bundleoftulips::SNF5::wazapple::bflower:
:wheretomato::rosebud::sunflower::Yellow_Box::blocks3::Yellow_Box::sunflower::rosebud::wheretomato:
`,
`:id_sergeant::SNF5::Yellow_Box::WhiteSphere::Prainbow::WhiteSphere::Red_Box::SNF2::lora:
:SNF5::SNF5::Yellow_Box::WhiteSphere::pcars::WhiteSphere::Red_Box::SNF2::SNF2:
:Yellow_Box::Yellow_Box::Yellow_Box::Yellow_Box::pcars::Red_Box::Red_Box::Red_Box::Red_Box:
:WhiteSphere::WhiteSphere::Yellow_Box::rubik::kalisymbol::rubik::Red_Box::WhiteSphere::WhiteSphere:
:Prainbow::pcars::pcars::kalisymbol::shockedIro::kalisymbol::pcars::pcars::Prainbow:
:WhiteSphere::WhiteSphere::Green_Box::rubik::kalisymbol::rubik::Blue_Box::WhiteSphere::WhiteSphere:
:Green_Box::Green_Box::Green_Box::Green_Box::pcars::Blue_Box::Blue_Box::Blue_Box::Blue_Box:
:SNF4::SNF4::Green_Box::WhiteSphere::pcars::WhiteSphere::Blue_Box::SNF1::SNF1:
:shsumm::SNF4::Green_Box::WhiteSphere::Prainbow::WhiteSphere::Blue_Box::SNF1::Sybry:
`,
`:Inc_Seraphia::tibby::con2_ellie::Grey_Box::Prainbow::Grey_Box::LiselotCute::taejin::lora:
:dnage_cd::a2::elenashame::Grey_Box::pcars::Grey_Box::ravenbust::mpgb_ayumi::gs_angry:
:funny::junsmirk::higu_mion::Grey_Box::pcars::Grey_Box::irishappy::kurenai::RockZoe:
:Grey_Box::Grey_Box::Grey_Box::Grey_Box::candyrainbow::Grey_Box::Grey_Box::Grey_Box::Grey_Box:
:Prainbow::pcars::pcars::candyrainbow::rubik::candyrainbow::pcars::pcars::Prainbow:
:Grey_Box::Grey_Box::Grey_Box::Grey_Box::candyrainbow::Grey_Box::Grey_Box::Grey_Box::Grey_Box:
:Happyaku::spherical_scenery_of_creation::smiling::Grey_Box::pcars::Grey_Box::superel::Playful::sakurabeachmomokolaugh:
:hp_nikki::sarahsmile::dl1vera::Grey_Box::pcars::Grey_Box::svmel::sdelena::listine:
:con2_narika::joyfin::eliselaugh::Grey_Box::Prainbow::Grey_Box::carissia::Playful::alisa:
`,
`:uno_wild::threecolors::uno_wild::threecolors::uno_wild::fivecolors::uno_wild::fivecolors::uno_wild:
:threecolors::w_heart::Grey_Box::Grey_Box::mcmouth::Grey_Box::Grey_Box::w_heart::fivecolors:
:uno_wild::Grey_Box::em04::em04::Grey_Box::em03::em03::Grey_Box::uno_wild:
:threecolors::Grey_Box::em04::Cheergerka::Grey_Box::TrollGerka::em03::Grey_Box::fivecolors:
:uno_wild::mcmouth::Grey_Box::Grey_Box::The_Ball::Grey_Box::Grey_Box::mcmouth::uno_wild:
:threecolors::Grey_Box::em01::SadGerka::Grey_Box::Angrygerka::em05::Grey_Box::fivecolors:
:uno_wild::Grey_Box::em01::em01::Grey_Box::em05::em05::Grey_Box::uno_wild:
:threecolors::w_heart::Grey_Box::Grey_Box::mcmouth::Grey_Box::Grey_Box::w_heart::fivecolors:
:uno_wild::threecolors::uno_wild::threecolors::uno_wild::fivecolors::uno_wild::fivecolors::uno_wild:
`,
`:fivecolors::bloodsplat::bloodsplat::bloodsplat::pcars::weed::weed::weed::threecolors:
:bloodsplat::fivecolors::bloodsplat::r_heart::pcars::g_heart::weed::threecolors::weed:
:bloodsplat::bloodsplat::r_heart::Grey_Box::Grey_Box::Grey_Box::g_heart::weed::weed:
:bloodsplat::r_heart::Grey_Box::uno_wild::The_Ball::uno_wild::Grey_Box::g_heart::weed:
:pcars::pcars::Grey_Box::The_Ball::p2chell::The_Ball::Grey_Box::pcars::pcars:
:YellowS::y_star::Grey_Box::uno_wild::The_Ball::uno_wild::Grey_Box::b_ball::Wisp:
:YellowS::YellowS::y_star::Grey_Box::Grey_Box::Grey_Box::b_ball::Wisp::Wisp:
:YellowS::threecolors::YellowS::y_star::pcars::b_ball::Wisp::fivecolors::Wisp:
:threecolors::YellowS::YellowS::YellowS::pcars::Wisp::Wisp::Wisp::fivecolors:
`,
`:uno_wild::SNF3::blocks2::SNF3::infamy::SNF3::blocks2::SNF3::uno_wild:
:SNF3::blocks3::righteye::blocks4::candyrainbow::blocks5::pcars::blocks1::SNF3:
:blocks2::Yellow_Box::The_Ball::Green_Box::rubik::Blue_Box::crystals::Red_Box::blocks2:
:SNF3::Grey_Box::Grey_Box::w_heart::Grey_Box::w_heart::Grey_Box::Grey_Box::SNF3:
:infamy::Grey_Box::threecolors::threecolors::HalloweenFlowers::fivecolors::fivecolors::Grey_Box::infamy:
:SNF3::Grey_Box::Grey_Box::w_heart::Grey_Box::w_heart::Grey_Box::Grey_Box::SNF3:
:blocks2::Yellow_Box::Prainbow::Green_Box::pcars::Blue_Box::The_Ball::Red_Box::blocks2:
:SNF3::SNF5::righteye::blocks4::candyrainbow::blocks5::crystals::blocks1::SNF3:
:uno_wild::SNF3::blocks2::SNF3::infamy::SNF3::blocks2::SNF3::uno_wild:
`,
`:Angrygerka::blocks1::amethyst::rosebud::oohapresent::rosebud::amethyst::SNF4::steammocking:
:blocks1::blocks1::amethyst::Cheergerka::Cheergerka::Cheergerka::amethyst::SNF4::SNF4:
:rosebud::rosebud::uno_wild::Prainbow::Prainbow::Prainbow::uno_wild::rosebud::rosebud:
:amethyst::SadGerka::Prainbow::Grey_Box::Grey_Box::Grey_Box::Prainbow::TrollGerka::amethyst:
:oohapresent::SadGerka::Prainbow::Grey_Box::shockedIro::Grey_Box::Prainbow::TrollGerka::oohapresent:
:amethyst::SadGerka::Prainbow::Grey_Box::Grey_Box::Grey_Box::Prainbow::TrollGerka::amethyst:
:rosebud::rosebud::uno_wild::Prainbow::Prainbow::Prainbow::uno_wild::rosebud::rosebud:
:SNF5::SNF5::amethyst::Angrygerka::Angrygerka::Angrygerka::amethyst::blocks5::blocks5:
:SNF5::SNF5::amethyst::rosebud::oohapresent::rosebud::amethyst::blocks5::steamsad:
`,
];
unsafeWindow.mandelas2 = [
`:bloodgear::goldengear::icegear::Prainbow::fivecolors::pcars::candyrainbow::tiselements::rainbow:
:neutralgear::bloodgear::goldengear::icegear::Prainbow::fivecolors::pcars::candyrainbow::tiselements:
:dullgear::neutralgear::bloodgear::goldengear::icegear::Prainbow::fivecolors::pcars::candyrainbow:
:Prainbow::dullgear::neutralgear::bloodgear::goldengear::icegear::Prainbow::fivecolors::pcars:
:fivecolors::Prainbow::dullgear::neutralgear::righteye::goldengear::icegear::Prainbow::fivecolors:
:pcars::fivecolors::Prainbow::dullgear::neutralgear::bloodgear::goldengear::icegear::Prainbow:
:candyrainbow::pcars::fivecolors::Prainbow::dullgear::neutralgear::bloodgear::goldengear::icegear:
:tiselements::candyrainbow::pcars::fivecolors::Prainbow::dullgear::neutralgear::bloodgear::goldengear:
:rainbow::tiselements::candyrainbow::pcars::fivecolors::Prainbow::dullgear::neutralgear::bloodgear:
`,
`:kalisymbol::b_ball::Green_Box::zeusambrosia::Purple_Box::zeusambrosia::Green_Box::b_ball::kalisymbol:
:b_ball::Blue_Box::PlanetYelaxot::Yellow_Box::r_heart::Yellow_Box::PlanetYelaxot::Blue_Box::b_ball:
:Green_Box::PlanetYelaxot::y_star::Red_Box::glasswindow::Red_Box::y_star::PlanetYelaxot::Green_Box:
:zeusambrosia::Yellow_Box::Red_Box::glasswindow::LightRedCube::glasswindow::Red_Box::Yellow_Box::zeusambrosia:
:Purple_Box::r_heart::glasswindow::GreenCube::righteye::LightBlueCube::glasswindow::r_heart::Purple_Box:
:zeusambrosia::Yellow_Box::Red_Box::glasswindow::YellowCube::glasswindow::Red_Box::Yellow_Box::zeusambrosia:
:Green_Box::PlanetYelaxot::y_star::Red_Box::glasswindow::Red_Box::y_star::PlanetYelaxot::Green_Box:
:b_ball::Blue_Box::PlanetYelaxot::Yellow_Box::r_heart::Yellow_Box::PlanetYelaxot::Blue_Box::b_ball:
:kalisymbol::b_ball::Green_Box::zeusambrosia::Purple_Box::zeusambrosia::Green_Box::b_ball::kalisymbol:
`,
`:Prainbow::fbpearl::zeusambrosia::steamhappy::zcrystal::steamhappy::zeusambrosia::fbpearl::Prainbow:
:fbpearl::kalisymbol::fbpearl::zeusambrosia::Red_Box::zeusambrosia::fbpearl::kalisymbol::fbpearl:
:zeusambrosia::fbpearl::kalisymbol::fbpearl::spirallove::fbpearl::kalisymbol::fbpearl::zeusambrosia:
:steamhappy::zeusambrosia::fbpearl::kalisymbol::fbpearl::kalisymbol::fbpearl::zeusambrosia::steamhappy:
:zcrystal::Red_Box::spirallove::fbpearl::garfunkel::fbpearl::spirallove::Red_Box::zcrystal:
:steamhappy::zeusambrosia::fbpearl::kalisymbol::fbpearl::kalisymbol::fbpearl::zeusambrosia::steamhappy:
:zeusambrosia::fbpearl::kalisymbol::fbpearl::spirallove::fbpearl::kalisymbol::fbpearl::zeusambrosia:
:fbpearl::kalisymbol::fbpearl::zeusambrosia::Red_Box::zeusambrosia::fbpearl::kalisymbol::fbpearl:
:Prainbow::fbpearl::zeusambrosia::steamhappy::zcrystal::steamhappy::zeusambrosia::fbpearl::Prainbow:
`,
`:Red_Box::LightRedCube::LightRedCube::LightRedCube::pcars::GreenCube::GreenCube::GreenCube::Green_Box:
:LightRedCube::bloodgear::bloodgear::LightRedCube::pcars::GreenCube::neutralgear::neutralgear::GreenCube:
:LightRedCube::bloodgear::bloodgear::LightRedCube::pcars::GreenCube::neutralgear::neutralgear::GreenCube:
:LightRedCube::LightRedCube::LightRedCube::Purple_Box::blocks2::Purple_Box::GreenCube::GreenCube::GreenCube:
:pcars::pcars::pcars::blocks2::shockedIro::blocks2::pcars::pcars::pcars:
:LightBlueCube::LightBlueCube::LightBlueCube::Purple_Box::blocks2::Purple_Box::YellowCube::YellowCube::YellowCube:
:LightBlueCube::icegear::icegear::LightBlueCube::pcars::YellowCube::goldengear::goldengear::YellowCube:
:LightBlueCube::icegear::icegear::LightBlueCube::pcars::YellowCube::goldengear::goldengear::YellowCube:
:Blue_Box::LightBlueCube::LightBlueCube::LightBlueCube::pcars::YellowCube::YellowCube::YellowCube::Yellow_Box:
`,
`:goldduck::YellowCube::YellowCube::Blue_Box::egg::Green_Box::LightRedCube::LightRedCube::health:
:YellowCube::YellowCube::righteye::Blue_Box::candyrainbow::Green_Box::righteye::LightRedCube::LightRedCube:
:Blue_Box::Blue_Box::Blue_Box::g_heart::egg::b_ball::Green_Box::Green_Box::Green_Box:
:Prainbow::Prainbow::Prainbow::Grey_Box::w_heart::Grey_Box::Prainbow::Prainbow::Prainbow:
:candyrainbow::egg::candyrainbow::w_heart::Grey_Box::w_heart::candyrainbow::egg::candyrainbow:
:Prainbow::Prainbow::Prainbow::Grey_Box::w_heart::Grey_Box::Prainbow::Prainbow::Prainbow:
:Red_Box::Red_Box::Red_Box::y_star::egg::r_heart::Yellow_Box::Yellow_Box::Yellow_Box:
:GreenCube::GreenCube::righteye::Red_Box::candyrainbow::Yellow_Box::righteye::LightBlueCube::LightBlueCube:
:clover::GreenCube::GreenCube::Red_Box::egg::Yellow_Box::LightBlueCube::LightBlueCube::butterfly:
`,
];
unsafeWindow.mandelas = { index: 0, pool: mandelas1.concat(mandelas2)};
unsafeWindow.jokes = [
  'The big difference between sex for money and sex for free is that sex for money usually costs a lot less.',
  'You are such a good friend that if we were on a sinking ship together and there was only one life jacket... I\'d miss you heaps and think of you often.',
  'Having sex is like playing bridge. If you don\'t have a good partner, you\'d better have a good hand.',
  'I don\'t suffer from insanity. I enjoy every minute of it.',
  'A policeman walked over to a parked car and asked the driver if the car was licensed. "Of course it is", said the driver. "Great, I\'ll have a beer then", said the policeman.',
  'Who was the first to see a cow and think "I wonder what will happen if I squeeze these dangly things and drink whatever comes out?"',
  'What if there were no hypothetical questions?',
  'It\'s so simple to be wise. Just think of something stupid to say and then don\'t say it.',
  'Never put both feet in your mouth at the same time. You won\'t have a leg to stand on.',
  'I\'m a humble person, really. I\'m actually much greater than I think I am.',
  'Assassinationg is the extreme form of censorship. -George Bernard Shaw',
  'A man was siting in a restaurant waiting for his meal when a big king prawn comes flying across the room and hits him on the back of the head. He turns around and the waiter said, "That\'s just for starters".',
  'I don\'t have a solution, but I do admire the problem.',
  'The trouble with doing something right the first time is that nobody appreciates how difficult it was.',
  'If you are supposed to learn from your mistakes, why do some people have more than one child.',
  'When tempted to fight fire with fire, remember that the Fire Department usually uses water.',
  'It\'s amazing that the amount of news that happens in the world everyday always just exactly fits the newspaper.',
  'I met a Dutch girl with inflatable shoes last week, phoned her up to arrange a date but unfortunately she\'d popped her clogs.',
  'When I asked you for a flower, you gave me a garden... When I asked you for a stone, you gave me a statue... What are you... deaf?',
  'When I was at school people used to throw gold bars at me. I was the victim of bullion.',
  'Vegetarian: Native American definition for "lousy hunter".',
  'I was having dinner with a world chess champion and there was a check tablecloth. It took him two hours to pass me the salt.',
  'Don\'t worry about what people think, they don\'t do it very often.',
  'If I agreed with you we\'d both be wrong.',
  'Better to remain silent and be thought a fool, than to speak and remove all doubt.',
  'Experience is what you get when you didn\'t get what you wanted.',
  'What did the plumber say when he wanted to divorce his wife? Sorry, but it\'s over, Flo!',
  'Guy : "Doc, I\'ve got a cricket ball stuck up my backside." Doc : "How\'s that?" Guy : "Don\'t you start..."',
  'Stevie Wonder got a cheese grater for his birthday. He said it was the most violent book he\'d ever read.',
  'Efficiency is a highly developed form of laziness.',
  'A policeman stops a woman and asks for her licence. "Madam", he says, "It says here that you should be wearing glasses." "Well", replies the woman, "I have contacts." "Listen, love", says the copper, "I don\'t care who you know; You\'re nicked!"',
  'A lorry-load of tortoises crashed into a trainload of terrapins, I thought, "That\'s a turtle disaster".',
  'If at first you don\'t succeed, buy her another beer.',
  'Doctor: I have some bad news and some very bad news. Patient: Well, you might as well give me the bad news first. Doctor: The lab called with your test results. They said you have 24 hours to live. Patient: 24 HOURS! That\'s terrible!! WHAT could be WORSE? What\'s the very bad news? Doctor: I\'ve been trying to reach you since yesterday.',
  'Some people say "If you can\'t beat them, join them". I say "If you can\'t beat them, beat them", because they will be expecting you to join them, so you will have the element of surprise.',
  'It was love at first sight. Then I took a second look !!',
  'A man returns from an exotic holiday and is feeling very ill. He goes to see his doctor, and is immediately rushed to the hospital to undergo some tests. The man wakes up after the tests in a private room at the hospital, and the phone by his bed rings. "This is your doctor. We have the results back from your tests and we have found you have an extremely nasty disease called M.A.D.S. It\'s a combination of Measles, AIDS, Diphtheria, and Shingles!"  "Oh my gosh", cried the man, "What are you going to do, doctor?"  "Well we\'re going to put you on a diet of pizzas, pancakes, and pita bread." replied the doctor.  "Will that cure me?" asked the man.  The doctor replied, "Well no, but, it\'s the only food we can slide under the door."',
  '"Doc, I can\'t stop singing \'The Green, Green Grass of Home.\'" "That sounds like Tom Jones Syndrome." "Is it common?" "It\'s Not Unusual."',
  'Don\'t piss me off! I\'m running out of places to hide the bodies.',
  'As Sid sat down to a big plate of chips and gravy down the local pub, a mate of his came over and said, "Here Sid, me old pal. I thought you were trying to get into shape? And here you are with a high-fat meal and a pint of stout!" Sid looked up and replied, "I am getting into shape. The shape I\'ve chosen is a sphere."',
  'Some of us learn from the mistakes of others; the rest of us have to be the others.',
  'So I said to this train driver "I want to go to Paris". He said "Eurostar?" I said, "I\'ve been on telly but I\'m no Dean Martin".',
  'The only difference between the people I\'ve dated and Charles Manson is that Manson has the decency to look like a nut case when you first meet him.',
  'Just remember...if the world didn\'t suck, we\'d all fall off.',
  'There\'s a fine line between cuddling and holding someone down so they can\'t get away.',
  'When we were together, you always said you\'d die for me. Now that we\'ve broke up, I think it\'s time you kept your promise!',
  '"Where are you going on holiday?" John asked Trevor. "We\'re off to Thailand this year", Trevor replied. "Oh; aren\'t you worried that the very hot weather might disagree with your wife?" asked John. "It wouldn\'t dare", said Trevor.',
  'So I went down the local supermarket, I said, "I want to make a complaint, this vinegar\'s got lumps in it", he said, "Those are pickled onions".',
  'Build a man a fire, and he\'ll be warm for a day. Set a man on fire, and he\'ll be warm for the rest of his life.',
  'Look people I don\'t like exercise so I\'m not going to walk a mile in your shoes. I\'ll judge you standing right here.',
  'I sometimes go to my own little world, but that\'s okay, they know me there.',
  'Behind every successful man is his woman. Behind the fall of a successful man is usually another woman.',
  'Good health is merely the slowest possible rate at which one can die.',
  'Strangers have the best candy.',
  'Sometimes when I reflect back on all the beer I drink I feel shamed. Then I look into the glass and think about the workers in the brewery and all of their hopes and dreams. If I didn\'t drink this beer, they might be out of work and their dreams would be shattered. Then I say to myself, "It is better that I drink this beer and let their dreams come true than be selfish and worry about my liver.',
  'A clear conscience is usually the sign of a bad memory.',
  'If 4 out of 5 people SUFFER from diarrhea... does that mean that one enjoys it?',
  'Don\'t steal. That\'s the government\'s job.',
  'Campers: Nature\'s way of feeding mosquitoes',
  'The difference between fiction and reality? Fiction has to make sense.',
  'The last time I was inside a woman was when I went to the Statue of Liberty.',
  'The early bird might get the worm, but the second mouse gets the cheese.',
  'I don\'t have an attitude; I have a personality you can\'t handle.',
  'A friend is someone who will help you move. A GOOD friend is someone who will help you move a dead body.',
  'You do not need a parachute to skydive. You only need a parachute to skydive twice.',
  'If sex is a pain in the ass, then you\'re doing it wrong...',
  'We can\'t all be heroes. Somebody has to sit on the sidelines and clap as they go by.',
  'Pete goes for a job on a building site as an odd-job man. The foreman asks him what he can do. "I can do anything" says Pete. "Can you make tea?" asks the foreman. "Sure, yes", replies Pete. "I can make a great cup of tea." "Can you drive a forklift?" asks the foreman, "Good grief!" replies Pete. "How big is the teapot?"',
  'We are all part of the ultimate statistic – ten out of ten die.',
  'Most women don\'t know where to look when they\'re eating a banana.',
  'How do you get a sweet little 80-year-old lady to say the F word? Get another sweet little 80-year-old lady to yell *BINGO*!',
  'I\'ve tried a lot of diets. But my body keeps rejecting them.',
  'I rang up British Telecom, I said, "I want to report a nuisance caller", he said "Not you again".',
  'America is a country which produces citizens who will cross the ocean to fight for democracy but won\'t cross the street to vote.',
  'By the time a man realises that his father was right, he has a son who thinks he\'s wrong.',
  'Good judgement comes from bad experience and a lot of that comes from bad judgement.',
  'I don\'t have an attitude problem. You have a perception problem.',
  'Two cows standing next to each other in a field. Daisy says to Dolly, "I was artificially inseminated this morning." "I don\'t believe you", said Dolly. "It\'s true, no bull!" exclaimed Daisy.',
  'Four fonts walk into a bar the barman says "Oi - get out! We don\'t want your type in here"',
  'I was such an ugly kid. When I played in the sandbox the cat kept covering me up.',
  'A neutron walks into a pub. "I\'d like a beer", he says. The landlord promptly serves him a beer. "How much will that be?" asks the neutron. "For you?" replies the landlord, "No charge."',
  'Insanity is defined as doing the same thing over and over again, expecting different results.',
  'One nice thing about egotists: They don\'t talk about other people.',
  'Being in a nudist colony probably takes all the fun out of Halloween.',
  'I have to exercise early in the morning before my brain figures out what I\'m doing.',
  'Two cows standing in a field. One turns to the other and says "Moo!" The other one says "Damn, I was just about to say that!".',
  'It\'s okay to let your mind go blank; but please turn off the sound.',
  'A termite walks into a pub and says, "Is the bar tender here?"',
  'Join The Army, visit exotic places, meet strange people, then kill them.',
  'Two vampires walked into a bar and called for the landlord. "I\'ll have a glass of blood", said one. "I\'ll have a glass of plasma", said the other. "Okay", replied the landlord, "That\'ll be one blood and one blood lite."',
  'Descartes walks into a pub. "Would you like a beer sir?" asks the landlord politely. Descartes replies, "I think not" and ping! he vanishes.',
  'Hard work has a future payoff. Laziness pays off NOW!',
  'The farther away the future is, the better it looks.',
  'Do not argue with an idiot. He will drag you down to his level and beat you with experience.',
  'Clinton lied. A man might forget where he parks or where he lives, but he never forgets oral sex, no matter how bad it is.',
  'Man: Doctor, I\'ve just swallowed a pillow. Doctor: How do you feel? Man: A little down in the mouth.',
  'A businessman turned to a colleague and asked, "So, how many people work at your office?" His friend shrugged and replied, "Oh about half of them."',
  'Conference, n. The confusion of one man multiplied by the number present.',
  'If you keep your feet firmly on the ground, you\'ll have trouble putting on your pants.',
  'Do you realize that in about 40 years, we\'ll have thousands of old ladies running around with tattoos?',
  'A woman has got to love a bad man once or twice in her life, to be thankful for a good one.',
  'Whoever coined the phrase "Quiet as a mouse" has never stepped on one.',
  'The difference between an oral thermometer and a rectal thermometer is in the taste.',
  'I get my large circumference from too much pi.',
  'I don\'t trust anything that bleeds for five days and doesn\'t die.',
  'So this bloke says to me, "Can I come in your house and talk about your carpets?" I thought, "That\'s all I need, a Je-hoover\'s witness".',
  'Make love, not war. Hell, do both. Get married.',
  'Never hit a man with glasses. Hit him with a baseball bat.',
  'What is the most important thing to learn in chemistry? Never lick the spoon.',
  'Two years ago I married a lovely young virgin, and if that doesn\'t change soon, I\'m gonna divorce her.',
  'Never get into fights with ugly people, they have nothing to lose.',
  'Married men live longer than single men, but they\'re a lot more willing to die.',
  'Think of how stupid the average person is, and realize half of them are stupider than that.',
  'Out of my mind. Back in five minutes.',
  'I\'d kill for a Nobel Peace Prize.',
  'A bus is a vehicle that runs twice as fast when you are after it as when you are in it.',
  'We have enough gun control. What we need is idiot control.',
  'Without ME, it\'s just AWESO.',
  'Alcoholism is the only disease that tries to convince you that you don\'t have it.',
  'Isn\'t it odd the way everyone automatically assumes that the goo in soap dispensers is always soap? I like to fill mine with mustard, just to teach people a lesson in trust.',
  'A man is stopped by an angry neighbour. "I\'d just left the house this morning to collect my newspaper when that evil Doberman of yours went for me!" "I\'m astounded", said the dog\'s owner. "I\'ve been feeding that fleabag for seven years and it\'s never got the paper for me."',
  'We live in a society where pizza gets to your house before the police.',
  'Doctors tell us there are over seven million people who are overweight. These, of course, are only round figures.',
  'Women may not hit harder, but they hit lower.',
  'Man is peculiar. He spends a fortune making his home insect-proof and air-conditioned, and then eats in the yard.',
  'I don\'t mind the rat race. But I could do with a little more cheese.',
  'Mail your packages early so the Post Office has time to lose them before Christmas.',
  'Never underestimate the power of stupid people in large groups.',
  'You live and learn. At any rate, you live.',
  'A dog who attends a flea circus most likely will steal the whole show.',
  'Did you hear about the guy whose whole left side was cut off? He\'s all right now.',
  'Ham and Eggs: A day\'s work for a chicken, a lifetime commitment for a pig.',
  'Some things man was never meant to know. For everything else, there\'s Google.',
  'Man: (to friend) I\'m taking my wife on an African Safari. Friend: Wow! What would you do if a vicious lion attacked your wife? Man: Nothing. Friend: Nothing? You wouldn\'t do anything? Man: Too right. I\'d let the stupid lion fend for himself!',
  'I was thinking about how people seem to read the Bible a whole lot more as they get older. Then it dawned on me... they were cramming for their finals.',
  'How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?',
  'Be careful of your thoughts, they may become words at any moment.',
  'Laugh and the world laughs with you. Snore and you sleep alone',
  'Ham and eggs. A day\'s work for a chicken, a lifetime commitment for a pig.',
  'A passer-by spots a fisherman by a river. "Is this a good river for fish?" he asks. "Yes", replies the fisherman, "It must be. I can\'t get any of them to come out."',
  'Going to church doesn\'t make you a Christian any more than standing in a garage makes you a car.',
  'If you were any slower, you\'d be going in reverse.',
  'Girls are like roads, more the curves, more the dangerous they are.',
  'I\'ve learned that the people you care most about in life are taken from you too soon and all the less important ones just never go away.',
  'To steal ideas from one person is plagiarism. To steal from many is research.',
  'By the time you learn the rules of life, you\'re too old to play the game.',
  'If Wal-Mart is lowering prices every day, why isn\'t anything in the store is free yet?',
  'Roses are red violets are blue, I\'m schizophrenic and so am I.',
  'The journey of a thousand miles begins with a broken fan belt and a flat tire.',
  'Everybody is somebody else\'s weirdo.',
  'A dollar saved is a dime earned. The rest is taxes.',
  'My wife ran off with my best friend last week. I miss him!',
  'Who invented the brush they put next to the toilet? That thing hurts!',
  'Procrastination has it\'s good side. You always have something to do tomorrow.',
  'Haikus are easy. But sometimes they don\'t make sense. Refrigerator.',
  'My biggest problem with the younger generation is I\'m not in it.',
  'If you think nobody cares if you\'re alive, try missing a couple of payments.',
  'It\'s not how good your work is, it\'s how well you explain it.',
  'If God is watching us, the least we can do is be entertaining.',
  'Sex is not the answer. Sex is the question. "Yes" is the answer.',
  'Bills travel through the mail at twice the speed',
  'Impotence: Nature\'s way of saying "No hard feelings".',
  'My opinions may have changed, but not the fact that I am right.',
  'You know, they got a luggage store in the airport? A place to buy a piece of luggage? How late do you have to be for a flight where you\'re like, ‘Fuck it – just grab a pile of shit. We\'ll get a bag at the airport\'.',
  'A cheap shot is a terrible thing to waste.',
  'A bus station is where a bus stops. A train station is where a train stops. On my desk, I have a work station..',
  'My drinking team has a bowling problem.',
  'A fine is a tax for doing wrong. A tax is a fine for doing well.',
  'Good girls are bad girls that never get caught.',
  'A babysitter is a teenager acting like an adult while the adults are out acting like teenagers.',
  'An invisible man marries an invisible woman. The kids were nothing to look at either.',
  'I went to the butcher\'s the other day to bet him 50 bucks that he couldn\'t reach the meat off the top shelf. He said, "No, the steaks are too high."',
  'The other day I sent my girlfriend a huge pile of snow. I rang her up; I said "Did you get my drift?"',
  'At every party there are two kinds of people: those who want to go home and those who don\'t. The trouble is, they are usually married to each other.',
  'Sex on tv can\'t hurt unless you fall off.',
  'I married Miss Right. I just didn\'t know her first name was Always.',
  'Don\'t follow in my footsteps. I walk into a lot of walls.',
  'I have never understood why women love cats. Cats are independent, they don\'t listen, they don\'t come in when you call, they like to stay out all night, and when they\'re home they like to be left alone and sleep. In other words, every quality that women hate in a man, they love in a cat.',
  'I thought I wanted a career, turns out I just wanted paychecks.',
  'Why do they lock gas station bathrooms? Are they afraid someone will clean them?',
  'A tramp approached a well-dressed man. "Ten pence for a cup of tea, Guv?" He asked. The man gave him the money and after for five minutes said, "So where\'s my cup of tea then?"',
  'A brain went into a bar and said, "Can I have a pint of lager please, mate?" "No way", said the barman. "You\'re already out of your head."',
  'A three-legged dog walks into a saloon in the Old West. He slides up to the bar and announces: "I\'m looking for the man who shot my paw."',
  'I\'m in shape. Round is a shape isn\'t it?',
  'If winning isn\'t everything why do they keep score?',
  'Some people hear voices.. Some see invisible people.. Others have no imagination whatsoever.',
  'There are no winners in life...only survivors.',
  'Life is like a Lambourghini. It goes too fast and it costs too much.',
  'I went to the Chinese restaurant and this duck came up to me with a red rose and says "Your eyes sparkle like diamonds". I said, "Waiter, I asked for a-ROMATIC duck".',
  'Only in America... do banks leave both doors open and then chain the pens to the counters.',
  'If the economy is slowing down, how come it\'s so hard for me to keep up with it?',
  'Doctor: Did you take the patient\'s temperature nurse? Nurse: No doctor. Is it missing?',
  'I phoned up the builder\'s yard yesterday. I said, "Can I have a skip outside my house?". The builder said, "Sure. Do what you want. It\'s your house."',
  'Some days you are the bug, some days you are the windshield.',
  'Canadians are more polite when they are being rude than Americans are when they are being friendly.',
  'Why is it called tourist season if we can\'t shoot them?',
  'If life hands you lemons, break out the tequila!',
  'I went to a seafood disco last week and pulled a mussel.',
  'If you don\'t care where you are, then you ain\'t lost.',
  'There are two kinds of friends : those who are around when you need them, and those who are around when they need you.',
  'George Washington said "We would have a black president when pigs fly!"... well, swine flu.',
  'WARNING: The consumption of alcohol may cause you to think you can sing.',
  'The early bird may get the worm, but the second mouse gets the cheese.',
  'The best thing about living at the beach is that you only have assholes on three sides of you.',
  'Constipated people don\'t give a crap.',
  'I slept like a baby last night.... Waking up every 3 hours crying for food.',
  '"My wife is really immature. It\'s pathetic. Every time I take a bath, she comes in and sinks all my little boats."',
  'Some mistakes are too much fun to only make once.',
  'The easiest job in the world has to be coroner. Surgery on dead people. What\'s the worst thing that could happen? If everything went wrong, maybe you\'d get a pulse.',
  '100,000 sperm and you were the fastest?',
  'Woman on phone: I\'d like to complain about these incontinence pants I bought from you! Shopkeeper: Certainly madam, where are you ringing from? Woman on phone: From the waist down!',
  'Seen it all, done it all, can\'t remember most of it.',
  'It\'s not the bullet that kills you, it\'s the hole.',
  'Support your local Search and Rescue Unit. Get lost.',
  'He who smiles in a crisis has found someone to blame.',
  'I tried to hang myself with a bungee chord. I kept almost dying',
  'Hard work never killed anyone, but why take the chance?',
  'Politicians and diapers have one thing in common. They should both be changed regularly, and for the same reason.',
  'A celebrity is someone who works hard all his life to become known and then wears dark glasses to avoid being recognised.',
  'Change is inevitable, except from a vending machine.',
  'Why is a bra singular and panties plural?',
  'Mother: Why are you home from school so early? Son: I was the only one in the class who could answer a question. Mother: Oh, really? What was the question? Son: Who threw the rubber at the headmaster?',
  'Women will never be equal to men until they can walk down the street with a bald head and a beer gut, and still think they are sexy.',
  'Everything is edible, some things are only edible once.',
  'The other day someone left a piece of plastacine in my bedroom. I didn\'t know what to make of it.',
  'I pretend to work as long as they pretend to pay me.',
  'If you must choose between two evils, pick the one you\'ve never tried before.',
  'A doctor thoroughly examined his patient and said, "Look I really can\'t find any reason for this mysterious affliction. It\'s probably due to drinking." The patient sighed and snapped, "In that case, I\'ll come back when you\'re damn well sober!"',
  'The last thing I want to do is hurt you. But it\'s still on the list.',
  'The only problem with troubleshooting is, sometimes, trouble shoots back',
  'The shinbone is a device for finding furniture in a dark room.',
  'Knowledge is knowing a tomato is a fruit; Wisdom is not putting it in a fruit salad.',
  'A highly excited man rang up for an ambulance. "Quickly, come quickly", he shouted, "My wife\'s about to have a baby." "Is this her first baby?" asked the operator. "No, you fool", came the reply, "It\'s her husband."',
  'If a turtle doesn\'t have a shell, is he homeless or naked?',
  'What do you call cheese that isn\'t yours?  Nacho cheese.',
  'My psychiatrist told me I was crazy and I said I want a second opinion. He said okay, you\'re ugly too.',
  'My favorite mythical creature? The honest politician.',
  'If at first you don\'t succeed, skydiving is not for you!',
  'Make crime pay. Become a lawyer.',
  'A wife was having a go at her husband. "Look at Mr Barnes across the road", she moaned. "Every morning when he goes to work, he kisses his wife goodbye. Why don\'t you do that?" "Because I haven\'t been introduced to her yet", replied her old man.',
  'It is hard to understand how a cemetery raised its burial cost and blamed it on the cost of living.',
  'Every once in a brownish-purple moon, I worry that I might be colorblind.',
  'Insanity is hereditary. You get it from your kids.',
  'Never, under any circumstances, take a sleeping pill and a laxative on the same night.',
  'A diplomat is someone who can tell you to go to hell in such a way that you will look forward to the trip.',
  'Jesus loves you, but everyone else thinks you\'re an asshole.',
  'A man goes into a bar and says, "Can I have a bottle of less?" "What\'s that?", asks the barman, "Is it the name of a beer?" "I don\'t know", replies the man, "but my doctor says I have to drink it."',
  'God is talking to one of his angels. He says, "Boy, I just created a 24-hour period of alternating light and darkness on Earth." "What are you going to do now?" asks the angel. "Call it a day", says God.',
  'Why do they use sterilized needles for death by lethal injection?',
  'I didn\'t fight my way to the top of the food chain to be a vegetarian',
  'You know that feeling you get after a really rewarding day at work? Could you describe it for the rest of us?',
  'A bargain is something you don\'t need at a price you can\'t resist.',
  'We are all time travelers moving at the speed of exactly 60 minutes per hour',
  'Whenever I fill out an application, in the part that says "If an emergency, notify:" I put "DOCTOR". What\'s my mother going to do?',
  'When you go into court, you are putting your fate into the hands of people who weren\'t smart enough to get out of jury duty.',
  'Nostalgia isn\'t what it used to be.',
  'Discretion is being able to raise your eyebrow instead of your voice.',
  'A bank is a place that will lend you money, if you can prove that you don\'t need it.',
  'So I said "Do you want a game of Darts?" He said, "OK then", I said nearest to bull starts". He said, "Baa", I said, "Moo", he said, You\'re closest".',
  'I don\'t have a beer gut, I have a protective covering for my rock hard abs.',
  'A little boy asked his father, "Daddy, how much does it cost to get married?" Father replied, "I don\'t know son, I\'m still paying."',
  'I discovered I scream the same way whether I\'m about to be devoured by a great white shark or if a piece of seaweed touches my foot.',
  'If Bill Gates had a penny for every time I had to reboot my computer...oh wait, he does.',
  'Waiter: And how did you find your steak sir? Customer: I just flipped a chip over, and there it was!',
  'If you can stay calm while all around you is chaos, then you probably haven\'t completely understood the situation.',
  'A guy goes into a pet shop and asks for a wasp. The owner tells him they don\'t sell wasps, to which the man says, "Well you\'ve got one in the window."',
  'People tend to make rules for others and exceptions for themselves.',
  'The right to be heard does not automatically include the right to be taken seriously.',
  'In a courtroom, a mugger was on trial. The victim, asked if she recognised the defendant, said, "Yes, that\'s him. I saw him clear as day. I\'d remember his face anywhere." Unable to contain himself, the defendant burst out with, "She\'s lying! I was wearing a mask!"',
  'Worrying works! 99% of the things I worry about never happen',
  'Virginity is like a soapbubble, one prick and it is gone.',
  'War does not determine who is right only who is left.',
  '"How much will it cost to have the tooth extracted?" asked the patient. "50 pounds", replied the dentist. "50 pounds for a few moments\' work?!" asked the patient. "The dentist smiled, and replied, "Well, if you want better value for money, I can extract it very, very slowly..."',
  'I love deadlines. I like the whooshing sound they make as they fly by.',
  'Now, most dentist\'s chairs go up and down, don\'t they? The one I was in went back and forwards. I thought, "This is unusual". Then the dentist said to me, "Mitsuku, get out of the filing cabinet".',
  'I saw a woman wearing a sweat shirt with "Guess" on it...so I said "Implants?"',
  'Why do women always ask questions that have no right answers?',
  'Two crisps were walking down a road when a taxi pulled up alongside them and said "Do you want a lift? One of the crisps replied, "No thanks, we\'re Walkers!"',
  'Politics is the art of looking for trouble, finding it, misdiagnosing it and then misapplying the wrong remedies.',
  'The best measure of someone\'s honesty is the zero adjust on their bathroom scale.',
  'I read recipes the same way I read science fiction. I get to the end and I think, "Well, that\'s not going to happen."',
  'I ran into my ex the other day, hit reverse, and ran into him again.',
  'Christmas trees are like men. They don\'t look as good once you get them home.',
  'A depressed man turned to his friend in the pub and said, "I woke up this morning and felt so bad that I tried to kill myself by taking 50 aspirin." "Oh man, that\'s really bad", said his friend, "What happened?" The first man sighed and said, "After the first two, I felt better."',
  'A candidate is someone who gets money from the rich and votes from the poor to protect them from each other.',
  'My mother never saw the irony in calling me a son-of-a-bitch.',
  'Children: You spend the first 2 years of their life teaching them to walk and talk. Then you spend the next 16 years telling them to sit down and shut-up.',
  'Just about the time when you think you can make ends meet, somebody moves the ends.',
  'Knowledge is power, and power corrupts. So study hard and be evil.',
  'I\'m beginning to think that if opportunity ever does knock, it\'ll be because it has to use my bathroom.',
  'A little boy asked his father, "Daddy, how much does it cost to get married?" Father replied, "I don\'t know son, I\'m still paying."',
  'Two antennas meet on a roof, fall in love and get married. The ceremony wasn\'t much, but the reception was excellent.',
  'Why do we press harder on a remote control when we know the batteries are getting weak?',
  'I\'ll procrastinate later.',
  'I was in the supermarket and I saw this man and woman wrapped in a barcode. I said, "Are you two an item?"',
  'Television is called a medium because it is neither rare nor well done.',
  'I got in a fight one time with a really big guy, and he said, "I\'m going to mop the floor with your face." I said, "You\'ll be sorry." He said, "Oh, yeah? Why?" I said, "Well, you won\'t be able to get into the corners very well."',
  'Late one evening, a man is watching television when his phone rings. "Hello?" he answers. "Is that 77777?" sounds a desperate voice on other end of the phone. "Er, yes it is", replies the man puzzled. "Thank goodness!" cries the caller relieved. "Can you ring 999 for me? I\'ve got my finger stuck in the number seven."',
  'Why didn\'t Noah swat those two mosquitoes?',
  'David Hasselhoff walks into a bar and says to the barman, "I want you to call me David Hoff".  The barman replies "Sure thing Dave... no hassle"',
  'Only dead fish go with the flow.',
  '"How long have I been working at that office? As a matter of fact, I\'ve been working there ever since they threatened to sack me."',
  'Fighting for peace is like fucking for virginity.',
  'Why is it called Alcoholics ANONYMOUS when the first thing you do is stand up and say, \'My name is Peter and I am an alcoholic\'?',
  'This isn\'t an office. It\'s hell with fluorescent lighting.',
  'Hallmark Card: "I\'m so miserable without you, it\'s almost like you\'re still here."',
  'Rap is to music as Etch-A-Sketch is to art.',
  'If the number 2 pencil is the most popular, why is it still number 2?',
  'A truck carrying copies of Roget\'s Thesaurus overturned on the highway. The local newspaper reported that onlookers were "stunned, overwhelmed, astonished, bewildered and dumbfounded."',
  'Answering Machine: "Hi! I\'m probably home. I\'m just avoiding someone I don\'t like. Leave a message. If I don\'t call back, it\'s you."',
  'If a leper gives you the finger, do you have to give it back?',
  'Waiter, what is this stuff? That\'s bean salad sir. I know what it\'s been, but what is it now?',
  'Three monks are meditating in the Himalayas. One year passes in silence, and one of them says to the other, "Pretty cold up here isn\'t it?" Another year passes and the second monk says, "You know, you are quite right." Another year passes and the third monk says, "Hey, I\'m going to leave unless you two stop jabbering!"',
  'Two drunk men sat in a pub. One says to the other, "Does your watch tell the time?" "The other replies, "No, mate. You have to look at it."',
  'Do not walk behind me, for I may not lead. Do not walk ahead of me, for I may not follow. Do not walk beside me either. Just pretty much leave me the hell alone.',
  'Drink coffee! Do stupid things faster with more energy!',
  'Women should not have children after Really... 35 children are enough.',
  'A bartender is just a pharmacist with a limited inventory.',
  'Why do people keep running over a string a dozen times with their vacuum cleaner, then reach down, pick it up, examine it, then put it down to give their vacuum one more chance?',
  'Two hydrogen atoms walk into a bar. One says, "I\'ve lost my electron." The other says, "Are you sure?" The first replies, "Yes, I\'m positive..."',
  'Anyone who says an onion is the only vegetable that will make you cry has never been hit in the face with a pumpkin.',
  'You know your children are growing up when they stop asking you where they came from and refuse to tell you where they\'re going.',
  'To be sure of hitting the target, shoot first and call whatever you hit the target.',
  'I have all the money I\'ll ever need – if I die by 4:00 p.m. today.',
  'I said "no" to drugs, but they just wouldn\'t listen.',
  'What do you get when you cross poison ivy with a four-leaf clover? A rash of good luck.',
  'Don\'t hate me because I\'m beautiful. Hate me because your boyfriend thinks so.',
  'Never test the depth of the water with both feet.',
  'A man is horribly run over by a mobile library. The van screeches to a halt, the man still screaming in agony with his limbs torn apart. The driver\'s door opens, a woman steps out, leans down and whispers, "Ssshhhhh..."',
  'Don\'t tell any big lies today. Small ones can be just as effective.',
  'Two antennas met on a roof, fell in love and got married. The ceremony wasn\'t much, but the reception was excellent.',
  'Manager to interviewee: For this job we need someone who is responsible. Interviewee to Manager: I\'m your man then - in my last job, whenever anything went wrong, I was responsible.',
  'A woman goes into a clothes shop, "Can I try that dress on in the window please?" she asks. "I\'m sorry madam", replies the shop assistant, "but you\'ll have to use the changing-rooms like everyone else."',
  'The difference between in-laws and outlaws? Outlaws are wanted.',
  'A man walks into a surgery. "Doctor!" he cries. "I think I\'m shrinking!" "I\'m sorry sir, there are no appointments at the moment", says the physician. "You\'ll just have to be a little patient."',
  'Why don\'t you slip into something more comfortable...like a coma.',
  'A policeman stopped a motorist in the centre of town one evening. "Would you mind blowing into this bag, sir?" asked the policeman. "Why?" asked the driver. "Because my chips are too hot", replied the policeman.',
  'A man strolls into his local grocer\'s and says, "Three pounds of potatoes, please." "No, no, no", replies the owner, shaking his head, "it\'s kilos nowadays, mate..." "Oh", apologises the man, "three pounds of kilos, please."',
  'Judge: Silence in the court! The next person who shouts will be thrown out. Prisoner: Hallelujah!',
  'After a car crash one of the drivers was lying injured on the pavement. "Don\'t worry", said a policeman who\'s first on the scene," a Red Cross nurse is coming." "Oh no", moaned the victim, "Couldn\'t I have a blonde, cheerful one instead?"',
  'Remember, if you smoke after sex you\'re doing it too fast.',
  'I like work. It fascinates me. I sit and look at it for hours.',
  'Eat, drink and be merry, for tomorrow they may make it illegal.',
  'The main reason Santa is so jolly is because he knows where all the bad girls live.',
  '"Is your mother home?" the salesman asked a small boy sitting on the front step of a house. "Yeah, she\'s home", the boy said, moving over to let him past. The salesman rang the doorbell, got no response, knocked once, then again. Still no-one came to the door. Turning to the boy, the salesman said, "I thought you said your mother was home." The kid replied, "She is, but I don\'t live here."',
  'What\'s the difference between a northern fairytale and a southern fairytale? A northern fairytale begins "Once upon a time..." A southern fairytale begins "Y\'all ain\'t gonna believe this shit..."',
  'Friends may come and go, but enemies accumulate.',
  'Logic is a systematic method of coming to the wrong conclusion with confidence.',
  'Panties not best thing on earth, but next to it.',
  'Hippopotomonstrosesquippedaliophobia: Fear of long words.',
  'A man strolls into a lingerie shop and asks the assistant: "Do you have a see-through negligee, size 46-48-52?" The assistant looks bewildered. "What the heck would you want to see through that for?"!',
  'Losing a husband can be hard: in my case it was almost impossible.',
  'You ever make fun of someone so much, you think you should thank them for all the good times you\'ve had?',
  'How many existentialists does it take to change a light bulb?  Two. One to screw it in, and one to observe how the light bulb itself symbolises a single incandescent beacon of subjective reality in a netherworld of endless absurdity, reaching towards the ultimate horror of a maudlin cosmos of bleak, hostile nothingness.',
  'Sometimes the best helping hand you can give is a good, firm push.',
  'Children in the back seats of cars cause accidents, but accidents in the back seats of cars cause children.',
  'If life is a waste of time and time is a waste of life, then let\'s get wasted together and have the time of our lives.',
  'The hardest thing to learn in life is which bridge to cross and which to burn.',
  'Smith & Wesson: The original point and click interface.',
  'A man went to visit a friend and was amazed to find him playing chess with his dog. He watched the game in astonishment for a while. "I can hardly believe my eyes!" he exclaimed. "That\'s the smartest dog I\'ve ever seen." His friend shook his head. "Nah, he\'s not that bright. I beat him three games in five."',
  'A positive attitude may not solve all your problems, but it will annoy enough people to make it worth the effort.',
  'An egotist is someone who is usually me-deep in conversation.',
  'Archeologist: someone whose carreer lies in ruins.',
  'Doctor: Tell me nurse, how is that boy doing; the one who ate all those 5p pieces? Nurse: Still no change doctor.',
  'My idea of a high stress job is any job where you have to work with other people.',
  'Laugh at your problems, everybody else does.',
  'Crowded elevators smell different to midgets.',
  'A woman goes into a US sporting goods store to buy a rifle. "It\'s for my husband", she tells the clerk. "Did he tell you what gauge to get?" asks the clerk. Are you kidding?" she says. "He doesn\'t even know that I\'m going to shoot him!"',
  'Things are more like they are now than they ever were before.',
  'There are no personal problems which cannot be solved through suitable application of high explosives.',
  'A snake slithers into a pub and up to the bar. The landlord says, "I\'m sorry, but I can\'t serve you." "What? Why not?" asks the snake. "Because", says the landlord, "You can\'t hold your drink."',
  'If you can\'t convince them, confuse them.',
  'If a dog sniffs your ass, you\'re probably a bitch.',
  'My neighbor asked if he could use my lawnmower. I told him of course he could, as long as he didn\'t take it out of my yard.',
  'He said, "You remind me of a pepper-pot", I said "I\'ll take that as a condiment".',
  'But I\'ll tell you what I love doing more than anything: trying to pack myself in a small suitcase. I can hardly contain myself.',
  'A murderer, sitting in the electric chair, was about to be executed. "Have you any last requests?" asked the prison guard. "Yes", replied the murderer. "Will you hold my hand?"',
  'Women might be able to fake orgasms. But men can fake a whole relationship.',
  'Ever notice that people who spend money on beer, cigarettes, and lottery tickets are always complaining about being broke and not feeling well?',
  'According to a new survey, women say they feel more comfortable undressing in front of men than they do undressing in front of other women. They say that women are too judgmental, where, of course, men are just grateful.',
  'The Olympic committee has just announced that Origami is to be introduced in the next Olympic Games. Unfortunately it will only be available on paper view.',
  'I intend to live forever. So far, so good.',
  'You\'re never too old to learn something stupid.',
  'Why do Americans choose from just two people to run for president and 50 for Miss America?',
  'Sometimes, "I\'ll get back to you on that" means "I\'m going to hide under my desk and hope an idea pops into my head."',
  'The human brain is a wonderful thing. It starts working the moment you are born, and never stops until you stand up to speak in public.',
  'I bet you I could stop gambling.',
  'Dogs have masters. Cats have staff.',
  'If good things come in small packages, then more good things can come in large packages.',
  'I\'m not myself today. Maybe I\'m you.',
  'A skeleton walks into a pub one night and sits down on a stool. The landlord asks, "What can I get you?" The skeleton says, "I\'ll have a beer, thanks" The landlord passes him a beer and asks "Anything else?" The skeleton nods. "Yeah...a mop..."',
  'Middle age is when work is a lot less fun, and fun is a lot more work.',
  'I don\'t love salsa dancing. I love salsa just the way it is.',
  'Your kid may be an honors student, but you\'re still an idiot.',
  'If your dog is barking at the back door and your wife is yelling at the front door, who do you let in first? The dog, of course. He\'ll shut up once you let him in.',
  'Why do doctors call what they do "practice?"',
  'You have two choices in life: You can stay single and be miserable, or get married and wish you were dead.',
  'I used to be indecisive. Now I\'m not sure.',
  'Why is it that in the US: If you take off all your clothes and walk down the street waving a machete and firing an Uzi, terrified citizens will phone the police and report: "There\'s a naked person outside!"',
  'If a mute kid swears does his mother wash his hands with soap?',
  'If I\'d shot you sooner, I\'d be out of jail by now.',
  'A celebrity is someone who works hard all his life to become known and then wears dark glasses to avoid being recognized.',
  'What has four legs and an arm? A happy pit bull.',
  'A white horse walks into a bar, pulls up a stool, and orders a pint. The landlord pours him a tall frothy mug and say, "You know, we have a drink named after you." To which the white horse replies, "What, Eric?"',
  'I went in to a pet shop. I said, "Can I buy a goldfish?" The guy said, "Do you want an aquarium?" I said, "I don\'t care what star sign it is."',
  'What do you call someone who puts poison in a person\'s corn flakes? A cereal killer',
  'Beauty is only skin deep...but ugly goes all the way to the bone!',
  'If it\'s true that we are here to help others, then what exactly are the others here for?',
  'It ain\'t the jeans that make your butt look fat.',
  'Life is like a doughnut. You\'re either in the dough or in the hole.',
  'Two Oranges in a pub, one says to the other "Your round.".',
  'Genius does what it must, talent does what it can, and you had best do what you\'re told.',
  'There are two kinds of people who don\'t say much: those who are quiet and those who talk a lot.',
  'Every day, man is making bigger and better fool-proof things, and every day, nature is making bigger and better fools. So far, I think nature is winning.',
  'I should\'ve known it wasn\'t going to work out between my ex-wife and me. After all, I\'m a Libra and she\'s a bitch.',
  'Why do gorillas have big nostrils? Because they have big fingers!',
  'If you can\'t laugh at yourself, make fun of other people.',
  'The difference between divorce and legal separation is that a legal separation gives a husband time to hide his money.',
  'When you choke a smurf, what color does it turn?',
  'We have all heard that a million monkeys banging on a million typewriters will eventually reproduce the entire works of Shakespeare. Now, thanks to the Internet, we know this is not true.',
  'A team of scientists were nominated for the Nobel Prize. They had used dental equipment to discover and measure the smallest particles yet known to man. They became known as "The Graders of the Flossed Quark..."',
  'A bloke walks into work one day and says to a colleague, "Do you like my new shirt - it\'s made out of the finest silk and got loads of cactuses over it." "Cacti", says the co-worker. "Forget my tie", says the bloke. "Look at my shirt!"',
  'Did you hear about the Buddhist who refused the offer of Novocain during his root canal work? He wanted to transcend dental medication.',
  'There are three kinds of people: The ones who learn by reading. The ones who learn by observation. And the rest of them who have to touch the fire to learn it\'s hot.',
  'Unless you\'re the lead dog, the view never changes.',
  'If everything seems to be coming your way, you\'re probably in the wrong lane.',
  'Accept it. Your parents HAVE had sex before.',
  'One day your prince will come. Mine just took a wrong turn, got lost and is too stubborn to ask for directions.',
  'A TV can insult your intelligence, but nothing rubs it in like a computer.',
  'I think, therefore I\'m single.',
  'I ran three miles today. Finally I said, "Lady take your purse."',
  'I said to the Gym instructor "Can you teach me to do the splits?" He said, "How flexible are you?" I said, "I can\'t make Tuesdays".',
  'Born Free........Taxed to Death.',
  'We never really grow up, we only learn how to act in public.',
  'I didn\'t say it was your fault. I said I was going to blame you.',
  'I am not a vegetarian because I love animals. I am a vegetarian because I hate plants.',
  'Whizzing round a sharp bend on a country road a motorist ran over a large dog. A distraught farmer\'s wife ran over to the dead animal. "I\'m so very sorry", said the driver, "I\'ll replace him, of course." "Well, I don\'t know", said the farmer\'s wife, "Are you any good at catching rats?"',
  'One tequila, two tequila, three tequila, floor.',
  'The voices in my head may not be real, but they have some good ideas!',
  'One good thing about being wrong is the joy it brings to others.',
  'Why couldn\'t the rabbit get a loan?  Because he had burrowed too much already!',
  'Why does someone believe you when you say there are four billion stars, but check when you say the paint is wet?',
  'Waiter, this coffee tastes like dirt! Yes sir, that\'s because it was ground this morning.',
  'No matter how busy people are, they are never too busy to stop and talk about how busy they are.',
  'It\'s bad luck to be superstitious.',
  'A police officer on a motorcycle pulls alongside a man driving around the M25 in an open-topped sports car and flags him down. The policeman solemnly approaches the car. "Sir, I\'m sorry to tell you your wife fell out a mile back", he says. "Oh, thank goodness", the man replies. "I thought I was going deaf."',
  'To err is human, to blame it on somebody else shows management potential.',
  '668 – The neighbour of the beast.',
  'The knack of flying is learning how to throw yourself at the ground and miss.',
  'You may have a heart of gold, but so does a hard-boiled egg.',
  'It\'s not the fall that kills you; it\'s the sudden stop at the end.',
  'My pc\'s bark is worse than it\'s byte.',
  'Light travels faster than sound. This is why some people appear bright until you hear them speak.',
  'My mate Sid was a victim of I.D. theft. Now we just call him S.',
  'They call it "pms" because "mad cow disease" was already taken.',
  'Does this rag smell like chloroform to you?',
  'I once went to a Doctor Who restaurant. For starters I had Dalek bread.',
  'I want to die peacefully in my sleep, like my grandfather.. Not screaming and yelling like the passengers in his car.',
  'Old programmers never die. They just lose their memories.',
  'No wonder newborn babies cry. They\'ve got nothing to eat, no clothes and they already owe the government money.',
  'Life\'s like a bird, it\'s pretty cute until it shits on your head.',
  'A hard thing about a business is minding your own.',
  'If you\'re looking for sympathy, you\'ll find it in the dictionary between "shit" and "syphilis"',
  'Lite: the new way to spell "Light," now with 20% fewer letters!',
  'Progress is made by lazy men looking for an easier way to do things.',
  'Employee of the month is a good example of how somebody can be both a winner and a loser at the same time.',
  'Does time fly when you\'re having sex or was it really just one minute?',
  'The Miss Universe pageant is fixed. All the winners are from Earth.',
  'Van Gogh goes into a pub and his mate asks him if he wants a drink. "No thanks", said Vincent, "I\'ve got one ear."',
  'The sex was so good that even the neighbors had a cigarette.',
  'When you stop believing in Santa Claus is when you start getting clothes for Christmas!',
  'I wanna hang a map of the world in my house. Then I\'m gonna put pins into all the locations that I\'ve traveled to. But first, I\'m gonna have to travel to the top two corners of the map so it won\'t fall down.',
  'The probability of someone watching you is proportional to the stupidity of your action.',
  'Two women were standing at a funeral. "I blame myself for his death", said the wife. "Why?" said her friend. "Because I shot him", said the wife.',
  'Trust but verify.',
  'A cowboy walked into a bar, dressed entirely in paper. It wasn\'t long before he was arrested for rustling.',
  'When in doubt, mumble.',
  'A man walks into a bar with a slab of asphalt under his arm and says: "A beer please, and one for the road."',
  'Materialism: buying things we don\'t need with money we don\'t have to impress people that don\'t matter.',
  'A man goes into a fish and chip shop and orders fish and chips twice. The shop owner says, "I heard you the first time."',
  'When you go to the drugstore, why are the condoms not in with the other party supplies?',
  'You\'re never too old to learn something stupid.',
  'Money talks...but all mine ever says is good-bye.',
  'Who lit the fuse on your tampon?',
  'Friends are like condoms: They protect you when things get hard.',
  'You are depriving some poor village of its idiot.',
  'Everyone has the right to be stupid, but you are abusing the privilege!',
  'I consider "On Time" to be when I get there.',
  'Money can\'t buy happiness, but it sure makes misery easier to live with.',
  'Every so often, I like to go to the window, look up, and smile for a satellite picture.',
  'A famous blues musician died. His tombstone bore the inscription, "Didn\'t wake up this morning..."',
  'A committee is twelve men doing the work of one.',
  'I\'m multi-talented: I can talk and piss you off at the same time.',
  'Artificial intelligence is no match for natural stupidity.',
  'Hospitality: making your guests feel like they\'re at home, even if you wish they were.',
  'What\'s the diference between a sock and a camera? A sock takes five toes and a camera takes four toes!',
  'A businessman was interviewing a nervous young woman for a position in his company. He wanted to find out something about her personality, so he asked, "If you could have a conversation with someone living or dead, who would it be?" The girl thought about the question: "The living one", she replied.',
  'Which is worse, ignorance or apathy? Who knows? Who cares?',
  'God must love stupid people. He made SO many.',
  'Worrying works! 90% of the things I worry about never happen.',
  'A fish staggers into a bar. "What can I get you?" asks the landlord. The fish croaks "Water..."',
  'It matters not whether you win or lose: what matters is whether I win or lose.',
  'They keep saying the right person will come along, I think mine got hit by a truck.',
  'So, this \'One Laptop Per Child\' thing. Where do I drop off the child and where do I pick up the laptop?',
  'For every action, there is a corresponding over-reaction.',
  'Why do you need a driver\'s license to buy liquor when you can\'t drink and drive?',
  'Men have two emotions: Hungry and Horny. If you see him without an erection, make him a sandwich.',
  '1110011010001011111?  010011010101100111011!',
  'Stress is when you wake up screaming and you realize you haven\'t fallen asleep yet.',
  'A man goes into a bar and orders a pint. After a few minutes he hears a voice that says, "Nice shoes". He looks around but the whole bar is empty apart from the barman at the other end of the bar. A few minutes later he hears the voice again. This time it says, "I like your shirt". He beckons the barman over and tells him what\'s been happening to which the barman replies, "Ah, that would be the nuts sir. They\'re complimentary"!',
  'A newly-wed couple had recently opened a joint bank account. "Darling", said the man. "The bank has returned that cheque you wrote last week." "Great", said the woman. "What shall I spend it on next?"',
  'Failure is not falling down, it is not getting up again.',
  'If you do not say it, they can\'t repeat it.',
  'With a calendar, your days are numbered.',
  'Wise people think all they say, fools say all they think.',
  'An antique is a thing which has been useless for so long that it is still in good condition.',
  'Time is a great teacher, but unfortunately it kills all its pupils.',
  'Keep the dream alive: Hit the snooze button.',
  'A jumper cable walks into a bar. The bartender says, "I\'ll serve you but don\'t start anything."',
  'Did you know that dolphins are so smart that within a few weeks of captivity, they can train people to stand on the very edge of the pool and throw them fish?',
  'Children seldom misquote you. In fact, they usually repeat word for word what you shouldn\'t have said.',
  'A tortoise goes to the police station to report being mugged by three snails. "What happened?" says the policeman. "I don\'t know", says the tortoise. "It was all so quick."',
  'Teamwork gives you someone else to blame.',
  'Man goes to the doctor, "Doctor, doctor. I keep seeing fish everywhere." "Have you seen an optician?" asks the doctor. "Look I told you," snapped the patient, "It\'s fish that I see."',
  'Anyone who has never made a mistake has never tried anything new.',
  'A conscience is what hurts when all your other parts feel so good.',
  'Children in the dark make accidents, but accidents in the dark make children.',
  'The last time someone listened to a Bush, a bunch of people wandered in the desert for 40 years!',
  'The best way to lie is to tell the truth, carefully edited truth.',
  'Some cause happiness wherever they go. Others whenever they go.',
  'Never agree to plastic surgery if the doctor\'s office is full of portraits by Picasso.',
  'A man goes into a pub with a newt sitting on his shoulder. "That\'s a nice newt", says the landlord, "What\'s he called?" "Tiny", replies the man. "Why\'s that?" asks the landlord. "Because he\'s my newt", says the man.',
  'Alcohol is a perfect solvent: It dissolves marriages, families and careers.',
  'A grizzly bear walks into a pub and says, "Can I have a pint of lager..............................................................................................................................and a packet of crisps please." To which the barman replies, "Why the big paws?"',
  'I was playing the piano in a bar and this elephant walked in and started crying his eyes out. I said "Do you recognise the tune?" He said "No, I recognise the ivory."',
  'Puritanism: The haunting fear that someone, somewhere may be happy.',
  'Life\'s a bitch, \'cause if it was a slut, it\'d be easy.',
  'I saw this bloke chatting up a cheetah; I thought, "He\'s trying to pull a fast one".',
  'A woman goes to the doctor and says, "Doctor, my husband limps because his left leg is an inch shorter than his right leg. What would you do in his case?" "Probably limp, too", says the doc.',
  'A man visits his doctor: "Doc, I think I\'m losing it", he says",I\'m forever dreaming I wrote Lord Of The Rings." "Hmm. One moment", replies the doctor, consulting his medical book. "Ah yes, now I see... you\'ve been Tolkien in your sleep."',
  'Bumper Sticker: Older, Wiser and Just Generally More Annoying.',
  'Silence doesn\'t mean your sexual performance left her speechless.',
  'When dog food is new and improved tasting, who tests it?',
  'Yoga class is great. You can close your eyes and imagine yourself in a relaxing place. Like on your couch not doing Yoga.',
  'Love your enemies. Just in case your friends turn out to be a bunch of jerks.',
  'If you need space then work at NASA.',
  'True friendship comes when the silence between two people is comfortable.',
  'A pony walks into a pub. The publican says, "What\'s the matter with you?" "Oh it\'s nothing", says the pony. "I\'m just a little horse!"',
  'During sex, my girlfriend always wants to talk to me. Just the other night she called me from a hotel.',
  'Be safety conscious. 80% of people are caused by accidents.',
  'No one is listening until you fart.',
  'I went to buy some camouflage trousers the other day but I couldn\'t find any.',
  'If it\'s really a supercomputer, how come the bullets don\'t bounce off when I shoot it?',
  'A restaurant nearby had a sign in the window which said "We serve breakfast at any time", so I ordered French toast in the Renaissance.',
  'With sufficient thrust, pigs fly just fine.',
  'A pessimist is someone who looks at the land of milk and honey and sees only calories and cholesterol.',
  'A sandwich walks into a bar. The bartender says, "Sorry we don\'t serve food in here."',
  'Use the best: Linux for servers, Mac for graphics and Windows for solitaire.',
  'Why is it called Alcoholics ANONYMOUS when the first thing you do is stand up and say, ‘My name is Peter and I am an alcoholic\'',
  'IRS: We\'ve got what it takes to take what you\'ve got.',
  'She said she was approaching forty, and I couldn\'t help wondering from what direction.',
  'Two tramps walk past a church and start to read the gravestones. The first tramp says, "Good grief - this bloke was 182!" "Oh yeah?" says the other."What was his name?" "Miles from London."',
  'Two goldfish are in a tank. One turns to the other and says, "Do you know how to drive this thing?"',
  'The reason grandchildren and grandparents get along so well is because they have a common "enemy".',
  'A cat, by any other name, is still a sneaky little furball that barfs on the furniture.',
  'I asked God for a bike, but I know God doesn\'t work that way. So I stole a bike and asked for forgiveness.',
  'Men are like mascara, they usually run at the first sign of emotion.',
  'Warning: Dates in calendar are closer than they appear.',
  'Reality is a crutch for people who can\'t handle drugs.',
  'I could lend a hand but I prefer to give a finger.',
  'Why is it that most nudists are people you don\'t want to see naked?',
  'The quickest way to double your money is to fold it in half and put it back in your pocket.',
  'Man in pub: How much do you charge for one single drop of whisky? Landlord: That would be free sir. Man in pub: Excellent. Drip me a glass full.',
  '1 in 5 people in the world are Chinese. There are 5 people in my family, so it must be one of them. It\'s either my mum or my dad. Or my older brother Colin. Or my younger brother Ho-Cha-Chu. But I think it\'s Colin.',
  'If corn oil comes from corn, where does baby oil come from?',
  'I was reading this book, \'The History of Glue\'. I couldn\'t put it down.',
  'See, the problem is that God gives men a brain and a penis, and only enough blood to run one at a time.',
  'A couple are dining in a restaurant when the man suddenly slides under the table. A waitress, noticing that the woman is glancing nonchalantly around the room, wanders over to check that there\'s no funny business going on. "Excuse me, madam", she smarms, "but I think your husband has just slid under the table." "No he hasn\'t", the woman replies. "As a matter of fact, he\'s just walked in."',
  'You know the world is going crazy when the best rapper is a white guy, the best golfer is a black guy, the tallest guy in the NBA is Chinese, the Swiss hold the America\'s Cup, France is accusing the U.S. of arrogance, Germany doesn\'t want to go to war, and the three most powerful men in America are named ‘Bush\', ‘Dick\', and ‘Colon\'. Need I say more?',
  'There\'s only one thing worse than feeling inferior, and that\'s being able to prove it.',
  'Well aren\'t you a waste of two billion years of evolution.',
  'Some open minds should be closed for repairs.',
  'Love at first sight is easy to understand. It\'s when a couple have been looking at each other for years that it becomes a miracle.',
  'How do you get holy water? Boil the hell out of it.',
  'My love life is like a fairy tale—it\'s grim.',
  'An old man takes his two grandchildren to see the new Scooby-Doo film. When he returns home, his wife asks if he enjoyed himself. "Well", he starts, "if it wasn\'t for those pesky kids...!"',
  'If you\'re going to ride my ass at least pull my hair and make me scream!',
  'I love oral sex...it\'s the phone bill I hate.',
  'My girlfriend said she wanted me to be more like her Ex. So I dumped her.',
  'I like long walks, especially when they are taken by people who annoy me.',
  'Without nipples, breasts would be pointless.',
  'The trouble with being punctual is that nobody\'s there to appreciate it.',
  'What has four legs, is big, green, fuzzy, and if it fell out of a tree would kill you? A pool table.',
  'The sole purpose of a child\'s middle name, is so he can tell when he\'s really in trouble.',
  'Sign at the Cash Register: IN GOD WE TRUST All others pay cash.',
  'Foreign Aid: The transfer of money from poor people in rich countries to rich people in poor countries.',
  'Sex at age 90 is like trying to shoot pool with a rope.',
  'An archaeologist is someone whose life is in ruins.',
  'Evening news is where they begin with \'Good evening\', and then proceed to tell you why it isn\'t.',
  'Your gene pool could use a little chlorine.',
  'If you go to sleep with a itching ass you will wake up with a stinking finger ...',
  'A vampire bat arrives back at the roost with his face full of blood. All the bats get excited and ask where he got it from. "Follow me", he says and off they fly over hills, over rivers and into a dark forest. "See that tree over there", he says.  "WELL I DIDN\'T!!".',
  'A man goes into a fish shop and says, "I\'d like a piece of cod, please." Fishmonger says, "It won\'t be long sir." "Well, it had better be fat then", replies the man.',
  'A man\'s credit card was stolen but he decided not to report it because the thief was spending less than his wife did.',
  'You can easily judge the character of a man by how he treats those who can do nothing for him.',
  'The best way to succeed in life is to start from scratch and keep scratching.',
  'I always take life with a grain of salt, ...plus a slice of lemon, ...and a shot of tequila.',
  'Deja Vu – When you think you\'re doing something you\'ve done before, it\'s because God thought it was so funny, he had to rewind it for his friends.',
  'I saw six men kicking and punching the mother-in-law. My neighbour said ‘Are you going to help?\' I said ‘No, six should be enough.\'',
  'Caffeine is for people who feel they aren\'t irritable enough on their own.',
  'Whenever I find the key to success, someone changes the lock.',
  'Should crematoriums give discounts for burn victims?',
  'Always borrow money from a pessimist. He won\'t expect it back.',
  'Two cannibals are eating a clown. One says to the other: "Does this taste funny to you?"',
  'Little girl: Grandpa, can you make a sound like a frog? Grandpa: I suppose so sweetheart. Why do you want me to make a sound like a frog?" Little girl: Because Mum said that when you croak, we\'re going to Disneyland.',
  'Two men walking their dogs pass each other in a graveyard. The first man says to the second, "Morning." "No", says the second man. "Just walking the dog."',
  'A computer once beat me at chess, but it was no match for me at kick boxing.',
  'Doctor! I have a serious problem, I can never remember what i just said. When did you first notice this problem? What problem?',
  'Some people are like Slinkies ... not really good for anything, but you can\'t help smiling when you see one tumble down the stairs.',
  'Two men are chatting in a pub one day. "How did you get those scars on your nose?" said one. "From glasses", said the other. "Well why don\'t you try contact lenses?" asked the first. "Because they don\'t hold as much beer", said the second.',
  'Quit worrying about your health. It\'ll go away.',
  'A man went to the doctor, "Look doc", he said, "I can\'t stop my hands from shaking." "Do you drink much?" asked the doctor. "No", replied the man, "I spill most of it."',
  'Never lie to an x-ray technician. They can see right through you.',
  'You should work eight hours, play eight hours and sleep eight hours. But not the same eight hours.',
];
