const path = require('path')
const { setup: setupServer, teardown: teardownServer } = require('jest-dev-server')

const isCI = process.env.CI === 'true'

async function setup(jestConfig = {}) {
  try {
    await fs.mkdir(path.join(__dirname, '../artifacts'))
  } catch {}

  if (isCI) {
    await setupServer({
      command: 'yarn start',
      launchTimeout: 120e3,
      port: 8080,
      waitOnScheme: {
        resources: ['http-get://localhost:8080/']
      }
    })
  }
}

async function teardown(jestConfig = {}) {
  if (isCI) {
    await teardownServer()
  }
}

module.exports = { setup, teardown }