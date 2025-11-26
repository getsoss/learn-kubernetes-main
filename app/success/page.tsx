"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SuccessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLaunch = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("세션 준비 중입니다... 잠시만 기다려주세요.");

    try {
      // 1️⃣ Supabase 세션 가져오기 → access token 추출
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        throw new Error("로그인 세션을 확인할 수 없습니다.");
      }

      const accessToken = data.session.access_token;

      // 2️⃣ 로그인한 사용자 uuid 가져오기
      const userId = data.session.user.id; // Supabase Auth에서 제공하는 UUID

      // 3️⃣ proxy_sessions 테이블에 저장
      const { error: insertError } = await supabase
        .from("proxy_sessions")
        .insert([
          {
            uid: userId,
            session_id: null,
            status: "inactive",
          },
        ]);

      if (insertError) {
        throw new Error("proxy_sessions 테이블에 저장하는 데 실패했습니다.");
      }

      // 4️⃣ Access Token 저장
      localStorage.setItem("access_token", accessToken);

      // 5️⃣ Launch API 호출
      const response = await fetch("/api/launch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(
          errorPayload?.detail ?? "세션 준비 중 오류가 발생했습니다."
        );
      }

      await response.json();

      setMessage(
        "세션이 준비되었습니다.\n2분 후 서비스가 자동으로 시작됩니다."
      );
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setMessage(error);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        const token = localStorage.getItem("access_token");
        const redirectUrl = token
          ? `http://localhost:3001/terminal?access_token=${encodeURIComponent(
              token
            )}`
          : "http://localhost:3001/terminal";
        window.location.href = redirectUrl;
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-k8s-dark flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-k8s-primary/10 via-transparent to-k8s-accent/10" />
      <div className="relative z-10 w-full max-w-md card p-8 text-center glow-effect">
        <h1 className="text-2xl font-bold text-k8s-text mb-2">
          로그인이 완료되었습니다!
        </h1>
        <p className="text-k8s-muted mb-6">이제 서비스를 이용하실 수 있어요.</p>

        {message && (
          <p className="text-sm text-k8s-muted mb-4 whitespace-pre-wrap">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleLaunch}
          disabled={isLoading}
          className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? "요청 중..." : "서비스 이용하기"}
        </button>
      </div>
    </div>
  );
}
