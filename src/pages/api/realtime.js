import { Server } from 'socket.io'

export default function socketHandler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, { maxHttpBufferSize: 1e9 })
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on("room", msg => {
                socket.join(msg.room_id);
            });
            
            socket.on("message", msg => {
                socket.to(msg.room_id).emit("message", msg);
            });
        });
    }
    res.end()
}
