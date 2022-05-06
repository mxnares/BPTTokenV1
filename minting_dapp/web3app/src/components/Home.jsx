import WalletBalance from "./WalletBalance";
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import BPTToken from '../artifacts/contracts/Token.sol/BPTToken.json';

// CHANGE THIS whenever you deploy 
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, BPTToken.abi, signer);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    };

    return (
        <div>
            <WalletBalance />

            <h1>Tree Huggers NFT Collection</h1>
                {Array(totalMinted + 1)
                    .fill(0)
                    .map((_, i) => (
                        <div key={i}>
                            <NFTImage tokenId={i} />
                        </div>
                    ))
                }
        </div>
    );
}

// change contentId and imageURI to your IPFS link (here we use Pinata to upload to IPFS)
function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmRdUjKfeXxuGREiz85VafUAVjhAgqCwHuDH4eNjfSWnL2';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
    //const imageURI = `img/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    };

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
    }

    return (
        <div>
            <img src={isMinted ? imageURI : 'img/placeholder.png'} ></img>
            <div>
                <h5>ID #{tokenId}</h5>
                {!isMinted ? (
                    <button onClick={mintToken}>
                        Mint
                    </button>
                ) : (
                    <button onClick={getURI}>
                        Taken! Show URI
                    </button>
                )}
            </div>
        </div>
    );

};

export default Home;