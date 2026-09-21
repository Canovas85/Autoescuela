const channelsByUser = new Map();

const sendEvent = (response, event, payload) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const registerNotificationChannel = (usuarioId, response) => {
  if (!channelsByUser.has(usuarioId)) {
    channelsByUser.set(usuarioId, new Set());
  }

  channelsByUser.get(usuarioId).add(response);
};

export const unregisterNotificationChannel = (usuarioId, response) => {
  const userChannels = channelsByUser.get(usuarioId);

  if (!userChannels) {
    return;
  }

  userChannels.delete(response);

  if (userChannels.size === 0) {
    channelsByUser.delete(usuarioId);
  }
};

export const pushNotificationEvent = (usuarioId, event, payload) => {
  const userChannels = channelsByUser.get(usuarioId);

  if (!userChannels || userChannels.size === 0) {
    return;
  }

  userChannels.forEach((response) => {
    sendEvent(response, event, payload);
  });
};

export const pushNotificationCreated = (notification) => {
  pushNotificationEvent(notification.usuarioId, "notification:created", {
    id: notification.id,
    tipo: notification.tipo,
    titulo: notification.titulo,
    createdAt: notification.createdAt,
  });
};

export const pushNotificationUpdated = (notification) => {
  pushNotificationEvent(notification.usuarioId, "notification:updated", {
    id: notification.id,
    leida: notification.leida,
    archivada: notification.archivada,
    readAt: notification.readAt,
    archivedAt: notification.archivedAt,
  });
};

export const pushNotificationsBulkUpdated = (usuarioId, payload) => {
  pushNotificationEvent(usuarioId, "notification:bulk-updated", payload);
};

export const openNotificationStream = (usuarioId, req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  registerNotificationChannel(usuarioId, res);

  sendEvent(res, "connected", {
    ok: true,
    timestamp: new Date().toISOString(),
  });

  const keepAlive = setInterval(() => {
    sendEvent(res, "ping", {
      timestamp: new Date().toISOString(),
    });
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAlive);
    unregisterNotificationChannel(usuarioId, res);
    res.end();
  });
};
