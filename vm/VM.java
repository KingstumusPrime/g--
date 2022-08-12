package vm;

import static vm.Bytecode.*;

import java.util.ArrayList;
import java.util.List;

public class VM {
    boolean trace = false;
    int[] data;
    int[] code;
    int[] stack;

    int ip;
    int sp = -1;
    int fp;

    public VM(int[] code, int main, int datasize) {
        this.code = code;
        this.ip = main;
        data = new int[datasize];
        stack = new int[100];
    }

    public void cpu(){
        while(ip < code.length){
            int opcode = code[ip];
            if(trace){
                disassemble(opcode);
            }
            ip++;
            switch(opcode) {

                case ICONST:
                    int v = code[ip];
                    ip++;
                    sp++;
                    stack[sp] = v;                    
                    break;

                case PRINT:
                    v = stack[sp];
                    sp--;
                    System.out.println(v);
                    break;
                case HALT:
                    return;
            }
        }
    }
    private void disassemble(int opcode){
        Instruction instr =  Bytecode.instructions[opcode];
        System.err.printf("%04d: %s",ip,instr.name);

        if(instr.nOpnds==1){
            System.err.printf(" %d", code[ip+1]);
        }
        
        else if(instr.nOpnds==2){
            System.err.printf(" %d %d", code[ip + 1], code[ip+2]);
        }

        List<Integer> stck = new ArrayList<Integer>();
        for(int i = 0; i <= sp; i++){
            stck.add(stack[i]);

        }
        System.err.print("\t\t" + stck);
        System.err.println();
    }
}

