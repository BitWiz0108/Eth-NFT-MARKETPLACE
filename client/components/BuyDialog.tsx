import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Web3Modal from "web3modal";
import Button from "./common/Button";
import { BigNumber, ethers } from "ethers";

interface Props {
  open: boolean;
  onClose: () => void;
  price: string;
  onBuy: () => void;
}

export const BuyDialog = ({ open, onClose, price, onBuy }: Props) => {
  const [balance, setBalance] = useState<string | undefined>();

  useEffect(() => {
    getBalance();
  }, []);
  async function getBalance() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.listAccounts();
    const userBalance = await provider.getBalance(accounts[0]);
    setBalance(userBalance.toString());
  }

  function getRemainingBalanceAfterPurchase() {
    let remaining: BigNumber;
    if (balance) {
      let bigBalance = ethers.utils.parseEther(balance);
      let itemPrice = ethers.utils.parseEther(price);
      remaining = bigBalance.sub(itemPrice);

      let rounded: any = ethers.utils.formatEther(remaining);
      rounded = Math.round(rounded * 1e4) / 1e4;
      let clean: any = ethers.utils.formatEther(String(rounded));
      clean = (+clean).toFixed(2);
      return clean;
    }
  }
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto " onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 transition bg-black opacity-70" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform shadow-homogen bg-background rounded-2xl">
              <Dialog.Title as="h2" className="text-2xl font-medium leading-6 text-white">
                Place a Bid
              </Dialog.Title>
              <div className="w-full h-0.5 my-8 bg-gray-500 rounded-full"></div>
              <div className="mt-4">
                <p className="font-semibold text-gray-500">
                  Your balance
                  <span className="float-right font-medium text-gray-200 font-inter">
                    {balance && Number(ethers.utils.formatEther(balance)).toFixed(2)} ETH
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-gray-500">
                  Price{" "}
                  <span className="float-right font-medium text-gray-200 font-inter">
                    {Number(ethers.utils.formatEther(price)).toFixed(2)} ETH
                  </span>
                </p>
              </div>
              <div className="w-full h-0.5 mt-6 bg-gray-500 rounded-full"></div>
              <div className="mt-8">
                <p className="font-semibold text-gray-500">
                  Remaining balance after purchase
                  <span className="float-right font-semibold text-white font-inter">
                    {balance && getRemainingBalanceAfterPurchase()} ETH
                  </span>
                </p>
              </div>
              <div className="flex justify-center mt-8 ">
                <Button onClick={() => onBuy()}>Buy</Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
