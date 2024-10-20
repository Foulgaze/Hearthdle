window.columnHeaders = 
					{
						"Mana Cost" : "manaCost", 
						"Classes" : "classId", 
						"Card Type" : "cardTypeId", 
						"Rarity" : "rarityId", 
						"Card Set" : "cardSetId"
					}
let loadCount = 0
function cardFileIsLoaded(data)
{
	window.cardData = data
	window.cardToGuess = getDailyCard(cardData)
	console.log(cardToGuess)
	setupDropdown(onDropdownClick, document.getElementById("searchInput"))
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
	const row = document.createElement("div")
	row.classList.add("individualGuess")
	populateRowWithGuess(row, cardName)
}

async function populateRowWithGuess(row,cardName)
{
	console.log(conversionData)
	Object.values(columnHeaders).forEach(headerName =>
	{
		const header = document.createElement("p")
		let data = cardData[cardName][headerName]
		if(data == cardToGuess[headerName]) // Make Green
		{
			header.classList.add("green")
		}
		else // Make Red
		{
			header.classList.add("red")
		}
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