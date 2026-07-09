import sys
import subprocess

def main():
    if sys.platform == "win32":
        # Semgrep has binary compatibility issues on native Windows (ELF executable check fails).
        # We print a warning and skip the check to avoid blocking local git commits on Windows.
        print("WARNING: Semgrep is not natively supported on Windows. Skipping scan.")
        sys.exit(0)

    # Run the real semgrep command on non-Windows platforms
    cmd = ["semgrep"] + sys.argv[1:]
    try:
        result = subprocess.run(cmd, capture_output=False)
        sys.exit(result.returncode)
    except Exception as e:
        print(f"Error running semgrep: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
