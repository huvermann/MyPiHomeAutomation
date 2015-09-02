import platform

def is_windows():
    """Returns true if current platform is windows"""
    return any(platform.win32_ver())