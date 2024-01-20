import { useEffect, useState } from 'react'
import io from 'socket.io-client'


import { Button } from '@nextui-org/button';

import { BiUpload } from "react-icons/bi";

let socket

export default function Home() {
    const [roomID, setRoomID] = useState(Math.floor(100000 + Math.random() * 900000))
    const [uploading, setUploading] = useState("Larger files will take longer")
    const [disableOptions, setDisableOptions] = useState(uploading === "Uploading")

    async function socketInitializer() {
        await fetch('/api/realtime');
        socket = io();

        socket.on("connect", () => {
            socket.emit("room", {
                room_id: roomID
            });

            socket.on("message", msg => {
                if (msg.type === "received") {
                    setUploading("Sent successfully");
                }
            });
        });
    }


    useEffect(() => {
        socketInitializer()
    }, []);

    async function splitChunks(fileData) {
        let startPointer = 0;
        let endPointer = fileData.size;
        let chunks = [];
        while (startPointer < endPointer) {
            let newStartPointer = startPointer + 99000000;
            chunks.push(fileData.slice(startPointer, newStartPointer));
            startPointer = newStartPointer;
        }
        return chunks;
    }

    async function upload(file) {
        setUploading("Uploading")
        let blob_array = [];

        await Promise.all(
            (await splitChunks(file)).map(async (blob) => {
                blob_array.push(blob)
            })
        );

        let current_blob_count = 0
        let blob_chunk_count = blob_array.length

        for (let blob_chunk of blob_array) {
            current_blob_count++
            socket.emit("message", {
                room_id: roomID,
                type: "file",
                file_name: file.name,
                current_chunk_number: current_blob_count,
                total_chunk_amount: blob_chunk_count,
                file: blob_chunk
            });
        }
    }


    return (
        <main>
            <a className="fixed top-0 left-0 m-1" href="/">🡨</a>
            <div className="text-center mt-3">
                <p className="text-2xl">Code: <strong>{roomID}</strong></p>
            </div>

            <div className="h-screen flex items-center justify-center -mt-20">
                <label htmlFor="dropzone-file">
                    <div className={uploading === "Uploading" ? "cursor-wait cursor-loading" : "cursor-pointer"}>
                        <div className="flex flex-col items-center justify-center h-[12rem] w-[22rem] border border-default-400 rounded-xl text-center">
                            <div className="mb-2 text-sm">
                                <div className="flex flex-col items-center justify-center">
                                    <BiUpload className="w-8 h-8 text-default-500" />
                                </div>
                                <p className="font-semibold text-default-500">
                                    Click to upload
                                </p>
                                <p className="text-xs text-default-400">{uploading}</p>
                            </div>
                        </div>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={(e) => upload(e.target.files[0])} disabled={uploading === "Uploading"} />
                </label>
            </div>
        </main>
    );
}
