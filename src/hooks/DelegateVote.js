import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "./utils";
import { getProvider } from "./constants/providers";
import { getProposalsContract } from "./constants/contracts";
import { useCallback } from "react";

export const useDelegateVote = async (address) => {

    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();


    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = getProposalsContract(signer);
    
        try {
            const transaction = await contract.delegate(address);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();
    
            console.log("receipt: ", receipt);
    
            if (receipt.status) {
                return console.log("vote successfull!");
            }
    
            console.log("vote failed!");
        } catch (error) {
            console.log(error);
            let errorText;
            if (error.reason === "You already voted.") {
                errorText = "You have not right to vote";
            } else if (error.reason === "Self-delegation is disallowed.") {
                errorText = "You cannot delegation yourself";
            } else if(error.reason === "Found loop in delegation."){
                errorText = "You cannot delegate the address that delegated you";
        }
             else {
                errorText = "An unknown error occured";
            }
    
            console.error("error: ", errorText);
        }

    },[address, chainId, walletProvider])
   
    }
    
