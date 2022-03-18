import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.NFT_STORAGE_API_KEY

export async function storeAsset(NFTMetadata) {
    const client = new NFTStorage({ token: API_KEY })
    const metadata = await client.store(NFTMetadata)
    console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)

    return metadata.url;
}

