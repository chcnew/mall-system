#!/usr/bin/env bash
# WSL：使用 Windows 上 V2RayN 的本地代理（默认 SOCKS5 端口 10808）。
# 前置：V2RayN 勾选「允许来自局域网的连接」；必要时在 Windows 防火墙放行该端口。
set -euo pipefail

PROXY_PORT="${PROXY_PORT:-10808}"
DO_DOCKER=0
DO_GIT=0
UNDO=0

usage() {
  echo "用法: $0 [选项]
  --port <n>   代理端口（默认 10808，也可用环境变量 PROXY_PORT）
  --docker     为 systemd 管理的 dockerd 写入代理（需 sudo，使用运行时的 Windows IP）
  --git        设置全局 git http/https.proxy 为 socks5://...
  --undo       移除本脚本写入的 shell 片段、git 代理与 docker drop-in
  -h, --help   显示本说明"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port) PROXY_PORT="${2:?}"; shift 2 ;;
    --docker) DO_DOCKER=1; shift ;;
    --git) DO_GIT=1; shift ;;
    --undo) UNDO=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "未知参数: $1" >&2; usage >&2; exit 1 ;;
  esac
done

MARK_BEGIN="# >>> mall-system wsl-v2ray-proxy"
MARK_END="# <<< mall-system wsl-v2ray-proxy"
DOCKER_DROPIN="/etc/systemd/system/docker.service.d/http-proxy.conf"

win_host() {
  local h
  h="$(grep -m1 '^nameserver' /etc/resolv.conf 2>/dev/null | awk '{print $2}')"
  if [[ -z "$h" ]]; then
    h="$(ip route show 2>/dev/null | awk '/default/ {print $3; exit}')"
  fi
  if [[ -z "$h" ]]; then
    echo "无法解析 Windows 主机 IP（请在 WSL2 内运行）。" >&2
    exit 1
  fi
  printf '%s' "$h"
}

remove_block_safe() {
  local f="$1"
  [[ -f "$f" ]] || return 0
  awk -v s="$MARK_BEGIN" -v e="$MARK_END" '
    $0 == s { skip=1; next }
    $0 == e { skip=0; next }
    !skip { print }
  ' "$f" >"${f}.tmp" && mv "${f}.tmp" "$f"
}

inject_shell() {
  local f="$1"
  touch "$f"
  remove_block_safe "$f"
  cat >>"$f" <<EOF

$MARK_BEGIN
export WIN_HOST="\$(grep -m1 '^nameserver' /etc/resolv.conf 2>/dev/null | awk '{print \$2}')"
[ -z "\$WIN_HOST" ] && export WIN_HOST="\$(ip route show 2>/dev/null | awk '/default/ {print \$3; exit}')"
export ALL_PROXY="socks5://\${WIN_HOST}:${PROXY_PORT}"
export all_proxy="\$ALL_PROXY"
export HTTP_PROXY="\$ALL_PROXY"
export HTTPS_PROXY="\$ALL_PROXY"
export NO_PROXY="localhost,127.0.0.1,::1,\${WIN_HOST}"
export no_proxy="\$NO_PROXY"
$MARK_END
EOF
  echo "已写入: $f"
}

undo_docker() {
  if [[ ! -f "$DOCKER_DROPIN" ]]; then
    return 0
  fi
  if sudo -v; then
    sudo rm -f "$DOCKER_DROPIN"
    sudo systemctl daemon-reload
    sudo systemctl restart docker 2>/dev/null || true
    echo "已移除 $DOCKER_DROPIN 并已尝试重启 docker。"
  else
    echo "需要 sudo 才能删除 $DOCKER_DROPIN。" >&2
  fi
}

if [[ "$UNDO" -eq 1 ]]; then
  for rc in "$HOME/.bashrc" "$HOME/.zshrc"; do
    if [[ -f "$rc" ]]; then
      remove_block_safe "$rc"
      echo "已从 $rc 移除代理片段（若存在）。"
    fi
  done
  git config --global --unset http.proxy 2>/dev/null || true
  git config --global --unset https.proxy 2>/dev/null || true
  echo "已尝试清除 git 全局代理。"
  undo_docker
  exit 0
fi

WH="$(win_host)"
echo "Windows 主机 IP: $WH  代理: socks5://${WH}:${PROXY_PORT}"

inject_shell "$HOME/.bashrc"
if [[ -f "$HOME/.zshrc" ]]; then
  inject_shell "$HOME/.zshrc"
fi
echo "请执行: source ~/.bashrc  （或重新打开终端）"

if [[ "$DO_GIT" -eq 1 ]]; then
  P="socks5://${WH}:${PROXY_PORT}"
  git config --global http.proxy "$P"
  git config --global https.proxy "$P"
  echo "已设置 git 全局代理: $P"
fi

if [[ "$DO_DOCKER" -eq 1 ]]; then
  if ! command -v systemctl >/dev/null 2>&1; then
    echo "未找到 systemctl。若使用 Docker Desktop，请在 Settings → Proxies 中手动填写。" >&2
    exit 1
  fi
  sudo mkdir -p "$(dirname "$DOCKER_DROPIN")"
  sudo tee "$DOCKER_DROPIN" >/dev/null <<EOF
[Service]
Environment="HTTP_PROXY=socks5://${WH}:${PROXY_PORT}"
Environment="HTTPS_PROXY=socks5://${WH}:${PROXY_PORT}"
Environment="NO_PROXY=localhost,127.0.0.1,::1"
EOF
  sudo systemctl daemon-reload
  sudo systemctl restart docker
  echo "已写入 $DOCKER_DROPIN 并已重启 docker。"
  echo "提示：若 pull 仍失败，可在 V2RayN 开启 HTTP 入站，改用 http://IP:HTTP端口 后重新运行本脚本并改 PROXY_PORT。"
fi
