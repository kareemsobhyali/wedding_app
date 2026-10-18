import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentInvitationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentInvitationId;
  },
);

export const CurrentDraftSessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.draftSessionId;
  },
);
