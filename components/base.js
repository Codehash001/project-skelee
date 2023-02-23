import Image from 'next/image'
import { useState,useEffect } from "react"
import { initOnboard } from "../ulits/onboard"
import { config } from '../dapp.config'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Link} from 'react-scroll/modules';
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  publicMint          } from '../ulits/interact'

//REMEMBER TO ADD A LOGO

export default function Base () {
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')

  const [nav, setNav] = useState(false);

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      const isPublicSale = await isPublicSaleState()
      setIsPublicSale(isPublicSale)

      setMaxMintAmount(
        isPublicSale ? config.maxMintAmount : '0'
      )
      
      
    }

    init()
  }, [])
  
  useEffect( () => {
    const onboardData = initOnboard( {
      address: (address) => setWalletAddress(address ? address : ''),
      wallet: (wallet) => {
        if (wallet.provider) {
          window.localStorage.setItem('selectedWallet', wallet.name)
        } else {
          window.localStorage.removeItem('selectedWallet') }}
    }
    )
  setOnboard(onboardData)
  }, [])

  const previouslySelectedWallet = typeof window !== 'undefined' &&
  window.localStorage.getItem('selectedWallet')

useEffect(() => {
  if (previouslySelectedWallet !== null && onboard) {
    onboard.walletSelect(previouslySelectedWallet)
  }
}, [onboard, previouslySelectedWallet])

const handleNav = () => {
  setNav(!nav);
}

  const connectWalletHandler = async () => {
    const walletSelected = await onboard.walletSelect()
    if (walletSelected) {
      await onboard.walletCheck()
      window.location.reload(false)
    }
  }

  const connectWalletHandlerMobile = async () => {
    setNav(false)
    const walletSelected = await onboard.walletSelect()
    if (walletSelected) {
      await onboard.walletCheck()
      window.location.reload(false)
      
    }
  }

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }


  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  
  return (
    <>
    
    <div className='font-Gotham text-white w-screen h-screen flex flex-col items-center justify-start lg:px-20 px-6 py-6'>
      <h1 className='text-center font-medium text-lg'>SKELEE</h1>
      <div className='w-[700px] mt-8'>
      <p className='text-center text-sm'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet.
        <br/>
        <br/>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet.
      </p>
      </div>
      
      <h1 className='font-Akira font-bold tracking-widest uppercase text-5xl text-center mt-8'>MINT</h1>
      <h1 className='tracking-wide uppercase text-xl text-center'>Early access</h1>

      {/* minting engine */}
      <div className='w-[800px] flex flex-row items-center justify-between mt-6 filter backdrop-blur-lg p-4'>
        <div>
          <img src='/nft.gif'
          className='w-[400px] h-[400px]'/>
        </div>

        <div className='flex flex-col items-center justify-between w-full p-6'>
          <div className='flex justify-between w-full'>
            <h1 className='text-lg text-center uppercase'>New friends mint <br/> 02/24 11.00 - 22.30</h1>
            <h1 className='text-lg text-center uppercase'>early access mint <br/> 02/24 11.00 - 22.30</h1>
          </div>

          {/* countdown */}
          <div className='flex w-full justify-between'>
            <h1 className='text-2xl text-center'>02 <br/>HRS</h1>
            <h1 className='text-2xl text-center'>52 <br/>MINS</h1>
            <h1 className='text-2xl text-center'>02 <br/>SECS</h1>
          </div>

          <div className='flex justify-between w-full'>
            <h1 className='text-lg text-center'>Mint Price<br/>.25 ETH</h1>
            <h1 className='text-lg text-center'>Total Supply<br/>8,000</h1>
            <h1 className='text-lg text-center'>Reveal Time<br/>FEB 2023</h1>

          </div>

          <button className='px-6 py-3 bg-black rounded-lg'>Connect Wallet</button>

        </div>
      </div>
    </div>
    
    </>
  )
}

