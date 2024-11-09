window.guessedCards = []
window.countDownTimer = null
window.priorDay = null
const lastSolvedDayCookie = "priorSolveDate"
const streakCookie = "streak"
const guessPercentages = [150,250,500,750,1000]
const cookiePath = "guessArt"
function cardDataIsLoaded(data)
{
	window.cardData = data
	window.cardToGuess = getDailyCard(cardData, 3)
	document.getElementById("guessesRemaining").innerHTML = `${guessPercentages.length + 1 - guessedCards.length} Guesses Remaining`
	window.artHolder = document.getElementById("cardArtHolder")
	artHolder.style.backgroundImage = `url(${cardToGuess["image"]})`
	console.log(cardToGuess)
	document.getElementById("correctGuessImage").src = cardToGuess["image"]
	loadPriorGuesses()
	setupDropdown(onCardGuess, document.getElementById("searchInput"))
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


function setupGuessCategories()
{
	const row = document.createElement("div")
	row.classList.add("individualGuess")
	guessResults.appendChild(row)
}

function onCardGuess(cardName, slowReveal = true)
{
	let isCorrectCard = cardName == cardToGuess["name"].toUpperCase()
	const guessElement = document.createElement("div")
	const cardNameElement = document.createElement("p");
	guessElement.classList.add("individualGuess")
	cardNameElement.innerHTML = cardName
	guessedCards.push(cardName)
	document.getElementById("guessesRemaining").innerHTML = `${guessPercentages.length + 1 - guessedCards.length} Guesses Remaining`

	if(slowReveal)
	{
		setCookie("priorGuesses", JSON.stringify(guessedCards), undefined, cookiePath)
	}
	guessResults.appendChild(guessElement)
	guessElement.appendChild(cardNameElement)
	let backgroundImageName = isCorrectCard ? "correctName" : "incorrectName"
	guessElement.style.backgroundImage = `url(../Assets/ArtGuess/${backgroundImageName}.png)`
	if(isCorrectCard)
	{
		endGuessing(slowReveal, isCorrectCard)
		return
	}
	else
	{
		if (guessedCards.length > guessPercentages.length)
		{
			endGuessing(slowReveal, false)
			return
		}
	}
	artHolder.style.backgroundSize = `${guessPercentages[guessPercentages.length - 1 - (guessedCards.length - 1)]}%` 
	console.log(`${guessPercentages[guessPercentages.length - 1 - (guessedCards.length - 1)]}%` )

}

function setCountdownTimer(countdownElement)
{
	let currentDate = new Date()
	if(priorDay != null && currentDate.getDate() != priorDay.getDate())
	{
		deleteCookie("priorGuesses") // Just in case not automatically deleted 
		location.reload()
	}
	let remainingHours = (23 - currentDate.getHours()).toString().padStart(2, '0')
	let remainingMinutes = (59 - currentDate.getMinutes()).toString().padStart(2, '0')
	let remainingSeconds = (59 - currentDate.getSeconds()).toString().padStart(2, '0')
	countdownElement.innerHTML = `${remainingHours}:${remainingMinutes}:${remainingSeconds}`
	priorDay = currentDate

}
function dateToString(date)
{
	return `${date.getDate()},${date.getMonth()},${date.getYear()}`
}
function updateStreak()
{
	let today = new Date()
	let yesterday = new Date(today.getDate() - 1)
	let priorSolveDate = getCookie(lastSolvedDayCookie)
	if(priorSolveDate == null)
	{
		setCookie(lastSolvedDayCookie, dateToString(today), 365, cookiePath)
		setCookie(streakCookie, "1", 365, cookiePath)
	}
	else
	{
		if (priorSolveDate == dateToString(yesterday))
		{
			let streakLength = parseInt(getCookie(streakCookie))
			setCookie(streakCookie, (streakLength + 1).toString(),365, cookiePath )
		}
		else
		{
			setCookie(streakCookie, "1", 365, cookiePath)
		}
	}
}
function endGuessing(firstVictory, wonGame)
{
	// Clear elements
	document.querySelectorAll('.victoryCondition').forEach(element =>
	{
		console.log(element)
		element.classList.remove('victoryCondition')
	})
	document.getElementById("guessBox").remove()
	document.getElementById("menuBox").style.gridTemplateRows = "1fr"

	if(wonGame)
	{
		//Setup text
		let guess_tense = guessedCards.length == 1 ? "guess" : "guesses";
		document.getElementById("victoryText").innerHTML = `Solved in ${guessedCards.length} ${guess_tense}!`

		if(firstVictory)
		{
			updateStreak()
		}
		document.getElementById("streak").innerHTML = `Streak 🔥${getCookie(streakCookie)}`
	}
	else
	{
		document.getElementById("victoryText").innerHTML = `You didn't get the card`
	}


	// Scroll to bottom
	const scrollingElement = (document.scrollingElement || document.body);
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
	
	// Setup countdown
	let countdownTimer = document.getElementById("countdown")
	setCountdownTimer(countdownTimer)
	countDownTimer = setInterval(() => {setCountdownTimer(countdownTimer)}, 1000)
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
	fetch('../Assets/CardData/id_conversions.json').then
	(response => response.json())
	.then(data => {window.conversionData = data; beginFetchingCardData()})
	.catch(error => dataHasErrored(error));

	window.guessResults = document.getElementById("guessResults")

}

window.addEventListener('load', pageIsLoaded);