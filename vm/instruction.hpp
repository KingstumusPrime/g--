# pragma once

#include <cstdint>

namespace bytecodeinterpreter {
    enum Opcode: uint8_t{
        EXIT,
        ADD_INT,
        PUSH_INT,
        PRINT_INT,
        NUM_INSTRUCTIONS,
    };

    class Instruction
    {
    public:
        Opcode opcode;
        uint8_t p1;
        uint16_t p2;
    };
}
