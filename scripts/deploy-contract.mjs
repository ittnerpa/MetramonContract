async function deployContract() {
    const MetramonContract = await ethers.getContractFactory("MetramonAi")
    const Metramon = await MetramonContract.deploy()
    await Metramon.deployed()
    // This solves the bug in Mumbai network where the contract address is not the real one
    const txHash = Metramon.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
}

deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });