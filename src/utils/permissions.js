// for limited and defined permissions the config file for permission list and routes has been created for more advanced/ dynamic requirements db tables for permisions could be created

export const permissionsList = {
  system_admin: {
    user: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    artist: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    song: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    csv: {
      download: true,
      upload: true,
    },
  },
  super_admin: {
    user: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    artist: {
      create: false,
      list: true,
      update: false,
      delete: false,
    },
    song: {
      create: false,
      list: true,
      update: false,
      delete: false,
    },
    csv: {
      download: false,
      upload: false,
    },
  },
  artist_manager: {
    user: {
      create: false,
      list: false,
      update: false,
      delete: false,
    },
    artist: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    song: {
      create: false,
      list: true,
      update: false,
      delete: false,
    },
    csv: {
      download: true,
      upload: true,
    },
  },
  artist: {
    user: {
      create: false,
      list: false,
      update: false,
      delete: false,
    },
    artist: {
      create: false,
      list: false,
      update: false,
      delete: false,
    },
    song: {
      create: true,
      list: true,
      update: true,
      delete: true,
    },
    csv: {
      download: false,
      upload: false,
    },
  },
};

export const routeRoles = {
  "artists-list": ["system_admin", "super_admin", "artist_manager"],
  "add-user": ["system_admin", "super_admin"],
  "users-list": ["system_admin", "super_admin"],
  "edit-user": ["system_admin", "super_admin"],
  "add-artist": ["system_admin", "artist_manager"],
  "edit-artist": ["system_admin", "artist_manager"],
  "musics-list": ["system_admin", "super_admin", "artist_manager", "artist"],
  "add-music": ["system_admin", "artist"],
  "edit-music": ["system_admin", "artist"],
};
