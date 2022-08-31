const instructions = {
    EXIT: "01"
}

const registers = {
    R0: "01",
    R1
}

stack = []

class Instruction{
    constructor(opcode, i1=null, i2=null){
        this.opcode = opcode
        this.i1 = i1
        this.i2 = i2

    }
}

var instruction = new Instruction(instructions.PUSH_INT, 10)

    