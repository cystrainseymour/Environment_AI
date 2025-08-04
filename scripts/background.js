const cgpt_filter = new RegExp("https://chatgpt.com/|https://chatgpt.com|https://chatgpt.com/c/*|https://chatgpt.com/?model=*", "g");

chrome.tabs.onUpdated.addListener(
	callback : (url) => {
		console.log("a");
		if(cgpt_filter.test(url)){
			require("./chat_gpt.js");
		}
	}
);

