window.columnHeaders = 
					{
						"Name" : "name",
						"Mana Cost" : "manaCost", 
						"Classes" : "classId", 
						"Card Type" : "cardTypeId", 
						"Rarity" : "rarityId", 
						"Card Set" : "cardSetId"
					}



const headersToSkip = ["name", "cardTypeId", "classId"]
let loadCount = 0
window.guessedCards = new Set()
function cardFileIsLoaded(data)
{
	window.cardData = data
	window.cardToGuess = getDailyCard(cardData)
	console.log(cardToGuess)
	setupCorrectCard()
	setupDropdown(onDropdownClick, document.getElementById("searchInput"))
}

function setupCorrectCard()
{
	document.getElementById("correctGuessImage").src = cardToGuess["image"]
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

function onDropdownClick(cardName)
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
	guessedCards.add(cardName)
	populateRowWithGuess(row, cardName)
}

function setupWrongGuess(answer, guess, header, headerName)
{
	header.classList.add("red");
	if(headersToSkip.includes(headerName))
	{
		return;
	}
	console.log(answer, guess)
	if(answer > guess)
	{
		header.style.backgroundImage = "url(../Assets/CardGuess/CardGuessBorders/guessUpArrow.png)"
	}
	else
	{
		header.style.backgroundImage = "url(../Assets/CardGuess/CardGuessBorders/guessDownArrow.png)"
	}
}

async function populateRowWithGuess(row,cardName)
{
	guessResults.appendChild(row)
	let count = 0;
	let timeoutValue = 450;
	Object.values(columnHeaders).forEach(headerName =>
	{
		const header = document.createElement("div")
		let data = cardData[cardName][headerName]
		if(data == cardToGuess[headerName]) 
		{
			header.classList.add("green")
		}
		else 
		{
			setupWrongGuess( cardToGuess[headerName], data, header, headerName)
		}
		console.log(header)
		if(Object.hasOwn(conversionData, headerName))
		{
			header.innerHTML = conversionData[headerName][cardData[cardName][headerName]]
		}
		else
		{
			header.innerHTML = cardData[cardName][headerName]

		}
		setTimeout(() => row.appendChild(header), timeoutValue * count)
		count += 1
	})
	
	if(cardName == cardToGuess["name"].toUpperCase())
	{
		document.getElementById("correctGuess").style.display = ""
		document.getElementById("guessBox").remove()
		document.getElementById("menuBox").style.gridTemplateRows = "1fr"
		let guess_tense = guessedCards.size == 1 ? "guess" : "guesses";
		document.getElementById("victoryText").innerHTML = `Card found in ${guessedCards.size} ${guess_tense}!`
	}
}

function dataHasErrored(error)
{
	console.log(`Page has errored ${error}`);
}

function beginFetchingCardData()
{
	fetch('../Assets/CardData/all_cards.json').then(response => response.json()) .then(data => {cardFileIsLoaded(data)}).catch(error => dataHasErrored(error));
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