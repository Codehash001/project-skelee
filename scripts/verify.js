require ('@nomiclabs/hardhat-etherscan')
const hre = require( 'hardhat')

const _initBaseURI='ipfs://bafybeiekw4svr3jn2romogzecdmx4xz2khz3vfih3eaxfrvsjbkmknod6u/'


async function main() {

  await hre.run('verify:verify', {
    address: '0x1682C9098b7C1039868eDBD3b2d66DB97c4cA985',
    constructorArguments: [_initBaseURI]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
