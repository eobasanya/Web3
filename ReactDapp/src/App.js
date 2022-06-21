import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';
//react styles 
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'


const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const tokenAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

function App() {
  const isBackgroundRed = true;
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  
  // input use state value here to update and improve UI. 
  async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  
  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance:", balance.toString());
    }
  }
  
 async function sendCoins() {
   if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log('Coins successfully sent! $', amount);
      console.log('Coins successfully sent to', userAccount);
    }
}



  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data:', data)
      } catch (err) {
        console.log("Error:", err)
      }


    }

}
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }

    
    
}

  
  return (
    <div className="App">
      
      <header className="App-header">
        <Button variant="contained" size="large" onClick={getBalance}>Get Balance</Button>
        <br />
        <Button variant="contained" size="large" onClick={fetchGreeting}>Current Employee </Button>
        <br />
       <br />
        <Box
          component="form"
          sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off">
          <TextField id="filled-basic" onChange={e => setGreetingValue(e.target.value)} placeholder="Enter Your Name" value={greeting} variant="filled"/>
        </Box>
        <br />
         <Button variant="contained" size="large" onClick={setGreeting}>Clock - In</Button>
        <br />
        
        
        
        
        <Box
          component="form"
          sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off">
          <TextField id="filled-basic" onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" variant="filled" />
        </Box>
        
        <br />
        <Box
          component="form"
          sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off">
          <TextField id="filled-basic" onChange={e => setAmount(e.target.value)} placeholder="Amount" variant="filled"/>
        </Box>
        <br />
        <Button variant="contained" size="large" onClick={sendCoins}>Pay Employee</Button>
        <br />
        
      </header>
      
    </div>
    
  );
}

export default App;
