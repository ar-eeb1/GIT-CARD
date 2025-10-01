"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef } from "react";


export default function Home() {
  const [username, setUsername] = useState("")
  const [name, setName] = useState()
  const [followers, setFollowers] = useState(null)
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState()
  const [email, setEmail] = useState("")
  const [qr, setQr] = useState("")
  const [iconSize, setIconSize] = useState(250)
  const cardRef = useRef(false)
  const emailRef = useRef()

  async function downloadCard() {
    const dataUrl = await toPng(cardRef.current)
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = 'card.png'
    link.click()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(username);
    let res = await fetch(`https://api.github.com/users/${username}`)
    let a = await res.json()

    setName(a.name)
    setFollowers(a.followers)
    setBio(a.bio)
    setAvatar(a.avatar_url)
    setQr(`https://github.com/${username}`)
    setEmail(a.email)
    setIconSize(50)
  }

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

      <div><h1 className="text-center text-7xl text-yellow-800 font-bold m-5">Create Your Git visiting Card</h1></div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={username}
          placeholder="Enter GitHub ID"
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Search
        </button>
      </form>
      <div className="flex items-center justify-center text-center w-[300px] flex-col rounded-lg bg-black  shadow-md  overflow-hidden " ref={cardRef}>
        <div className="w-full bg-gradient-to-r text-yellow-600 from-yellow-500 via-yellow-600 to-yellow-400 mb-2">.</div>
        {avatar && (
          <Image
            src={avatar}
            alt="GitProfile"
            width={120}
            height={120}
            className="rounded-full border border-white p-2 mb-4"
          />
        )}
        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-600 bg-clip-text text-transparent">{name}</h1>
        <h3 className="text-gray-100">Followers: {followers}</h3>
        <p className=" text-gray-100 m-2">{bio}</p>
        {
          emailRef.current?.checked && (
            <p className="text-gray-100 m-2">{email}</p>
          )
        }

        {qr && (
          <QRCodeCanvas
            value={qr}
            size={120}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
            className="rounded-xl m-3"
          />
        )}
        <lord-icon
          src="https://cdn.lordicon.com/acgiczyg.json"
          trigger="loop"
          delay="1500"
          state="in-reveal"
          colors="primary:#e8b730,secondary:#e88c30"
          style={{ width: `${iconSize}px`, height: `${iconSize}px`, transition: "all 0.5s ease-in-out" }}
        >
        </lord-icon>
      </div>
      <button onClick={downloadCard} className="bg-black text-sm text-white m-2 rounded-2xl pl-4 pr-4 cursor-pointer">Download PNG</button>
      <div className="flex justify-center items-center gap-2">

        <input type="checkbox" ref={emailRef} />
        <label>Include E-mail</label>
      </div>
    </div>


  )
}
