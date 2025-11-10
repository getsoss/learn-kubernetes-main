"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

export default function SuccessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLaunch = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        throw new Error("로그인 세션을 확인할 수 없습니다.");
      }

      const response = await fetch("/api/launch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(
          errorPayload?.detail ?? "세션 생성 중 문제가 발생했습니다."
        );
      }

      const result = await response.json();

      setMessage(
        result?.session_id
          ? "세션이 준비되었습니다. 잠시 후 서비스가 시작됩니다."
          : "요청이 완료되었습니다."
      );
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-k8s-dark flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-k8s-primary/10 via-transparent to-k8s-accent/10" />
      <div className="relative z-10 w-full max-w-md card p-8 text-center glow-effect">
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-r from-k8s-primary to-k8s-accent flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-k8s-text mb-2">
          로그인이 완료되었습니다!
        </h1>
        <p className="text-k8s-muted mb-6">이제 서비스를 이용하실 수 있어요.</p>
        {message && (
          <p className="text-sm text-k8s-muted mb-4 whitespace-pre-wrap">
            {message}
          </p>
        )}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLaunch}
            disabled={isLoading}
            className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? "요청 중..." : "서비스 이용하기"}
          </button>
          <a
            href="/"
            className="btn-secondary w-full inline-flex items-center justify-center"
          >
            홈으로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
