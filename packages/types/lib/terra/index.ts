import { SendOptions } from '../chain'

export interface InputTransaction {}

export interface TerraSendOptions extends SendOptions {
  messages?: any[]
}
