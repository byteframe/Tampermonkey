//------------------------------------------------------------------------------ ScrapeAllVideosAndCompare
setInterval(() => (
  jQuery('a#video-title').each((I, E) =>  console.dir("--" + E.text.trim())),
  setTimeout(() => jQuery('#navigate-after')[0].click(), 1000)), 7500)
ls -1 /mnt/d/Video/Youtube | while read FILE; do
  FILE="${FILE%.*}"
  if ! grep -q "${FILE}" /mnt/c/Users/byteframe/Desktop/output.log; then
    echo ${FILE}
  fi
done
cat /mnt/c/Users/byteframe/Desktop/output.log | while read FILE; do
  if [ $(find /mnt/d/Video/Youtube -name "${FILE}.*" | wc -l) != '1' ]; then
    echo ${FILE}
  fi
done
//------------------------------------------------------------------------------ PlaylistProcessing
w.mkdirSync('playlists'),
batch = '',
response.data.items.forEach((item) =>
  batch += '"C:\\\\Program Files\\mpv-x86_64-20170913\\youtube-dl.exe" -J --flat-playlist https://www.youtube.com/playlist?list=' + item.id + ' > ' + item.snippet.title.replace(/ /g, '_') + ".json\n")
w.writeFileSync('playlists/get_playlists.bat', batch);
playlisted = [],
w.readdirSync('playlists').forEach((playlist, i) => (
  JSON.parse(w.readFileSync('playlists/' + playlist)).entries.forEach((entry) => (
    playlisted.push(entry.title))))),
duplicates(playlisted);
console.log(uploaded.length),
uploaded.filter(e => !playlisted.includes(e)),
html = '',
uploaded.forEach((video) =>
  (playlisted.indexOf(video) == -1) &&
    (html += ('<a href="https://www.youtube.com/watch?v=' + video + '">' + video +"</a>\n" ))),
fs.writeFileSync('missing.html', html)
//------------------------------------------------------------------------------ OldYoutubeJQuery
var videos = jQuery('.vm-thumbnail-container a.yt-uix-sessionlink');
(function youtube_video(v = videos.length-1) {
  if (v == -1) {
    console.log('youtube_page(p-1);');
  }
  jQuery.get(videos[v].href).done(function(response) {
    var title = jQuery(response).find('h1.title').innerText;
    var description = jQuery(response).find('#description')[0].innerText.split('\n');
    console.log(title + " | " + description[0] + " | " + description[2]);
    youtube_video(v--);
  });
})();
if (loaded == 0){
    console.log('still loading');
} else if (loaded == 1){
  (function youtube_page(p = 19) {
    if (p == -1) {
      return true;
    }
    jQuery.get('https://www.youtube.com/my_videos?o=U&pi=' + p,
    ).done(function(response) {
      var videos = jQuery(response).find('.vm-thumbnail-container a.yt-uix-sessionlink');
      (function youtube_video(v = videos.length-1) {
        if (v == -1) {
          youtube_page(p-1);
        }
        console.log(videos[v].href);
        return 1;
        jQuery.get(videos[v].href).done(function(response) {
          var title = jQuery(response).find('h1.title')[0].innerText;
          var description = jQuery(response).find('#description')[0].innerText.split('\n');
          console.log(title);
          console.log(description[0]);
          console.log(description[2]);
        });
      })();
    });
  })();