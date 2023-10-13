// Libraries
import React, { useEffect } from 'react';
import { Button, Progress } from "@chakra-ui/react";
import styles from "styles/yams.module.css"
// Components (Internal)
import LinkIcon from 'components/Icons/LinkIcon';
import BackIcon from 'components/Icons/BackIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';

// Components (External)
import { toast } from 'react-toastify';

// Hooks (Exteneral)
import { useRouter } from 'next/router';

// Hooks (Internal)
import useLinkExchangeMutations from 'mutations/farming/useLinkExchangeMutations';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';

// Internal
import { Room } from 'pages/farming/[room]';
import { ProgressBar } from 'react-toastify/dist/components';
import { extractDexExchangeEntries, stripObjOfNonVolume, sumValues } from '../../utils/points';
import classNames from 'classnames';
import rooms from 'utils/config/rooms';
import Link from 'next/link';

const LinkingScreen: React.FC<{room: Room}> = ({room}) => {
   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // none || linking || waiting || completed
   const [publicKey, setPublicKey] = React.useState("")
   const [secretKey, setSecretKey] = React.useState("")
   const [apiPass, setApiPass] = React.useState("")
   const [isLoading, setLoading] = React.useState(false)
   const [volume, setVolume] = React.useState(0)
   const [roomData, setRoomData] = React.useState<Room | null>(null)
   useEffect(() => {
      if (room) 
         setRoomData(rooms.find(r => r.name === room.name)!);
   }, [room])
   /* ================================== hooks ================================== */
   const router = useRouter();
   const linkExchangeMutation = useLinkExchangeMutations();
   const userFarmingQuery = useUserFarmingQuery();

   /* ================================== useEffect ================================== */
   useEffect(() => {
      if (!room) {return}

      const exchangeKey = (room.exchange_id).toLowerCase()

      console.log(userFarmingQuery.data)
      console.log(room)
      if (userFarmingQuery.data){
         console.log("farming data", userFarmingQuery.data)

         let linkStatus = userFarmingQuery.data.volume[`${exchangeKey}_status`]
         const linkVolume = userFarmingQuery.data.volume[exchangeKey]

         console.log({linkStatus})
         console.log({linkVolume})

         // if (Number(linkVolume) > 0){
            if (room.exchange_id == "Binance") {
               setVolume(  
                  Number( // Combine Binance futures and spot
                     Number(userFarmingQuery.data.volume["binance"]) +
                     Number(userFarmingQuery.data.volume["binancecoinm"])
                  )
               )
            } else if (room.exchange_id == "GMX") {
               setVolume(  
                  Number( // Combine Binance futures and spot
                     Number(userFarmingQuery.data.volume["gmx_arbitrum"]) +
                     Number(userFarmingQuery.data.volume["gmx_avalanche"])
                  )
               )
               linkStatus = userFarmingQuery.data.volume[`gmx_status`]
            } else if (room.exchange_id == "SNX") {
               setVolume(Number(userFarmingQuery.data.volume["synthetix_optimism"]))
               linkStatus = userFarmingQuery.data.volume[`synthetix_status`]
            } else if (room.exchange_id == "DYDX") {
               setVolume(Number(userFarmingQuery.data.volume["dydx_ethereum"]))
               linkStatus = userFarmingQuery.data.volume[`dydx_status`]
            } else if (room.exchange_id == "Spot Dex") {
               const dexVolumes : Record<string, any> = stripObjOfNonVolume(extractDexExchangeEntries(userFarmingQuery.data.volume))
               const total = sumValues(dexVolumes)
               console.log(total)
               setVolume(Number(total))
               linkStatus = userFarmingQuery.data.volume[`dex_status`]
            } else {
               setVolume(Number(Number(linkVolume).toFixed(2)))
            }
            
            
         // } else
         if (linkStatus === "processing" || linkStatus === "queued"){ // TODO: Switch this to whatever the state is meant to be
            setStatus("waiting")
         } else if (linkStatus === "success") {
            setStatus("completed")
         } else if (linkStatus === "failed" && linkVolume >= 0) {
            setStatus("completed")
         } else if (linkStatus === "failed") {
            setStatus("failed")
         } else {
            setStatus("none")
         }
         
      }

   },[userFarmingQuery.data])
   /* ================================== functions ================================== */
   async function handleSubmit() {
      setLoading(true);
      if (publicKey.length === 0) {
         toast.error("Please enter a public key.");
         setLoading(false)
         return;
      }
      else if (secretKey.length === 0) {
         toast.error("Please enter a secret key.");
         setLoading(false)
         return;
      }

      linkExchangeMutation.mutate({
         exchange: room.exchange_id.toLowerCase(),
         api_key: publicKey,
         secret_key: secretKey,
         api_pass: room.needsApiPass ? apiPass : '',
         type: room.type
      }, {
            onSettled: (data, error, variables, context) => {
               if (error){
                  setStatus("linking")
                  setLoading(false);
                  if (error?.message) {
                     toast.error(JSON.stringify(error.message));
                  }
                  else {
                     toast.error(JSON.stringify(error));
                  }
               }else{
                  setStatus("waiting");
                  setLoading(false);
                  userFarmingQuery.refetch()
               }
            }
         });
   }

   return (
     <div className={classNames("px-8 sm:px-0 flex flex-col relative justify-center items-center bg-primary-light gap-5 text-black", styles.boxIndent)}
         style={{height: 'calc(100vh - 200px)', borderRadius: '20px', margin:"0 20px 20px 20px"}}>
         {roomData && roomData.guide && 
            <Link className={classNames(`flex items-center justify-center h-14 px-4 gap-3 absolute top-0 right-0 mt-4 mr-4
            rounded-2xl flex-shrink-0 text-2xl`, styles.boxIndent)}
            href={roomData.guide || ""} target="blank">
               📔
            </Link>
         }
         {/* Icon (Link || completion || waiting(add spinner)) */}
         {(status === "none" || status === "linking") && <LinkIcon />}
         {(status === "processing") && <Progress />}
         {(status === "completed") && <CompleteIcon />}

         {/* Title (link) */}
         <h1 className="tg-title-h1 text-black text-5xl font-black">
            {status === "none" ? `Link to ${room ? room.exchange_id : ""}` : ""}
            {status === "linking" ? "Setup link" : ""}
            {status === "waiting" ? "Processing your trading volume..." : ""}
            {status === "completed" ? "Linked" : ""}
            {status === "failed" ? `It's taking longer than usual to connect to ${room.exchange_id}, we're investigating. Your submission time was recorded.` : ""}
            
         </h1>
         {/* description (link your api keys || Your api keys may take some time) */}
         <h2 className="text-sm font-medium text-black text-center max-w-sm">
            {status === "none" && "Link your trading account"}
            {status === "waiting" &&  "Your trading data may take some time to update. Check back in ~1hr."}
            {status === "waiting" &&  " We have recorded the time of your submission."}
            {status === "completed" && "Your volumes are linked to your voting account"}
         </h2>
         {/* Link button (hide when linking) */}
         {status === "none" &&
            <button
               className={classNames("text-black bg-primary rounded-3xl py-2 px-4",
                styles.primaryButtonShadow)}
               onClick={() => setStatus("linking")}
            >
               Link
            </button>
         }
         {status === "waiting" &&
            <button
               className={classNames("text-black bg-primary rounded-3xl py-2 px-4",
               styles.primaryButtonShadow)}
               onClick={() => {
                     router.push("/farming")
                   }
               }
            >
               Done
            </button>
         }
          {status === "linking" && !room.dex &&
            <div className="gap-8 flex flex-col">
               <div className="relative max-w-xs w-full ">
                  <p className="absolute top-0 text-xs text-black">API PUBLIC KEY</p>
                  <div className="mt-5 relative">
                     <input
                        type="text"
                        className={classNames("text-black bg-transparent rounded-3xl py-2 pr-16 pl-4 w-full focus:outline-none",
                        styles.inputIndent)}
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                     />
                  </div>
               </div>
               <div className="relative max-w-xs w-full mt-[-15px]">
                  <p className="absolute top-0 text-xs text-black">API SECRET KEY</p>
                  <div className="mt-5 relative">
                     <input
                        type="text"
                        className={classNames("text-black bg-transparent rounded-3xl py-2 pr-16 pl-4 w-full focus:outline-none",
                        styles.inputIndent)}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        />
                  </div>
               </div>

               {/* need api pass */}

               {  room.needsApiPass ?
                  <div className="relative max-w-xs w-full mt-[-15px]">
                     <p className="absolute top-0 text-xs text-black">API PASS</p>
                     <div className="mt-5 relative">
                        <input
                           type="text"
                           className={classNames(`bg-primary-light text-black rounded-3xl py-2 pr-16 pl-4 w-full focus:outline-none`,
                           styles.inputIndent)}
                           value={apiPass}
                           onChange={(e) => setApiPass(e.target.value)}
                           />
                     </div>
                  </div> : ''
               }

            </div>
         }
        {(status === "linking") &&
            <div className="flex flex-row gap-4">

               {/* Button */}
               <Button
                  height="42px"
                  isLoading={isLoading}
                  loadingText='Submitting'
                  className="!text-black !bg-primary !rounded-3xl !py-2 !px-4 !font-normal"
                  background="primary"
                  variant="custom"
                  onClick={() => {
                     handleSubmit()
                   }}
                  disabled={isLoading || (publicKey.length === 0 || secretKey.length === 0 )}
               >Submit</Button>
            </div>
         }
         {status === "completed" &&
           <div className="flex flex-row items-center gap-10">
              <div className="flex flex-col justify-center items-center">
                 <p className="text-sm font-bold">Calculated volume</p>   
                 <p className="text-lg font-black">{volume > 0 ? `$${volume.toLocaleString()}` : '$0'}</p>
              </div>
             
              {/* <div className="flex flex-col justify-center items-center">
                 <p className="text-sm font-bold">Available tokens:</p>   
                 <p className="text-base font-black">{}</p>
              </div> */}
          </div>}
          {status === "waiting" || status === "completed" &&
            <div className="flex flex-row gap-4">              
               {/* Button */}
               <button
                  className={classNames("text-black bg-primary rounded-3xl py-2 px-4"
                  , styles.primaryButtonShadow)}
                  onClick={() => {
                     router.push("/farming")
                   }
                  }
               >Done</button>
            </div>
         }
      </div>
   );
}

export default LinkingScreen;
