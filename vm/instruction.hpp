# pragma once

#include <cstdint>

namespace bytecodeinterpreter {
    enum Opcode: uint8_t{
        EXIT,
        ADD_INT,
        PUSH_INT,
        POP_INT,
        PRINT_INT,
        CMP_INT_LT,
        LOAD_INT,
        STORE_INT,
        JMP,
        JMP_FALSE,
        JMP_TRUE,
        LOAD_INT_BP_REL,
        STORE_INT_BP_REL,
        CALL,
        RETURN,
        NUM_INSTRUCTIONS,
    };

    class Instruction
    {
    public:
        Opcode opcode;
        uint8_t p1;
        int16_t p2;
    };
}
