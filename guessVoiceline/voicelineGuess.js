window.guessedCards = []
window.countDownTimer = null
window.priorDay = null
const lastSolvedDayCookie = "priorSolveDate"
const streakCookie = "streak"
const cookiePath = "guessVoiceline"
const inputRange = document.querySelector('.custom-input');
const volumeCookie = "volume"
function cardDataIsLoaded(cardData)
{
	fetch('../Assets/CardData/voiceline_names.json').then
	(response => response.json())
	.then(data => {cardNamesAreLoaded(cardData, data)})
	.catch(error => dataHasErrored(error));
}

function cardNamesAreLoaded(cardData, nameData)
{
	window.cardData = cardData
	window.cardToGuess = cardData[getDailyCardFromName(nameData, 5)]
	console.log(cardToGuess)
	document.getElementById("correctGuessImage").src = cardToGuess["image"]
	setupVoicelines()
	loadPriorGuesses()
	setAudio(true)
	setupDropdown(onCardGuess, document.getElementById("searchInput"))
}

function setAudio(init = false)
{
	volume = inputRange.value
	if(init)
	{
		console.log("init")
		let priorVolume = getCookie(volumeCookie)
		if(priorVolume != null)
		{
			let parsedVolume = parseFloat(priorVolume)
			if(parsedVolume != NaN)
			{
				volume = parsedVolume
				inputRange.value = parsedVolume
				console.log(inputRange.value)
			}
		}
	}
	playAudio.volume = volume
	attackAudio.volume = volume
	deathAudio.volume = volume
	setCookie(volumeCookie, `${volume}`,365, cookiePath)
}

function setupVoicelines()
{
	let buttons = document.getElementsByClassName("voiceButton")
	window.playAudio = new Audio(cardToGuess["voicelines"]["play"])
	window.attackAudio = new Audio(cardToGuess["voicelines"]["attack"])
	window.deathAudio = new Audio(cardToGuess["voicelines"]["death"])
	buttons[0].addEventListener("click", () => {playAudio.play()})
	buttons[1].addEventListener("click", () => {attackAudio.play()})
	buttons[2].addEventListener("click", () => {deathAudio.play()})
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
			updateStreak(lastSolvedDayCookie, streakCookie, cookiePath)
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

inputRange.addEventListener('input', () => setAudio(false));