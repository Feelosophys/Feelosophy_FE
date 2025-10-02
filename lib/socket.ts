import { io, Socket } from 'socket.io-client';

interface NewCommentData {
    postId: string;
    comment: {
        _id: string;
        content: string;
        author: {
            _id: string;
            name: string;
            avatar?: string;
        };
        createdAt: string;
    };
}

interface NewReactionData {
    postId: string;
    reaction: {
        _id: string;
        type: string;
        user: {
            _id: string;
            name: string;
        };
    };
}

class SocketManager {
    private socket: Socket | null = null;
    private token: string | null = null;

    connect(token: string) {
        if (this.socket && this.socket.connected && this.token === token) {
            return this.socket;
        }

        if (this.socket) {
            this.socket.disconnect();
        }

        this.token = token;
        this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
            auth: {
                token: token
            },
            transports: ['websocket'],
            upgrade: true
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.token = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    joinForum(forumId: string) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('join-forum', forumId);
        }
    }

    leaveForum(forumId: string) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('leave-forum', forumId);
        }
    }

    onNewComment(callback: (data: NewCommentData) => void) {
        if (this.socket) {
            this.socket.on('new-comment', callback);
        }
    }

    onNewReaction(callback: (data: NewReactionData) => void) {
        if (this.socket) {
            this.socket.on('new-reaction', callback);
        }
    }

    offNewComment() {
        if (this.socket) {
            this.socket.off('new-comment');
        }
    }

    offNewReaction() {
        if (this.socket) {
            this.socket.off('new-reaction');
        }
    }
}

export const socketManager = new SocketManager();