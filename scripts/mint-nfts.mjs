import {storeAsset} from "./store-asset.mjs";
import dotenv from 'dotenv'
import csvToJson from "convert-csv-to-json";
import fs from "fs";
dotenv.config()

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const METADATA_PATH = process.env.METADATA_PATH
const ROOT_DIRECTORY_IMAGES = process.env.ROOT_DIRECTORY_IMAGES


function getMetaData() {
    return csvToJson.getJsonFromCsv(METADATA_PATH);
}

async function formatMetaDataAttributes(metaData) {
    return {
        name: metaData.name,
        description: metaData.description,
        image: new File(
            [await fs.promises.readFile(ROOT_DIRECTORY_IMAGES+metaData.file)],
            metaData.file.split("/")[2],
            { type: 'image/png' }
        ),
        attributes: [
            {
                "trait_type" : "PRIMARY_ELEMENT",
                "value" : metaData.primaryElement
            },
            {
                "trait_type" : "SECONDARY_ELEMENT",
                "value" : metaData.secondaryElement
            },
            {
                "trait_type" : "ATTRIBUTE",
                "value" : metaData.attribute
            },
            {
                "trait_type" : "LEVEL",
                "value" : metaData.level
            },
        ]
    }
}

export async function mintNFT(contractAddress, metaDataURL) {
    const ExampleNFT = await ethers.getContractFactory("MetramonAi")
    const [owner] = await ethers.getSigners()
    await ExampleNFT.attach(contractAddress).mintNFT(owner.address, metaDataURL)
    console.log("NFT minted to: ", owner.address)
}

storeAsset()
    .then((metadataUrl) => mintNFT(CONTRACT_ADDRESS, metadataUrl))
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });