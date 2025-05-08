import mongoose from 'mongoose';

import { Password } from '../services/password';

// Interface describing the properties required to create new User
interface UserAttrs {
  email: string;
  password: string;
}

// Interface describing the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface describing the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Mongoose schema for User
// The schema defines the structure of the User document in MongoDB
// and includes validation rules for the fields
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  // toJSON option is used to customise the JSON representation of the document
  // The transform function modifies the output by adding an 'id' field
  // and removing the '_id', 'password', and '__v' fields (will do own versioning)
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

// The pre-save hook hashes the password before saving the document
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  // done is a callback function that signals that the pre-save hook is complete
  done(); 
});

// The build method is a static method that creates a new User instance
// with the specified attributes
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// The User model is created using the userSchema and the UserModel interface
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
