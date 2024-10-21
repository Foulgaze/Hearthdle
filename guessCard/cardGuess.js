window.columnHeaders = 
					{
						"Name" : "name",
						"Mana Cost" : "manaCost", 
						"Classes" : "classId", 
						"Card Type" : "cardTypeId", 
						"Rarity" : "rarityId", 
						"Card Set" : "cardSetId"
					}
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
	if(guessedCards.has(cardName))
	{
		return;
	}
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

async function populateRowWithGuess(row,cardName)
{
	
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
			header.classList.add("red")
		}
		// Yellow goes somewhere
		if(Object.hasOwn(conversionData, headerName))
		{
			header.innerHTML = conversionData[headerName][cardData[cardName][headerName]]
		}
		else
		{
			header.innerHTML = cardData[cardName][headerName]

		}
		row.appendChild(header)
	})
	guessResults.appendChild(row)
	if(cardName == cardToGuess["name"].toUpperCase())
	{
		document.getElementById("correctGuess").style.display = "";
		document.getElementById("guessBox").style.display = "none";
		let guess_tense = guessedCards.size == 1 ? "guess" : "guesses";
		document.getElementById("victoryText").innerHTML = `You did it in ${guessedCards.size} ${guess_tense}!`
	}
}

function dataHasErrored(error)
{
	console.log(`Page has errored ${error}`);
}

function beginFetchingCardData()
{
	fetch('../Assets/all_cards.json').then(response => response.json()) .then(data => {cardFileIsLoaded(data)}).catch(error => dataHasErrored(error));
}

function pageIsLoaded()
{
	fetch('../Assets/id_conversions.json').then
	(response => response.json())
	.then(data => {window.conversionData = data; beginFetchingCardData()})
	.catch(error => dataHasErrored(error));

	window.guessResults = document.getElementById("guessResults")

}

window.addEventListener('load', pageIsLoaded);