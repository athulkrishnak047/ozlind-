export type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};

export type ApiFailure = {
  ok: false;
  error: { code: string; message: string };
  requestId: string;
};

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function jsonSuccess<T>(data: T, status = 200): Response {
  const requestId = createRequestId();
  const body: ApiSuccess<T> = { ok: true, data, requestId };
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": requestId
    }
  });
}

export function jsonFailure(code: string, message: string, status: number): Response {
  const requestId = createRequestId();
  const body: ApiFailure = { ok: false, error: { code, message }, requestId };
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": requestId
    }
  });
}
