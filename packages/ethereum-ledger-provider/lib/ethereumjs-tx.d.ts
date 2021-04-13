/**
 * This is empty module because `npm run test:unit` is conflicting this type definition with
 * the other version (v2) of this lib in ethereum-js-wallet-provider.
 *
 * The reason for this is that unit tests are compiled from the root and so are not able to handle
 * separate type definitions for the same library.
 * */
declare module 'ethereumjs-tx'
