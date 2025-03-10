#include "BytecodeInterpreter.hpp"
#include <iostream>


namespace bytecodeinterpreter {

    using namespace std;

    InstructionFunction gInstructionFunctions[NUM_INSTRUCTIONS] = {
        ExitInstruction,
        AddIntInstruction,
        PushIntInstruction,
        PopIntInstruction,
        PrintIntInstruction,
        CmpIntLtInstruction,
        LoadIntInstruction,
        StoreIntInstruction,
        JmpInstruction,
        JmpFalseInstruction,
        JmpTrueInstruction,
        LoadIntBpRelInstruction,
        StoreIntBpRelInstruction,
        CallInstruction,
        ReturnInstruction,
    };

    /*static*/ void BytecodeInterpreter::Run(Instruction* code, vector<int16_t> arguments, int16_t * result){
        InterpreterRegisters registers{ .currentInstruction = code };

        if(result){
            registers.stack.push_back(0);
        }

        registers.stack.insert(registers.stack.end(), arguments.begin(), arguments.end());

        registers.stack.push_back(0);
        registers.returnAdressStack.push_back(nullptr);
        registers.baseIndex = registers.stack.size();


        while (registers.currentInstruction != nullptr) {
            gInstructionFunctions[registers.currentInstruction->opcode](registers);
        }

        size_t numArgs = arguments.size();
        while (numArgs--)
        {
            registers.stack.pop_back();
        }
        

        if (result){
            *result = registers.stack[0];
        }
        
    }


    void ExitInstruction(InterpreterRegisters& registers) {
        registers.currentInstruction = nullptr;
    }


    void AddIntInstruction(InterpreterRegisters& registers) {
        int16_t rightHandSide = registers.stack.back();
        registers.stack.pop_back();
        int16_t leftHandSide = registers.stack.back();
        registers.stack.pop_back();
        registers.stack.push_back(leftHandSide + rightHandSide);
        ++registers.currentInstruction;
    }


    void PushIntInstruction(InterpreterRegisters& registers) {
        registers.stack.push_back(registers.currentInstruction->p2);
        ++registers.currentInstruction;
    }

    void PopIntInstruction(InterpreterRegisters& registers) {
        registers.stack.pop_back();
        ++registers.currentInstruction;
    }

    void PrintIntInstruction(InterpreterRegisters& registers) {
        int16_t number = registers.stack.back();
        registers.stack.pop_back();
        cout << "Number Printed: " << number << endl;
        ++registers.currentInstruction;
    }

    
    void CmpIntLtInstruction(InterpreterRegisters& registers) {
        int16_t rightHandSide = registers.stack.back();
        registers.stack.pop_back();
        int16_t leftHandSide = registers.stack.back();
        registers.stack.pop_back();

        registers.stack.push_back(leftHandSide < rightHandSide);
        ++registers.currentInstruction;
    }

    void LoadIntInstruction(InterpreterRegisters& registers) {
        registers.stack.push_back(registers.stack[registers.currentInstruction->p2]);
        ++registers.currentInstruction;
    }

    void StoreIntInstruction(InterpreterRegisters& registers) {
        registers.stack[registers.currentInstruction->p2] = registers.stack.back();
        registers.stack.pop_back();
        ++registers.currentInstruction;
    }
    
    void JmpInstruction(InterpreterRegisters& registers) {
        registers.currentInstruction += registers.currentInstruction->p2;
    }

    void JmpFalseInstruction(InterpreterRegisters& registers) {
        int16_t condition = registers.stack.back();
        registers.stack.pop_back();
        if (condition == 0){
            registers.currentInstruction += registers.currentInstruction->p2;
        } else {
            ++registers.currentInstruction;
        }
    }

    void JmpTrueInstruction(InterpreterRegisters& registers) {
        int16_t condition = registers.stack.back();
        registers.stack.pop_back();
        if (condition == 1){
            registers.currentInstruction += registers.currentInstruction->p2;
        } else {
            ++registers.currentInstruction;
        }
    }

    void LoadIntBpRelInstruction(InterpreterRegisters& registers){
        registers.stack.push_back(registers.stack[registers.currentInstruction->p2 + registers.baseIndex]);
        ++registers.currentInstruction;    
    }
    void StoreIntBpRelInstruction(InterpreterRegisters& registers){
        registers.stack[registers.currentInstruction->p2 + registers.baseIndex] = registers.stack.back();
        registers.stack.pop_back();
        ++registers.currentInstruction;
    }
    void CallInstruction(InterpreterRegisters& registers){
        registers.stack.push_back(int16_t(registers.baseIndex));
        registers.returnAdressStack.push_back(registers.currentInstruction + 1);
        registers.baseIndex = registers.stack.size();
        registers.currentInstruction += registers.currentInstruction->p2;
    }
    void ReturnInstruction(InterpreterRegisters& registers){
        Instruction* returnAddress = registers.returnAdressStack.back();
        registers.returnAdressStack.pop_back();
        registers.baseIndex = registers.stack.back();
        registers.stack.pop_back();

        registers.currentInstruction = returnAddress;
    }

}