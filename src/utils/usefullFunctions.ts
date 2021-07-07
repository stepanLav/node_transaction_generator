import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import { KeypairType } from '@polkadot/util-crypto/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { Keyring } from '@polkadot/keyring'

export function createArrayOfTransactions(slisedUserArray:any , extrinsic: SubmittableExtrinsicFunction, batch: any, ...params: any) {
    let faucetTxArray = []
    let faucetTxOneBatch = []

    for (let users of slisedUserArray) {
        params[1] = users.address
        const tx = extrinsic(...params)
        faucetTxOneBatch.push(tx)
    }
    faucetTxArray.push(batch(faucetTxOneBatch))
    return faucetTxArray
}

export function createKeyringFromMnemonic(cryptoType: KeypairType, mnemonic: string): KeyringPair {
    const cast = new Keyring({ type: cryptoType });
    const userName = 'test'
    return cast.addFromMnemonic(mnemonic, { name: userName })
}

export function makestring(length: number, onlyLetters=false) {
    let result = '';
    let characters: string
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
    if (onlyLetters) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}