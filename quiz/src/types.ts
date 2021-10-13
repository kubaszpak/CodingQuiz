export interface Code {
    a: string;
    b: string;
    c: string;
    correct: string;
    language: string;
    image: Blob;
}

export interface AddNewCode {
    addNewCode: ((code: Code) => void);
}