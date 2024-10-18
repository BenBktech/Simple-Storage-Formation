import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
    return (
        <nav className="flex items-center justify-center p-10">
            <div className="grow">Logo</div>
            <div>
                <ConnectButton />
            </div>
        </nav> 
    )
}

export default Header