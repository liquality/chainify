import { closeGanache, startGanache } from './ganache';

export async function startLocalNetworks() {
    await startGanache();
}

export async function stopLocalNetworks() {
    await closeGanache();
}
