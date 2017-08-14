const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: String,
    passwordHash: String,
    secrets: [
      {
        author: Boolean,
        secret: {
          type: Schema.Types.ObjectId,
          ref: "Secret"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.virtual("password").set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 12);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
