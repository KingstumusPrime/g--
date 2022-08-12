package vm;
import static vm.Bytecode.*;


public class test {
    static int[] hello = {
        ICONST, 99,
        GSTORE, 0,
        GLOAD, 0,
        PRINT,
        HALT
    };
    public static void main(String[] args) {
        VM vm = new VM(hello, 0, 0);
        vm.trace = true;
        vm.cpu();
    }
}
