import 'setimmediate';
export * from './crypto';
export * from './hex';
export * as Math from './math';
export * from './string';
export * from './swap';

export function asyncSetImmediate() {
    return new Promise((resolve) => setImmediate(resolve));
}

export const retry = async <T>(method: () => Promise<T>, startWaitTime = 500, waitBackoff = 2, retryNumber = 5) => {
    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        try {
            const result = await method();
            if (result) {
                return result;
            }
            waitTime *= waitBackoff;
        } catch (err) {
            // throw error on last try
            if (i + 1 == retryNumber) {
                throw err;
            }
        } finally {
            await sleep(waitTime);
        }
    }
    return null;
};

export async function sleep(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
