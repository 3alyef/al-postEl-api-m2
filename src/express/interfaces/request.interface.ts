export interface requestEncrypt {
    idC: string;
    emailC: string;
    soulNameC: string;
    costumNameC: costumName
}

export interface costumName {
    costum_name: string | undefined;
    lastUpdateIn: string | undefined
}