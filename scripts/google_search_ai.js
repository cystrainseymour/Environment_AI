const AveTokensPerWord = 1.33;
const WHPerToken = 3.228008552;
const GCarbonPerWH = 0.3674098;
const PercCleanEnergy = 0.64;

function findAIOverview() {
	let match;
	for (let h1 of document.querySelectorAll("h1")) {
		if (h1.textContent.includes("Search Results")) {
			match = h1;
			break;
		}
	}
	let overview = match.nextSibling.nextSibling;
	return overview;
}

function getLength(overview){
	let allText = overview.innerText;
	let groundingLinksText;
	
	for (let span of overview.querySelectorAll("span")){
		if (span.innerText.includes("Show all")) {
			var match = span.parentElement.parentElement.parentElement.parentElement.parentElement
			groundingLinksText = match.innerText;
			break;
		}
	}
	
	let allWords = allText.split(" ").length;
	let groundingLinksWords = groundingLinksText.split(" ").length;
	
	let genWords = allWords - groundingLinksWords;
	
	return genWords * AveTokensPerWord;
}

function calculateEnergy(length){
	let nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format(Math.round(WHPerToken * length));
}

function calculateCarbon(length){
	return Math.round(WHPerToken * (1-PercCleanEnergy) * length * GCarbonPerWH);
}

function calculateWater(length){
	return Math.round(0);
}

function createInfoBox(length){
	let energy = calculateEnergy(length);
	let carbon = calculateCarbon(length);
	let water = calculateWater(length);
	
	let infoText = energy + " ⚡ | " + carbon + " ⛽ | " + water + " 💧"
	
	let infoBox = document.createElement("div");
	infoBox.innerText = infoText;
	return infoBox;
}

function findDisplayLocation(overview){
	let loc;
	for (let strong of overview.querySelectorAll("strong")){
		if (strong.innerText.includes("AI Overview")) {
			loc = strong.parentElement.parentElement.parentElement.childNodes[0]
			break;
		}
	}
	return loc;
}

function display(overview, length){
	let infoBox = createInfoBox(length);
	let loc = findDisplayLocation(overview);
	loc.after(infoBox);
}

function main(){
	let overview = findAIOverview();
	let length = getLength(overview);
	display(overview, length);
	
	const config = {characterData: true}
	
	const observer = new MutationObserver(() => {
		length = getLength(overview);
		display(overview, length);
	});
	
	observer.observe(overview, config);
}

main();
console.log("done");