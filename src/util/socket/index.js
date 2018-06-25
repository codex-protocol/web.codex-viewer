import io from 'socket.io-client'

import EventBus from '../eventBus'
import config from '../config'
import eventToastHandlers from './eventToastHandlers'

export default {

  socket: null,

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  },

  updateSocket(newAuthToken) {

    this.disconnect()

    // if newAuthToken is falsy, then just disconnect
    if (!newAuthToken) {
      return
    }

    this.socket = io(`${config.apiUrl}/?token=${newAuthToken}`, {
      transports: ['websocket'],
    })

    this.socket.once('connect', () => {

      this.socket.on('user-event', (event) => {

        console.info('socket event received:', event)
        EventBus.$emit(`socket:${event.name}`, event.data)

        const eventAction = eventToastHandlers[event.name]
        if (typeof eventAction === 'function') eventAction(event.data)

      })
    })
  },
}
