const onlinePlayers = new Map() // socket.id -> player

export function addPlayer(socketId, player) {
  console.log('[ONLINE-MANAGER] - A player is now connected')
  onlinePlayers.set(socketId, player) // Utilise .set() pour une Map
  console.log(onlinePlayers.values())

  return true
}

export function removePlayerBySocketId(sId) {
  console.log('[ONLINE-MANAGER] - A player disconnect :', sId)
  return onlinePlayers.delete(sId) // Supprime l'entrée de la Map
}

export function removePlayerById(id) {
  try {
    for (const [socketId, player] of onlinePlayers.entries()) {
      if (player.id === id) {
        onlinePlayers.delete(socketId)
        return true
      }
    }
  } catch (err) { console.log(err); return false }

}

export function getMap() {
  return onlinePlayers
}

export function getOnlinePlayers() {
  return Array.from(onlinePlayers.values())
}

export function getPlayerFromSocketId(socketId) {
  return onlinePlayers.get(socketId);
}
