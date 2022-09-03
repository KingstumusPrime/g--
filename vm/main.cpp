#include <iostream>
#include "instruction.hpp"
#include "BytecodeInterpreter.hpp"
#include <vector>

using namespace bytecodeinterpreter;
using namespace std;




int main(int argc, char const *argv[])
{
    cout << "Bytecode Interperter 1.0\n" << endl;


    Instruction code[] = {
        Instruction{PUSH_INT, 0, 4000},
        Instruction{PUSH_INT, 0, 1042},
        Instruction{ADD_INT, 0,0},
        Instruction{PRINT_INT, 0, 0},
        Instruction{EXIT, 0, 0},
    };
    
    BytecodeInterpreter::Run(code);

    cout << "\ndone!" << endl;

    return 0;
}
