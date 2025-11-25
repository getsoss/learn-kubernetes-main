import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PROXY_BASE_URL = "http://43.203.84.169:8080";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json(
      { detail: "인증 정보가 없습니다." },
      { status: 401 }
    );
  }

  const targetOrigin =
    process.env.LAUNCH_PROXY_BASE_URL ?? DEFAULT_PROXY_BASE_URL;

  try {
    const response = await fetch(`${targetOrigin}/launch`, {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });

    const text = await response.text();
    const contentType =
      response.headers.get("content-type") ?? "application/json";
    let payload: unknown = text;

    if (contentType.includes("application/json")) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { detail: "Invalid JSON response from proxy target." };
      }
    }

    return NextResponse.json(payload, {
      status: response.status,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      { detail: `Launch 요청에 실패했습니다: ${message}` },
      { status: 502 }
    );
  }
}
