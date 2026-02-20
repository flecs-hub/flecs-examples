#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

log() {
  printf '[install-node] %s\n' "$1"
}

fail() {
  printf '[install-node] ERROR: %s\n' "$1" >&2
  exit 1
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

run_with_optional_sudo() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif has_cmd sudo; then
    sudo "$@"
  else
    fail "Need root privileges for '$*' and sudo is not available."
  fi
}

verify_install() {
  if ! has_cmd node; then
    fail "node is still not available after install."
  fi
  if ! has_cmd npm; then
    fail "npm is still not available after install."
  fi

  log "Install complete."
  log "node: $(node --version)"
  log "npm:  $(npm --version)"
}

install_playwright() {
  if ! has_cmd npm; then
    fail "npm is required to install Playwright."
  fi

  log "Installing Playwright package in ${PROJECT_ROOT}..."
  (
    cd "${PROJECT_ROOT}"
    npm install --no-save playwright
  )

  log "Installing Playwright Chromium browser..."
  (
    cd "${PROJECT_ROOT}"
    npx playwright install chromium
  )

  log "Playwright install complete."
}

if has_cmd node && has_cmd npm; then
  log "Node and npm are already installed."
  verify_install
  install_playwright
  exit 0
fi

OS="$(uname -s)"

case "$OS" in
  Darwin)
    if has_cmd brew; then
      log "Installing Node.js via Homebrew..."
      brew install node
      verify_install
      install_playwright
      exit 0
    fi

    fail "Homebrew is not installed. Install Homebrew first: https://brew.sh/"
    ;;
  Linux)
    if has_cmd apt-get; then
      log "Installing Node.js + npm via apt-get..."
      run_with_optional_sudo apt-get update
      run_with_optional_sudo apt-get install -y nodejs npm
      verify_install
      install_playwright
      exit 0
    fi

    if has_cmd dnf; then
      log "Installing Node.js + npm via dnf..."
      run_with_optional_sudo dnf install -y nodejs npm
      verify_install
      install_playwright
      exit 0
    fi

    if has_cmd yum; then
      log "Installing Node.js + npm via yum..."
      run_with_optional_sudo yum install -y nodejs npm
      verify_install
      install_playwright
      exit 0
    fi

    if has_cmd pacman; then
      log "Installing Node.js + npm via pacman..."
      run_with_optional_sudo pacman -Sy --noconfirm nodejs npm
      verify_install
      install_playwright
      exit 0
    fi

    if has_cmd apk; then
      log "Installing Node.js + npm via apk..."
      run_with_optional_sudo apk add --no-cache nodejs npm
      verify_install
      install_playwright
      exit 0
    fi

    fail "No supported package manager found (apt-get, dnf, yum, pacman, apk)."
    ;;
  *)
    fail "Unsupported OS: $OS. Please install Node.js manually from https://nodejs.org/"
    ;;
esac
