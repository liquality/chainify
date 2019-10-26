import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
import TransportWebBle from '@ledgerhq/hw-transport-web-ble'
import TransportU2F from '@ledgerhq/hw-transport-u2f'

export default (config = { useWebBle: false, useU2F: false }) => {
  if (config.useWebBle) return TransportWebBle
  if (config.useU2F) return TransportU2F

  return TransportWebUsb
}
