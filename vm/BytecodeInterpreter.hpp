# pragma once

#include "instruction.hpp"
#include <cstdint>
#include <vector>

namespace bytecodeinterpreter{

    using namespace std;

    struct InterpreterRegisters {
        vector<uint16_t> stack;
        Instruction *currentInstruction;
    };

    typedef void (*InstructionFunction)(InterpreterRegisters& registers);

    void ExitInstruction(InterpreterRegisters& registers);
    void AddInstruction(InterpreterRegisters& registers);
    void PushIntInstruction(InterpreterRegisters& registers);
    void PrintInstruction(InterpreterRegisters& registers);

    extern InstructionFunction gInstructionFunctions[NUM_INSTRUCTIONS];

    class BytecodeInterpreter {
    public:
        static void Run(Instruction* code);
    };



}