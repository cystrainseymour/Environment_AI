const KWHPerToken = 993.7660132;
const GCarbonPerKWH = 480;
const PercCleanEnergy = 0.64;

function findAIOverview() {
	var match;
	for (let h1 of document.querySelectorAll("h1")) {
		if (h1.textContent.includes("Search Results")) {
			match = h1;
			break;
		}
	}
	var overview = match.nextSibling.nextSibling;
	return overview
}

function getLength(overview){
	var length = overview.innerText.length;
	console.log(length);
	for (let span of overview.querySelectorAll("span")){
		if (span.innerText.includes("Show all")) {
			var match = span.parentElement.parentElement.parentElement.parentElement.parentElement
			length -= match.innerText.length;
			break;
		}
	}
	
	return length;
}

function calculateEnergy(length){
	var nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format(Math.round(KWHPerToken * length));
}

function calculateCarbon(length){
	return Math.round(KWHPerToken * PercCleanEnergy * length / GCarbonPerKWH);
}

function calculateWater(length){
	return Math.round(0);
}

function createInfoBox(length){
	var energy = calculateEnergy(length);
	var carbon = calculateCarbon(length);
	var water = calculateWater(length);
	
	var infoText = energy + " ⚡ | " + carbon + " ⛽ | " + water + " 💧"
	
	var infoBox = document.createElement("div");
	infoBox.innerText = infoText;
	return infoBox;
}

function findDisplayLocation(overview){
	var loc;
	for (let strong of overview.querySelectorAll("strong")){
		if (strong.innerText.includes("AI Overview")) {
			loc = strong.parentElement.parentElement.parentElement.childNodes[0]
			break;
		}
	}
	return loc;
}

function display(overview, length){
	var infoBox = createInfoBox(length);
	var loc = findDisplayLocation(overview);
	var infoBox = createInfoBox(length);
	loc.after(infoBox);
}

function main(){
	var overview = findAIOverview();
	var length = getLength(overview);
	display(overview, length);
	console.log(length);
}

main();