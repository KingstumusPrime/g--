package vm;

import static vm.Bytecode.*;


public class test {
    static int[] hello = {
        LOAD, -3,
        ICONST, 2,
        ILT,
        BRF, 10,
        ICONST, 1,
    };
    public static void main(String[] args) {
        int datasize = 1;
        int mainip = 0;
        VM vm = new VM(hello, mainip, datasize);
        vm.trace = true;
        vm.cpu();
    }
}
