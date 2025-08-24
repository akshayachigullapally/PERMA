import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    trim: true
  },
  backgroundColor: {
    type: String,
    default: '#3B82F6'
  },
  textColor: {
    type: String,
    default: '#FFFFFF'
  }
}, {
  timestamps: true
});

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required for Google users
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'dark'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  links: [linkSchema],
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    monthlyViews: {
      type: Number,
      default: 0
    },
    monthlyClicks: {
      type: Number,
      default: 0
    }
  },
  achievements: [achievementSchema],
  achievementPoints: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'links.url': 1 });

export const User = mongoose.model('User', userSchema);
