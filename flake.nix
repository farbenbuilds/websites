{
  description = "Farben's official web presence: a growing documentation hub, the landing/branding page, and the merchandise shop";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    nix-vite-plus.url = "github:ryoppippi/nix-vite-plus";
  };

  outputs = inputs @ {
    self,
    flake-parts,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      # Every system nix-vite-plus publishes prebuilt `vp` binaries for.
      # There is no x86_64-darwin Vite+ binary, so that system is not listed.
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      perSystem = {
        pkgs,
        system,
        ...
      }: let
        lib = pkgs.lib;
        isLinux = pkgs.stdenv.hostPlatform.isLinux;
        pkgsMusl =
          if isLinux
          then pkgs.pkgsMusl
          else null;

        # `vp` is a prebuilt binary whose glibc closure lives in the Nix store,
        # so the same package runs in the musl shell as well. Every native
        # loader bundled with it (vite-plus, rolldown, oxlint, oxfmt, …) probes
        # /usr/bin/ldd before checking the running process, though, and on a
        # musl host that makes them look for musl bindings the package
        # deliberately does not ship. Point the probe at a path that never
        # exists so each loader falls through to the glibc process report.
        vitePlus = inputs.nix-vite-plus.packages.${system}.vp.overrideAttrs (
          old:
            lib.optionalAttrs isLinux {
              postFixup =
                (old.postFixup or "")
                + ''
                  grep -rl --include='*.js' --include='*.cjs' --include='*.mjs' \
                    "/usr/bin/ldd" $out/node_modules \
                  | while IFS= read -r f; do
                      substituteInPlace "$f" \
                        --replace '"/usr/bin/ldd"' '"/usr/bin/ldd.nix-vite-plus"' \
                        --replace "'/usr/bin/ldd'" "'/usr/bin/ldd.nix-vite-plus'"
                    done
                '';
            }
        );

        # The standalone pnpm releases ship native glibc and musl builds, so
        # each shell pins the flavour matching its libc.
        pnpm = pkgs.callPackage ./nix/pnpm.nix {};
        pnpmMusl =
          if isLinux
          then pkgsMusl.callPackage ./nix/pnpm.nix {}
          else null;

        mkDevShell = packagePkgs: pnpmPackage:
          packagePkgs.mkShell {
            packages = [
              vitePlus
              packagePkgs.nodejs
              pnpmPackage
            ];
          };
      in {
        formatter = pkgs.alejandra;

        devShells =
          {
            default = mkDevShell pkgs pnpm;
          }
          // lib.optionalAttrs isLinux {
            musl = mkDevShell pkgsMusl pnpmMusl;
          };

        checks.format =
          pkgs.runCommand "check-format" {
            nativeBuildInputs = [pkgs.alejandra];
          } ''
            alejandra --check $(find ${./.} -name '*.nix')
            touch $out
          '';
      };
    };
}
