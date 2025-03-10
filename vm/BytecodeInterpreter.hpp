# pragma once

#include "instruction.hpp"
#include <cstdint>
#include <vector>

namespace bytecodeinterpreter {

    using namespace std;

    struct InterpreterRegisters {
        vector<int16_t> stack;
        vector<Instruction*> returnAdressStack;
        Instruction *currentInstruction;
        size_t baseIndex;
    };

    typedef void (*InstructionFunction)(InterpreterRegisters& registers);

    void ExitInstruction(InterpreterRegisters& registers);
    void AddIntInstruction(InterpreterRegisters& registers);
    void PushIntInstruction(InterpreterRegisters& registers);
    void PopIntInstruction(InterpreterRegisters& registers);
    void PrintIntInstruction(InterpreterRegisters& registers);
    void CmpIntLtInstruction(InterpreterRegisters& registers);
    void LoadIntInstruction(InterpreterRegisters& registers);
    void StoreIntInstruction(InterpreterRegisters& registers);
    void JmpInstruction(InterpreterRegisters& registers);
    void JmpFalseInstruction(InterpreterRegisters& registers);
    void JmpTrueInstruction(InterpreterRegisters& registers);
    void LoadIntBpRelInstruction(InterpreterRegisters& registers);
    void StoreIntBpRelInstruction(InterpreterRegisters& registers);
    void CallInstruction(InterpreterRegisters& registers);
    void ReturnInstruction(InterpreterRegisters& registers);



    extern InstructionFunction gInstructionFunctions[NUM_INSTRUCTIONS];

    class BytecodeInterpreter {
    public:
        static void Run(Instruction* code, vector<int16_t> arguments, int16_t * result = nullptr);
    };



}