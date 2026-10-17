{
  description = "Farben's official web presence: documentation for uWebZockets and ventiws, the landing/branding page, and the merchandise shop";

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
        # so the same package runs in the musl shell as well.
        vitePlus = inputs.nix-vite-plus.packages.${system}.vp;

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
