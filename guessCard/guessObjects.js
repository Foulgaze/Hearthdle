const backgroundTypes = {
	Red : "guessWrong",
	Green : "guessCorrect",
	Down : "guessDownArrow",
	Up : "guessUpArrow",
	Orange : "guessPartialCorrect"
}

class AbstractGuess
{
	constructor(header, convertResult)
	{
		this.headerTitle = header
		this.convertResult = convertResult
	}
	getBackgroundURL(cardToGuess, guessedCard)
	{
		throw new Error("This is abstract")
	}
	getGuessText(guessedCard, conversionObject)
	{
		if(this.convertResult)
		{
			return `${conversionObject[this.headerTitle][guessedCard[this.headerTitle]]}`
		}
		return `${guessedCard[this.headerTitle]}`
	}
}

class ClassIDGuess extends AbstractGuess
{
	constructor(header, convertResult)
	{
		super(header,convertResult )
	}
	getClassSet(card_data)
	{
		let classes = new Set(card_data["multiClassIds"])
		if(classes.size == 0)
		{
			classes.add(card_data[this.headerTitle])
		}
		return classes
	}

	getBackgroundURL(cardToGuess, guessedCard)
	{
		let cardToGuessClasses = this.getClassSet(cardToGuess)
		let guessedCardClasses = this.getClassSet(guessedCard)
		let classIntersection = cardToGuessClasses.intersection(guessedCardClasses)
		if(cardToGuessClasses.size == classIntersection.size && guessedCardClasses.size == classIntersection.size)
		{
			return backgroundTypes.Green;
		}
		if(classIntersection.size != 0)
		{
			return backgroundTypes.Orange;
		}
		return backgroundTypes.Red;
	}

	getGuessText(guessedCard, conversionObject)
	{
		let data = [...guessedCard["multiClassIds"]]
		if(guessedCard["multiClassIds"].length == 0)
		{
			data.push(guessedCard[this.headerTitle])
		}
		data = data.map(classId => conversionObject[this.headerTitle][classId])
		return data.join(",\n")
	}
}

class NumericGuess extends AbstractGuess
{
	constructor(header, convertResult)
	{
		super(header,convertResult )
	}
	getBackgroundURL(cardToGuess, guessedCard)
	{
		let cardToGuessCost = cardToGuess[this.headerTitle] 
		let guessedCardCost = guessedCard[this.headerTitle]

		if(cardToGuessCost > guessedCardCost)
		{
			return backgroundTypes.Up;
		}
		if(cardToGuessCost < guessedCardCost)
		{
			return backgroundTypes.Down
		}
		return backgroundTypes.Green;
	}
	getGuessText(guessedCard, conversionObject)
	{
		return super.getGuessText(guessedCard, conversionObject)
	}


}

class StringGuess extends AbstractGuess
{
	constructor(header, convertResult)
	{
		super(header,convertResult )
	}

	getBackgroundURL(cardToGuess, guessedCard)
	{
		if(cardToGuess[this.headerTitle] != guessedCard[this.headerTitle])
		{
			return backgroundTypes.Red
		}
		return backgroundTypes.Green
	}
	getGuessText(guessedCard, conversionObject)
	{
		return super.getGuessText(guessedCard, conversionObject)
	}

}


