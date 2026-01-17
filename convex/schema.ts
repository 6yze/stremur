import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    pin: v.optional(v.string()),
    isAdmin: v.boolean(),
    color: v.string(),
    createdAt: v.number(),
  }),

  watchHistory: defineTable({
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    progress: v.number(),
    duration: v.number(),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaType", "mediaId"]),

  watchlist: defineTable({
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaType", "mediaId"]),
});
