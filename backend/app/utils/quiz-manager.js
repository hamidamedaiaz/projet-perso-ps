let sessions = []


const playerSocketMap = new Map()

export function getPlayerSocketMap() {
  return playerSocketMap
}

export function registerPlayerSocket(playerId, socketId) {
  playerSocketMap.set(playerId, socketId)
}

export function unregisterPlayerSocket(playerId) {
  for (const session of sessions) {
    const player = session.players.find((player) => player.id === playerId)
    if (player) {
      leaveSession(playerId, session.id)
      break
    }
  }
  playerSocketMap.delete(playerId)
}

export function getSocketIdFromPlayerId(playerId) {
  return playerSocketMap.get(playerId)
}

export function createNewSession(quiz, socketId) {
  const session = createEmptySession(quiz, socketId)
  sessions.push(session)
  return session
}

export function deleteSession(sessionId) {
  sessions = sessions.filter((session) => session.id !== sessionId)
}

export function getSession(sessionId) {
  return sessions.find((session) => session.id === sessionId)
}

export function joinSession(sessionId, profile) {
  const return_value = { success: false, quizId: -1 }

  const player = createPlayer(profile)

  sessions.forEach((session) => {
    const playerAlreadyExists = session.players.some((p) => p.id === player.id)

    if (session.id === sessionId && !session.isRunning && !playerAlreadyExists) {
      session.players.push(player)
      return_value.success = true
      return_value.quizId = session.quiz.id
    }
  })

  return return_value
}

export function leaveSession(playerId, sessionId) {
  let leaved = false

  sessions.forEach((session) => {
    if (session.id === sessionId) {
      const playerExists = session.players.some((player) => player.id === playerId)
      if (playerExists) {
        session.players = session.players.filter((player) => player.id !== playerId)
        leaved = true
      }
    }
  })

  return leaved
}


export function getPlayersFromSession(sessionId) {
  const session = sessions.find((session) => session.id === sessionId)
  if (session) return session.players
}

function createEmptySession(quiz, socketId) {
  try {
    const sessionId = [...crypto.getRandomValues(new Uint8Array(3))]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    return {
      id: sessionId,
      players: [],
      quiz,
      currentQuestionId: -1,
      isRunning: false,
      adminSocketId: socketId,
    }
  } catch (err) { console.log(err) }
}


function createPlayer(profile) {
  const player = {
    id: profile.id,
    name: profile.name,
    lastName: profile.lastName,
    answers: [],
    hasAnswered: false,
  }
  return player
}

function initQuiz(sessionId) {
  const session = sessions.find((session) => session.id === sessionId)
  session.players.forEach((player) => player = initQuizResults(session.quiz, player))
}

function initQuizResults(quiz, player) {
  const questionResults = []

  quiz.questions.forEach((question) => {
    const questionResult = {
      quizId: quiz.id,
      questionId: question.id,
      answerIds: [],
      timeSpent: 0,
      numberOfHintsUsed: 0,
    }
    questionResults.push(questionResult)
  })

  player.answers = questionResults

  return player
}

export function startSession(sessionId) {

  const session = sessions.find((session) => session.id === sessionId)
  let result = { started: false, players: session.players }
  try {
    initQuiz(sessionId)
    session.isRunning = true
    session.currentQuestionId = 0
    result.started = true
  } catch (err) {
    console.log('[SERVER] error while starting the session -', err)
  }

  return result
}

export function getQuestion(questionId, sessionId) {
  const session = sessions.find((session) => session.id === sessionId)
  try {
    const question = session.quiz.questions[questionId]
    return question
  } catch (err) { console.log('[SERVER] error while trying to retrieve the question - ', questionId, 'from session - ', sessionId) }
}

export function nextQuestion(sessionId) {
  const result = { hasChanged: false, currentQuestionId: -1, isQuizFinished: false }
  try {
    sessions.find((session) => {
      if (session.id === sessionId) {
        const numberOfQuestions = session.quiz.questions.length
        // Check s'il reste encore des questions
        if (session.currentQuestionId <= numberOfQuestions) {
          session.currentQuestionId += 1
          result.currentQuestionId = session.currentQuestionId
          result.hasChanged = true
        } else {
          result.isQuizFinished = true
        }
      }
    })
  } catch (err) {
    console.log('[SERVER] error while changing question : ', err)
  } finally {
    return result
  }
}

export function checkDataValidity(sessionId, playerId, answer) {
  let isValid = false

  const session = sessions.find((session) => session.id === sessionId)

  if (session) {

    const profile = session.players.find((player) => player.id == playerId)

    if (profile) {
      if (answer.id !== -1) isValid = true
    }
    else {
      console.log("[SERVER] - Invalid Profile")
    }
  } else {
    console.log("[SERVER] - Invalid Session")
  }

  return isValid
}

// TO DO FIND PLAYER 

export function getAdminSocketId(sessionId) {
  const session = sessions.find((session) => session.id === sessionId)
  return session.adminSocketId
}

export function disconnectPlayer(playerId) {
  try {
    sessions.forEach((session) => {
      session.players.filter((player) => player.id !== playerId)
    })
  } catch (err) { console.log(err) }
}

export function isSessionAdmin(socketId) {
  const result = { isAdmin: false, sessionId: "None" }
  const session = sessions.find(session => session.adminSocketId === socketId)
  if (session) {
    result.isAdmin = true
    result.sessionId = session.id
  }
  return result;
}

export function handleReconnection(sessionId, profile, socketId) {
  let connected = false;
  sessions.forEach(session => {
    if (session.id === sessionId) {
      session.players.forEach(player => {
        if (player.id === profile.id) {
          //Update the value
          playerSocketMap.set(profile.id, socketId)
          connected = true;
        }
      })
    }
  })
  return connected;
}