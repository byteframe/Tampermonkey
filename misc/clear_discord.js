// Turn on Developer Mode under User Settings > Appearance > Developer Mode (at the bottom)
// Then open the channel you wish to delete all of the messages (could be a DM) and click the three dots on the far right.
// Click "Copy ID" and paste that instead of LAST_MESSAGE_ID.
// Copy / paste the below script into the JavaScript console.

var before = '1235095604988874752';
clearMessages = function() {
	const authToken = document.body.appendChild(document.createElement`iframe`).contentWindow.localStorage.token.replace(/"/g, "");
	const channel = window.location.href.split('/').pop();
	const baseURL = `https://discordapp.com/api/channels/${channel}/messages`;
	const headers = {"Authorization": authToken };

	let clock = 0;
	let interval = 2000;

	function delay(duration) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), duration);
		});
	}

	fetch(baseURL + '?before=' + before + '&limit=100', {headers})
		.then(resp => resp.json())
		.then(messages => {
		return Promise.all(messages.filter(e => e.author.username == 'byteframe').map((message) => {
			before = message.id;
			return delay(clock += interval).then(() => fetch(`${baseURL}/${message.id}`, {headers, method: 'DELETE'}));
		}));
	}).then(() => clearMessages());
}
clearMessages();