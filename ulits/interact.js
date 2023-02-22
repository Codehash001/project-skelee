const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
import { config } from '../dapp.config'

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
const contract = require('../artifacts/contracts/SKLL.sol/SKLL.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)


export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxSupply().call()
  return maxSupply
}

export const isPausedState = async () => {
  const paused = await nftContract.methods.paused().call()
  return paused
}

export const isPublicSaleState = async () => {
  const publicSale = await nftContract.methods.publicSale().call()
  return publicSale
}

export const getPublicsalePrice = async () => {
    const PublicsalePrice = await nftContract.methods.cost().call()
    return PublicsalePrice
}


//Set up public sale mint

export const publicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }
  const wallet =(window.ethereum.selectedAddress)
  const numberMinted = await nftContract.methods.numberMinted(wallet) .call()
  console.log('You have already minted : ' + numberMinted)
  console.log ('you are going to mint : ' + mintAmount)
  const AbleToMint = (config.maxMintAmount - numberMinted)

  if (AbleToMint <  mintAmount){
    return {
      success: false,
      status: '📌 You have already minted ' + numberMinted +' NFT/s ' +
       'You are able to mint only '+ AbleToMint +' more NFT/s ' 
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.publicSalePrice*mintAmount), 'ether')
    ).toString(16), // hex
    gas: String(25000 * mintAmount),
    data: nftContract.methods.publicSaleMint(mintAmount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}
