import redis from 'redis'
import { config } from '../../boot/index.js'

const client = redis.createClient({
  url: config.redisURL,
})

client.on("error", err => console.error("Redis Error:", err));

// Connect to Redis immediately
const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect()
  }
}

connectRedis()

export default client
