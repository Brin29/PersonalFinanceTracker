import GoogleIcon from "@/components/ui/icons/googleIcon";
import GithubIcon from "@/components/ui/icons/githubIcon";
import { API_BASE_URL } from "@/lib/api/client";

function buildAuthorizeUrl(base: string, redirectPath?: string) {
  if (!redirectPath || redirectPath === "/") return base;
  const url = new URL(base);
  url.searchParams.set("from", redirectPath);
  return url.toString();
}

export function OAuthButtons({ redirectPath }: { redirectPath?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          o continúa con
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={buildAuthorizeUrl(`${API_BASE_URL}/auth/google`, redirectPath)}
          className="btn-ghost"
        >
          <GoogleIcon />
          Google
        </a>
        <a
          href={buildAuthorizeUrl(`${API_BASE_URL}/auth/github`, redirectPath)}
          className="btn-ghost"
        >
          <GithubIcon />
          GitHub
        </a>
      </div>
    </div>
  );
}
