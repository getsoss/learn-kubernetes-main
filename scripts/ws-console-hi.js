// ws-shell.js
const WebSocket = require("ws");
const readline = require("readline");

const WS_URL =
  "ws://43.202.244.126:8080/session/a72de8a4?token=eyJhbGciOiJIUzI1NiIsImtpZCI6IklHUWtMQUU2YitQL1labGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FxbGx6d3pxZGVha3Zld2lpZ2R1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyZmJlNmIyOS1kOTY3LTRhYTEtODQ2Yy1mMWYzNWY3NjU5ZTkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0MTY0Njk2LCJpYXQiOjE3NjQxNjEwOTYsImVtYWlsIjoiZ2V0c29zczg0QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTlJcEVORWxicjJJakZNU0hUemVGTHNOeHRpSFA2TTBDTkl4bUtvZXQtRVN3aERRPXM5Ni1jIiwiZW1haWwiOiJnZXRzb3NzODRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IuyerOyXsCIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiLsnqzsl7AiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJOUlwRU5FbGJyMklqRk1TSFR6ZUZMc054dGlIUDZNMENOSXhtS29ldC1FU3doRFE9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExNTg2NTcwMTY1Mjc1OTE1ODUxMCIsInN1YiI6IjExNTg2NTcwMTY1Mjc1OTE1ODUxMCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzY0MTYxMDk2fV0sInNlc3Npb25faWQiOiJlNjM5ZTBiOC03M2IyLTQ5YmQtOTg2ZS01NTkzZGNmZmU0YTkiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.QM3QW4ECpDH7XM4ooXXXa3g8IIsZImj6UbxrZbWKb80";
const ACCESS_TOKEN = WS_URL.split("token=")[1];

const socket = new WebSocket(WS_URL, {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

socket.on("open", () => {
  console.log("✅ 서버 터미널 연결 성공\n");
  console.log("이제 명령어를 입력하세요 (예: ls, pwd, whoami)\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // 사용자의 입력을 서버로 전송
  rl.on("line", (line) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(line + "\n"); // 줄바꿈 포함해야 bash가 실행함
    } else {
      console.log("❌ 연결이 닫혔습니다.");
    }
  });

  // Ctrl+C 로 종료
  rl.on("SIGINT", () => {
    console.log("\n종료 중...");
    socket.close();
    process.exit(0);
  });
});

// 서버에서 오는 터미널 출력 처리
socket.on("message", (data) => {
  process.stdout.write(data.toString());
});

socket.on("close", (code, reason) => {
  console.log(`\n❌ 연결 종료 (code: ${code}, reason: ${reason.toString()})`);
  process.exit(0);
});

socket.on("error", (err) => {
  console.error("⚠️ 오류:", err.message);
});
