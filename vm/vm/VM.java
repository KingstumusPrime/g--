package vm;

import static vm.Bytecode.*;

import java.util.ArrayList;
import java.util.List;


public class VM {
    boolean trace = false;
    int[] globals;
    int[] code;
    int[] stack;

    int ip;
    int sp = -1;
    int fp;

    public VM(int[] code, int main, int datasize) {
        this.code = code;
        this.ip = main;
        globals = new int[datasize];
        stack = new int[100];
    }

    
    public void cpu(){
        StringBuilder buf = new StringBuilder();
        buf.append("\n");
        if( trace ) buf.append("\n=========\nOutput\n=========\n");
        while(ip < code.length){
            int opcode = code[ip];
            if(trace){
                System.err.printf("%-35s", disInstr());
            }
            ip++;
            switch(opcode) {

                case ICONST:
                    int v = code[ip];
                    ip++;
                    sp++;
                    stack[sp] = v;                    
                    break;

                case GLOAD:
                    int Laddr = code[ip];
                    ip++;
                    v = globals[Laddr];
                    sp ++;
                    stack[sp] = v;
                    break;
                case GSTORE:
                    v = stack[sp];
                    sp--;
                    int addr = code[ip];
                    ip++;
                    globals[addr] = v;
                    break;

                case PRINT:
                    v = stack[sp];
                    sp--;
                    buf.append(v);
                    break;
                case BR:
                    ip = code[ip++];
                    break;
                case BRT:
                    addr = code[ip++];
                    if(stack[sp--] == 1) ip = addr;
                    break;
                case BRF:
                    addr = code[ip++];
                    if(stack[sp--] == 0) ip = addr;
                    break;
                case LOAD:
                    stack[++sp] = stack[fp + code[ip++]];
                    break;
                case POP:
                    --sp;
                    break;
                case CALL:
                    addr = code[ip++];
                    int nargs = code[ip++];
                    stack[++sp] = nargs;
                    stack[++sp] = fp;
                    stack[++sp] = ip;
                    fp = sp;
                    ip = addr;
                    break;
                case RET:
                    int rvalue = stack[sp--];
                    sp = fp;
                    ip = stack[sp--];
                    fp = stack[sp--];
                    nargs = stack[sp--];
                    sp -= nargs;
                    stack[++sp] = rvalue;
                    break;
                    
                case HALT:
                    System.err.print(buf + "\n");
                    if(trace)System.err.println(stackString());
                    if(trace)dumpDataMemory();
                    return;
                    
            }

            if(trace) System.err.println(stackString());
        }
        System.err.print(buf);
        if(trace)System.err.println(stackString());
        if(trace)dumpDataMemory();
    }
    protected String disInstr(){
        int opcode = code[ip];
        String opName = Bytecode.instructions[opcode].name;
        StringBuilder buf = new StringBuilder();
        buf.append(String.format("%04d:\t%-11s", ip, opName));
        int nargs = Bytecode.instructions[opcode].nOpnds;
        if(nargs > 0) {
            List<String> operands = new ArrayList<>();
            for(int i= ip+ 1; i <= ip + nargs; i++){
                operands.add(String.valueOf(code[i]));
            }
            for (int i = 0; i < operands.size(); i++){
                String s = operands.get(i);
                if(i>0) buf.append(", ");
                buf.append(s);
            }
        }
        return buf.toString();
    }

    protected void dissisemble(int opcode){
        Instruction instr = Bytecode.instructions[opcode];
        System.err.printf("%04d: %s", ip, instr.name);
        if (instr.nOpnds == 1){
            System.err.printf(" %d", code[ip+1]);
        }
        else if (instr.nOpnds == 2){
            System.err.printf(" %d, %d", code[ip + 1], code[ip + 2]);
        }
        List<Integer> stck = new ArrayList<>();
        for (int i = 0; i <= sp; i++){
            stck.add(stack[i]);
        }
        System.err.print(stck);
        System.err.println();
    }


    protected String stackString(){
        StringBuilder buf = new StringBuilder();
        buf.append("stack=[");
        for (int i = 0; i <= sp; i++){
            int o = stack[i];
            buf.append(" ");
            buf.append(o);
        }
        buf.append(" ]");
        return buf.toString();
    }

    protected void dumpDataMemory(){
        System.err.println("Data memory");
        int addr = 0;
        for(int o: globals){
            System.err.printf("%04d: %d\n", addr, o);
            addr++;
        }
        System.err.println();
    }

    protected void dumpCodeMemory() {
        System.err.println("Code Memory");
        int addr = 0;
        for(int o: code){
            System.err.printf("%04d: %d\n", addr, o);
            addr++;
        }
        System.err.println();
    }

}

