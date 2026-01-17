import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWatchlist = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by addedAt descending
    return items.sort((a, b) => b.addedAt - a.addedAt);
  },
});

export const addToWatchlist = mutation({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", args.userId).eq("mediaType", args.mediaType).eq("mediaId", args.mediaId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new entry
    const id = await ctx.db.insert("watchlist", {
      userId: args.userId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      addedAt: Date.now(),
    });

    return id;
  },
});

export const removeFromWatchlist = mutation({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("watchlist")
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

export const isInWatchlist = query({
  args: {
    userId: v.id("users"),
    mediaId: v.number(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", args.userId).eq("mediaType", args.mediaType).eq("mediaId", args.mediaId)
      )
      .first();

    return !!existing;
  },
});
