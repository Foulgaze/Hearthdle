window.columnHeaders = 
					{
						"Name" : new StringGuess("name", false),
						"Mana Cost" : new NumericGuess("manaCost", false), 
						"Classes" : new ClassIDGuess("classId", true), 
						"Card Type" : new StringGuess("cardTypeId", true), 
						"Rarity" : new NumericGuess("rarityId", true),
						"Card Set" : new NumericGuess("cardSetId", true)
					}

window.guessedCards = []
window.countDownTimer = null
window.priorDay = null
const lastSolvedDayCookie = "priorSolveDate"
const streakCookie = "streak"
const cookiePath = "guessCard"
function cardDataIsLoaded(data)
{
	window.cardData = data
	window.cardToGuess = getDailyCard(cardData)
	console.log(cardToGuess)
	document.getElementById("correctGuessImage").src = cardToGuess["image"]
	setupCardSet()
	loadPriorGuesses()
	setupDropdown(onCardGuess, document.getElementById("searchInput"))
}

function setupCardSet()
{
	set_name = conversionData["cardSetId"][cardToGuess["cardSetId"]]
	document.getElementById("setName").innerHTML = set_name
	console.log(set_name)
	set_name = set_name.replaceAll(" ", "_").replaceAll('’', "'")
	// Object.values(conversionData["cardSetId"]).forEach(s_name =>
	// {
	// 	var http = new XMLHttpRequest();
	// 	s_name = s_name.replaceAll(" ", "_").replaceAll('’', "'")
	// 	http.open('HEAD', `../Assets/CardGuess/SetIcons/${s_name}.svg`);
	// 	http.send(); // Test for making sure everythign works
	// 	console.log(http.status != 404)
	// })
	document.getElementById("setIcon").src = `../Assets/CardGuess/SetIcons/${set_name}.svg`
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
	Object.keys(columnHeaders).forEach(columnHeader =>
	{
		const header = document.createElement("p")
		header.innerHTML = columnHeader
		row.appendChild(header)
	})
	guessResults.appendChild(row)
}

function onCardGuess(cardName, slowReveal = true)
{
	if(guessResults.childElementCount == 0)
	{
		setupGuessCategories()
	}
	else
	{
		guessResults.appendChild(document.createElement("br"))
	}
	const row = document.createElement("div")
	row.classList.add("individualGuess")
	guessedCards.push(cardName)
	if(slowReveal)
	{
		setCookie("priorGuesses", JSON.stringify(guessedCards),undefined, cookiePath)
	}
	populateRowWithGuess(row, cardName, slowReveal)
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
	let date = new Date()
	date.setDate(date.getDate() - 1)
	let priorSolveDate = getCookie(lastSolvedDayCookie)
	if(priorSolveDate != null && priorSolveDate == dateToString(date))
	{
		let streakLength = parseInt(getCookie(streakCookie))
		setCookie(streakCookie, (streakLength + 1).toString(),365,cookiePath)
	}
	else
	{
		setCookie(streakCookie, "1",365,cookiePath)
	}
	setCookie(lastSolvedDayCookie, dateToString(new Date()),365,cookiePath)

}
function setupVictory(firstVictory)
{
	// Clear elements
	document.querySelectorAll('.victoryCondition').forEach(element =>
	{
		console.log(element)
		element.classList.remove('victoryCondition')
	})
	document.getElementById("guessBox").remove()
	document.getElementById("menuBox").style.gridTemplateRows = "1fr"

	//Setup text
	let guess_tense = guessedCards.length == 1 ? "guess" : "guesses";
	document.getElementById("victoryText").innerHTML = `Solved in ${guessedCards.length} ${guess_tense}!`

	// Scroll to bottom
	const scrollingElement = (document.scrollingElement || document.body);
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
	
	// Setup countdown
	let countdownTimer = document.getElementById("countdown")
	setCountdownTimer(countdownTimer)
	countDownTimer = setInterval(() => {setCountdownTimer(countdownTimer)}, 1000)

	// Set Streak
	if(firstVictory)
	{
		updateStreak()
	}
	document.getElementById("streak").innerHTML = `Streak 🔥${getCookie(streakCookie)}`

}

async function populateRowWithGuess(row,cardName, slowReveal)
{
	guessResults.appendChild(row)
	let count = 0;
	let timeoutValue = 450;
	Object.values(columnHeaders).forEach(comparisonObject =>
	{
		const header = document.createElement("div")
		header.classList.add("individualGuess")
		let data = cardData[cardName]
		header.style.backgroundImage = `url(../Assets/CardGuess/Borders/${comparisonObject.getBackgroundURL(cardToGuess, data)}.png)`
		let result = comparisonObject.getGuessText(data, conversionData)
		header.innerHTML = result
		if(slowReveal)
		{
			header.classList.add("fadeInGuess")
			setTimeout(() => row.appendChild(header), timeoutValue * count)
		}
		else
		{
			row.appendChild(header)
		}
		count += 1
	})
	
	if(cardName == cardToGuess["name"].toUpperCase())
	{
		setupVictory(slowReveal)
	}
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