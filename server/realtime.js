import { Server as SocketIO } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getIO } from './globals.js';

const TOKEN_SECRET = process.env.NEXUS_TOKEN_SECRET || 'dev-secret';

const connectedUsers = new Map();

export function setupWebSocket(server) {
  const io = new SocketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, TOKEN_SECRET, { algorithms: ['HS256'] });
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.sub;
    connectedUsers.set(userId, socket.id);

    console.log(`[WS] User connected: ${userId}`);

    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`[WS] User disconnected: ${userId}`);
    });

    socket.on('subscribe', (channel) => {
      if (channel === 'notifications' || channel === 'tasks' || channel === 'approvals') {
        socket.join(channel);
        console.log(`[WS] User ${userId} subscribed to ${channel}`);
      }
    });

    socket.on('unsubscribe', (channel) => {
      socket.leave(channel);
      console.log(`[WS] User ${userId} unsubscribed from ${channel}`);
    });
  });

  return io;
}

export function emitNotification(userId, notification) {
  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
}

export function emitTaskUpdate(userId, task) {
  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit('task:update', task);
    io.to('tasks').emit('task:update', task);
  }
}

export function emitApprovalUpdate(userId, approval) {
  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit('approval:update', approval);
    io.to('approvals').emit('approval:update', approval);
  }
}

export function emitToChannel(channel, event, data) {
  const io = getIO();
  if (io) {
    io.to(channel).emit(event, data);
  }
}

export function getConnectedUsers() {
  return Array.from(connectedUsers.keys());
}

export default { setupWebSocket, emitNotification, emitTaskUpdate, emitApprovalUpdate, emitToChannel, getConnectedUsers };