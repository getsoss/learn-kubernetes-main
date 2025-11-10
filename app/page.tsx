"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}`
              : undefined,
        },
      });
      if (error) {
        alert(error.message);
        return;
      }
      // Email confirmation may be required based on Supabase settings
      alert("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleGmailLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/success`
            : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-k8s-dark flex items-center justify-center p-4">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-k8s-primary/10 via-transparent to-k8s-accent/10"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-k8s-primary to-k8s-accent rounded-2xl mb-4 glow-effect">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">K8s Lab</h1>
          <p className="text-k8s-muted text-lg">
            Kubernetes 실습 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="card p-8 glow-effect">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-k8s-text mb-2">회원가입</h2>
            <p className="text-k8s-muted">새 계정을 만들어 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-k8s-text mb-2"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-k8s-text mb-2"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-k8s-text mb-2"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-k8s-text mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                {loading ? "처리중..." : "회원가입"}
              </span>
            </button>
          </form>

          {/* 구분선 */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-k8s-secondary text-k8s-muted">
                  또는
                </span>
              </div>
            </div>
          </div>

          {/* Gmail 로그인 버튼 */}
          <button
            onClick={handleGmailLogin}
            className="w-full btn-secondary group"
          >
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Gmail로 계속하기
            </span>
          </button>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-k8s-muted">
              이미 계정이 있으신가요?{" "}
              <a
                href="/login"
                className="text-k8s-primary hover:text-k8s-accent font-medium transition-colors duration-300 hover:underline"
              >
                로그인하기
              </a>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-8">
          <p className="text-k8s-muted text-sm">
            회원가입 시{" "}
            <a
              href="#"
              className="text-k8s-primary hover:text-k8s-accent transition-colors duration-300"
            >
              이용약관
            </a>{" "}
            및{" "}
            <a
              href="#"
              className="text-k8s-primary hover:text-k8s-accent transition-colors duration-300"
            >
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* 배경 장식 요소들 */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-k8s-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-k8s-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-k8s-primary/10 rounded-full blur-2xl"></div>
    </div>
  );
}
