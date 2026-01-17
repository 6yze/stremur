import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    pin: v.optional(v.string()),
    isAdmin: v.boolean(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      pin: args.pin,
      isAdmin: args.isAdmin,
      color: args.color,
      createdAt: Date.now(),
    });
    return userId;
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return false;

    // Check if this is the last admin
    if (user.isAdmin) {
      const admins = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("isAdmin"), true))
        .collect();
      if (admins.length <= 1) {
        throw new Error("Cannot delete the last admin user");
      }
    }

    // Delete all watch history for this user
    const watchHistory = await ctx.db
      .query("watchHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const entry of watchHistory) {
      await ctx.db.delete(entry._id);
    }

    // Delete all watchlist items for this user
    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const entry of watchlist) {
      await ctx.db.delete(entry._id);
    }

    // Delete the user
    await ctx.db.delete(args.userId);
    return true;
  },
});

export const validatePin = query({
  args: {
    userId: v.id("users"),
    pin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return false;

    // If user has no PIN set, always valid
    if (!user.pin) return true;

    // Compare PINs
    return user.pin === args.pin;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    pin: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Filter out undefined values
    const filteredUpdates: Record<string, string> = {};
    if (updates.name !== undefined) filteredUpdates.name = updates.name;
    if (updates.pin !== undefined) filteredUpdates.pin = updates.pin;
    if (updates.color !== undefined) filteredUpdates.color = updates.color;

    await ctx.db.patch(userId, filteredUpdates);
    return true;
  },
});
