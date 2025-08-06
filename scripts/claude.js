const AveTokensPerWord = 1.33;

const WHPerToken = {"Sonnet 3.5": 1.1141468, "Sonnet 4": 1.1141468, "Opus 3": 0.8940735211, "Opus 4": 2.417212264}

const GCarbonPerWH = 0.36740988;
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
	let mainArea = document.querySelector("header").nextSibling.children[0].children[0];
	
	return mainArea;
}
	
function calculateEnergy(length, consump){	
	let nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format((consump * length).toFixed(2));
}

function calculateCarbon(length, consump){
	
	return ((1-PercCleanEnergy) * (consump *  length) * GCarbonPerWH).toFixed(2);
}

function calculateWater(length, consump){
	return Math.round(0);
}

function findConsump(){
	let model = document.querySelector("[data-testid~=\"model-selector-dropdown\"]").innerText;
	try{
		return WHPerToken[model];
	} catch(err){
		if(model.includes("Sonnet")){
			return WHPerToken["Sonnet 3.5"];
		}
		return WHPerToken["Opus 3"];
	} finally {
		return WHPerToken["Sonnet 3.5"];
	}
}

function createInfoBox(length){
	let consump = findConsump();
	let energy = calculateEnergy(length, consump);
	let carbon = calculateCarbon(length, consump);
	let water = calculateWater(length, consump);
	
	let infoText = "\t" + energy + " ⚡ | " + carbon + " ⛽ | " + water + " 💧"
	
	let infoBox = document.createElement("div");
	infoBox.innerText = infoText;
	return infoBox;
}

function findDisplayLocation(){
	let loc = document.getElementById("input-tools-menu-trigger");
	return loc.parentElement.parentElement.parentElement.parentElement.parentElement;
}

function display(length){
	let infoBox = createInfoBox(length);
	let loc = findDisplayLocation();
	loc.after(infoBox);
}

function full(responseArea) {
	waitForElm(responseArea, "div.font-claude-message").then((elm) => {
		let responseLength = 0;
		for(let resp of responseArea.querySelectorAll("div.font-claude-message")){
			responseLength += resp.nextSibling.innerText.split(" ").length;
		}
		
		return AveTokensPerWord * responseLength;
	}).then((length) => {
		display(length);
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
		const textObserver = new MutationObserver(function() {
			full(responseArea);
		});

		textObserver.observe(responseArea, config);
		
		const modelObserver = new MutationObserver(function() {
			display(length);
		});

		modelObserver.observe(document.querySelector("[data-testid~=\"model-selector-dropdown\"]"), config);
	});
}

main();