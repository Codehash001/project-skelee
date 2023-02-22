const hre = require('hardhat')

const _initBaseURI='ipfs://bafybeiekw4svr3jn2romogzecdmx4xz2khz3vfih3eaxfrvsjbkmknod6u/'

async function main() {

  // Deploy the contract
  const skll = await hre.ethers.getContractFactory('SKLL')
  const SKLL = await skll.deploy(
    _initBaseURI)
  await SKLL.deployed()

  console.log('SKLL deployed to:', SKLL.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
