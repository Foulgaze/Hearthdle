function seededRandom(seed, seedOffset) 
{
	const a = 1664525 * seedOffset;
	const c = 1013904223 * seedOffset;
	const m = Math.pow(2, 32);
  
	let value = (a * seed + c) % m;
	return value / m; 
}


function getRandomRange(end, seedOffset)
{
	let unscaled_value = seededRandom(new Date().getDate(), seedOffset)
	return Math.floor(unscaled_value * end);
}

function getDailyCard(cardData, seedOffset = 1)
{
	let keys = Object.keys(cardData)
	let randomCard = getRandomRange(keys.length, seedOffset)
	return cardData[keys[randomCard]]
}

function getDailyCardFromName(cardNames, seedOffset = 1)
{
	let randomCard = getRandomRange(cardNames.length, seedOffset)
	return cardNames[randomCard]
}
