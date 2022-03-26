import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
import csv from "csvtojson";

dotenv.config()

const METADATA_PATH = process.env.METADATA_PATH
const ROOT_DIRECTORY_IMAGES = process.env.ROOT_DIRECTORY_IMAGES
const API_KEY = process.env.NFT_STORAGE_API_KEY

function formatMetaDataAttributes(metaData, index) {
    return {
        name: "#" + (index+1) + " " + metaData.name,
        description: metaData.name + " in one out of thousands of generated metramons by an AI.",
        image: new File(
            [fs.readFileSync(ROOT_DIRECTORY_IMAGES+metaData.file)],
            metaData.file.split("/")[2],
            { type: 'image/png' }
        ),
        attributes: [
            {
                "trait_type" : "PRIMARY_ELEMENT",
                "value" : metaData['Primary Element']
            },
            {
                "trait_type" : "SECONDARY_ELEMENT",
                "value" : metaData['Secondary Element']
            },
            {
                "trait_type" : "ATTRIBUTE",
                "value" : metaData.Attribute
            },
            {
                "trait_type" : "LEVEL",
                "value" : metaData.Level
            },
        ]
    }
}

export async function storeAsset(NFTMetadata) {
    const client = new NFTStorage({ token: API_KEY })
    const metadata = await client.store(NFTMetadata)
    console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)

    return metadata.url;
}

csv().fromFile(METADATA_PATH)
    .then(async (metaData)=> {
        const metadataURL = []
        for (var index=0; index<300; index++) {
             await storeAsset(formatMetaDataAttributes(metaData[index], index)).then((url) => {
                metadataURL.push(url)
            })
            console.log("Store Asset: ", index)
        }
        fs.appendFileSync("IPFS_CID_NFT.json", JSON.stringify(metadataURL));
    })

