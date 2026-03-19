/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}
const root = ReactDOM.createRoot(document.getElementById("root"));

const newGameSave = () => {
  const words = [
    "TORONTO",
    "VANCOUVER",
    "MONTREAL",
    "CALGARY",
    "OTTAWA",
    "EDMONTON",
    "WINNIPEG",
    "QUEBEC",
    "HALIFAX",
    "VICTORIA",
    "SASKATOON",
    "REGINA"
  ]

  const orderedWords = shuffle(words)
  return {
    skips: 3,
    points: 0,
    strikes: 0,
    orderedWords: orderedWords,
    currentIndex: 0,
    currentShuffled: shuffle(orderedWords[0]),
    gameOverMessage: ''
  }
}


const App = () => {
  const [currentGuess, setCurrentGuess] = React.useState('')
  const [feedback, setFeedback] = React.useState('')
  const [gameSave, setGameSave] = React.useState(() => {
    const loaded = localStorage.getItem('gameSave')
    if (loaded) {
      return JSON.parse(loaded)
    }

    return newGameSave()
  })

  React.useEffect(() => {
    localStorage.setItem('gameSave', JSON.stringify(gameSave))
  }, [gameSave])
  const nextWord = (skipsUsed, pointsEarned) => {
    let nextIndex = gameSave.currentIndex + 1
    let gameOverMessage = ""
    if (nextIndex >= gameSave.orderedWords.length) {
      nextIndex = gameSave.currentIndex
      gameOverMessage = "Congratulations! You won the game!"
    }

    const nextWord = gameOverMessage ? gameSave.currentShuffled : shuffle(gameSave.orderedWords[nextIndex])

    setGameSave(lastSave => ({
      ...lastSave,
      skips: gameSave.skips - skipsUsed,
      currentIndex: nextIndex,
      currentShuffled: nextWord,
      points: lastSave.points + pointsEarned,
      gameOverMessage: gameOverMessage
    }))
  }

  const handleSkip = () => {
    if (gameSave.skips <= 0) {
      alert("No skips left")
      return;
    }

    nextWord(1, 0)
  }

  const handleRestart = () => {
    setGameSave(newGameSave())
    setFeedback('')
  }

  const handleGuess = (e) => {
    e.preventDefault()
    const guess = currentGuess.toUpperCase().replace(/\s+/g, '')
    if (!guess) {
      return;
    }

    const currentWord = gameSave.orderedWords[gameSave.currentIndex]
    setCurrentGuess('')
    if (guess === currentWord) {
      setFeedback(`${guess} is CORRECT`)
      nextWord(0, 10)
      return
    }

    let gameOverMessage = ""
    const strikes = gameSave.strikes + 1
    if (strikes >= 3) {
      gameOverMessage = "Game over! No more guesses left!"
    }


    setFeedback(`${guess} is INCORRECT`)
    setGameSave(lastSave => ({
      ...lastSave,
      strikes: lastSave.strikes + 1,
      points: lastSave.points - 5,
      gameOverMessage: gameOverMessage,
    }))
  }

  if (gameSave.gameOverMessage) {
    return (
      <div className="container">
        <h1> ¡Scramble! </h1>
        <h2> {gameSave.gameOverMessage}</h2>
        <div>YOUR POINTS: {gameSave.points}</div>
        <button onClick={handleRestart}>RESTART</button>
      </div>
    )
  }

  return (
    <div className="container">
      <h1> ¡Scramble! </h1>
      <div>Guess the word:</div>
      <h2> {gameSave.currentShuffled}</h2>
      <form onSubmit={handleGuess}>
        <input id="guess" type="text" value={currentGuess} placeholder="Your guess here..." onChange={(e) => setCurrentGuess(e.target.value)} />
        <input type="submit" value="Try" />
      </form>
      <div className="feedback">{feedback}</div>
      <div className="display">
        <div>POINTS: {gameSave.points}</div>
        <div>SKIPS: {gameSave.skips}</div>
        <div>STRIKES: {gameSave.strikes}</div>
      </div>
      <button onClick={handleSkip}>SKIP!</button>
    </div>
  );
}

root.render(<App />);
