function seededRandom(seed) 
{
	const a = 1664525;
	const c = 1013904223;
	const m = Math.pow(2, 32);
  
	let value = (a * seed + c) % m;
	return value / m; 
}


function getRandomRange(end)
{
	let unscaled_value = seededRandom(new Date().getDate())
	return Math.floor(unscaled_value * end);
}

function getDailyCard(cardData)
{
	let keys = Object.keys(cardData)
	let randomCard = getRandomRange(keys.length)
	return cardData[keys[randomCard]]
}
