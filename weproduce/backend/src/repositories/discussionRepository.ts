import { prisma } from "@/lib/prisma";

export const discussionRepository = {
  findPosts() {
    return prisma.discussionPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  },

  findPostById(id: string) {
    return prisma.discussionPost.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  },

  createPost(userId: string, title: string, content: string) {
    return prisma.discussionPost.create({
      data: {
        userId,
        title,
        content,
      },
      include: {
        user: {
          include: { profile: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  },

  findCommentsForPost(postId: string) {
    return prisma.discussionComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });
  },

  createComment(postId: string, userId: string, content: string) {
    return prisma.discussionComment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });
  },
};
