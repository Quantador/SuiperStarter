import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from "axios";

function NewHome() {

    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios.get("http://localhost:8000/bets")
            .then((res) => {
                setBets(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            }
        )
    }, [campaigns])



  return (
    <div className="flexjustify-center items-center bg-base-200 " >
        <div>
            <Navbar />
        </div>
        <div>
            {loading ?     
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            :
                <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                    {campaigns.map((campaign, index) => (
                        <li key={index}>
                            <div className="card lg:card-side bg-base-100 shadow-xl">
                                <figure>
                                    <img
                                    src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                                    alt="Album" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">${campaing.name}</h2>
                                    <p>${campaign.description}</p>
                                    <div className="card-actions justify-end">
                                    <button className="btn btn-primary">More informations</button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            }
        </div>
    </div>
  )
}

export default NewHome