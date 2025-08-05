const AveTokensPerWord = 1.33;
const Mini4o_WHPerToken = 0.00012;
const Mini4o_WHPerImage = 0.06036363636;
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
	
function calculateEnergy(length_vec){
	let [length, nImages] = length_vec;
	
	let nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format((Mini4o_WHPerToken * length + Mini4o_WHPerImage * nImages).toFixed(2));
}

function calculateCarbon(length_vec){
	let [length, nImages] = length_vec;
	
	return ((1-PercCleanEnergy) * (Mini4o_WHPerToken *  length + Mini4o_WHPerImage * nImages) / GCarbonPerWH).toFixed(2);
}

function calculateWater(length_vec){
	let [length, nImages] = length_vec;
	
	return Math.round(0);
}

function createInfoBox(length_vec){
	let energy = calculateEnergy(length_vec);
	let carbon = calculateCarbon(length_vec);
	let water = calculateWater(length_vec);
	
	let infoText = "\t" + energy + " ⚡ | " + carbon + " ⛽ | " + water + " 💧"
	
	let infoBox = document.createElement("div");
	infoBox.innerText = infoText;
	return infoBox;
}

function findDisplayLocation(){
	let loc = document.getElementById("system-hint-button");
	return loc;
}

function display(length_vec){
	let infoBox = createInfoBox(length_vec);
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
		waitForElm(responseArea, "img").then((elm) => {
			let nImages = responseArea.querySelectorAll("img").length;
			return [length, nImages];
		}).then((length_vec) => {
			display(length_vec);
		});
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


