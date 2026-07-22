import { discussionRepository } from "@/repositories/discussionRepository";
import { ApiError } from "@/utils/apiResponse";

export const discussionService = {
  async getPosts() {
    const posts = await discussionRepository.findPosts();
    return posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.user.id,
        displayName: post.user.profile?.displayName ?? "Anonymous Member",
        avatarUrl: post.user.profile?.avatarUrl ?? null,
      },
      commentCount: post._count.comments,
    }));
  },

  async createPost(userId: string, title: string, content: string) {
    if (!title || !title.trim()) {
      throw ApiError.badRequest("Title is required");
    }
    if (!content || !content.trim()) {
      throw ApiError.badRequest("Content is required");
    }

    const post = await discussionRepository.createPost(userId, title.trim(), content.trim());
    return {
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.user.id,
        displayName: post.user.profile?.displayName ?? "Anonymous Member",
        avatarUrl: post.user.profile?.avatarUrl ?? null,
      },
      commentCount: post._count.comments,
    };
  },

  async getComments(postId: string) {
    const post = await discussionRepository.findPostById(postId);
    if (!post) {
      throw ApiError.notFound("Discussion post not found");
    }

    const comments = await discussionRepository.findCommentsForPost(postId);
    return comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      userId: c.userId,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: {
        id: c.user.id,
        displayName: c.user.profile?.displayName ?? "Anonymous Member",
        avatarUrl: c.user.profile?.avatarUrl ?? null,
      },
    }));
  },

  async createComment(postId: string, userId: string, content: string) {
    const post = await discussionRepository.findPostById(postId);
    if (!post) {
      throw ApiError.notFound("Discussion post not found");
    }

    if (!content || !content.trim()) {
      throw ApiError.badRequest("Comment content is required");
    }

    const c = await discussionRepository.createComment(postId, userId, content.trim());
    return {
      id: c.id,
      postId: c.postId,
      userId: c.userId,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: {
        id: c.user.id,
        displayName: c.user.profile?.displayName ?? "Anonymous Member",
        avatarUrl: c.user.profile?.avatarUrl ?? null,
      },
    };
  },
};
