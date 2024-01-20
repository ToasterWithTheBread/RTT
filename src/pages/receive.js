import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import { Input } from "@nextui-org/react";
import { Button } from '@nextui-org/button';

import { BiCheck } from "react-icons/bi";

let socket

export default function Home() {
    const [roomID, setRoomID] = useState("")
    const [connected, setConnected] = useState(false)
    const [receivingFile, setReceivingFile] = useState(false)

    const [totalFiles, setTotalFiles] = useState(0)
    const [receivedFiles, setReceivedFiles] = useState(0)

    async function join() {
        if (roomID === "") {
            return;
        }

        let file_array = []

        await fetch('/api/realtime');
        socket = io();

        socket.on("connect", () => {
            socket.emit("room", {
                room_id: Number(roomID)
            });
            setConnected(true)

            socket.on("message", msg => {
                if (msg.type === "file") {
                    setReceivingFile(true)
                    setTotalFiles(msg.total_chunk_amount)
                    setReceivedFiles(msg.current_chunk_number)
                    file_array.push(msg.file)
                    if (msg.total_chunk_amount === file_array.length) {
                        setReceivingFile(false);
                        download(file_array, msg.file_name);
                        socket.emit("message", {
                            room_id: Number(roomID),
                            type: "received"
                        });
                        file_array = [];
                    }

                }
            });
        });
    }

    async function download(chunks, filename) {
        if (!chunks || chunks.length === 0) {
            return;
        }

        let combinedBlob = new Blob();

        for (let i = 0; i < chunks.length; i++) {
            combinedBlob = new Blob([combinedBlob, chunks[i]]);
        }

        const a = document.createElement('a');
        a.href = URL.createObjectURL(combinedBlob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    return (
        <main>
            <a className="fixed top-0 left-0 m-1" href="/">🡨</a>
            <div className="h-screen flex items-center justify-center">
                {!connected ? (
                    <>
                        <div className="w-[250px]">
                            <Input type="text" placeholder="Enter room code" value={roomID} onChange={(e) => setRoomID(Number(e.target.value))} />
                            <Button size="lg" color="primary" radius="md" fullWidth variant="shadow" className="mt-5" onClick={() => join()} startContent={<BiCheck />}>Join room</Button>
                        </div>


                    </>
                ) : (
                    <>
                        <p className="fixed bottom-0 right-0 m-1">{connected && roomID}</p>
                        <p className="fixed bottom-0 left-0 m-1 text-success">{connected && "Connected"}</p>


                        {receivingFile ? (
                            <p className="text-center">Receiving chunk {receivedFiles} out of {totalFiles}</p>
                        ) : (
                            <p className="text-center">Waiting to receive file...</p>
                        )}
                    </>
                )}

            </div>

        </main>
    );
}
