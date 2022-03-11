export const assetCodeToDenom: Record<string, string> = {
    LUNA: 'uluna',
    UST: 'uusd',
};

export const denomToAssetCode: Record<string, string> = Object.keys(assetCodeToDenom).reduce((result, key) => {
    result[assetCodeToDenom[key]] = key;
    return result;
}, {} as Record<string, string>);

export const DEFAULT_GAS_ADJUSTMENT = 1.75;
