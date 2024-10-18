'use client'
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RocketIcon } from "@radix-ui/react-icons"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// On importe les données du contrat
import { contractAddress, contractAbi } from '@/constants'

// On importe les éléments de Wagmi qui vont nous permettre de :
/*
useReadContract : Lire les données d'un contrat
useAccount : Récupérer les données d'un compte connecté à la DApp via RainbowKit
useWriteContract : Ecrire des données dans un contrat
useWaitForTransactionReceipt : Attendre que la transaction soit confirmée (équivalent de transaction.wait() avec ethers)
*/
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const SimpleStorage = () => {
    // On récupère l'adresse connectée à la DApp
    const { address } = useAccount();

    // Un State pour stocker le nombre de l'input
    const [number, setNumber] = useState(null);

    const { data: numberGet, error: getError, isPending: getIsPending, refetch } = useReadContract({
        // adresse du contrat
        address: contractAddress,
        // abi du contrat
        abi: contractAbi,
        // nom de la fonction dans le smart contract
        functionName: 'retrieve',
        // qui appelle la fonction ?
        account: address
    })

    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        
    });

    // Lorsque l'utilisateur clique sur le bouton set
    const setTheNumber = async() => {
        // alors on écrit vraiment dans le contrat intelligent (fonction store du contrat)
        writeContract({ 
            address: contractAddress, 
            abi: contractAbi,
            functionName: 'store', 
            args: [number], 
        }) 
    }

    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = 
    useWaitForTransactionReceipt({ 
        hash,
    })

    const refetchEverything = async() => {
        await refetch();
    }

    useEffect(() => {
        if(isSuccess) {
            refetchEverything();
        }
        if(errorConfirmation) {
            
        }
    }, [isSuccess, errorConfirmation])

    return (
    <div className="flex flex-col w-full">
        <h2 class="mb-4 text-4xl">Get</h2>
        <div className="flex">
            {/* Est ce qu'on est en train de récupérer le nombre ? */}
            {getIsPending ? (
                <div>Chargement...</div>
            ) : (
                <p>The number in the Blockchain : <span className="font-bold">{numberGet?.toString()}</span></p>
            )}
        </div>
        <h2 class="mt-6 mb-4 text-4xl">Set</h2>
        <div direction="flex flex-col w-full">
            {hash && 
                <Alert className="mb-4 bg-lime-200">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Transaction Hash: {hash}
                    </AlertDescription>
                </Alert>
            }
            {isConfirming && 
                <Alert className="mb-4 bg-amber-200">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Waiting for confirmation...
                    </AlertDescription>
                </Alert>
            }
            {isSuccess && 
                <Alert className="mb-4 bg-lime-200">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Transaction confirmed.
                    </AlertDescription>
                </Alert>
            }
            {errorConfirmation && (
                <Alert className="mb-4 bg-red-400">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {(errorConfirmation).shortMessage || errorConfirmation.message}
                    </AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert className="mb-4 bg-red-400">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {(error).shortMessage || error.message}
                    </AlertDescription>
                </Alert>
            )} 
        </div>
        <div className="flex">
            <Input placeholder='Your number' onChange={(e) => setNumber(e.target.value)} />
            <Button variant="outline"disabled={setIsPending} onClick={setTheNumber}>{setIsPending ? 'Setting...' : 'Set'}</Button>
        </div>
    </div>
  )
}

export default SimpleStorage