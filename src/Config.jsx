const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;

    // 1. 빌드 시 주입된 환경 변수가 있으면 최우선 사용
    if (envUrl && !envUrl.includes('localhost')) return envUrl;

    // 2. 현재 도메인이 calmdesk.cloud라면 강제로 운영 API 주소 할당
    if (
        window.location.hostname === "calmdesk.cloud" ||
        window.location.hostname === "www.calmdesk.cloud"
    ) {
        return "https://api.calmdesk.cloud";
    }

    // 3. 그 외(로컬 개발)에는 localhost 사용
    return envUrl || "http://localhost:8080";
};

export const API_URL = getApiUrl();
