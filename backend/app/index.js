const { Server } = require('socket.io')
const buildServer = require('./build-server.js')
const logger = require('./utils/logger.js')
const multiplayerQuizManager = require('./utils/quiz-manager.js')
const onlineManager = require('./utils/online-manager.js')


buildServer((server) => {
    logger.info(`Server is listening on port ${server.address().port}`)

    // ADAPTER LE SERVER EN WS
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('[SERVER] - user connected')

        socket.on('lobby-connection', (player) => {
            if (player.id !== -1 && player.role !== 'admin') {
                console.log('[SERVER] - Player is online', player.name)
                onlineManager.addPlayer(socket.id, player)
                socket.broadcast.emit('lobby-connection', player)
            }
        })

        socket.on('lobby-disconnect', (data) => {
            console.log('[SERVER] - Player disconnect from lobby')
            onlineManager.removePlayerById(data.id)
            socket.broadcast.emit('lobby-disconnect', data)
        })

        socket.on('request-for-online-players', () => {
            console.log('[SERVER] request-for-online-players received');
            const players = onlineManager.getOnlinePlayers();
            console.log('[SERVER] online-players emitted');
            socket.emit('online-players', { players: players });
        })

        socket.on('generate-new-session', (quiz) => {
            console.log('[SERVER] generate-new-session received')

            const session = multiplayerQuizManager.createNewSession(quiz, socket.id)

            console.log('[SERVER] session-created emitted')
            socket.emit('session-created', session)
        })

        // BEFORE THE BEGINING OF THE SESSION


        // JOIN SESSION

        socket.on('join-session', (data) => {
            console.log('[SERVER] join-session received')

            const hasJoined = multiplayerQuizManager.joinSession(data.sessionId, data.profile)

            if (hasJoined.success) {
                multiplayerQuizManager.registerPlayerSocket(data.profile.id, socket.id)

                console.log('[SERVER] quiz-joined-success emitted')
                socket.emit('quiz-joined-success', { quizId: hasJoined.quizId, sessionId: data.sessionId })

                console.log('[SERVER] player-has-joined-session emitted')
                socket.broadcast.emit('player-has-joined-session', { sessionId: data.sessionId, profile: data.profile })
            } else {
                console.log('[SERVER] quiz-joined-error emitted')
                socket.emit('quiz-joined-error', 'an error occured while joining the session')
            }
        })

        socket.on('lobby-admin-move-player', (data) => {
            console.log('[SERVER] - Demande de move');
            const map = onlineManager.getMap()
            for (const [sId, profile] of map.entries()) {
                if (profile.id === data.profile.id) {
                    console.log('[SERVER] - Demande de move, PLAYER TROUVE', data);
                    io.to(sId).emit('client-game-move', { code: data.sessionId })
                }
            }
        })

        // LEAVE SESSION
        socket.on('leave-session', (data) => {
            console.log('[SERVER] leave-session received')

            const hasleaved = multiplayerQuizManager.leaveSession(data.profile.id, data.sessionId)

            if (hasleaved) {
                console.log('[SERVER] leave-session-success emitted')
                socket.emit('leave-session-success', 'session has been leaved successfully')

                console.log('[SERVER] player-has-leaved-session emitted')
                multiCast('player-has-leaved-session', data.sessionId, data);

                const adminSocket = multiplayerQuizManager.getAdminSocketId(data.sessionId);
                io.to(adminSocket).emit('player-has-leaved-session', data)
            } else {
                console.log('[SERVER] leave-session-error emitted')
                socket.emit('leave-session-error', 'an error occured while leaving the session')
            }
        })


        // KICK A PLAYER FROM A SESSION

        socket.on('kick-player', (data) => {
            console.log("[SERVER] kick-player received");

            const socketId = multiplayerQuizManager.getSocketIdFromPlayerId(data.profile.id)

            if (socketId) {
                console.log("[SERVER] kicked emitted")
                io.to(socketId).emit('kicked', {
                    sessionId: data.sessionId,
                });

                multiplayerQuizManager.leaveSession(data.profile.id, data.sessionId)

                multiplayerQuizManager.unregisterPlayerSocket(data.profile.id);

                console.log("[SERVER] kick-player-success emitted");
                socket.emit('kick-player-success', 'Player has been kicked successfully');
                multiCast('kick-player-session', data.sessionId, data.profile.id) // socket.broadcast.emit('kick-player-session', data.profile.id);
            } else {
                console.log("[SERVER] kick-player-error emitted");
                socket.emit('kick-player-error', 'Player not found or not connected');
            }
        });

        socket.on('leave-admin', (data) => {
            console.log('[SERVER] leave-admin received')
            multiCast('kicked', data.sessionId, { sessionId: data.sessionId })
            multiplayerQuizManager.deleteSession(data.sessionId)
        })


        socket.on('start-session', (data) => {
            console.log('[SERVER] start-session received')
            const hasStarted = multiplayerQuizManager.startSession(data.sessionId)
            if (hasStarted) {
                const question = multiplayerQuizManager.getQuestion(0, data.sessionId)
                console.log('[SERVER] session started successfully')
                multiCast('quiz-started', data.sessionId, { sessionId: data.sessionId, question })
            } else console.log('[SERVER] quiz-started-error')
        })

        socket.on('next-question-from-admin', (data) => {
            console.log('[SERVER] next-question-from-admin received');
            result = multiplayerQuizManager.nextQuestion(data.sessionId)
            if (result.hasChanged) {
                console.log('[SERVER] next-question emitted')
                socket.emit('next-question', { sessionId: data.sessionId, questionId: result.currentQuestionId })
                multiCast('next-question', data.sessionId, { sessionId: data.sessionId, questionId: result.currentQuestionId })
            }
            else {
                console.log('[SERVER next-question error')
            }
        })

        socket.on('submit-answer', (data) => {
            console.log('[SERVER] submit-answer received');

            const isAnswerValid = multiplayerQuizManager.checkAnswerValidity(data.sessionId, data.profileId, data.answer);
            if (isAnswerValid) {

                if (data.answer.isCorrect) {
                    console.log('[SERVER] correct-answer emitted');
                    socket.emit('correct-answer', ({ sessionId: data.sessionId }));
                }
                else {
                    console.log('[SERVER] correct-answer emitted');
                    socket.emit('wrong-answer', { sessionId: data.sessionId })
                };
                const adminSocket = multiplayerQuizManager.getAdminSocketId(data.sessionId);
                console.log('[SERVER] player-has-answered emitted');
                io.to(adminSocket).emit('player-has-answered', data)
                multiCast('player-has-answered', data.sessionId, data)
            } else console.log('[SERVER] invalid answer error ')
        })

        socket.on('all-player-has-answered', (data) => {
            console.log('[SERVER] all-player-has-answered received')
            multiCast('every-one-answered', data.sessionId, data)
        })

        socket.on('disconnect', () => {
            console.log(`[SERVER] socket ${socket.id} disconnected`)



            // Trouver le playerId lié à ce socketId
            let playerId = null
            for (const [id, sId] of multiplayerQuizManager.getPlayerSocketMap()) {
                if (sId === socket.id) {
                    playerId = id
                    break
                }
            }

            const profile = onlineManager.getPlayerFromSocketId(socket.id)
            if (profile) socket.broadcast.emit('lobby-disconnect', profile)


            if (playerId) {
                multiplayerQuizManager.unregisterPlayerSocket(playerId);
                console.log(`[SERVER] Player ${playerId} unregistered from socket`);
                console.log("[SERVER] player-disconnected emitted");
                socket.broadcast.emit("player-disconnected", { profileId: playerId });
            }

            onlineManager.removePlayerBySocketId(socket.id)

        });



    });


    function multiCast(event, sessionId, data = {}) {
        try {
            const players = multiplayerQuizManager.getPlayersFromSession(sessionId)
            console.log(players)
            if (players) {
                players.forEach((player) => {
                    const socketId = multiplayerQuizManager.getSocketIdFromPlayerId(player.id);
                    if (socketId) {
                        console.log("[SERVER]", event, "emitted")
                        io.to(socketId).emit(event, data)
                    }
                })
            }
        } catch (err) {
            console.log('[SERVER] - ', err)
        }

    }
})
