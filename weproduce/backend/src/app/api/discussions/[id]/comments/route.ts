import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { discussionService } from "@/services/discussionService";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAuth(request);
    const comments = await discussionService.getComments(params.id);
    return ok(comments);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = requireAuth(request);
    const body = await request.json();
    const comment = await discussionService.createComment(params.id, userId, body.content);
    return ok(comment);
  } catch (error) {
    return fail(error);
  }
}
