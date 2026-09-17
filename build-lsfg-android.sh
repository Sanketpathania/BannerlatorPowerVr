#!/usr/bin/env bash
# Build script for lsfg-vk Vulkan layer for Android ARM64
#
# Prerequisites:
#   - Android NDK (set ANDROID_NDK_HOME or pass --ndk)
#   - CMake 3.22+
#   - Ninja (optional, uses Make by default)
#
# Usage:
#   ./build-lsfg-android.sh [--ndk /path/to/ndk] [--clean]

set -euo pipefail

NDK="${ANDROID_NDK_HOME:-${ANDROID_NDK:-}}"
CLEAN=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --ndk) NDK="$2"; shift 2 ;;
        --clean) CLEAN=true; shift ;;
        *) echo "Unknown: $1"; exit 1 ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/app/src/main/jniLibs/arm64-v8a"
mkdir -p "$OUTPUT_DIR"

if [[ -z "$NDK" ]]; then
    echo "WARNING: Android NDK not found. Checking fallback prebuilt asset..."
    if [ -f "${SCRIPT_DIR}/app/src/main/assets/lsfg-vk/liblsfg-vk.so" ]; then
        cp "${SCRIPT_DIR}/app/src/main/assets/lsfg-vk/liblsfg-vk.so" "${OUTPUT_DIR}/libVkLayer_LSFGVK_frame_generation.so"
        echo "Copied prebuilt fallback layer to ${OUTPUT_DIR}/libVkLayer_LSFGVK_frame_generation.so"
        exit 0
    fi
    echo "ERROR: Android NDK not found. Set ANDROID_NDK_HOME or pass --ndk"
    exit 1
fi

BUILD_DIR="${SCRIPT_DIR}/build/lsfg-vk-android"
ABI="arm64-v8a"
API_LEVEL="26"

TOOLCHAIN="${NDK}/toolchains/llvm/prebuilt/linux-x86_64"
CMAKE="${TOOLCHAIN}/bin/cmake"
if [ ! -f "$CMAKE" ]; then
    CMAKE="cmake"
fi

if [[ "$CLEAN" == true ]]; then
    rm -rf "$BUILD_DIR"
    echo "Cleaned build directory"
fi

mkdir -p "$BUILD_DIR"

echo "=== Building lsfg-vk for Android ARM64 ==="
echo "NDK:      $NDK"
echo "ABI:      $ABI"
echo "API:      $API_LEVEL"
echo "Build:    $BUILD_DIR"
echo "Output:   $OUTPUT_DIR"

BUILD_SUCCESS=false
if "$CMAKE" -S "${SCRIPT_DIR}/app/src/main/cpp/lsfg-vk" -B "$BUILD_DIR" \
    -DCMAKE_TOOLCHAIN_FILE="${NDK}/build/cmake/android.toolchain.cmake" \
    -DANDROID_ABI="$ABI" \
    -DANDROID_PLATFORM="android-${API_LEVEL}" \
    -DANDROID_STL="c++_shared" \
    -DCMAKE_BUILD_TYPE=Release \
    -DLSFGVK_BUILD_VK_LAYER=ON \
    -DLSFGVK_BUILD_CLI=OFF \
    -DLSFGVK_BUILD_UI=OFF && \
   "$CMAKE" --build "$BUILD_DIR" --parallel "$(nproc)"; then
    FOUND_SO=$(find "$BUILD_DIR" -name "libVkLayer_LSFGVK_frame_generation.so" -type f 2>/dev/null | head -1)
    if [ -n "$FOUND_SO" ]; then
        cp "$FOUND_SO" "$OUTPUT_DIR/"
        echo "=== Done ==="
        echo "Library copied from: $FOUND_SO"
        ls -lh "$OUTPUT_DIR/libVkLayer_LSFGVK_frame_generation.so"
        BUILD_SUCCESS=true
    fi
fi

if [ "$BUILD_SUCCESS" = false ]; then
    echo "Notice: CMake build of lsfg-vk did not produce library, checking prebuilt asset..."
    if [ -f "${SCRIPT_DIR}/app/src/main/assets/lsfg-vk/liblsfg-vk.so" ]; then
        cp "${SCRIPT_DIR}/app/src/main/assets/lsfg-vk/liblsfg-vk.so" "${OUTPUT_DIR}/libVkLayer_LSFGVK_frame_generation.so"
        echo "Successfully deployed prebuilt layer to ${OUTPUT_DIR}/libVkLayer_LSFGVK_frame_generation.so"
    else
        echo "ERROR: libVkLayer_LSFGVK_frame_generation.so could not be built or found."
        exit 1
    fi
fi
