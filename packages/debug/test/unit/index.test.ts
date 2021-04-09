/* eslint-env mocha */

import { expect } from 'chai'

import Debug from '../../lib'

const dbg = require('debug')

describe('debug library', () => {
  it('should not add logs to the console.history if disabled', () => {
    const debug = Debug('test')
    debug('test')
    expect((console as any).history).to.equal(undefined)
  })

  it('should add logs to the console.history if enabled', () => {
    dbg.enable('liquality:cal*')

    const debug = Debug('test')
    debug('test')
    expect((console as any).history.length).to.equal(2)

    dbg.disable()
  })
})
