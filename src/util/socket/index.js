import io from 'socket.io-client'

import EventBus from '../eventBus'
import { apiUrl } from '../config'
import eventToastHandlers from './eventToastHandlers'

export default {

  socket: null,

  updateSocket(newAuthToken) {

    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = io(`${apiUrl}/?token=${newAuthToken}`, {
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
