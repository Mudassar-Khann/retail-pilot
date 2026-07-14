#!/usr/bin/env python3
import os
import sys
import shutil

# Target garment profiles mapping database IDs to names
GARMENTS = {
    "1": ("2001", "Ralph Lauren Burgundy Tapestry Hunter Shawl Knit"),
    "2": ("2002", "Diznew Seamed Eyelet Heavy Hoodie"),
    "3": ("2003", "System Tech Sunburst Ribbed Jumper"),
    "4": ("2004", "Sartorial Slouch Paneled Corduroy Wide Trousers"),
    "5": ("2005", "Sartorial Slouch Patched Heritage Bomber"),
    "6": ("2006", "Quiet Luxury Heritage Embroidered Tunic"),
    "7": ("2007", "Sartorial Slouch Jacquard Abstract Lettering Jumper"),
    "8": ("2008", "Pikol Floral Tapestry Corduroy Jacket"),
    "9": ("2009", "System Tech Pixel Tapestry Combat Sweatshirt")
}

def main():
    # Determine the directory where the script is located
    current_dir = os.path.dirname(os.path.abspath(__file__)) if __file__ else os.getcwd()

    print("=" * 60)
    print("      RETAILPILOT PRODUCT IMAGE RENAME HELPER CLI")
    print("=" * 60)
    print(f"Scanning directory: {current_dir}\n")

    # Target filenames list for exclusion check
    target_filenames = {f"{g_id}.png" for g_id, _ in GARMENTS.values()}

    # Scan for PNG files that are not already named 2001.png - 2009.png
    png_files = []
    try:
        for f in os.listdir(current_dir):
            if f.lower().endswith(".png") and f not in target_filenames and f != "rename_helper.py":
                # Ensure it is a file and not a directory
                if os.path.isfile(os.path.join(current_dir, f)):
                    png_files.append(f)
    except Exception as e:
        print(f"Error scanning directory: {e}", file=sys.stderr)
        sys.exit(1)

    if not png_files:
        print("No raw PNG files found needing renaming. All clear!")
        sys.exit(0)

    print(f"Found {len(png_files)} files to evaluate.\n")

    summary = []

    for filename in png_files:
        full_path = os.path.join(current_dir, filename)

        while True:
            print("-" * 60)
            print(f"Current file: [ {filename} ]")
            print("Which garment is this?")
            for key, (g_id, g_name) in sorted(GARMENTS.items()):
                print(f"[{key}] {g_id} - {g_name}")
            print("[s] Skip this file")
            print("[q] Exit")
            print("-" * 60)

            try:
                choice = input("Enter selection: ").strip().lower()
            except (KeyboardInterrupt, EOFError):
                print("\nExiting utility.")
                choice = 'q'

            if choice == 'q':
                print("\nExiting utility program.")
                print_summary(summary)
                sys.exit(0)
            elif choice == 's':
                print(f"Skipping file: {filename}\n")
                break
            elif choice in GARMENTS:
                target_id, target_name = GARMENTS[choice]
                target_filename = f"{target_id}.png"
                target_path = os.path.join(current_dir, target_filename)

                # Confirm override if target file already exists
                if os.path.exists(target_path):
                    print(f"\n[WARNING] Target file {target_filename} ({target_name}) already exists.")
                    try:
                        confirm = input("Overwrite existing file? (y/n): ").strip().lower()
                    except (KeyboardInterrupt, EOFError):
                        confirm = 'n'
                    if confirm != 'y':
                        print("Operation canceled for this file. Returning to selection menu.\n")
                        continue

                try:
                    # Perform safe rename operation
                    shutil.move(full_path, target_path)
                    print(f"✓ Successfully renamed:\n  [ {filename} ] -> [ {target_filename} ] ({target_name})\n")
                    summary.append((filename, target_filename, target_name))
                    break
                except PermissionError:
                    print(f"✗ Permission Error: Cannot write/rename to {target_filename}. Check file permissions.\n", file=sys.stderr)
                    break
                except FileNotFoundError:
                    print(f"✗ File Not Found Error: The source file {filename} could not be located.\n", file=sys.stderr)
                    break
                except Exception as e:
                    print(f"✗ Unexpected Error occurred: {e}\n", file=sys.stderr)
                    break
            else:
                print("Invalid input choice. Please select a valid menu option.\n")

    print_summary(summary)

def print_summary(summary):
    print("=" * 60)
    print("                 MAPPING RUN SUMMARY")
    print("=" * 60)
    if not summary:
        print("No files were renamed during this run.")
    else:
        for orig, renamed, name in summary:
            print(f"Mapped: {orig} -> {renamed} ({name})")
        print("\nAll changes staged successfully. Files are ready to be served!")
    print("=" * 60)

if __name__ == "__main__":
    main()
