import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWatchHistory = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("watchHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by updatedAt descending
    const sorted = items.sort((a, b) => b.updatedAt - a.updatedAt);

    // Apply limit if provided
    if (args.limit) {
      return sorted.slice(0, args.limit);
    }

    return sorted;
  },
});

export const getWatchProgress = query({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("watchHistory")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", args.userId).eq("mediaType", args.mediaType).eq("mediaId", args.mediaId)
      )
      .first();
  },
});

export const updateWatchProgress = mutation({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    progress: v.number(),
    duration: v.number(),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if entry exists
    const existing = await ctx.db
      .query("watchHistory")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", args.userId).eq("mediaType", args.mediaType).eq("mediaId", args.mediaId)
      )
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        progress: args.progress,
        duration: args.duration,
        season: args.season,
        episode: args.episode,
        title: args.title,
        posterPath: args.posterPath,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new entry
    const id = await ctx.db.insert("watchHistory", {
      userId: args.userId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      progress: args.progress,
      duration: args.duration,
      season: args.season,
      episode: args.episode,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const deleteWatchHistory = mutation({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("watchHistory")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", args.userId).eq("mediaType", args.mediaType).eq("mediaId", args.mediaId)
      )
      .first();

    if (!existing) {
      return false;
    }

    await ctx.db.delete(existing._id);
    return true;
  },
});

export const clearWatchHistory = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("watchHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    return true;
  },
});
