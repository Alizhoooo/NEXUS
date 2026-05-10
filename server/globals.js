const globals = {
  io: null,
  redis: null
};

export function setIO(io) {
  globals.io = io;
}

export function getIO() {
  return globals.io;
}

export function setRedis(client) {
  globals.redis = client;
}

export function getRedis() {
  return globals.redis;
}

export default globals;