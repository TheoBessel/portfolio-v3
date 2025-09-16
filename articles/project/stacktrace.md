<!-- *META -->

<!-- ----------------------------------------------------------------------- -->

## ARMv7 Stacktrace

<!-- ------------------------- Quick Description --------------------------- -->

Implementing a stacktrace mechanism on ARMv7-M architecture for fault detection and recovery in embedded systems.

<!-- ----------------------------------------------------------------------- -->

<!-- !META -->

<!-- *CONTENT -->

<!-- ----------------------------------------------------------------------- -->

# Implementing a Stacktrace on ARMv7-M

This project is part of the **TOLOSAT flight software**, which I am currently developing. The goal is to create a Fault Detection, Isolation, and Recovery (FDIR) mechanism for robust fault management.

The repository is available **[here](https://github.com/TheoBessel/ARM_Stacktrace)**.

## Motivation

The FDIR system is crucial for the Cortex-M7 microcontroller that powers the TOLOSAT software. To effectively detect and isolate faults, we needed a way to trace the call stack, which is commonly known as a stacktrace mechanism.

## Challenges on ARMv7-M

Unlike x86 architectures, implementing stack tracing on an ARMv7-M microcontroller presents specific challenges:
- **Variable-sized Stack Frames**: The ARMv7-M architecture uses stack frames with variable sizes to optimize memory, meaning the stack pointer (SP) and frame pointer (FP) are not always aligned to predictable addresses.
- **Unusable Frame Pointer (FP)**: Initial attempts to use the frame pointer failed, as the address alignment was unreliable.

## Stack Unwinding with ARM EHABI

I discovered that the ARM EABI GCC compiler generates stack unwinding information in two ELF file sections: `.ARM.exidx` and `.ARM.extab`. This data is essential for exception handling and provides insights for our stacktrace implementation.

### Unwind Instruction Example
Below is an excerpt from the `.ARM.exidx` section of our ELF file:

```assembly
0x80 <_stack_init>: 0x1 [cantunwind]

0x140 <UnwindStack>: @0x2000048c
  Compact model index: 1
  0x97      vsp = r7
  0x01      vsp = vsp + 8
  0x84 0x08 pop {r7, r14}
  0xb0      finish
  0xb0      finish

...

0xd38 <Reset_Handler>: @0x20000564
  Compact model index: 1
  0x97      vsp = r7
  0x03      vsp = vsp + 16
  0x84 0x08 pop {r7, r14}
  0xb0      finish
  0xb0      finish
```

*This information provides the stack frame pointer (`vsp`), the offset to the return address (`r14`), and the adjustments for the previous frame pointer.*

## Implementation Details

### Decoding Stack Unwinding Instructions

I developed functions to decode the `.ARM.exidx` and `.ARM.extab` information and retrieve the call stack trace. The implementation details can be found in:
- **[fdir.c](https://github.com/TheoBessel/ARM_Stacktrace/tree/main/src/fdir.c)**: Contains the core functions for Error Exception Handling (EEH).
- **[stacktrace.c](https://github.com/TheoBessel/ARM_Stacktrace/tree/main/src/stacktrace.c)**: Contains the core functions for decoding unwind stack.

### Debugging and Challenges

Understanding the ARM exception handling and unwinding tables took considerable effort, alongside rigorous debugging. Some debugging snippets used during development are available in:
- **[stacktrace.gdb](https://github.com/TheoBessel/ARM_Stacktrace/tree/main/script/stacktrace.gdb)**: GDB script with debugging aids for tracing the stack.

I also optimized a few functions using pure programming techniques to improve performance and memory usage (using pure functions and `__attribute__((pure))`).

## Current Status

The stacktrace mechanism operates on a bare-metal environment, it has also been tested on a FreeRTOS environment.
Major bugs have been fixed, and the stacktrace mechanism is now stable and reliable.

## Future Work
- **Optimization**: Improve performance and memory usage where possible.

<!-- ----------------------------------------------------------------------- -->

<!-- !CONTENT -->