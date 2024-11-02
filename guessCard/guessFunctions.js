const backgroundTypes = {
	Red : "guessWrong",
	Green : "guessCorrect",
	Down : "guessDownArrow",
	Up : "guessUpArrow",
	Orange : "guessPartiallyCorrect"
}

class AbstractGuess
{

	getBackgroundURL(cardToGuess, guessedCard)
	{
		throw new Error("This is abstract")
	}
	getGuessText(guessedCard, conversionObject)
	{
		throw new Error("This is abstract")
	}
}

class ClassID extends AbstractGuess
{
	headerTitle = "classId"

	getClassSet(card_data)
	{
		classes = Set(card_data["multiClassIds"])
		if(classes.size != 0)
		{
			classes.add(card_data[this.headerTitle])
		}
		return classes
	}

	getBackgroundURL(cardToGuess, guessedCard)
	{
		cardToGuessClasses = getClassSet(cardToGuess)
		guessedCardClasses = getClassSet(guessedCard)
		classIntersection = cardToGuessClasses.intersection(guessedCardClasses)
		if(cardToGuess.size == classIntersection.size)
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
		data = [...guessedCard["multiClassIds"]]
		if(guessedCard["multiClassIds"].length == 0)
		{
			data.push(guessedCard[this.headerTitle])
		}
		data.map(classId => conversionObject[this.headerTitle][classId])
		return data.join(",")
	}
}

class ManaCost extends AbstractGuess
{
	headerTitle = "manaCost"

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
		return guessedCard["manaCost"]
	}
}

class ManaCost extends AbstractGuess
{
	headerTitle = "name"

	getBackgroundURL(cardToGuess, guessedCard)
	{
		if(cardToGuess[this.headerTitle] != guessedCard[this.headerTitle])
		{
			return backgroundTypes.Red
		}
		return backgroundTypes.Green
	}

	getGuessText(guessedCard, _)
	{
		return guessedCard["manaCost"]
	}
}