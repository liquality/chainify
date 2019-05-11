import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
import TransportWebBle from '@ledgerhq/hw-transport-web-ble'

export default (config = { useWebBle: false }) => {
  if (config.useWebBle) return TransportWebBle

  return TransportWebUsb
}
