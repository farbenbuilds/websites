{
  lib,
  stdenv,
  stdenvNoCC,
  fetchurl,
  autoPatchelfHook,
  makeWrapper,
  version ? "12.15.0",
}: let
  platform = stdenvNoCC.hostPlatform;

  assetBySystem = {
    x86_64-linux = "linux-x64";
    aarch64-linux = "linux-arm64";
    x86_64-darwin = "darwin-x64";
    aarch64-darwin = "darwin-arm64";
  };

  asset =
    assetBySystem.${platform.system}
    + lib.optionalString (platform.isLinux && platform.isMusl) "-musl";

  hashes = {
    linux-x64 = "sha256-VbXtAJK9ERdsFmlZjiMa5S587axZ3m79DUFXMPN9BZg=";
    linux-x64-musl = "sha256-0zgCzJh9z74CqZFHN2S6Ja0bI0QYniCXolcLrtZvAIo=";
    linux-arm64 = "sha256-186TosfYR9OjS9P1WbYMFPV4sTIMF8w1KixcX9+VYRc=";
    linux-arm64-musl = "sha256-EYjvile/xXhvP3OamAZyQuUxpGNuP1Lp6d3HVWTqgE0=";
    darwin-x64 = "sha256-LXszaIRXSu6KdlvuSFkSEunK9Pz5hfsyeViMH7c/tH8=";
    darwin-arm64 = "sha256-akGih3dz6X8ZgyBnGHzG/ILhhtiiz5H+xLTBpfvW7yc=";
  };
in
  stdenvNoCC.mkDerivation {
    pname = "pnpm";
    inherit version;

    src = fetchurl {
      url = "https://github.com/pnpm/pnpm/releases/download/v${version}/pnpm-${asset}.tar.gz";
      hash = hashes.${asset};
    };

    nativeBuildInputs = [makeWrapper] ++ lib.optionals platform.isLinux [autoPatchelfHook];
    buildInputs = lib.optionals (platform.isLinux && !platform.isMusl) [stdenv.cc.cc.lib stdenv.cc.libc];

    dontBuild = true;
    sourceRoot = ".";

    installPhase = ''
      runHook preInstall

      mkdir -p $out/bin
      cp pnpm $out/bin/pnpm
      chmod +x $out/bin/pnpm

      makeWrapper $out/bin/pnpm $out/bin/pnpx --add-flag dlx
      ln -s pnpm $out/bin/pn
      ln -s pnpx $out/bin/pnx

      runHook postInstall
    '';

    meta = {
      description = "Fast, disk space efficient package manager for JavaScript";
      homepage = "https://pnpm.io/";
      license = lib.licenses.mit;
      mainProgram = "pnpm";
      platforms = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    };
  }
