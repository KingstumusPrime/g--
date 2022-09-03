#include "BytecodeInterpreter.hpp"
#include <iostream>


namespace bytecodeinterpreter{
    using namespace std;
    InstructionFunction gInstructionFunctions[NUM_INSTRUCTIONS] = {
        ExitInstruction,
        AddInstruction,
        PushIntInstruction,
        PrintInstruction,
    };

    void BytecodeInterpreter::Run(Instruction* code){
        InterpreterRegisters registers{.currentInstruction = code};
        cout << 'RUN';
        // while (registers.currentInstruction != nullptr)
        // {
        //     gInstructionFunctions[registers.currentInstruction->opcode](registers);
        // }
        
    }


    void ExitInstruction(InterpreterRegisters& registers){
        registers.currentInstruction = nullptr;
    }
    void AddInstruction(InterpreterRegisters& registers){
        uint16_t leftHandSide = registers.stack.back();
        registers.stack.pop_back();
        uint16_t rightHandSide = registers.stack.back();
        registers.stack.push_back(leftHandSide + rightHandSide);
        ++registers.currentInstruction;       
    }
    void PushIntInstruction(InterpreterRegisters& registers){
        registers.stack.push_back(registers.currentInstruction->p2);
        ++registers.currentInstruction;    
    }
    void PrintInstruction(InterpreterRegisters& registers){
        uint16_t number = registers.stack.back();
        registers.stack.pop_back();
        cout << "Number Printed: " << number << endl; 
        ++registers.currentInstruction;
    }

}