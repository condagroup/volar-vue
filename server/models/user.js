const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    customerId: {
        type: String,
    },
    subscriptionItemId: {
        type: String,
    },
    maxTokens: {
      type: Number,
    },
    invoiceIds: {
      type: [String],
    },
    showTokenModal: {
      type: Boolean,
      default: true,
    },
    savedSummaryPrompt: [
      {
        summaryFormat: String,
        freeTextPrompt: String,
        wordCount: Number,
        writingStyle: String,
      },
    ],
    savedBlogPostPrompt: [
      {
        profession: String,
        freeTextPrompt: String,
        wordCount: Number,
        style: String,
        audience: String,
        topic: String,
      },
    ]
  },
    { timestamps: true }
  );
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;