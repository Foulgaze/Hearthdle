const dropdownElements = [];
function filterFunction() 
{
	if(inputField == null)
	{
		return
	}
	dropdownElements.forEach(element => element.classList.remove("show"))
	dropdownList.style.display = "none"
    const input = inputField.value.toUpperCase()
	if(input == "")
	{
		return
	}
	let currentDropdownSize = 0
	let dropdownSize = dropdownElements.length

	for(var key in cardData)
	{
		if(key.startsWith(input) && !guessedCards.has(key))
		{
			let currentElement = dropdownElements[currentDropdownSize++]
			currentElement.innerHTML = cardData[key]["name"]
			currentElement.classList.add("show")
			if(currentDropdownSize >= dropdownSize)
			{
				break
			}
		}
	}
	if(currentDropdownSize != 0)
	{
		dropdownList.style.display = ""
	}
}

function enableDropdown(_)
{
	if(dropdownList.chidlElementCount == 0)
	{
		return
	}
	filterFunction()
}

function disableDropdown(_)
{
	hovered_elements = document.querySelectorAll( ":hover" )
	if(hovered_elements.length == 0)
	{
		dropdownList.style.display = "none"
		return;
	}
	last_element = hovered_elements[hovered_elements.length - 1]

	if (!last_element.classList.contains("show")) 
	{
		dropdownList.style.display = "none"
	} 

}


function setupDropdown(onClickfunction, inputField)
{
	window.inputField = document.getElementById("searchInput")
	window.dropdownList = document.getElementById("dropdownList")
	let dropdownSize = 10;
	createButtons(dropdownSize, dropdownList, onClickfunction )
	inputField.onclick = enableDropdown
	inputField.onblur = disableDropdown

}

function createButtons(count, dropdown, onClickfunction) 
{

    dropdown.innerHTML = ''

    for (let i = 0; i < count; ++i) 
	{
        const link = document.createElement("button")
		link.onclick = function()
		{
			dropdownList.style.display = "none"
			onClickfunction(link.innerHTML.toUpperCase())
		}
        dropdown.appendChild(link) // Append the link to the container
		dropdownElements.push(link)
    }
}