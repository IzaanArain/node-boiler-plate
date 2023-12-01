const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
      default: null,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    basics: {
      name: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      dob: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      gender: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      stageOfLife: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      religion: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      city: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
    },
    career: {
      school: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      job: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      company: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      income: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
    },
    physical: {
      height: {
        type: String,
        required: false,
        trim: true,
        default: null,
      }, 
      weight: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      race: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      eyeColor: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      hairColor: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      bodyType: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
    },
    personality: {
      personalityType: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      nightMorning: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      introvertedExtroverted: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      favEmojis: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      idealRelationShipD8: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      idealfriendShipD8: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      friendShipIntent: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      relationShipIntent: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
    },
    theTea: {
      interest: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      recreationalSubstances: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      music: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      tv: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      comedian: {
        type: Array,
        required: false,
        trim: true,
        default: [],
      },
      sportTeam: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      citiesVisited: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      politics: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      sexuality: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      lookingForRoomMates: {
        type: String,
        required: false,
        trim: true,
        default: null,
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
        default: 'Point'
      },
      address: {
        type: String,
        default: null
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]
      },
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    imageName: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    otherImages: {
      type: Array,
      required: false,
      trim: true,
      default: [],
    },
    otp: {
      type: Number,
      required: false,
      trim: true,
      default: null,
    },
    notification: {
      type: String,
      required: false,
      trim: true,
      default: "on",
    },
    stripeId: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    block: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Number,
      trim: true,
      default: 0,
    },
    isForget: {
      type: Number,
      trim: true,
      default: 0,
    },
    isProfileCompleted: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: null
    },
    searchCount: {
      type: Number,
      trim: true,
      default: 0,
    },
    user_social_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_social_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    isDeleted: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, process.env.secret_Key);
  user.token = token;
  await user.save();
  return token;
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};
userSchema.index({ location: '2dsphere' });
mongoose.model("Users", userSchema);
