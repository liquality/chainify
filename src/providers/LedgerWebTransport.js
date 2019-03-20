import WebUSBTransport from '@ledgerhq/hw-transport-webusb'

class LedgerWebTransport extends WebUSBTransport {}

LedgerWebTransport.isWebUSBTransport = true

export default LedgerWebTransport
