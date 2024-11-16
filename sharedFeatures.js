function getCookie(name) 
{
	const cookieArr = document.cookie.split("; ");
	for (let cookie of cookieArr) 
	{
		const [key, value] = cookie.split("=");
		if (key === name) 
		{
			return decodeURIComponent(value);
		}
	}
	return null;
}

function setCookie(name, value, expireTime, path="") 
{
	let expires = "expires="
	if(expireTime == undefined)
	{
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999); 
		expires += endOfDay.toUTCString();
	}
	else
	{
		// Assumes expire time is in days
		const expires = new Date(Date.now() + expireTime * 864e5).toUTCString();
	}

	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; SameSite=Lax; path=/${path}`;
}


function deleteCookie(name, cookiePath) 
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}`;
}
function dateToString(date)
{
	return `${date.getDate()},${date.getMonth()},${date.getYear()}`
}

function updateStreak(lastSolvedDayCookie, streakCookie, cookiePath)
{
	let date = new Date()
	date.setDate(date.getDate() - 1)
	let priorSolveDate = getCookie(lastSolvedDayCookie)
	if(priorSolveDate != null && priorSolveDate == dateToString(date))
	{
		let currentStreak = getCookie(streakCookie)
		let streakLength = 1
		if (currentStreak != null)
		{
			let parsedStreak =  parseInt(getCookie(currentStreak))
			if (parsedStreak != null)
			{
				streakLength = parsedStreak
			}
		}
		streakLength = streakLength == null ? 1 : streakLength
		setCookie(streakCookie, (streakLength + 1).toString(),365,cookiePath)
	}
	else
	{
		setCookie(streakCookie, "1",365,cookiePath)
	}
	setCookie(lastSolvedDayCookie, dateToString(new Date()),365,cookiePath)
}

function setCountdownTimer(countdownElement, cookiePath)
{
	let currentDate = new Date()
	if(priorDay != null && currentDate.getDate() != priorDay.getDate())
	{
		deleteCookie("priorGuesses")
		location.reload()
	}
	let remainingHours = (23 - currentDate.getHours()).toString().padStart(2, '0')
	let remainingMinutes = (59 - currentDate.getMinutes()).toString().padStart(2, '0')
	let remainingSeconds = (59 - currentDate.getSeconds()).toString().padStart(2, '0')
	countdownElement.innerHTML = `${remainingHours}:${remainingMinutes}:${remainingSeconds}`
	priorDay = currentDate

}

function loadPriorGuesses()
{
	let priorGuesses = getCookie("priorGuesses")
	if(priorGuesses == null)
	{
		return
	}
	JSON.parse(priorGuesses).forEach(cardName => onCardGuess(cardName, false))
}

function dataHasErrored(error)
{
	console.log(`Page has errored ${error}`);
}

function beginFetchingCardData()
{
	fetch('../Assets/CardData/all_cards.json').then
	(response => response.json()).then
	(data => {cardDataIsLoaded(data)}).catch
	(error => dataHasErrored(error));
}

function pageIsLoaded()
{
	document.getElementById("close-button").addEventListener('click', () => {document.querySelector('.help-container').style.display = "none"})
	fetch('../Assets/CardData/id_conversions.json').then
	(response => response.json())
	.then(data => {window.conversionData = data; beginFetchingCardData()})
	.catch(error => dataHasErrored(error));

	window.guessResults = document.getElementById("guessResults")

}



function setupHelpScreen() {
	const helpToggle = document.getElementById('helpIcon')
	const helpContainer = document.querySelector('.help-container')
	
	if (helpToggle) {
		helpToggle.addEventListener('click', () => {
			helpContainer.style.display = helpContainer.style.display === 'none' ? 'block' : 'none'
		});
	}
}

document.addEventListener('DOMContentLoaded', setupHelpScreen)

window.addEventListener('load', pageIsLoaded);