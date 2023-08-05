/* eslint-disable no-undef */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: '"users"',
      onUpdate: "cascade",
      onDelete: "cascade",
    },
    album_id: {
      type: "VARCHAR(50)",
      references: '"albums"',
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint(
    "user_album_likes",
    "unique_fk_user_id__album_id",
    "UNIQUE(user_id, album_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes", {});
};
