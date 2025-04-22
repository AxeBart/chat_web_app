import KinshasaMap from "./KinshasaMap"
import { Beef, Egg, Fish, FishIcon, House, MapIcon, MessageCircle, Settings, Store, User, UserCircle } from "lucide-react"

export default function App() {
    return (
        <div className="">
            <Search />
            <Map />
            <Dock />
            <Rideau />
        </div>
    )
}

function Map() {
    return (
        <div>
            <KinshasaMap className="h-[100svh] w-[100svw] z-0" />
        </div>
    )
}

function Search() {
    return (
        <div className="w-svw fixed z-[1000] top-0 bg-linear-to-b from-violet-700 py-3">
            <div className="mx-5 bg-violet-100 rounded-4xl">
                <div className="">
                    <input type="text" className="placeholder:text-violet-700 px-4 py-3 rounded-full w-full outline-none" placeholder="Trouver un marchand" />
                </div>

                {/* <div className="h-32 bg-violet-400 rounded-b-4xl shadow-xl"></div> */}
            </div>

            <div className="suggest flex gap-2 pl-5 py-2 overflow-x-scroll" style={{

            }}>

                <span className="bg-violet-950 text-white px-4 py-2 rounded-full flex gap-2 font-bold">Poissons <FishIcon strokeWidth={2} /> </span>
                <span className="bg-violet-950 text-white px-4 py-2 rounded-full flex gap-2 font-bold">Viandes <Beef strokeWidth={2} /> </span>
                <span className="bg-violet-950 text-white px-4 py-2 rounded-full flex gap-2 font-bold">Volaille <Egg strokeWidth={2} /> </span>

            </div>
        </div>
    )
}

function Dock() {
    return (
        <div className="z-[1001] fixed bottom-0 px-5 w-full">
            <div className="flex justify-between bg-violet-950 py-3 px-5 shadow-2xl rounded-t-4xl text-violet-50 w-9/10 mx-auto">
                <div className=""><MapIcon size={30} /></div>
                <div className=""><MessageCircle size={30} /></div>
                <div className=""><Store size={30} /></div>
                <div className=""><UserCircle size={30} /></div>
            </div>
        </div>
    )
}

function Rideau(){
    return(
        <div className="z-[1004] p-80 bg-amber-300 absolute">
            test
        </div>
    )
}
