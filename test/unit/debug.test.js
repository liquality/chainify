/* global describe, it */

const { expect } = require('chai')

const dbg = require('debug')
const { Client, Debug } = require('../../src')

describe('debug library', () => {
  it('should not add logs to the console.history if disabled', () => {
    const debug = Debug('test')
    debug('test')
    expect(console.history).to.equal(undefined)
  })

  it('should add logs to the console.history if enabled', () => {
    Client.debug('liquality:cal*')

    const debug = Debug('test')
    debug('test')
    expect(console.history.length).to.equal(1)

    dbg.disable()
  })
})
