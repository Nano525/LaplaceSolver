from pathlib import Path
import sys

SITE_PACKAGES_PATH = Path(__file__).resolve().parents[1] / "site_packages"

if SITE_PACKAGES_PATH.exists():
    sys.path.insert(0, str(SITE_PACKAGES_PATH))
