const AveTokensPerWord = 1.33;
const Mini4o_WHPerToken = 0.00012;
const GCarbonPerWH = 0.48;
const PercCleanEnergy = 0;

function waitForElm(area, selector) {
    return new Promise(resolve => {
        if (area.querySelector(selector)) {
            return resolve(area.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (area.querySelector(selector)) {
                observer.disconnect();
                resolve(area.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function findText() {
	let mainArea = document.getElementById("page-header").nextSibling;
	
	return mainArea;
}
	
function calculateEnergy(length){
	let nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format((Mini4o_WHPerToken * length).toFixed(2));
}

function calculateCarbon(length){
	return (Mini4o_WHPerToken * (1-PercCleanEnergy) * length / GCarbonPerWH).toFixed(2);
}

function calculateWater(length){
	return Math.round(0);
}

function createInfoBox(length){
	let energy = calculateEnergy(length);
	let carbon = calculateCarbon(length);
	let water = calculateWater(length);
	
	let infoText = "\t" + energy + " ⚡ | " + carbon + " ⛽ | " + water + " 💧"
	
	let infoBox = document.createElement("div");
	infoBox.innerText = infoText;
	return infoBox;
}

function findDisplayLocation(){
	let loc = document.getElementById("system-hint-button");
	return loc;
}

function display(length){
	let infoBox = createInfoBox(length);
	let loc = findDisplayLocation();
	loc.after(infoBox);
	
}

function full(responseArea) {
	waitForElm(responseArea, "h6").then((elm) => {
		let responseLength = 0;
		for(let resp of responseArea.querySelectorAll("h6")){
			if(resp.innerText.includes("ChatGPT said")){
				responseLength += resp.nextSibling.innerText.split(" ").length;
			}
		}
		return AveTokensPerWord * responseLength;
	}).then((length) => {
		display(length);
			const config = {characterData: true}
			const observer = new MutationObserver(function() {
			length = getLength(responseArea);
			display(responseArea, length);
		});
			observer.observe(responseArea, config);
	});
}

function main(){
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(findText());
		}, 1000);
	}).then((responseArea) => {
		full(responseArea);
		const config = {characterData: true}
		const observer = new MutationObserver(function() {
			full(responseArea);
		});

		observer.observe(responseArea, config);
	});
}

main();


