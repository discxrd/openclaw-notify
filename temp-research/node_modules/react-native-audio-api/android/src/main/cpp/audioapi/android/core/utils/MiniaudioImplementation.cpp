/// Miniaudio implementation for Android platform.
/// this define tells the miniaudio to also include the definitions and not only declarations.
/// Which should be done only once in the whole project.
/// This make its safe to include the header file in multiple places, without causing multiple definition errors.
/// TODO: Consider moving this file to common scope to re-use the miniaudio also for iOS platform.
#define MINIAUDIO_IMPLEMENTATION
#define MA_DEBUG_OUTPUT
#include <audioapi/libs/miniaudio/miniaudio.h>
