export interface IOAuthPayload {
    name?: string;
    email: string;
    sub:string;
}

export interface IOAuthService {
    verifyIdToken(idToken: string): Promise<IOAuthPayload>;
}