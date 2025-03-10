#include <iostream>
#include "instruction.hpp"
#include "BytecodeInterpreter.hpp"
#include <vector>


using namespace bytecodeinterpreter;
using namespace std;




int main()
{
    cout << "Bytecode Interperter 1.0\n" << endl;


    Instruction code[] = {
        Instruction{PUSH_INT, 0, 0},
        Instruction{LOAD_INT_BP_REL, 0, 0},
        Instruction{LOAD_INT_BP_REL, 0, -2},
        Instruction{CMP_INT_LT, 0, 0},
        Instruction{JMP_FALSE, 0, 10},

        Instruction{PUSH_INT, 0, 4000},
        Instruction{PUSH_INT, 0, 1042},
        Instruction{ADD_INT, 0, 0},
        Instruction{PRINT_INT, 0, 0},

        Instruction{LOAD_INT_BP_REL, 0, 0},
        Instruction{PUSH_INT, 0, 1},
        Instruction{ADD_INT, 0, 0},
        Instruction{STORE_INT_BP_REL, 0, 0},
        Instruction{JMP, 0, -12},
        Instruction{PUSH_INT, 0, 42},
        Instruction{STORE_INT_BP_REL, 0, -3},
        Instruction{JMP, 0, 1},
        Instruction{POP_INT, 0, 0},
        Instruction{RETURN, 0, 0},
    };
    
    int16_t resultValue = 0;
    BytecodeInterpreter::Run(code, {5}, &resultValue);

    cout << "\nResult: " << resultValue << "\ndone!" << endl;
    
    return 0;
}
