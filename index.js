const app = require('./app') // the actual Express Application

const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})