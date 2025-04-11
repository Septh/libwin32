
export enum ACCESS_MASK {
    DELETE = 0x00010000,
    READ_CONTROL = 0x00020000,
    WRITE_DAC = 0x00040000,
    WRITE_OWNER = 0x00080000,
    SYNCHRONIZE = 0x00100000,
    STANDARD_RIGHTS_REQUIRED = 0x000F0000,
    STANDARD_RIGHTS_READ = READ_CONTROL,
    STANDARD_RIGHTS_WRITE = READ_CONTROL,
    STANDARD_RIGHTS_EXECUTE = READ_CONTROL,
    STANDARD_RIGHTS_ALL = 0x001F0000,
    SPECIFIC_RIGHTS_ALL = 0x0000FFFF
}
